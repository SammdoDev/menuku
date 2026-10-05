import { notFound, permanentRedirect } from "next/navigation";
import Storefront from "../../../components/storefront/storefront";
import { getStoreBySlug } from "../../../lib/store";
import { RESERVED_STORE_SLUGS } from "../../../lib/store-paths";

export default async function LegacyStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED_STORE_SLUGS.has(slug)) {
    const store = await getStoreBySlug(slug);
    if (!store) notFound();
    return <Storefront store={store} />;
  }
  permanentRedirect(`/${encodeURIComponent(slug)}`);
}
