import { cancelPakasirTransaction, getPakasirTransactionStatus } from "./pakasir";
import { plans, rupiah } from "./plans";
import { PUBLIC_SITE_URL, supportWhatsAppUrl } from "./site";
import { createSupabaseAdminClient } from "./supabase/admin";
import { sendEmail } from "./email";

export const PAKASIR_INVOICE_TTL_MS = 24 * 60 * 60 * 1000;
const STATUS_RECHECK_DELAY_MS = 30 * 1000;
const EMAIL_RETRY_DELAY_MS = 5 * 60 * 1000;

export const PENDING_INVOICE_FIELDS =
  "id,tenant_id,owner_id,order_id,plan,months,amount,status,payment_method,payment_provider,payment_url,pakasir_txn_id,created_at,invoice_email_sent_at,invoice_email_attempted_at,pakasir_status_checked_at,billing_pending_lock,payment_receipt_email_attempted_at,payment_receipt_email_sent_at,invoice_expired_email_attempted_at,invoice_expired_email_sent_at";

export type PendingInvoice = {
  id: string;
  tenant_id: string;
  owner_id: string;
  order_id: string;
  plan: string;
  months: number;
  amount: number;
  status: string;
  payment_method: string | null;
  payment_provider: string | null;
  payment_url: string | null;
  pakasir_txn_id: string | null;
  created_at: string;
  invoice_email_sent_at: string | null;
  invoice_email_attempted_at: string | null;
  pakasir_status_checked_at: string | null;
  billing_pending_lock: boolean;
  payment_receipt_email_attempted_at: string | null;
  payment_receipt_email_sent_at: string | null;
  invoice_expired_email_attempted_at: string | null;
  invoice_expired_email_sent_at: string | null;
};

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

export function pakasirInvoiceExpiresAt(createdAt: string) {
  return new Date(new Date(createdAt).getTime() + PAKASIR_INVOICE_TTL_MS);
}

export function billingConfirmationUrl(orderId: string, plan: string, email?: "sent" | "failed") {
  const url = new URL("/dashboard/billing/confirmation", PUBLIC_SITE_URL);
  url.searchParams.set("order", orderId);
  url.searchParams.set("plan", plan);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

export function canonicalPakasirPaymentUrl(
  invoice: Pick<PendingInvoice, "payment_url" | "order_id" | "plan">,
) {
  if (!invoice.payment_url) return null;
  try {
    const paymentUrl = new URL(invoice.payment_url);
    if (paymentUrl.protocol !== "https:" || paymentUrl.hostname !== "app.pakasir.com") return null;
    paymentUrl.searchParams.set("qris_only", "1");
    paymentUrl.searchParams.set("redirect", billingConfirmationUrl(invoice.order_id, invoice.plan));
    return paymentUrl.toString();
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => {
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

function formatJakartaDate(date: Date) {
  return (
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(date) + " WIB"
  );
}

function planFeaturesHtml(planCode: string) {
  const plan = plans[planCode as "premium" | "business"];
  return [
    '<div style="margin-top:18px"><b>Fitur utama paket</b><ul style="padding-left:20px">',
    ...plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`),
    "</ul></div>",
  ].join("");
}

async function readInvoice(admin: AdminClient, id: string) {
  const { data, error } = await admin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Status invoice belum dapat diperiksa.");
  return data as PendingInvoice | null;
}

async function sendInvoiceExpiredEmail(admin: AdminClient, invoice: PendingInvoice) {
  if (invoice.invoice_expired_email_sent_at) return true;

  let recipient: string | null = null;
  try {
    const { data, error } = await admin.auth.admin.getUserById(invoice.owner_id);
    if (error) throw error;
    recipient = data.user?.email || null;
  } catch (caught) {
    console.error("[billing] could not load expired invoice recipient", caught);
    return false;
  }
  if (!recipient) return false;

  const now = new Date();
  const retryBefore = new Date(now.getTime() - EMAIL_RETRY_DELAY_MS).toISOString();
  const { data: claim, error: claimError } = await admin
    .from("subscriptions")
    .update({ invoice_expired_email_attempted_at: now.toISOString() })
    .eq("id", invoice.id)
    .is("invoice_expired_email_sent_at", null)
    .or(
      `invoice_expired_email_attempted_at.is.null,invoice_expired_email_attempted_at.lt.${retryBefore}`,
    )
    .select("id")
    .maybeSingle();

  if (claimError) {
    console.error("[billing] could not claim expired invoice email", claimError);
    return false;
  }
  if (!claim) {
    const { data: latest } = await admin
      .from("subscriptions")
      .select("invoice_expired_email_sent_at")
      .eq("id", invoice.id)
      .maybeSingle();
    return Boolean(latest?.invoice_expired_email_sent_at);
  }

  const planName = plans[invoice.plan as "premium" | "business"].name;
  const billingUrl = new URL("/dashboard/billing", PUBLIC_SITE_URL).toString();
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, invoice ${invoice.order_id} kedaluwarsa/dibatalkan. Saya ingin bantuan membuat invoice baru.`,
  );
  const html = [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f;line-height:1.6">',
    '<p style="color:#e45d32;font-size:12px;font-weight:bold;letter-spacing:2px">DIGIMENU</p>',
    '<h1 style="font-size:24px">Invoice sudah kedaluwarsa</h1>',
    "<p>Transaksi Pakasir untuk invoice ini sudah ditutup dan belum tercatat sebagai pembayaran berhasil. Paket belum diaktifkan.</p>",
    '<table style="width:100%;border-collapse:collapse;background:#faf8f4;border-radius:12px">',
    `<tr><td style="padding:10px">Nomor invoice</td><td style="padding:10px;text-align:right"><b>${escapeHtml(invoice.order_id)}</b></td></tr>`,
    `<tr><td style="padding:10px">Paket</td><td style="padding:10px;text-align:right"><b>${escapeHtml(planName)}</b></td></tr>`,
    `<tr><td style="padding:10px">Harga paket per bulan</td><td style="padding:10px;text-align:right"><b>${rupiah(plans[invoice.plan as "premium" | "business"].price)}</b></td></tr>`,
    `<tr><td style="padding:10px">Total</td><td style="padding:10px;text-align:right"><b>Rp${Number(invoice.amount).toLocaleString("id-ID")}</b></td></tr>`,
    `<tr><td style="padding:10px">Batas pembayaran</td><td style="padding:10px;text-align:right"><b>${escapeHtml(formatJakartaDate(pakasirInvoiceExpiresAt(invoice.created_at)))}</b></td></tr>`,
    "</table>",
    planFeaturesHtml(invoice.plan),
    `<p style="margin:24px 0"><a href="${escapeHtml(billingUrl)}" style="background:#e45d32;border-radius:10px;color:white;padding:12px 18px;text-decoration:none;font-weight:bold">Buat invoice baru</a></p>`,
    `<p>Kalau kamu sudah membayar sebelum invoice ditutup, <a href="${escapeHtml(supportUrl)}">hubungi admin Digimenu</a> dan sertakan nomor invoice ini.</p>`,
    "<p>Tim Digimenu</p></div>",
  ].join("");

  try {
    const result = await sendEmail({
      to: recipient,
      subject: `Invoice kedaluwarsa - ${invoice.order_id}`,
      html,
    });
    if (!result.sent) {
      console.error("[billing] invoice expiry email was not sent", result.reason);
      return false;
    }
  } catch (caught) {
    console.error("[billing] invoice expiry email request failed", caught);
    return false;
  }

  const { error: sentError } = await admin
    .from("subscriptions")
    .update({ invoice_expired_email_sent_at: new Date().toISOString() })
    .eq("id", invoice.id);
  if (sentError) console.error("[billing] could not record invoice expiry email", sentError);
  return !sentError;
}

async function failPakasirInvoice(admin: AdminClient, invoice: PendingInvoice) {
  const now = new Date().toISOString();
  const { error } = await admin
    .from("subscriptions")
    .update({
      status: "failed",
      payment_url: null,
      billing_pending_lock: false,
      updated_at: now,
    })
    .eq("id", invoice.id)
    .eq("status", "pending");
  if (error) {
    console.error("[pakasir] could not expire invoice", error);
    return invoice;
  }
  const failedInvoice = (await readInvoice(admin, invoice.id)) || { ...invoice, status: "failed" };
  if (failedInvoice.status === "failed") await sendInvoiceExpiredEmail(admin, failedInvoice);
  return failedInvoice;
}

async function sendPaymentReceiptEmail(admin: AdminClient, invoice: PendingInvoice) {
  if (invoice.payment_receipt_email_sent_at) return true;

  let recipient: string | null = null;
  try {
    const { data, error } = await admin.auth.admin.getUserById(invoice.owner_id);
    if (error) throw error;
    recipient = data.user?.email || null;
  } catch (caught) {
    console.error("[billing] could not load payment receipt recipient", caught);
    return false;
  }
  if (!recipient) return false;

  const now = new Date();
  const retryBefore = new Date(now.getTime() - EMAIL_RETRY_DELAY_MS).toISOString();
  const attemptedAt = now.toISOString();
  const { data: claim, error: claimError } = await admin
    .from("subscriptions")
    .update({ payment_receipt_email_attempted_at: attemptedAt })
    .eq("id", invoice.id)
    .is("payment_receipt_email_sent_at", null)
    .or(
      `payment_receipt_email_attempted_at.is.null,payment_receipt_email_attempted_at.lt.${retryBefore}`,
    )
    .select("id")
    .maybeSingle();

  if (claimError) {
    console.error("[billing] could not claim payment receipt email", claimError);
    return false;
  }
  if (!claim) {
    const { data: latest } = await admin
      .from("subscriptions")
      .select("payment_receipt_email_sent_at")
      .eq("id", invoice.id)
      .maybeSingle();
    return Boolean(latest?.payment_receipt_email_sent_at);
  }

  const paidAt = new Date().toISOString();
  const planName = plans[invoice.plan as "premium" | "business"].name;
  const receiptUrl = billingConfirmationUrl(invoice.order_id, invoice.plan);
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, saya ingin menanyakan pembayaran invoice ${invoice.order_id}.`,
  );
  const html = [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f;line-height:1.6">',
    '<p style="color:#e45d32;font-size:12px;font-weight:bold;letter-spacing:2px">DIGIMENU</p>',
    '<h1 style="font-size:24px">Pembayaran berhasil</h1>',
    "<p>Pembayaran sudah terkonfirmasi dan paket kamu telah diaktifkan. Simpan email ini sebagai bukti pembayaran.</p>",
    '<table style="width:100%;border-collapse:collapse;background:#faf8f4;border-radius:12px">',
    `<tr><td style="padding:10px">Nomor invoice</td><td style="padding:10px;text-align:right"><b>${escapeHtml(invoice.order_id)}</b></td></tr>`,
    `<tr><td style="padding:10px">Paket</td><td style="padding:10px;text-align:right"><b>${escapeHtml(planName)}</b></td></tr>`,
    `<tr><td style="padding:10px">Harga paket per bulan</td><td style="padding:10px;text-align:right"><b>${rupiah(plans[invoice.plan as "premium" | "business"].price)}</b></td></tr>`,
    `<tr><td style="padding:10px">Durasi</td><td style="padding:10px;text-align:right"><b>${Number(invoice.months || 1)} bulan</b></td></tr>`,
    `<tr><td style="padding:10px">Metode pembayaran</td><td style="padding:10px;text-align:right"><b>${invoice.payment_method === "qris" ? "QRIS Pakasir" : "Pakasir"}</b></td></tr>`,
    `<tr><td style="padding:10px">Total dibayar</td><td style="padding:10px;text-align:right"><b>Rp${Number(invoice.amount).toLocaleString("id-ID")}</b></td></tr>`,
    `<tr><td style="padding:10px">Waktu konfirmasi</td><td style="padding:10px;text-align:right"><b>${escapeHtml(formatJakartaDate(new Date(paidAt)))}</b></td></tr>`,
    "</table>",
    planFeaturesHtml(invoice.plan),
    `<p style="margin:24px 0"><a href="${escapeHtml(receiptUrl)}" style="background:#e45d32;border-radius:10px;color:white;padding:12px 18px;text-decoration:none;font-weight:bold">Lihat status paket</a></p>`,
    `<p>Butuh bantuan? <a href="${escapeHtml(supportUrl)}">Hubungi admin Digimenu</a>.</p>`,
    "<p>Terima kasih telah menggunakan Digimenu.</p></div>",
  ].join("");

  try {
    const result = await sendEmail({
      to: recipient,
      subject: `Pembayaran berhasil - ${invoice.order_id}`,
      html,
    });
    if (!result.sent) {
      console.error("[billing] payment receipt email was not sent", result.reason);
      return false;
    }
  } catch (caught) {
    console.error("[billing] payment receipt email request failed", caught);
    return false;
  }

  const { error: sentError } = await admin
    .from("subscriptions")
    .update({ payment_receipt_email_sent_at: new Date().toISOString() })
    .eq("id", invoice.id);
  if (sentError) console.error("[billing] could not record payment receipt email", sentError);
  return !sentError;
}

async function activatePakasirInvoice(admin: AdminClient, invoice: PendingInvoice) {
  const now = new Date().toISOString();
  const { data: activated, error } = await admin
    .from("subscriptions")
    .update({
      status: "active",
      paid_at: now,
      updated_at: now,
      billing_pending_lock: false,
    })
    .eq("id", invoice.id)
    .in("status", ["pending", "failed"])
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[pakasir] could not activate paid invoice", error);
    return false;
  }
  if (!activated) {
    const latest = await readInvoice(admin, invoice.id);
    if (latest?.status !== "active") return false;
  }

  const rank = { free: 0, premium: 1, business: 2 } as const;
  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .select("plan")
    .eq("id", invoice.tenant_id)
    .maybeSingle();
  if (tenantError || !tenant) {
    console.error("[pakasir] could not load tenant plan", tenantError);
    return false;
  }
  const currentRank = rank[tenant.plan as keyof typeof rank] ?? 0;
  const nextRank = rank[invoice.plan as keyof typeof rank] ?? 0;
  if (nextRank > currentRank) {
    const { error: planError } = await admin
      .from("tenants")
      .update({ plan: invoice.plan })
      .eq("id", invoice.tenant_id);
    if (planError) {
      console.error("[pakasir] could not update tenant plan", planError);
      return false;
    }
  }

  const activeInvoice = { ...invoice, status: "active" };
  await sendPaymentReceiptEmail(admin, activeInvoice);
  return true;
}

export async function reconcilePakasirInvoice(
  admin: AdminClient,
  invoice: PendingInvoice,
  options: { allowFailed?: boolean } = {},
) {
  if (invoice.payment_provider !== "pakasir") return invoice;
  if (invoice.status === "active") {
    await sendPaymentReceiptEmail(admin, invoice);
    return (await readInvoice(admin, invoice.id)) || invoice;
  }
  if (invoice.status !== "pending" && !(options.allowFailed && invoice.status === "failed")) {
    return invoice;
  }

  const now = new Date();
  const expired = now.getTime() >= pakasirInvoiceExpiresAt(invoice.created_at).getTime();
  if (!invoice.pakasir_txn_id) {
    return expired && invoice.status === "pending" ? failPakasirInvoice(admin, invoice) : invoice;
  }

  if (expired && invoice.status === "pending") {
    const retryBefore = new Date(now.getTime() - STATUS_RECHECK_DELAY_MS).toISOString();
    const checkedAt = now.toISOString();
    const { data: claim, error: claimError } = await admin
      .from("subscriptions")
      .update({ pakasir_status_checked_at: checkedAt, updated_at: checkedAt })
      .eq("id", invoice.id)
      .eq("status", "pending")
      .or(`pakasir_status_checked_at.is.null,pakasir_status_checked_at.lt.${retryBefore}`)
      .select("id")
      .maybeSingle();
    if (claimError) {
      console.error("[pakasir] could not claim expiry check", claimError);
      return invoice;
    }
    if (!claim) return (await readInvoice(admin, invoice.id)) || invoice;
  }

  let remote;
  try {
    remote = await getPakasirTransactionStatus(invoice.pakasir_txn_id);
  } catch (caught) {
    console.error("[pakasir] could not verify payment status", caught);
    return invoice;
  }
  if (
    remote.txnId !== invoice.pakasir_txn_id ||
    remote.orderId !== invoice.order_id ||
    remote.amount !== Number(invoice.amount)
  ) {
    console.error("[pakasir] transaction details do not match invoice", invoice.order_id);
    return invoice;
  }

  if (remote.status === "completed") {
    const activated = await activatePakasirInvoice(admin, invoice);
    if (!activated) return (await readInvoice(admin, invoice.id)) || invoice;
    return (await readInvoice(admin, invoice.id)) || { ...invoice, status: "active" };
  }

  if (remote.status === "canceled") {
    if (invoice.status !== "pending") return invoice;
    return failPakasirInvoice(admin, invoice);
  }

  if (expired && invoice.status === "pending") {
    try {
      await cancelPakasirTransaction(invoice.pakasir_txn_id);
      return failPakasirInvoice(admin, invoice);
    } catch (caught) {
      console.error("[pakasir] invoice expiry cancellation failed", caught);
      return invoice;
    }
  }
  return invoice;
}

export async function getPendingInvoice(admin: AdminClient, tenantId: string) {
  let completedFallback: PendingInvoice | null = null;
  while (true) {
    const { data, error } = await admin
      .from("subscriptions")
      .select(PENDING_INVOICE_FIELDS)
      .eq("tenant_id", tenantId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error("Invoice pending belum dapat diperiksa.");
    if (!data) return completedFallback;

    let invoice = data as PendingInvoice;
    if (!invoice.billing_pending_lock) {
      const { error: lockError } = await admin
        .from("subscriptions")
        .update({ billing_pending_lock: true })
        .eq("id", invoice.id)
        .eq("status", "pending");
      if (lockError?.code === "23505") {
        const { data: locked, error: lockedReadError } = await admin
          .from("subscriptions")
          .select(PENDING_INVOICE_FIELDS)
          .eq("tenant_id", tenantId)
          .eq("status", "pending")
          .eq("billing_pending_lock", true)
          .maybeSingle();
        if (lockedReadError) throw new Error("Invoice pending belum dapat diperiksa.");
        if (locked) invoice = locked as PendingInvoice;
      } else if (lockError) {
        throw new Error("Invoice pending belum dapat dikunci.");
      } else {
        invoice = { ...invoice, billing_pending_lock: true };
      }
    }

    if (
      invoice.payment_provider === "pakasir" &&
      Date.now() >= pakasirInvoiceExpiresAt(invoice.created_at).getTime()
    ) {
      const reconciled = await reconcilePakasirInvoice(admin, invoice);
      if (reconciled.status === "active") completedFallback = reconciled;
      if (reconciled.status !== "pending") continue;
      invoice = reconciled;
    }

    const paymentUrl = canonicalPakasirPaymentUrl(invoice);
    if (paymentUrl && paymentUrl !== invoice.payment_url) {
      await admin
        .from("subscriptions")
        .update({ payment_url: paymentUrl })
        .eq("id", invoice.id)
        .eq("status", "pending");
      invoice = { ...invoice, payment_url: paymentUrl };
    }

    return invoice;
  }
}

export async function sendBillingInvoiceEmail({
  admin,
  invoice,
  email,
  paymentUrl,
}: {
  admin: AdminClient;
  invoice: PendingInvoice;
  email: string | null | undefined;
  paymentUrl?: string | null;
}) {
  if (!email) return false;
  if (invoice.invoice_email_sent_at) return true;

  const now = new Date();
  const retryBefore = new Date(now.getTime() - EMAIL_RETRY_DELAY_MS).toISOString();
  const attemptedAt = now.toISOString();
  const { data: claim, error: claimError } = await admin
    .from("subscriptions")
    .update({ invoice_email_attempted_at: attemptedAt })
    .eq("id", invoice.id)
    .is("invoice_email_sent_at", null)
    .or(`invoice_email_attempted_at.is.null,invoice_email_attempted_at.lt.${retryBefore}`)
    .select("id")
    .maybeSingle();

  if (claimError) {
    console.error("[billing] could not claim invoice email", claimError);
    return false;
  }
  if (!claim) {
    const { data: latest } = await admin
      .from("subscriptions")
      .select("invoice_email_sent_at")
      .eq("id", invoice.id)
      .maybeSingle();
    return Boolean(latest?.invoice_email_sent_at);
  }

  const isManual = invoice.payment_method === "manual";
  const detailUrl = billingConfirmationUrl(invoice.order_id, invoice.plan);
  const payUrl = paymentUrl || invoice.payment_url;
  const expiry = pakasirInvoiceExpiresAt(invoice.created_at);
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, saya ingin menanyakan pembayaran invoice ${invoice.order_id}.`,
  );
  const planName = plans[invoice.plan as "premium" | "business"].name;
  const paymentInstructions = isManual
    ? "Hubungi admin melalui WhatsApp untuk meminta detail rekening, lalu transfer sesuai total invoice."
    : "Bayar dengan QRIS di halaman Pakasir. Paket akan aktif otomatis setelah pembayaran terkonfirmasi.";
  const deadline = isManual
    ? ""
    : `<p style="background:#fff3e7;border-radius:10px;padding:14px"><b>Batas pembayaran:</b> invoice ini berlaku selama 24 jam, sampai <b>${escapeHtml(formatJakartaDate(expiry))}</b>. Sisa waktu berjalan dapat dilihat di halaman detail invoice. Setelah batas waktu, transaksi akan dibatalkan otomatis dan kamu bisa membuat invoice baru.</p>`;
  const paymentCta =
    !isManual && payUrl
      ? `<p style="margin:12px 0"><a href="${escapeHtml(payUrl)}" style="background:#e45d32;border-radius:10px;color:white;padding:12px 18px;text-decoration:none;font-weight:bold">Bayar sekarang via Pakasir</a></p>`
      : "";
  const html = [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f;line-height:1.6">',
    '<p style="color:#e45d32;font-size:12px;font-weight:bold;letter-spacing:2px">DIGIMENU</p>',
    '<h1 style="font-size:24px">Invoice pembayaran siap</h1>',
    `<p>${paymentInstructions}</p>`,
    deadline,
    '<table style="width:100%;border-collapse:collapse;background:#faf8f4;border-radius:12px">',
    `<tr><td style="padding:10px">Nomor invoice</td><td style="padding:10px;text-align:right"><b>${escapeHtml(invoice.order_id)}</b></td></tr>`,
    `<tr><td style="padding:10px">Paket</td><td style="padding:10px;text-align:right"><b>${escapeHtml(planName)}</b></td></tr>`,
    `<tr><td style="padding:10px">Harga paket per bulan</td><td style="padding:10px;text-align:right"><b>${rupiah(plans[invoice.plan as "premium" | "business"].price)}</b></td></tr>`,
    `<tr><td style="padding:10px">Durasi</td><td style="padding:10px;text-align:right"><b>${Number(invoice.months || 1)} bulan</b></td></tr>`,
    `<tr><td style="padding:10px">Metode</td><td style="padding:10px;text-align:right"><b>${isManual ? "Transfer manual" : "QRIS Pakasir"}</b></td></tr>`,
    `<tr><td style="padding:10px">Total tagihan</td><td style="padding:10px;text-align:right"><b>Rp${Number(invoice.amount).toLocaleString("id-ID")}</b></td></tr>`,
    "</table>",
    planFeaturesHtml(invoice.plan),
    paymentCta,
    `<p style="margin:24px 0"><a href="${escapeHtml(detailUrl)}" style="border:1px solid #ded8ce;border-radius:10px;color:#29251f;padding:11px 16px;text-decoration:none;font-weight:bold">Lihat detail invoice</a></p>`,
    `<p>Jika pembayaran sudah berhasil tetapi status belum berubah, buka detail invoice beberapa saat lagi. Bantuan tersedia melalui <a href="${escapeHtml(supportUrl)}">WhatsApp admin</a>.</p>`,
    "<p>Terima kasih,<br>Tim Digimenu</p></div>",
  ].join("");

  let result: Awaited<ReturnType<typeof sendEmail>>;
  try {
    result = await sendEmail({
      to: email,
      subject: `Invoice ${invoice.order_id} - ${planName} Digimenu`,
      html,
    });
  } catch (caught) {
    console.error("[billing] invoice email request failed", caught);
    return false;
  }
  if (!result.sent) {
    console.error("[billing] invoice email was not sent", result.reason);
    return false;
  }

  const { error: sentUpdateError } = await admin
    .from("subscriptions")
    .update({ invoice_email_sent_at: new Date().toISOString() })
    .eq("id", invoice.id);
  if (sentUpdateError)
    console.error("[billing] could not record invoice email delivery", sentUpdateError);
  return true;
}
