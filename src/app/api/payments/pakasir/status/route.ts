import { NextResponse } from "next/server";
import { pakasirInvoiceExpiresAt, PENDING_INVOICE_FIELDS } from "@/features/billing/invoice-data";
import { reconcilePakasirInvoice } from "@/features/billing/pakasir-reconciliation";
import type { PendingInvoice } from "@/features/billing/types";
import { getCurrentMerchant } from "@/features/stores/queries/current-merchant";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { user, tenant } = await getCurrentMerchant();
  if (!user || !tenant) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const orderId = new URL(request.url).searchParams.get("order")?.trim();
  if (!orderId) return NextResponse.json({ error: "Nomor invoice wajib diisi." }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("tenant_id", tenant.id)
    .eq("order_id", orderId)
    .maybeSingle();
  if (error) {
    console.error("[pakasir] could not load invoice for status check", error);
    return NextResponse.json({ error: "Status invoice belum dapat diperiksa." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Invoice tidak ditemukan." }, { status: 404 });

  const invoice = data as PendingInvoice;
  if (invoice.payment_provider !== "pakasir") {
    return NextResponse.json({ error: "Invoice ini bukan pembayaran Pakasir." }, { status: 400 });
  }

  try {
    const latest = await reconcilePakasirInvoice(admin, invoice);
    return NextResponse.json(
      {
        status: latest.status,
        receiptEmailSent: Boolean(latest.payment_receipt_email_sent_at),
        expiresAt: pakasirInvoiceExpiresAt(invoice.created_at).toISOString(),
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (caught) {
    console.error("[pakasir] invoice status reconciliation failed", caught);
    return NextResponse.json(
      { error: "Status pembayaran belum dapat disinkronkan." },
      { status: 502 },
    );
  }
}
