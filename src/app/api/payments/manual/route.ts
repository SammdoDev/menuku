import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans } from "../../../../lib/plans";

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
  const plan = parsed.data.plan;
  const requestedMonths = Math.min(
    12,
    Math.max(1, Number(new URL(request.url).searchParams.get("months") || 1)),
  );
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
  const months = isUpgrade
    ? Math.max(
        1,
        Math.ceil((new Date(active!.expires_at).getTime() - now.getTime()) / (30 * 86400000)),
      )
    : requestedMonths;
  const amount = isUpgrade
    ? Math.ceil((plans[plan].price - plans[active!.plan as "premium" | "business"].price) * months)
    : plans[plan].price * months;
  const expiresAt = isUpgrade
    ? active!.expires_at
    : addMonths(active ? new Date(active.expires_at) : now, months).toISOString();
  const orderId = `MANUAL-${tenant.id.slice(0, 8)}-${Date.now()}`;
  const { error } = await supabase.from("subscriptions").insert({
    tenant_id: tenant.id,
    owner_id: user.id,
    plan,
    previous_plan: active?.plan || null,
    months,
    amount,
    expires_at: expiresAt,
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
