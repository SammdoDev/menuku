import { createSupabaseServerClient } from "./supabase/server";

export type PublicStore = {
  tenant: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    promo_enabled: boolean;
    promo_title: string | null;
    promo_description: string | null;
    promo_image_url: string | null;
    promo_link_url: string | null;
    plan: "free" | "premium" | "business";
    whatsapp: string | null;
    instagram: string | null;
    address: string | null;
    maps_url: string | null;
    opening_hours: unknown;
    primary_color: string;
    background_color: string;
    layout_type: string;
    show_price: boolean;
    show_address: boolean;
    show_opening_hours: boolean;
    is_published: boolean;
    is_active: boolean;
  };
  categories: Array<{ id: string; name: string; slug: string; description: string | null }>;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    image_url: string | null;
    is_featured: boolean;
    is_available: boolean;
    category_id: string;
  }>;
  links: Array<{ id: string; title: string; url: string; icon: string | null; link_type: string }>;
};

export async function getStoreBySlug(slug: string): Promise<PublicStore | null> {
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase
    .from("tenants")
    .select(
      "id,name,slug,description,logo_url,banner_url,promo_enabled,promo_title,promo_description,promo_image_url,promo_link_url,plan,whatsapp,instagram,address,maps_url,opening_hours,primary_color,background_color,layout_type,show_price,show_address,show_opening_hours,is_published,is_active",
    )
    .eq("slug", slug)
    .maybeSingle<PublicStore["tenant"]>();
  if (!tenant || !tenant.is_active) return null;
  const [{ data: categories }, { data: products }, { data: links }] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,slug,description")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id,name,slug,description,price,discount_price,image_url,is_featured,is_available,category_id",
      )
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("custom_links")
      .select("id,title,url,icon,link_type")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("sort_order"),
  ]);
  return { tenant, categories: categories ?? [], products: products ?? [], links: links ?? [] };
}
