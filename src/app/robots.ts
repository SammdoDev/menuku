import type { MetadataRoute } from "next";
import { INDEXABLE_SITE_URL } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${INDEXABLE_SITE_URL}/sitemap.xml`,
  };
}
