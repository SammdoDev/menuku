import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans } from "../../../../lib/plans";
import { sendEmail } from "../../../../lib/email";
import { createDuitkuInvoice } from "../../../../lib/duitku";
import { PUBLIC_SITE_URL, supportWhatsAppUrl } from "../../../../lib/site";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

const rank = { free: 0, premium: 1, business: 2 } as const;
function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function paymentReturnUrl(orderId: string, plan: string) {
  const url = new URL(
    process.env.DUITKU_RETURN_URL?.trim() || `${PUBLIC_SITE_URL}/dashboard/billing/confirmation`,
  );
  url.searchParams.set("order", orderId);
  url.searchParams.set("plan", plan);
  return url.toString();
}

function paymentCallbackUrl() {
  return (
    process.env.DUITKU_CALLBACK_URL?.trim() ||
    new URL("/api/payments/duitku/callback", PUBLIC_SITE_URL).toString()
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant)
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  const paymentAdmin = createSupabaseAdminClient();
  const parsed = z.object({ plan: z.enum(["premium", "business"]) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
  const plan = parsed.data.plan;
  const months = Math.min(12, Math.max(1, Number(new URL(request.url).searchParams.get("months") || 1)));
  const { data: active } = await supabase
    .from("subscriptions")
    .select("plan,expires_at")
    .eq("tenant_id", tenant.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (active && rank[plan] < rank[active.plan as keyof typeof rank])
    return NextResponse.json({ error: "Downgrade tersedia setelah paket aktif berakhir." }, { status: 400 });
  const now = new Date();
  const isUpgrade = Boolean(active && rank[plan] > rank[active.plan as keyof typeof rank]);
  const remainingMonths = active ? Math.max(1, Math.ceil((new Date(active.expires_at).getTime() - now.getTime()) / (30 * 86400000))) : 0;
  const credit = isUpgrade ? plans[active!.plan as "premium" | "business"].price * remainingMonths : 0;
  const amount = Math.max(0, plans[plan].price * months - credit);
  const expiresAt = addMonths(now, months).toISOString();
  const orderId = `MK${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
  const { error } = await supabase.from("subscriptions").insert({
    tenant_id: tenant.id,
    owner_id: user.id,
    plan,
    previous_plan: active?.plan || null,
    months,
    amount,
    expires_at: expiresAt,
    order_id: orderId,
    status: "pending",
    payment_method: process.env.DUITKU_PAYMENT_METHOD?.trim().toUpperCase() || null,
  });
  if (error) return NextResponse.json({ error: "Invoice belum dapat dicatat." }, { status: 500 });

  let duitku;
  try {
    duitku = await createDuitkuInvoice({
      orderId,
      amount,
      email: user.email || `${tenant.slug}@example.com`,
      customerName: user.user_metadata.name || tenant.name,
      productDetails: `Menuku ${plans[plan].name} ${months} bulan`,
      returnUrl: paymentReturnUrl(orderId, plan),
      callbackUrl: paymentCallbackUrl(),
    });
    const paymentUrl = new URL(duitku.paymentUrl);
    if (paymentUrl.protocol !== "https:") throw new Error("URL pembayaran Duitku tidak valid.");
    const { error: paymentRecordError } = await paymentAdmin
      .from("subscriptions")
      .update({ payment_url: paymentUrl.toString(), duitku_reference: duitku.reference || null })
      .eq("order_id", orderId);
    if (paymentRecordError) throw new Error("Link pembayaran belum dapat disimpan.");
  } catch (caught) {
    await paymentAdmin.from("subscriptions").update({ status: "failed" }).eq("order_id", orderId);
    return NextResponse.json({ error: caught instanceof Error ? caught.message : "Invoice Duitku belum dapat dibuat." }, { status: 502 });
  }
  const dashboardUrl = `${PUBLIC_SITE_URL}/dashboard/billing`;
  const supportUrl = supportWhatsAppUrl(`Halo admin Menuku, saya ingin konfirmasi invoice ${orderId}.`);
  const paymentType = active ? `Upgrade dari ${plans[active.plan as "premium" | "business"].name}` : "Paket baru";
  const safePaymentUrl = escapeHtml(duitku.paymentUrl);
  const invoiceHtml = `<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f"><h2>Invoice pembayaran Menuku</h2><p>Invoice kamu sudah siap. Selesaikan pembayaran melalui halaman Duitku.</p><p><b>Invoice:</b> ${escapeHtml(orderId)}<br><b>Paket:</b> ${escapeHtml(plans[plan].name)}<br><b>Jenis:</b> ${escapeHtml(paymentType)}<br><b>Durasi:</b> ${months} bulan<br><b>Total:</b> Rp${amount.toLocaleString("id-ID")}</p><p><a href="${safePaymentUrl}">Lanjutkan pembayaran di Duitku</a></p><p><a href="${escapeHtml(dashboardUrl)}">Buka Billing</a> · <a href="${escapeHtml(supportUrl)}">Chat admin WhatsApp</a></p></div>`;
  if (user.email) {
    try {
      await sendEmail({ to: user.email, subject: `Invoice Menuku ${orderId}`, html: invoiceHtml });
    } catch (caught) {
      console.error("[duitku] failed to send invoice email", caught);
    }
  }
  return NextResponse.json({ ok: true, orderId, paymentUrl: duitku.paymentUrl });
}
