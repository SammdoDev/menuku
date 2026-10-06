import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Storefront from "@/features/storefront/storefront";
import { getStoreBySlug } from "@/features/storefront/queries/store-query";
import { RESERVED_STORE_SLUGS } from "@/features/stores/store-paths";
import { getStoreMetadata } from "@/features/storefront/store-metadata";

type LegacyStorePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: LegacyStorePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!RESERVED_STORE_SLUGS.has(slug)) return {};

  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  return getStoreMetadata(store);
}

export default async function LegacyStorePage({ params }: LegacyStorePageProps) {
  const { slug } = await params;
  if (RESERVED_STORE_SLUGS.has(slug)) {
    const store = await getStoreBySlug(slug);
    if (!store) notFound();
    return <Storefront store={store} />;
  }
  permanentRedirect(`/${encodeURIComponent(slug)}`);
}
