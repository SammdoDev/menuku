export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  promo?: number;
  image: string;
  featured?: boolean;
  available: boolean;
};

export const categories = ["Semua", "Kopi", "Non-kopi", "Makanan", "Pastry"];

export const products: Product[] = [
  {
    id: "kopi-susu-aren",
    name: "Kopi Susu Aren",
    category: "Kopi",
    description: "Espresso, susu segar, dan gula aren asli.",
    price: 28000,
    promo: 24000,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
    featured: true,
    available: true,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "Kopi",
    description: "Double shot espresso dengan microfoam lembut.",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85",
    featured: true,
    available: true,
  },
  {
    id: "matcha-cloud",
    name: "Matcha Cloud",
    category: "Non-kopi",
    description: "Matcha ceremonial, susu, dan cold foam vanilla.",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
    featured: true,
    available: true,
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "Pastry",
    description: "Croissant renyah dengan 100% butter.",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
    available: false,
  },
  {
    id: "nasi-goreng",
    name: "Nasi Goreng Temu",
    category: "Makanan",
    description: "Nasi goreng kampung, telur mata sapi, acar segar.",
    price: 38000,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    available: true,
  },
  {
    id: "lemon-tea",
    name: "Lemon Tea",
    category: "Non-kopi",
    description: "Teh melati dingin, perasan lemon, dan madu.",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
    available: true,
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    category: "Pastry",
    description: "Pastry berlapis dengan isian dark chocolate.",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",
    available: true,
  },
  {
    id: "shakshuka",
    name: "Eggs & Toast",
    category: "Makanan",
    description: "Telur panggang saus tomat rempah, sourdough.",
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
    available: true,
  },
];

export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
