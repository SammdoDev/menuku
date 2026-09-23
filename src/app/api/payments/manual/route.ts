import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans } from "../../../../lib/plans";
import { sendEmail } from "../../../../lib/email";

const rank = { free: 0, premium: 1, business: 2 } as const;
function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export async function POST(request: Request) {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant)
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  const parsed = z
    .object({ plan: z.enum(["premium", "business"]) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
  const plan = parsed.data.plan;
  const requestedMonths = Math.min(
    12,
    Math.max(1, Number(new URL(request.url).searchParams.get("months") || 1)),
  );
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
    return NextResponse.json(
      { error: "Downgrade tersedia setelah paket aktif berakhir." },
      { status: 400 },
    );
  const now = new Date();
  const isUpgrade = Boolean(active && rank[plan] > rank[active.plan as keyof typeof rank]);
  const months = requestedMonths;
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
  const expiresAt = addMonths(now, months).toISOString();
  const orderId = `menuku-trx-billing-${tenant.slug}-${plan}-${crypto.randomUUID()}`;
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
  });
  if (error)
    return NextResponse.json(
      { error: "Konfirmasi pembayaran belum dapat dicatat." },
      { status: 500 },
    );
  if (user.email)
    await sendEmail({
      to: user.email,
      subject: `Invoice Menuku ${orderId}`,
      html: `<h2>Konfirmasi pembayaran diterima</h2><p>Invoice <b>${orderId}</b> untuk paket <b>${plans[plan].name}</b> sebesar <b>Rp${amount.toLocaleString("id-ID")}</b> sudah dibuat.</p><p>Silakan selesaikan pembayaran melalui QRIS. Admin akan memverifikasi pembayaran secara manual.</p>`,
    });
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  await Promise.all(
    adminEmails
      .filter((adminEmail) => adminEmail !== user.email)
      .map((adminEmail) =>
        sendEmail({
          to: adminEmail,
          subject: `Pembayaran baru Menuku: ${orderId}`,
          html: `<h2>Ada pembayaran baru</h2><p>Tenant <b>${tenant.name}</b> mengajukan paket <b>${plans[plan].name}</b> sebesar <b>Rp${amount.toLocaleString("id-ID")}</b>.</p><p>Order: ${orderId}</p>`,
        }),
      ),
  );
  return NextResponse.json({ ok: true, orderId });
}
