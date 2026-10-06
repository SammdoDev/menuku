import type { Metadata } from "next";
import { INDEXABLE_SITE_URL } from "@/config/site";
import { getStorefrontPath } from "@/features/stores/store-paths";
import type { PublicStore } from "./types";

export function getStoreMetadata(store: PublicStore): Metadata {
  const { tenant } = store;
  const canonicalUrl = `${INDEXABLE_SITE_URL}${getStorefrontPath(tenant.slug)}`;
  const title = `${tenant.name} | Menu Digital Menuku`;
  const description =
    tenant.description?.trim() ||
    `Lihat menu, harga, dan informasi terbaru dari ${tenant.name} di Menuku.`;
  const shareImage =
    tenant.banner_url || tenant.logo_url || `${INDEXABLE_SITE_URL}/landing-menu-food-strip.webp`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonicalUrl,
      siteName: "Menuku",
      title,
      description,
      images: [{ url: shareImage, alt: tenant.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}
