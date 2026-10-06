import type { Item, PublicStore } from "./types";
import { getFallbackProductImage } from "./helpers";

export function mapProducts(store: PublicStore): Item[] {
  const categories = new Map(store.categories.map((category) => [category.id, category.name]));
  return store.products.map((product, index) => ({
    id: product.id,
    name: product.name,
    category: categories.get(product.category_id) || "Lainnya",
    description: product.description || "",
    price: product.price,
    promo: product.discount_price ?? undefined,
    image: product.image_url || getFallbackProductImage(index),
    featured: product.is_featured,
    available: product.is_available,
  }));
}
