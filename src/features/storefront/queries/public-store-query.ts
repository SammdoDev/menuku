import "server-only";

import { createSupabasePublicClient } from "@/lib/supabase/public";

export type PublishedStoreSitemapRow = {
  slug: string;
  updated_at: string;
};

export async function getPublishedStoresForSitemap(): Promise<PublishedStoreSitemapRow[]> {
  const supabase = createSupabasePublicClient();
  const pageSize = 1000;
  const stores: PublishedStoreSitemapRow[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("tenants")
      .select("slug,updated_at")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("slug", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error("Failed to load published storefronts for sitemap.", { cause: error });
    }
    if (!data) {
      throw new Error("Supabase returned no sitemap data without reporting an error.");
    }

    stores.push(...data);
    if (data.length < pageSize) return stores;
  }
}
