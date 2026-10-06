import type { MetadataRoute } from "next";
import { INDEXABLE_SITE_URL } from "@/config/site";
import { getPublishedStoresForSitemap } from "@/features/storefront/queries/public-store-query";
import { getStorefrontPath } from "@/features/stores/store-paths";
import { SUPPORTED_LOCALES } from "@/i18n/config";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = [
    INDEXABLE_SITE_URL,
    ...SUPPORTED_LOCALES.filter((locale) => locale !== "id").map(
      (locale) => `${INDEXABLE_SITE_URL}/${locale}`,
    ),
    `${INDEXABLE_SITE_URL}/community`,
  ];
  const urls = new Set(staticUrls);
  const entries: MetadataRoute.Sitemap = staticUrls.map((url) => ({ url }));
  const stores = await getPublishedStoresForSitemap();

  for (const store of stores) {
    const url = `${INDEXABLE_SITE_URL}${getStorefrontPath(store.slug)}`;
    if (urls.has(url)) continue;
    urls.add(url);

    const lastModified = new Date(store.updated_at);
    entries.push(Number.isNaN(lastModified.getTime()) ? { url } : { url, lastModified });
  }

  return entries;
}
