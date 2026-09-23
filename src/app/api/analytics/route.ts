import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

const eventSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/),
  eventType: z.enum([
    "page_view",
    "product_view",
    "category_click",
    "link_click",
    "whatsapp_click",
    "instagram_click",
    "maps_click",
    "share_click",
  ]),
  sessionId: z.string().min(1).max(80),
  productId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  linkId: z.string().uuid().optional(),
  deviceType: z.enum(["mobile", "desktop"]).optional(),
});

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Event tidak valid." }, { status: 400 });
  const value = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", value.slug)
    .eq("is_published", true)
    .eq("is_active", true)
    .maybeSingle();
  if (!tenant) return NextResponse.json({ ok: true });
  const { error } = await supabase.from("analytics_events").insert({
    tenant_id: tenant.id,
    event_type: value.eventType,
    session_id: value.sessionId,
    product_id: value.productId || null,
    category_id: value.categoryId || null,
    link_id: value.linkId || null,
    device_type: value.deviceType || null,
  });
  if (error) return NextResponse.json({ error: "Event belum dapat disimpan." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
