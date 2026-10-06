import "server-only";

import { cancelPakasirTransaction, getPakasirTransactionStatus } from "@/lib/pakasir";
import { readInvoice, pakasirInvoiceExpiresAt } from "./invoice-data";
import {
  sendInvoiceExpiredEmail,
  sendPaymentReceiptEmail,
} from "./invoice-emails";
import type { BillingAdminClient } from "./server-types";
import type { PendingInvoice } from "./types";

const STATUS_RECHECK_DELAY_MS = 30 * 1000;

async function failPakasirInvoice(admin: BillingAdminClient, invoice: PendingInvoice) {
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

async function activatePakasirInvoice(admin: BillingAdminClient, invoice: PendingInvoice) {
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

  await sendPaymentReceiptEmail(admin, { ...invoice, status: "active" });
  return true;
}

export async function reconcilePakasirInvoice(
  admin: BillingAdminClient,
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
