import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans } from "../../../../lib/plans";

export async function POST(request: Request) {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant)
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  const parsed = z
    .object({ plan: z.enum(["premium", "business"]) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
  const plan = parsed.data.plan;
  const orderId = `MANUAL-${tenant.id.slice(0, 8)}-${Date.now()}`;
  const { error } = await supabase.from("subscriptions").insert({
    tenant_id: tenant.id,
    owner_id: user.id,
    plan,
    amount: plans[plan].price,
    order_id: orderId,
    status: "pending",
  });
  if (error)
    return NextResponse.json(
      { error: "Konfirmasi pembayaran belum dapat dicatat." },
      { status: 500 },
    );
  return NextResponse.json({ ok: true, orderId });
}
