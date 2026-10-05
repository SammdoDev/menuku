import { notFound } from "next/navigation";
import Storefront from "@/features/storefront/storefront";
import { getStoreBySlug } from "@/features/storefront/queries/store-query";

export default async function PublicStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  return <Storefront store={store} />;
}
