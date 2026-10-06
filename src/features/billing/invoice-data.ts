import "server-only";

import { PUBLIC_SITE_URL } from "@/config/site";
import type { BillingAdminClient } from "./server-types";
import type { PendingInvoice } from "./types";

export const PAKASIR_INVOICE_TTL_MS = 24 * 60 * 60 * 1000;

export const PENDING_INVOICE_FIELDS =
  "id,tenant_id,owner_id,order_id,plan,months,amount,status,payment_method,payment_provider,payment_url,pakasir_txn_id,created_at,invoice_email_sent_at,invoice_email_attempted_at,pakasir_status_checked_at,billing_pending_lock,payment_receipt_email_attempted_at,payment_receipt_email_sent_at,invoice_expired_email_attempted_at,invoice_expired_email_sent_at";

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

export async function readInvoice(admin: BillingAdminClient, id: string) {
  const { data, error } = await admin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Status invoice belum dapat diperiksa.");
  return data as PendingInvoice | null;
}

export async function listLatestPendingInvoice(admin: BillingAdminClient, tenantId: string) {
  const { data, error } = await admin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("tenant_id", tenantId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Invoice pending belum dapat diperiksa.");
  return data as PendingInvoice | null;
}

export async function getLatestLockedPendingInvoice(admin: BillingAdminClient, tenantId: string) {
  const { data, error } = await admin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("tenant_id", tenantId)
    .eq("status", "pending")
    .eq("billing_pending_lock", true)
    .maybeSingle();
  if (error) throw new Error("Invoice pending belum dapat diperiksa.");
  return data as PendingInvoice | null;
}
