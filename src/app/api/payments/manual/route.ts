import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans } from "../../../../lib/plans";
import { sendEmail } from "../../../../lib/email";
import { PUBLIC_SITE_URL, supportWhatsAppUrl } from "../../../../lib/site";

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
  const dashboardUrl = `${PUBLIC_SITE_URL}/dashboard/billing`;
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Menuku, saya ingin konfirmasi invoice ${orderId}.`,
  );
  const paymentType = active
    ? `Upgrade dari ${plans[active.plan as "premium" | "business"].name}`
    : "Paket baru";
  const invoiceHtml = `<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f"><h2 style="margin-bottom:4px">Konfirmasi pembayaran diterima</h2><p style="color:#6f675d;margin-top:0">Menuku Billing</p><hr style="border:0;border-top:1px solid #eee8e1;margin:24px 0"><p>Hai ${user.user_metadata.name || tenant.name},</p><p>Permintaan billing kamu sudah tercatat dan menunggu pembayaran.</p><table style="width:100%;border-collapse:collapse;margin:20px 0"><tr><td style="padding:8px 0;color:#756d63">Nomor invoice</td><td style="padding:8px 0;text-align:right;font-weight:bold;word-break:break-all">${orderId}</td></tr><tr><td style="padding:8px 0;color:#756d63">Paket</td><td style="padding:8px 0;text-align:right;font-weight:bold">${plans[plan].name}</td></tr><tr><td style="padding:8px 0;color:#756d63">Jenis transaksi</td><td style="padding:8px 0;text-align:right">${paymentType}</td></tr><tr><td style="padding:8px 0;color:#756d63">Durasi</td><td style="padding:8px 0;text-align:right">${months} bulan</td></tr><tr><td style="padding:12px 0;border-top:1px solid #eee8e1;font-weight:bold">Total pembayaran</td><td style="padding:12px 0;border-top:1px solid #eee8e1;text-align:right;font-size:20px;font-weight:bold;color:#ff6534">Rp${amount.toLocaleString("id-ID")}</td></tr></table><h3>Langkah pembayaran</h3><ol style="padding-left:20px;line-height:1.8"><li>Buka halaman billing Menuku.</li><li>Scan QRIS yang tersedia.</li><li>Transfer tepat sebesar Rp${amount.toLocaleString("id-ID")}.</li><li>Simpan bukti transfer jika diperlukan.</li></ol><p style="background:#fff4ee;padding:14px;border-radius:10px"><b>Penting:</b> pembayaran diverifikasi manual oleh admin. Paket baru aktif setelah pembayaran dikonfirmasi.</p><p><a href="${dashboardUrl}" style="display:inline-block;background:#ff6534;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold">Buka Billing</a> <a href="${supportUrl}" style="display:inline-block;border:1px solid #ff6534;color:#ff6534;text-decoration:none;padding:11px 17px;border-radius:8px;font-weight:bold">Chat admin WhatsApp</a></p><p style="color:#756d63;font-size:12px;margin-top:28px">Jika kamu sudah transfer, balas email ini atau kirim bukti pembayaran ke WhatsApp admin agar verifikasi lebih cepat.</p></div>`;
  if (user.email)
    await sendEmail({
      to: user.email,
      subject: `Invoice Menuku ${orderId}`,
      html: invoiceHtml,
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
          html: `<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f"><h2>Ada pembayaran baru</h2><p>Tenant <b>${tenant.name}</b> membuat invoice billing baru.</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#756d63">Order</td><td style="padding:8px 0;text-align:right;word-break:break-all">${orderId}</td></tr><tr><td style="padding:8px 0;color:#756d63">Paket</td><td style="padding:8px 0;text-align:right">${plans[plan].name}</td></tr><tr><td style="padding:8px 0;color:#756d63">Durasi</td><td style="padding:8px 0;text-align:right">${months} bulan</td></tr><tr><td style="padding:8px 0;font-weight:bold">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold">Rp${amount.toLocaleString("id-ID")}</td></tr></table><p>Silakan cek pembayaran dari Admin Console Menuku.</p></div>`,
        }),
      ),
  );
  return NextResponse.json({ ok: true, orderId });
}
