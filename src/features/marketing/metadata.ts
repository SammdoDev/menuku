import type { Metadata } from "next";
import { INDEXABLE_SITE_URL } from "@/config/site";
import type { Locale } from "@/i18n/config";

const localizedCopy: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  id: {
    title: "Menu Digital untuk Bisnis Kuliner Indonesia | Menuku",
    description:
      "Buat menu digital yang mudah dibagikan untuk bisnis kuliner. Kelola produk, harga, kategori, informasi toko, dan tautan bisnis dari satu dashboard.",
    ogLocale: "id_ID",
  },
  en: {
    title: "Digital Menu for Food Businesses in Indonesia | Menuku",
    description:
      "Create an easy-to-share digital menu for your food business. Manage products, prices, categories, store details, and business links in one dashboard.",
    ogLocale: "en_US",
  },
  ms: {
    title: "Menu Digital untuk Perniagaan Makanan | Menuku",
    description:
      "Bina menu digital yang mudah dikongsi untuk perniagaan makanan. Urus produk, harga, kategori, maklumat kedai dan pautan perniagaan dalam satu papan pemuka.",
    ogLocale: "ms_MY",
  },
  zh: {
    title: "餐饮商家的数字菜单 | Menuku",
    description:
      "为餐饮业务创建易于分享的数字菜单。在一个控制面板中管理产品、价格、分类、店铺信息和业务链接。",
    ogLocale: "zh_CN",
  },
  ja: {
    title: "飲食店向けデジタルメニュー | Menuku",
    description:
      "飲食店向けの共有しやすいデジタルメニューを作成。商品、価格、カテゴリー、店舗情報、ビジネスリンクを一つの管理画面で更新できます。",
    ogLocale: "ja_JP",
  },
};

const localizedPaths: Record<Locale, string> = {
  id: "/",
  en: "/en",
  ms: "/ms",
  zh: "/zh",
  ja: "/ja",
};

export function getLocalizedMarketingMetadata(locale: Locale): Metadata {
  const { title, description, ogLocale } = localizedCopy[locale];
  const path = localizedPaths[locale];
  const url = `${INDEXABLE_SITE_URL}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        Object.entries(localizedPaths).map(([language, languagePath]) => [
          language,
          `${INDEXABLE_SITE_URL}${languagePath === "/" ? "" : languagePath}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url,
      siteName: "Menuku",
      title,
      description,
    },
    twitter: { card: "summary", title, description },
  };
}
