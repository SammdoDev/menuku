import { createSupabaseServerClient } from "./supabase/server";
import { cache } from "react";

export type Tenant = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  business_type: string | null;
  logo_url: string | null;
  banner_url: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  maps_url: string | null;
  is_published: boolean;
  is_active: boolean;
  primary_color: string;
  background_color: string;
  layout_type: string;
  show_price: boolean;
  show_address: boolean;
  show_opening_hours: boolean;
  plan: "free" | "premium" | "business";
};

export const getCurrentMerchant = cache(async function getCurrentMerchant() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, tenant: null, supabase };
  const { data: tenant } = await supabase
    .from("tenants")
    .select(
      "id,owner_id,name,slug,description,business_type,logo_url,banner_url,whatsapp,instagram,address,maps_url,is_published,is_active,primary_color,background_color,layout_type,show_price,show_address,show_opening_hours,plan",
    )
    .eq("owner_id", user.id)
    .maybeSingle<Tenant>();
  return { user, tenant, supabase };
});
