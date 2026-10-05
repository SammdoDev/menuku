import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getPakasirTransactionStatus, pakasirConfig } from "../../../../../lib/pakasir";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";

const webhookSchema = z.object({
  txn_id: z.string().min(1),
  order_id: z.string().min(1),
  amount: z.number().int().positive(),
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

const planRank = { free: 0, premium: 1, business: 2 } as const;

async function syncTenantPlan(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  tenantId: string,
  plan: string,
) {
  const { data: tenant, error: tenantReadError } = await supabase
    .from("tenants")
    .select("plan")
    .eq("id", tenantId)
    .maybeSingle();
  if (tenantReadError || !tenant) return false;

  const currentRank = planRank[tenant.plan as keyof typeof planRank] ?? 0;
  const nextRank = planRank[plan as keyof typeof planRank] ?? 0;
  if (currentRank >= nextRank) return true;

  const { error } = await supabase.from("tenants").update({ plan }).eq("id", tenantId);
  return !error;
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
  if (event.status !== "completed") {
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseAdminClient();
  const { data: subscription, error: lookupError } = await supabase
    .from("subscriptions")
    .select("id,tenant_id,plan,amount,status,payment_provider,pakasir_txn_id")
    .eq("order_id", event.order_id)
    .maybeSingle();
  if (lookupError) {
    return NextResponse.json({ error: "Invoice belum dapat diperiksa." }, { status: 500 });
  }
  if (
    !subscription ||
    subscription.payment_provider !== "pakasir" ||
    Number(subscription.amount) !== event.amount ||
    subscription.pakasir_txn_id !== event.txn_id
  ) {
    return NextResponse.json({ error: "Data transaksi tidak cocok." }, { status: 404 });
  }

  if (subscription.status !== "active") {
    let remoteStatus;
    try {
      remoteStatus = await getPakasirTransactionStatus(event.txn_id);
    } catch {
      return NextResponse.json({ error: "Status pembayaran belum dapat diverifikasi." }, { status: 502 });
    }
    if (
      remoteStatus.status !== "completed" ||
      remoteStatus.txnId !== event.txn_id ||
      remoteStatus.orderId !== event.order_id ||
      remoteStatus.amount !== event.amount
    ) {
      return NextResponse.json({ error: "Status transaksi Pakasir tidak cocok." }, { status: 409 });
    }

    const { data: activated, error: activationError } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        paid_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)
      .eq("status", "pending")
      .eq("payment_provider", "pakasir")
      .select("id")
      .maybeSingle();
    if (activationError) {
      return NextResponse.json({ error: "Paket belum dapat diaktifkan." }, { status: 500 });
    }
    if (!activated) {
      const { data: latest, error: latestError } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("id", subscription.id)
        .maybeSingle();
      if (latestError) {
        return NextResponse.json({ error: "Status invoice belum dapat diperiksa." }, { status: 500 });
      }
      if (latest?.status !== "active") {
        return NextResponse.json({ error: "Invoice tidak lagi menunggu pembayaran." }, { status: 409 });
      }
    }
  }

  const synced = await syncTenantPlan(supabase, subscription.tenant_id, subscription.plan);
  if (!synced) {
    return NextResponse.json({ error: "Status paket belum dapat diperbarui." }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
