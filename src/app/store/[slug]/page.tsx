import { notFound } from "next/navigation";
import Storefront from "../../../components/storefront/storefront";
import { getStoreBySlug } from "../../../lib/store";

export default async function StorePage({ params }: { params: Promise<{ slug:string }> }) { const {slug}=await params; const store=await getStoreBySlug(slug); if(!store)notFound(); return <Storefront store={store}/>; }
