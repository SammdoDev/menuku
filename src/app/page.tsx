import type { Metadata } from "next";
import { PUBLIC_SITE_URL } from "../lib/site";

const title = "Menuku — Dashboard dan katalog digital untuk usaha kuliner";
const description =
  "Kelola menu, kategori, tautan bisnis, dan publikasi toko dari satu dashboard. Bagikan katalog Menuku melalui URL tokomu.";

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Menuku",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
};

export { default } from "./landing-page-linktree";
