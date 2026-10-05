export type PublicStore = {
  tenant: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    banner_url: string | null;
    promo_enabled: boolean;
    promo_title: string | null;
    promo_description: string | null;
    promo_image_url: string | null;
    promo_link_url: string | null;
    plan: "free" | "premium" | "business";
    whatsapp: string | null;
    instagram: string | null;
    address: string | null;
    maps_url: string | null;
    opening_hours: unknown;
    primary_color: string;
    background_color: string;
    layout_type: string;
    show_price: boolean;
    show_address: boolean;
    show_opening_hours: boolean;
    is_published: boolean;
    is_active: boolean;
  };
  categories: Array<{ id: string; name: string; slug: string; description: string | null }>;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    image_url: string | null;
    is_featured: boolean;
    is_available: boolean;
    category_id: string;
  }>;
  links: Array<{ id: string; title: string; url: string; icon: string | null; link_type: string }>;
};

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
