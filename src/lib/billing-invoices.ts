import { getPakasirTransactionStatus } from "./pakasir";
import { plans } from "./plans";
import { PUBLIC_SITE_URL, supportWhatsAppUrl } from "./site";
import { createSupabaseAdminClient } from "./supabase/admin";
import { sendEmail } from "./email";

const PENDING_INVOICE_FIELDS =
  "id,tenant_id,owner_id,order_id,plan,months,amount,status,payment_method,payment_provider,payment_url,pakasir_txn_id,created_at,invoice_email_sent_at,invoice_email_attempted_at,pakasir_status_checked_at,billing_pending_lock";
const PAKASIR_EXPIRY_MS = 24 * 60 * 60 * 1000;
const STATUS_RECHECK_DELAY_MS = 30 * 1000;
const EMAIL_RETRY_DELAY_MS = 5 * 60 * 1000;

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
};

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

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
    paymentUrl.searchParams.set(
      "redirect",
      billingConfirmationUrl(invoice.order_id, invoice.plan),
    );
    return paymentUrl.toString();
  } catch {
    return null;
  }
}

async function activateCompletedPakasirInvoice(admin: AdminClient, invoice: PendingInvoice) {
  const now = new Date().toISOString();
  const { error } = await admin
    .from("subscriptions")
    .update({ status: "active", paid_at: now, updated_at: now })
    .eq("id", invoice.id)
    .eq("status", "pending");
  if (error) return;

  const rank = { free: 0, premium: 1, business: 2 } as const;
  const { data: tenant } = await admin
    .from("tenants")
    .select("plan")
    .eq("id", invoice.tenant_id)
    .maybeSingle();
  const currentRank = rank[tenant?.plan as keyof typeof rank] ?? 0;
  const nextRank = rank[invoice.plan as keyof typeof rank] ?? 0;
  if (tenant && nextRank > currentRank) {
    await admin.from("tenants").update({ plan: invoice.plan }).eq("id", invoice.tenant_id);
  }
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

    if (invoice.payment_provider === "pakasir") {
      const age = Date.now() - new Date(invoice.created_at).getTime();
      if (age >= PAKASIR_EXPIRY_MS) {
        const checkedBefore = new Date(Date.now() - STATUS_RECHECK_DELAY_MS).toISOString();
        const checkedAt = new Date().toISOString();
        const { data: claim, error: claimError } = await admin
          .from("subscriptions")
          .update({ pakasir_status_checked_at: checkedAt, updated_at: checkedAt })
          .eq("id", invoice.id)
          .eq("status", "pending")
          .or(`pakasir_status_checked_at.is.null,pakasir_status_checked_at.lt.${checkedBefore}`)
          .select("id")
          .maybeSingle();

        if (!claimError && claim) {
          if (!invoice.pakasir_txn_id) {
            await admin
              .from("subscriptions")
              .update({ status: "failed", payment_url: null, updated_at: checkedAt })
              .eq("id", invoice.id)
              .eq("status", "pending");
            continue;
          }

          try {
            const remote = await getPakasirTransactionStatus(invoice.pakasir_txn_id);
            if (
              remote.txnId === invoice.pakasir_txn_id &&
              remote.orderId === invoice.order_id &&
              remote.amount === Number(invoice.amount)
            ) {
              if (remote.status === "canceled") {
                await admin
                  .from("subscriptions")
                  .update({ status: "failed", payment_url: null, updated_at: checkedAt })
                  .eq("id", invoice.id)
                  .eq("status", "pending");
                continue;
              }
              if (remote.status === "completed") {
                await activateCompletedPakasirInvoice(admin, invoice);
                const { data: latest, error: latestError } = await admin
                  .from("subscriptions")
                  .select(PENDING_INVOICE_FIELDS)
                  .eq("id", invoice.id)
                  .maybeSingle();
                if (latestError) throw new Error("Invoice pembayaran belum dapat diperiksa.");
                if (latest?.status === "active") completedFallback = latest as PendingInvoice;
                continue;
              }
            }
          } catch (caught) {
            console.error("[pakasir] could not reconcile expired payment", caught);
          }
        }
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
    }

    return invoice;
  }
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
  const invoiceUrl = paymentUrl || billingConfirmationUrl(invoice.order_id, invoice.plan);
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, saya ingin menanyakan pembayaran invoice ${invoice.order_id}.`,
  );
  const instructions = isManual
    ? "Hubungi admin melalui WhatsApp untuk meminta detail rekening, lalu transfer sesuai total invoice."
    : "Selesaikan pembayaran melalui Pakasir. Paket akan aktif otomatis setelah pembayaran terkonfirmasi.";
  const html = [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f">',
    "<h2>Invoice pembayaran Digimenu</h2>",
    "<p>Invoice kamu sudah siap. " + instructions + "</p>",
    "<p><b>Invoice:</b> " + escapeHtml(invoice.order_id),
    "<br><b>Paket:</b> " + escapeHtml(plans[invoice.plan as "premium" | "business"].name),
    "<br><b>Durasi:</b> " + Number(invoice.months || 1) + " bulan",
    "<br><b>Total:</b> Rp" + Number(invoice.amount).toLocaleString("id-ID") + "</p>",
    '<p><a href="' + escapeHtml(invoiceUrl) + '">' +
      (isManual ? "Buka instruksi invoice" : "Lanjutkan pembayaran") +
      "</a></p>",
    '<p><a href="' + escapeHtml(supportUrl) + '">Hubungi admin melalui WhatsApp</a></p></div>',
  ].join("");

  let result: Awaited<ReturnType<typeof sendEmail>>;
  try {
    result = await sendEmail({
      to: email,
      subject: "Invoice Digimenu " + invoice.order_id,
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
  if (sentUpdateError) console.error("[billing] could not record invoice email delivery", sentUpdateError);
  return true;
}
