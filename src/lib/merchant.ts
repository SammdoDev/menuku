import { createSupabaseServerClient } from "./supabase/server";

export type Tenant = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  business_type: string | null;
  whatsapp: string | null;
  is_published: boolean;
  is_active: boolean;
  primary_color: string;
};

export async function getCurrentMerchant() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, tenant: null, supabase };
  const { data: tenant } = await supabase
    .from("tenants")
    .select(
      "id,owner_id,name,slug,description,business_type,whatsapp,is_published,is_active,primary_color",
    )
    .eq("owner_id", user.id)
    .maybeSingle<Tenant>();
  return { user, tenant, supabase };
}
