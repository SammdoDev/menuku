import { NextResponse } from "next/server";
import { duitkuConfig, verifyDuitkuSignature } from "../../../../../lib/duitku";
import { createSupabaseAdminClient } from "../../../../../lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const merchantCode = String(form.get("merchantCode") || "");
    const amount = String(form.get("amount") || "");
    const orderId = String(form.get("merchantOrderId") || "");
    const paymentMethod = String(form.get("paymentCode") || "").toUpperCase();
    const resultCode = String(form.get("resultCode") || "");
    const signature = String(form.get("signature") || "");
    const reference = String(form.get("reference") || "");
    const config = duitkuConfig();
    if (
      merchantCode !== config.merchantCode ||
      !paymentMethod ||
      (config.paymentMethod && paymentMethod !== config.paymentMethod) ||
      !orderId ||
      !amount ||
      !verifyDuitkuSignature(`${merchantCode}${amount}${orderId}`, signature, config.apiKey)
    ) {
      return new NextResponse("INVALID", { status: 400 });
    }
    const supabase = createSupabaseAdminClient();
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id,tenant_id,amount,status,plan")
      .eq("order_id", orderId)
      .maybeSingle();
    if (!subscription || Number(subscription.amount) !== Number(amount))
      return new NextResponse("ORDER_NOT_FOUND", { status: 404 });
    if (resultCode === "00") {
      if (subscription.status !== "active") {
        const { data: updated, error } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            paid_at: new Date().toISOString(),
            payment_method: paymentMethod,
            duitku_reference: reference || null,
          })
          .eq("id", subscription.id)
          .eq("status", "pending")
          .select("id")
          .maybeSingle();
        if (error) return new NextResponse("ERROR", { status: 500 });
        if (!updated) {
          const { data: latest } = await supabase
            .from("subscriptions")
            .select("status")
            .eq("id", subscription.id)
            .maybeSingle();
          if (latest?.status !== "active") return new NextResponse("SUCCESS");
        }
      }
      const { error } = await supabase
        .from("tenants")
        .update({ plan: subscription.plan })
        .eq("id", subscription.tenant_id);
      if (error) return new NextResponse("ERROR", { status: 500 });
    } else if (resultCode !== "00" && subscription.status === "pending") {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "failed", payment_method: paymentMethod, duitku_reference: reference || null })
        .eq("id", subscription.id)
        .eq("status", "pending");
      if (error) return new NextResponse("ERROR", { status: 500 });
    }
    return new NextResponse("SUCCESS");
  } catch {
    return new NextResponse("ERROR", { status: 500 });
  }
}
