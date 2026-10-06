import type { MetadataRoute } from "next";
import { INDEXABLE_SITE_URL } from "@/config/site";
import { SUPPORTED_LOCALES } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: INDEXABLE_SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...SUPPORTED_LOCALES.filter((locale) => locale !== "id").map((locale) => ({
      url: `${INDEXABLE_SITE_URL}/${locale}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    {
      url: `${INDEXABLE_SITE_URL}/community`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];
}
