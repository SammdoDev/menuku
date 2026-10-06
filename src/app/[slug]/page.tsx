import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Storefront from "@/features/storefront/storefront";
import { getStoreBySlug } from "@/features/storefront/queries/store-query";
import { getStoreMetadata } from "@/features/storefront/store-metadata";

type PublicStorePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PublicStorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  return getStoreMetadata(store);
}

export default async function PublicStorePage({ params }: PublicStorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  return <Storefront store={store} />;
}
