import type { Metadata } from "next";
import { INDEXABLE_SITE_URL } from "../lib/site";

const title = "Menu Digital untuk UMKM Kuliner | Menuku";
const description =
  "Buat menu digital dan katalog menu online untuk usaha kuliner. Kelola produk, kategori, informasi toko, dan tautan bisnis dari satu dashboard.";

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

export { default } from "./landing-page-linktree";
