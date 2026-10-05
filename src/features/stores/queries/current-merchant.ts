import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import type { Tenant } from "@/features/stores/types";

export const getCurrentMerchant = cache(async function getCurrentMerchant() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, tenant: null, supabase };
  let { data: tenant, error } = await supabase
    .from("tenants")
    .select(
      "id,owner_id,name,slug,description,business_type,logo_url,banner_url,promo_enabled,promo_title,promo_description,promo_image_url,promo_link_url,whatsapp,instagram,address,maps_url,opening_hours,is_published,is_active,primary_color,background_color,layout_type,show_price,show_address,show_opening_hours,plan",
    )
    .eq("owner_id", user.id)
    .maybeSingle<Tenant>();
  if (
    (!tenant || error) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );
    const fallback = await admin
      .from("tenants")
      .select(
        "id,owner_id,name,slug,description,business_type,logo_url,banner_url,promo_enabled,promo_title,promo_description,promo_image_url,promo_link_url,whatsapp,instagram,address,maps_url,opening_hours,is_published,is_active,primary_color,background_color,layout_type,show_price,show_address,show_opening_hours,plan",
      )
      .eq("owner_id", user.id)
      .maybeSingle<Tenant>();
    if (fallback.data) tenant = fallback.data;
    if (fallback.error) error = fallback.error;
  }
  if (error)
    console.error("[merchant] failed to load tenant", {
      userId: user.id,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  return { user, tenant, supabase };
});
