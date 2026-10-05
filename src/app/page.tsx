import type { Metadata } from "next";
import { INDEXABLE_SITE_URL } from "../lib/site";
import { plans, type PlanCode } from "../lib/plans";
import LandingPageLinktree from "./landing-page-linktree";

const title = "Menu Digital untuk Bisnis Kuliner Indonesia | Menuku";
const description =
  "Buat menu digital yang mudah dibagikan untuk bisnis kuliner. Kelola produk, harga, kategori, informasi toko, dan tautan bisnis dari satu dashboard.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: INDEXABLE_SITE_URL,
    siteName: "Menuku",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
};

export default function HomePage() {
  const planPrices = (Object.entries(plans) as [PlanCode, (typeof plans)[PlanCode]][]).map(
    ([code, plan]) => ({ code, price: plan.price }),
  );

  return <LandingPageLinktree planPrices={planPrices} />;
}
