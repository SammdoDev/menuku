import type { Metadata } from "next";
import "./globals.css";
import { INDEXABLE_SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(INDEXABLE_SITE_URL),
  title: "Menuku — Katalog menu digital",
  description: "Mini-site dan katalog menu untuk bisnis kuliner.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "192x192" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
