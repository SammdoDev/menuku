import type { MetadataRoute } from "next";
import { INDEXABLE_SITE_URL } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: INDEXABLE_SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${INDEXABLE_SITE_URL}/community`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];
}
