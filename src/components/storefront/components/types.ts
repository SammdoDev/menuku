import type { PublicStore } from "../../../lib/store";

export type Item = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  promo?: number;
  image: string;
  featured: boolean;
  available: boolean;
};
const fallback = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
];
export const waUrl = (number: string | null, message: string) =>
  number ? `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}` : "";
export function mapProducts(store: PublicStore): Item[] {
  const categories = new Map(store.categories.map((category) => [category.id, category.name]));
  return store.products.map((product, index) => ({
    id: product.id,
    name: product.name,
    category: categories.get(product.category_id) || "Lainnya",
    description: product.description || "",
    price: product.price,
    promo: product.discount_price ?? undefined,
    image: product.image_url || fallback[index % fallback.length],
    featured: product.is_featured,
    available: product.is_available,
  }));
}
