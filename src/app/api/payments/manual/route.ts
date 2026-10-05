import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "@/features/stores/queries/current-merchant";
import { plans } from "@/features/billing/plans";
import { billingConfirmationUrl, PENDING_INVOICE_FIELDS } from "@/features/billing/invoice-data";
import { getPendingInvoice } from "@/features/billing/pending-invoice-query";
import { sendBillingInvoiceEmail } from "@/features/billing/invoice-emails";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

  const paymentAdmin = createSupabaseAdminClient();
  const continuePendingInvoice = async () => {
    const invoice = await getPendingInvoice(paymentAdmin, tenant.id);
    if (!invoice) return null;
    if (invoice.status === "active") {
      return NextResponse.json({
        ok: true,
        existing: true,
        alreadyPaid: true,
        orderId: invoice.order_id,
        confirmationUrl: billingConfirmationUrl(invoice.order_id, invoice.plan),
      });
    }
    const emailSent =
      invoice.payment_provider === "pakasir" && !invoice.payment_url
        ? null
        : await sendBillingInvoiceEmail({
            admin: paymentAdmin,
            invoice,
            email: user.email,
            paymentUrl: invoice.payment_url,
          });
    return NextResponse.json({
      ok: true,
      existing: true,
      orderId: invoice.order_id,
      paymentUrl: invoice.payment_url,
      confirmationUrl: billingConfirmationUrl(
        invoice.order_id,
        invoice.plan,
        emailSent === null ? undefined : emailSent ? "sent" : "failed",
      ),
      emailSent,
    });
  };

  const pendingResponse = await continuePendingInvoice();
  if (pendingResponse) return pendingResponse;

  const plan = parsed.data.plan;
  const requestedMonths = Number(new URL(request.url).searchParams.get("months") || 1);
  const months = [1, 3, 6, 12].includes(requestedMonths) ? requestedMonths : 1;
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
  if (amount < 1)
    return NextResponse.json(
      { error: "Nominal invoice tidak valid. Hubungi admin untuk bantuan upgrade paket." },
      { status: 400 },
    );

  const orderId = `MK${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
  const { error } = await supabase.from("subscriptions").insert({
    tenant_id: tenant.id,
    owner_id: user.id,
    plan,
    previous_plan: active?.plan || null,
    months,
    amount,
    expires_at: addMonths(now, months).toISOString(),
    order_id: orderId,
    status: "pending",
    payment_method: "manual",
    payment_provider: "manual",
    billing_pending_lock: true,
  });
  if (error) {
    if (error.code === "23505") {
      const concurrentResponse = await continuePendingInvoice();
      if (concurrentResponse) return concurrentResponse;
    }
    return NextResponse.json({ error: "Invoice transfer belum dapat dicatat." }, { status: 500 });
  }

  const { data: invoice, error: invoiceError } = await paymentAdmin
    .from("subscriptions")
    .select(PENDING_INVOICE_FIELDS)
    .eq("order_id", orderId)
    .maybeSingle();
  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Invoice transfer belum dapat dibaca." }, { status: 500 });
  }
  const emailSent = await sendBillingInvoiceEmail({
    admin: paymentAdmin,
    invoice: invoice as Parameters<typeof sendBillingInvoiceEmail>[0]["invoice"],
    email: user.email,
  });

  return NextResponse.json({
    ok: true,
    orderId,
    amount,
    confirmationUrl: billingConfirmationUrl(orderId, plan, emailSent ? "sent" : "failed"),
    emailSent,
  });
}
