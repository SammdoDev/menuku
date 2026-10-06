import "server-only";

import {
  canonicalPakasirPaymentUrl,
  getLatestLockedPendingInvoice,
  listLatestPendingInvoice,
  pakasirInvoiceExpiresAt,
} from "./invoice-data";
import { reconcilePakasirInvoice } from "./pakasir-reconciliation";
import type { BillingAdminClient } from "./server-types";
import type { PendingInvoice } from "./types";

export async function getPendingInvoice(admin: BillingAdminClient, tenantId: string) {
  let completedFallback: PendingInvoice | null = null;
  while (true) {
    let invoice = await listLatestPendingInvoice(admin, tenantId);
    if (!invoice) return completedFallback;

    if (!invoice.billing_pending_lock) {
      const { error: lockError } = await admin
        .from("subscriptions")
        .update({ billing_pending_lock: true })
        .eq("id", invoice.id)
        .eq("status", "pending");
      if (lockError?.code === "23505") {
        const locked = await getLatestLockedPendingInvoice(admin, tenantId);
        if (locked) invoice = locked;
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
