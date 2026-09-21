import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Menuku — Katalog menu digital",
  description: "Mini-site dan katalog menu untuk bisnis kuliner.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
