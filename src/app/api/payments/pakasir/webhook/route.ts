import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  PENDING_INVOICE_FIELDS,
  reconcilePakasirInvoice,
  type PendingInvoice,
} from "../../../../../lib/billing-invoices";
import { pakasirConfig } from "../../../../../lib/pakasir";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";

const webhookSchema = z.object({
  txn_id: z.string().min(1),
  order_id: z.string().min(1),
  amount: z.coerce.number().int().positive(),
  status: z.string(),
});

function matchesSecret(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  let expectedSecret: string;
  try {
    pakasirConfig();
    expectedSecret = process.env.PAKASIR_WEBHOOK_SECRET?.trim() || "";
  } catch {
    return NextResponse.json({ error: "Pakasir belum dikonfigurasi." }, { status: 503 });
  }
  if (!expectedSecret) {
    return NextResponse.json({ error: "Webhook Pakasir belum dikonfigurasi." }, { status: 503 });
  }

  const providedSecret = request.headers.get("x-secret") || "";
  if (!matchesSecret(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: "Webhook secret tidak valid." }, { status: 401 });
  }

  const parsed = webhookSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Format webhook tidak valid." }, { status: 400 });
  }
  const event = parsed.data;
  if (event.status !== "completed") return NextResponse.json({ received: true });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("order_id", event.order_id)
    .maybeSingle();
  if (error) {
    console.error("[pakasir] webhook invoice lookup failed", error);
    return NextResponse.json({ error: "Invoice belum dapat diperiksa." }, { status: 500 });
  }

  const invoice = data as PendingInvoice | null;
  if (
    !invoice ||
    invoice.payment_provider !== "pakasir" ||
    Number(invoice.amount) !== event.amount ||
    invoice.pakasir_txn_id !== event.txn_id
  ) {
    return NextResponse.json({ error: "Data transaksi tidak cocok." }, { status: 404 });
  }

  const updated = await reconcilePakasirInvoice(admin, invoice, { allowFailed: true });
  if (updated.status !== "active") {
    return NextResponse.json(
      { error: "Status pembayaran belum dapat disinkronkan." },
      { status: 502 },
    );
  }
  if (!updated.payment_receipt_email_sent_at) {
    return NextResponse.json({ error: "Bukti pembayaran belum dapat dikirim." }, { status: 503 });
  }
  return NextResponse.json({ received: true, status: "active" });
}
