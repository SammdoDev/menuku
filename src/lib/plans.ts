export const plans = {
  free: {
    name: "Free Demo",
    price: 0,
    description: "Coba buat katalog digital tanpa biaya.",
    features: [
      "Maks. 2 kategori",
      "Maks. 4 produk",
      "Halaman katalog dasar",
      "Tanpa custom link & analytics",
    ],
    limits: { categories: 2, products: 4, links: 0, analytics: false, customStyle: false },
  },
  premium: {
    name: "Premium",
    price: Number(process.env.PLAN_PREMIUM_PRICE || 29000),
    description: "Untuk bisnis kuliner yang mulai berkembang.",
    features: [
      "Maks. 6 kategori",
      "Maks. 30 produk",
      "Maks. 5 custom link",
      "Analytics dasar & custom style",
    ],
    limits: {
      categories: 6,
      products: 30,
      links: 5,
      analytics: true,
      customStyle: true,
    },
  },
  business: {
    name: "Business",
    price: Number(process.env.PLAN_BUSINESS_PRICE || 79000),
    description: "Untuk tim dan bisnis dengan kebutuhan lebih besar.",
    features: ["Semua fitur Premium", "3 anggota tim", "Custom domain", "Dukungan prioritas"],
    limits: {
      categories: Infinity,
      products: Infinity,
      links: Infinity,
      analytics: true,
      customStyle: true,
    },
  },
} as const;

export type PlanCode = keyof typeof plans;

export function getPlanRules(plan: string) {
  return plans[(plan in plans ? plan : "free") as PlanCode].limits;
}

export function isPaidPlan(value: string): value is Exclude<PlanCode, "free"> {
  return value === "premium" || value === "business";
}

export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
