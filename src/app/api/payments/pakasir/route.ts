import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans } from "../../../../lib/plans";
import { sendEmail } from "../../../../lib/email";
import { createPakasirPayment, pakasirConfig } from "../../../../lib/pakasir";
import { PUBLIC_SITE_URL, supportWhatsAppUrl } from "../../../../lib/site";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

const rank = { free: 0, premium: 1, business: 2 } as const;

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const parsed = z
    .object({ plan: z.enum(["premium", "business"]) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
  }

  try {
    pakasirConfig();
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Pakasir belum dikonfigurasi.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const plan = parsed.data.plan;
  const requestedMonths = Number(new URL(request.url).searchParams.get("months") || 1);
  const months = [1, 3, 6, 12].includes(requestedMonths) ? requestedMonths : 1;
  const { data: active } = await supabase
    .from("subscriptions")
    .select("plan,expires_at")
    .eq("tenant_id", tenant.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (active && rank[plan] < rank[active.plan as keyof typeof rank]) {
    return NextResponse.json(
      { error: "Downgrade tersedia setelah paket aktif berakhir." },
      { status: 400 },
    );
  }

  const now = new Date();
  const isUpgrade = Boolean(active && rank[plan] > rank[active.plan as keyof typeof rank]);
  const remainingMonths = active
    ? Math.max(
        1,
        Math.ceil((new Date(active.expires_at).getTime() - now.getTime()) / (30 * 86400000)),
      )
    : 0;
  const credit = isUpgrade
    ? plans[active!.plan as "premium" | "business"].price * remainingMonths
    : 0;
  const amount = Math.max(0, plans[plan].price * months - credit);
  if (amount < 500) {
    return NextResponse.json(
      { error: "Nominal invoice minimum untuk QRIS Pakasir adalah Rp500." },
      { status: 400 },
    );
  }

  const orderId =
    "MK" +
    Date.now().toString(36).toUpperCase() +
    crypto.randomBytes(5).toString("hex").toUpperCase();
  const { error: insertError } = await supabase.from("subscriptions").insert({
    tenant_id: tenant.id,
    owner_id: user.id,
    plan,
    previous_plan: active?.plan || null,
    months,
    amount,
    expires_at: addMonths(now, months).toISOString(),
    order_id: orderId,
    status: "pending",
    payment_method: "qris",
    payment_provider: "pakasir",
  });
  if (insertError) {
    return NextResponse.json({ error: "Invoice belum dapat dicatat." }, { status: 500 });
  }

  const returnUrl = new URL("/dashboard/billing/confirmation", PUBLIC_SITE_URL);
  returnUrl.searchParams.set("order", orderId);
  returnUrl.searchParams.set("plan", plan);
  const paymentAdmin = createSupabaseAdminClient();

  try {
    const pakasir = await createPakasirPayment({
      orderId,
      amount,
      returnUrl: returnUrl.toString(),
    });
    const { data: savedPayment, error: updateError } = await paymentAdmin
      .from("subscriptions")
      .update({
        payment_url: pakasir.paymentUrl,
        pakasir_txn_id: pakasir.txnId,
      })
      .eq("order_id", orderId)
      .eq("payment_provider", "pakasir")
      .select("id")
      .maybeSingle();
    if (updateError || !savedPayment) throw new Error("Payment link belum dapat disimpan.");

    const dashboardUrl = new URL("/dashboard/billing", PUBLIC_SITE_URL).toString();
    const supportUrl = supportWhatsAppUrl("Halo admin Menuku, saya ingin konfirmasi invoice " + orderId + ".");
    const paymentType = active
      ? "Upgrade dari " + plans[active.plan as "premium" | "business"].name
      : "Paket baru";
    const safePaymentUrl = escapeHtml(pakasir.paymentUrl);
    const invoiceHtml = [
      '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f">',
      "<h2>Invoice pembayaran Menuku</h2>",
      "<p>Invoice kamu sudah siap. Selesaikan pembayaran melalui halaman Pakasir.</p>",
      "<p><b>Invoice:</b> " + escapeHtml(orderId),
      "<br><b>Paket:</b> " + escapeHtml(plans[plan].name),
      "<br><b>Jenis:</b> " + escapeHtml(paymentType),
      "<br><b>Durasi:</b> " + months + " bulan",
      "<br><b>Total:</b> Rp" + amount.toLocaleString("id-ID") + "</p>",
      '<p><a href="' + safePaymentUrl + '">Lanjutkan pembayaran di Pakasir</a></p>',
      '<p><a href="' + escapeHtml(dashboardUrl) + '">Buka Billing</a> · ',
      '<a href="' + escapeHtml(supportUrl) + '">Chat admin WhatsApp</a></p></div>',
    ].join("");
    if (user.email) {
      try {
        await sendEmail({ to: user.email, subject: "Invoice Menuku " + orderId, html: invoiceHtml });
      } catch (caught) {
        console.error("[pakasir] failed to send invoice email", caught);
      }
    }

    return NextResponse.json({ ok: true, orderId, paymentUrl: pakasir.paymentUrl });
  } catch (caught) {
    await paymentAdmin
      .from("subscriptions")
      .update({ status: "failed" })
      .eq("order_id", orderId)
      .eq("status", "pending");
    const error = caught instanceof Error ? caught.message : "Invoice Pakasir belum dapat dibuat.";
    return NextResponse.json({ error }, { status: 502 });
  }
}
