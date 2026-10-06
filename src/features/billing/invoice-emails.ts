import "server-only";

import { plans } from "./plans";
import {
  buildBillingInvoiceEmail,
  buildInvoiceExpiredEmail,
  buildPaymentReceiptEmail,
} from "./email-templates";
import type { BillingAdminClient } from "./server-types";
import type { PendingInvoice } from "./types";
import { sendEmail } from "@/lib/email";

const EMAIL_RETRY_DELAY_MS = 5 * 60 * 1000;

async function claimEmailAttempt(
  admin: BillingAdminClient,
  invoiceId: string,
  attemptedAtField: string,
  sentAtField: string,
  logLabel: string,
): Promise<"claimed" | "sent" | "skipped"> {
  const now = new Date();
  const retryBefore = new Date(now.getTime() - EMAIL_RETRY_DELAY_MS).toISOString();
  const { data: claim, error: claimError } = await admin
    .from("subscriptions")
    .update({ [attemptedAtField]: now.toISOString() })
    .eq("id", invoiceId)
    .is(sentAtField, null)
    .or(`${attemptedAtField}.is.null,${attemptedAtField}.lt.${retryBefore}`)
    .select("id")
    .maybeSingle();

  if (claimError) {
    console.error(`[billing] could not claim ${logLabel} email`, claimError);
    return "skipped";
  }
  if (claim) return "claimed";

  const { data: latest } = await admin
    .from("subscriptions")
    .select(sentAtField)
    .eq("id", invoiceId)
    .maybeSingle();
  return (latest as Record<string, string | null> | null)?.[sentAtField] ? "sent" : "skipped";
}

async function getInvoiceRecipient(
  admin: BillingAdminClient,
  invoice: PendingInvoice,
  label: string,
) {
  try {
    const { data, error } = await admin.auth.admin.getUserById(invoice.owner_id);
    if (error) throw error;
    return data.user?.email || null;
  } catch (caught) {
    console.error(`[billing] could not load ${label} recipient`, caught);
    return null;
  }
}

export async function sendInvoiceExpiredEmail(admin: BillingAdminClient, invoice: PendingInvoice) {
  if (invoice.invoice_expired_email_sent_at) return true;
  const recipient = await getInvoiceRecipient(admin, invoice, "expired invoice");
  if (!recipient) return false;
  const claim = await claimEmailAttempt(
    admin,
    invoice.id,
    "invoice_expired_email_attempted_at",
    "invoice_expired_email_sent_at",
    "expired invoice",
  );
  if (claim !== "claimed") return claim === "sent";

  try {
    const result = await sendEmail({
      to: recipient,
      subject: `Invoice kedaluwarsa - ${invoice.order_id}`,
      html: buildInvoiceExpiredEmail(invoice),
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

export async function sendPaymentReceiptEmail(admin: BillingAdminClient, invoice: PendingInvoice) {
  if (invoice.payment_receipt_email_sent_at) return true;
  const recipient = await getInvoiceRecipient(admin, invoice, "payment receipt");
  if (!recipient) return false;
  const claim = await claimEmailAttempt(
    admin,
    invoice.id,
    "payment_receipt_email_attempted_at",
    "payment_receipt_email_sent_at",
    "payment receipt",
  );
  if (claim !== "claimed") return claim === "sent";

  try {
    const result = await sendEmail({
      to: recipient,
      subject: `Pembayaran berhasil - ${invoice.order_id}`,
      html: buildPaymentReceiptEmail(invoice),
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

export async function sendBillingInvoiceEmail({
  admin,
  invoice,
  email,
  paymentUrl,
}: {
  admin: BillingAdminClient;
  invoice: PendingInvoice;
  email: string | null | undefined;
  paymentUrl?: string | null;
}) {
  if (!email) return false;
  if (invoice.invoice_email_sent_at) return true;

  const claim = await claimEmailAttempt(
    admin,
    invoice.id,
    "invoice_email_attempted_at",
    "invoice_email_sent_at",
    "invoice",
  );
  if (claim !== "claimed") return claim === "sent";

  const planName = plans[invoice.plan as "premium" | "business"].name;
  let result: Awaited<ReturnType<typeof sendEmail>>;
  try {
    result = await sendEmail({
      to: email,
      subject: `Invoice ${invoice.order_id} - ${planName} Digimenu`,
      html: buildBillingInvoiceEmail(invoice, paymentUrl),
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
