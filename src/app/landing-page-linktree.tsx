"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Instagram,
  Link2,
  MapPin,
  MenuSquare,
  QrCode,
  Sparkles,
} from "lucide-react";
import Brand from "../components/brand";
import LandingMotion from "../components/landing-motion";
import { useTranslate, type Locale, type TranslationMessages } from "../lib/use-translate";
import type { PlanCode } from "../lib/plans";
import { supportWhatsAppUrl } from "../lib/site";

type LandingPlan = { code: PlanCode; price: number };

const messages = {
  id: {
    "nav.features": "Fitur",
    "nav.gallery": "Galeri",
    "nav.steps": "Cara kerja",
    "nav.pricing": "Harga",
    "nav.aria": "Navigasi utama",
    "nav.login": "Masuk",
    "nav.start": "Mulai gratis",
    "language.label": "Pilih bahasa",
    "hero.eyebrow": "MENU DIGITAL UNTUK BISNIS KULINER",
    "hero.title.first": "Bikin tokomu jadi",
    "hero.title.highlight": "pilihan nomor satu.",
    "hero.copy":
      "Menu digital yang cantik, praktis, dan mudah dibagikan. Kelola produk, harga, dan info tokomu dalam satu tempat.",
    "hero.primary": "Buat menu gratis",
    "hero.secondary": "Lihat contoh menu",
    "hero.point.one": "Mulai gratis, tanpa kartu kredit",
    "hero.point.two": "Satu link untuk semua menu",
    "hero.preview.badge": "TAMPILAN TOKO",
    "hero.preview.open": "Buka menu",
    "hero.preview.cafe": "Kopi Temu",
    "hero.preview.description": "Kopi, roti, dan cerita baik.",
    "hero.preview.category.one": "Favorit",
    "hero.preview.category.two": "Kopi",
    "hero.preview.item.one": "Kopi Susu Aren",
    "hero.preview.item.two": "Matcha Cloud",
    "hero.preview.status": "Tersedia",
    "hero.float.title": "Menu siap dibagikan",
    "hero.float.copy": "Satu link, semua info",
    "hero.metric.value": "1 link",
    "hero.metric.label": "untuk tokomu",
    "gallery.eyebrow": "SEMUA YANG TOKOMU BUTUHKAN",
    "gallery.title": "Kecil langkahnya. Besar kesan menunya.",
    "gallery.copy": "Dari katalog sampai insight, semuanya dirancang supaya tokomu makin mudah ditemukan dan diingat.",
    "gallery.store.eyebrow": "KATALOG DIGITAL",
    "gallery.store.title": "Menu rapi, pelanggan nyaman memilih.",
    "gallery.store.copy": "Tampilkan produk, harga, dan status ketersediaan dengan jelas.",
    "gallery.store.price.one": "Rp24.000",
    "gallery.store.price.two": "Rp35.000",
    "gallery.analytics.eyebrow": "INSIGHT TOKO",
    "gallery.analytics.title": "Lihat menu yang paling disukai.",
    "gallery.analytics.visits": "Kunjungan minggu ini",
    "gallery.analytics.growth": "Contoh: +28% dari minggu lalu",
    "gallery.analytics.disclaimer": "Angka kunjungan dan produk pada preview dashboard adalah data contoh.",
    "gallery.qr.eyebrow": "SCAN & JELAJAHI",
    "gallery.qr.title": "Satu scan, langsung lihat menu.",
    "gallery.qr.copy": "Tempel QR di meja, etalase, atau kemasan.",
    "gallery.links.eyebrow": "SEMUA LINK PENTING",
    "gallery.links.title": "WhatsApp, Maps, dan sosial media.",
    "gallery.links.copy": "Arahkan pelanggan ke tujuan yang tepat dari satu halaman.",
    "features.eyebrow": "DIBUAT UNTUK USAHA KULINER",
    "features.title": "Dari dapur ke pelanggan, lebih simpel.",
    "features.copy": "Semua alat penting untuk mengelola katalog digital tokomu, tanpa alur yang bikin repot.",
    "feature.menu.title": "Menu dan kategori",
    "feature.menu.copy": "Atur produk, harga, kategori, dan ketersediaan dengan cepat.",
    "feature.store.title": "Profil tokomu",
    "feature.store.copy": "Tampilkan jam buka, lokasi, deskripsi, dan kontak bisnis.",
    "feature.links.title": "Link bisnis",
    "feature.links.copy": "Hubungkan WhatsApp, Instagram, TikTok, Maps, dan tautan lain.",
    "feature.analytics.title": "Insight kunjungan",
    "feature.analytics.copy": "Pahami kunjungan dan interaksi pelanggan dengan tokomu.",
    "steps.eyebrow": "TIGA LANGKAH MUDAH",
    "steps.title": "Dalam beberapa menit, siap dibagikan.",
    "steps.copy": "Mulai dari info yang sudah ada. Kamu bisa menyempurnakan tokomu kapan saja.",
    "step.one.title": "Buat akun",
    "step.one.copy": "Daftar dan isi nama bisnis kulinermu.",
    "step.two.title": "Susun menu",
    "step.two.copy": "Tambah kategori, produk, harga, dan foto.",
    "step.three.title": "Bagikan link",
    "step.three.copy": "Publikasikan halaman, lalu bagikan ke pelanggan.",
    "pricing.eyebrow": "PAKET MENUKU",
    "pricing.title": "Mulai sesuai kebutuhanmu.",
    "pricing.copy": "Pilih paket yang pas hari ini. Kamu bisa upgrade saat tokomu berkembang.",
    "pricing.popular": "REKOMENDASI",
    "pricing.free": "Gratis",
    "pricing.month": "/ bulan",
    "pricing.forever": "selamanya",
    "pricing.choose.premium": "Pilih Premium",
    "pricing.choose.business": "Pilih Business",
    "pricing.cta.free": "Mulai gratis",
    "pricing.free.note": "Untuk mengenalkan tokomu secara online",
    "pricing.premium.note": "Untuk bisnis kuliner yang terus bertumbuh",
    "pricing.business.note": "Untuk tim dan usaha dengan kebutuhan lebih besar",
    "pricing.free.feature.1": "Hingga 2 kategori",
    "pricing.free.feature.2": "Hingga 4 produk",
    "pricing.free.feature.3": "Halaman katalog dasar",
    "pricing.premium.feature.1": "Hingga 6 kategori",
    "pricing.premium.feature.2": "Hingga 30 produk",
    "pricing.premium.feature.3": "Hingga 5 tautan bisnis",
    "pricing.premium.feature.4": "Analytics dasar",
    "pricing.premium.feature.5": "Pengaturan tampilan",
    "pricing.business.feature.1": "Semua fitur Premium",
    "pricing.business.feature.2": "3 anggota tim",
    "pricing.business.feature.3": "Custom domain",
    "pricing.business.feature.4": "Dukungan prioritas",
    "payment.eyebrow": "PEMBAYARAN FLEKSIBEL",
    "payment.title": "Pilih cara yang paling nyaman.",
    "payment.copy": "Upgrade paket langsung dari dashboard Menuku.",
    "payment.manual.title": "Transfer manual",
    "payment.manual.copy": "Minta detail rekening lewat admin. Paket aktif setelah pembayaran diverifikasi.",
    "payment.manual.note": "Diverifikasi admin",
    "payment.qris.title": "QRIS otomatis",
    "payment.qris.copy": "Bayar melalui checkout Pakasir. Status paket diperbarui otomatis setelah pembayaran.",
    "payment.qris.note": "Status otomatis",
    "faq.eyebrow": "MASIH PUNYA PERTANYAAN?",
    "faq.title": "Kami siap membantu.",
    "faq.copy": "Cari tahu hal penting sebelum tokomu mulai online.",
    "faq.contact": "Tanya admin",
    "faq.one.question": "Apa itu Menuku?",
    "faq.one.answer": "Menuku membantu bisnis kuliner membuat katalog digital yang berisi menu, foto, harga, lokasi, dan kontak dalam satu link.",
    "faq.two.question": "Apakah pelanggan perlu membuat akun?",
    "faq.two.answer": "Tidak. Pelanggan cukup membuka link tokomu untuk melihat menu.",
    "faq.three.question": "Bisa mengubah menu setelah dibagikan?",
    "faq.three.answer": "Bisa kapan saja dari dashboard. Link tokomu tetap sama.",
    "faq.four.question": "Bagaimana cara membayar paket?",
    "faq.four.answer": "Gunakan QRIS otomatis lewat Pakasir atau pilih transfer manual dan minta detailnya dari admin.",
    "faq.five.question": "Apakah Menuku menerima pesanan langsung?",
    "faq.five.answer": "Menuku menampilkan katalog dan tombol kontak agar pelanggan bisa bertanya atau memesan langsung ke tokomu.",
    "cta.eyebrow": "TOKOMU PANTAS TAMPIL MENARIK",
    "cta.title": "Buat menu yang bikin pelanggan ingin mampir.",
    "cta.copy": "Mulai gratis, rapikan katalog, lalu bagikan ke pelanggan hari ini.",
    "cta.button": "Buat menu gratis",
    "footer.tagline": "Menu digital untuk bisnis kuliner Indonesia.",
    "footer.login": "Masuk",
    "footer.contact": "Hubungi admin",
  },
  en: {
    "nav.features": "Features",
    "nav.gallery": "Gallery",
    "nav.steps": "How it works",
    "nav.pricing": "Pricing",
    "nav.aria": "Main navigation",
    "nav.login": "Log in",
    "nav.start": "Start for free",
    "language.label": "Choose language",
    "hero.eyebrow": "DIGITAL MENUS FOR FOOD BUSINESSES",
    "hero.title.first": "Make your business",
    "hero.title.highlight": "the customers’ #1 choice.",
    "hero.copy":
      "A beautiful, practical menu that is easy to share. Manage products, prices, and store details in one place.",
    "hero.primary": "Create a free menu",
    "hero.secondary": "See a menu preview",
    "hero.point.one": "Free to start, no credit card",
    "hero.point.two": "One link for your whole menu",
    "hero.preview.badge": "STORE PREVIEW",
    "hero.preview.open": "Open menu",
    "hero.preview.cafe": "Kopi Temu",
    "hero.preview.description": "Coffee, bread, and good stories.",
    "hero.preview.category.one": "Favorites",
    "hero.preview.category.two": "Coffee",
    "hero.preview.item.one": "Palm Sugar Latte",
    "hero.preview.item.two": "Matcha Cloud",
    "hero.preview.status": "Available",
    "hero.float.title": "Your menu is ready",
    "hero.float.copy": "One link, all the details",
    "hero.metric.value": "1 link",
    "hero.metric.label": "for your store",
    "gallery.eyebrow": "EVERYTHING YOUR STORE NEEDS",
    "gallery.title": "A few simple steps. A menu that stands out.",
    "gallery.copy": "From your catalog to useful insights, everything helps customers find and remember your business.",
    "gallery.store.eyebrow": "DIGITAL CATALOG",
    "gallery.store.title": "A clear menu makes choosing easy.",
    "gallery.store.copy": "Show products, prices, and availability at a glance.",
    "gallery.store.price.one": "IDR 24,000",
    "gallery.store.price.two": "IDR 35,000",
    "gallery.analytics.eyebrow": "STORE INSIGHTS",
    "gallery.analytics.title": "See what customers love most.",
    "gallery.analytics.visits": "Visits this week",
    "gallery.analytics.growth": "Example: +28% from last week",
    "gallery.analytics.disclaimer": "Visit and product counts in this dashboard preview are sample data.",
    "gallery.qr.eyebrow": "SCAN & EXPLORE",
    "gallery.qr.title": "One scan takes them to your menu.",
    "gallery.qr.copy": "Place your QR on tables, windows, or packaging.",
    "gallery.links.eyebrow": "YOUR IMPORTANT LINKS",
    "gallery.links.title": "WhatsApp, Maps, and social media.",
    "gallery.links.copy": "Send customers where they need to go from one page.",
    "features.eyebrow": "MADE FOR FOOD BUSINESSES",
    "features.title": "From your kitchen to your customers, made simple.",
    "features.copy": "The essential tools for managing your digital catalog, without the busywork.",
    "feature.menu.title": "Menus and categories",
    "feature.menu.copy": "Quickly manage products, prices, categories, and availability.",
    "feature.store.title": "Your store profile",
    "feature.store.copy": "Show opening hours, location, description, and contact details.",
    "feature.links.title": "Business links",
    "feature.links.copy": "Connect WhatsApp, Instagram, TikTok, Maps, and more.",
    "feature.analytics.title": "Visit insights",
    "feature.analytics.copy": "Understand visits and customer interactions with your store.",
    "steps.eyebrow": "THREE EASY STEPS",
    "steps.title": "Ready to share in minutes.",
    "steps.copy": "Start with the details you already have. Improve your storefront whenever you like.",
    "step.one.title": "Create an account",
    "step.one.copy": "Sign up and add your food business name.",
    "step.two.title": "Build your menu",
    "step.two.copy": "Add categories, products, prices, and photos.",
    "step.three.title": "Share your link",
    "step.three.copy": "Publish your page and share it with customers.",
    "pricing.eyebrow": "MENUKU PLANS",
    "pricing.title": "Start with what you need.",
    "pricing.copy": "Choose the right plan today. Upgrade as your business grows.",
    "pricing.popular": "RECOMMENDED",
    "pricing.free": "Free",
    "pricing.month": "/ month",
    "pricing.forever": "forever",
    "pricing.choose.premium": "Choose Premium",
    "pricing.choose.business": "Choose Business",
    "pricing.cta.free": "Start for free",
    "pricing.free.note": "A simple way to bring your store online",
    "pricing.premium.note": "For food businesses ready to grow",
    "pricing.business.note": "For teams and growing operations",
    "pricing.free.feature.1": "Up to 2 categories",
    "pricing.free.feature.2": "Up to 4 products",
    "pricing.free.feature.3": "Basic digital catalog",
    "pricing.premium.feature.1": "Up to 6 categories",
    "pricing.premium.feature.2": "Up to 30 products",
    "pricing.premium.feature.3": "Up to 5 business links",
    "pricing.premium.feature.4": "Basic analytics",
    "pricing.premium.feature.5": "Display settings",
    "pricing.business.feature.1": "Everything in Premium",
    "pricing.business.feature.2": "3 team members",
    "pricing.business.feature.3": "Custom domain",
    "pricing.business.feature.4": "Priority support",
    "payment.eyebrow": "FLEXIBLE PAYMENTS",
    "payment.title": "Choose how you want to pay.",
    "payment.copy": "Upgrade your plan right from the Menuku dashboard.",
    "payment.manual.title": "Manual bank transfer",
    "payment.manual.copy": "Ask our admin for bank details. Your plan activates after payment is verified.",
    "payment.manual.note": "Verified by admin",
    "payment.qris.title": "Automatic QRIS",
    "payment.qris.copy": "Pay through Pakasir checkout. Your plan updates automatically after payment.",
    "payment.qris.note": "Automatic status",
    "faq.eyebrow": "HAVE A QUESTION?",
    "faq.title": "We’re here to help.",
    "faq.copy": "Here are a few things to know before taking your store online.",
    "faq.contact": "Contact support",
    "faq.one.question": "What is Menuku?",
    "faq.one.answer": "Menuku helps food businesses create a digital catalog with menus, photos, prices, location, and contact details in one link.",
    "faq.two.question": "Do customers need an account?",
    "faq.two.answer": "No. Customers can open your store link and browse the menu right away.",
    "faq.three.question": "Can I update my menu after sharing it?",
    "faq.three.answer": "Anytime from your dashboard. Your store link stays the same.",
    "faq.four.question": "How do I pay for a plan?",
    "faq.four.answer": "Pay by QRIS through Pakasir or choose manual transfer and ask our admin for the details.",
    "faq.five.question": "Can customers order directly through Menuku?",
    "faq.five.answer": "Menuku shows your catalog and contact buttons so customers can ask questions or order directly from your store.",
    "cta.eyebrow": "YOUR STORE DESERVES TO STAND OUT",
    "cta.title": "Create a menu that makes customers want to visit.",
    "cta.copy": "Start free, polish your catalog, and share it with customers today.",
    "cta.button": "Create a free menu",
    "footer.tagline": "Digital menus for food businesses in Indonesia.",
    "footer.login": "Log in",
    "footer.contact": "Contact support",
  },
} satisfies TranslationMessages;

const featureCards = [
  { icon: MenuSquare, title: "feature.menu.title", copy: "feature.menu.copy" },
  { icon: MapPin, title: "feature.store.title", copy: "feature.store.copy" },
  { icon: Link2, title: "feature.links.title", copy: "feature.links.copy" },
  { icon: Activity, title: "feature.analytics.title", copy: "feature.analytics.copy" },
];

const steps = [
  { number: "01", title: "step.one.title", copy: "step.one.copy" },
  { number: "02", title: "step.two.title", copy: "step.two.copy" },
  { number: "03", title: "step.three.title", copy: "step.three.copy" },
];

const faqItems = ["one", "two", "three", "four", "five"] as const;

function MenuThumbnail({ tone }: { tone: "peach" | "green" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-12 shrink-0 place-items-center rounded-xl text-xl ${tone === "peach" ? "bg-gradient-to-br from-[#ffd9bf] to-[#f6a77d]" : "bg-gradient-to-br from-[#e2edcf] to-[#a4c18e]"}`}
    >
      {tone === "peach" ? "☕" : "🍵"}
    </span>
  );
}

function AnalyticsBars() {
  return (
    <div className="flex h-24 items-end gap-2" aria-hidden="true">
      {[34, 53, 42, 69, 57, 86, 74, 100, 78, 92, 68, 100].map((height, index) => (
        <span
          className={`min-w-0 flex-1 rounded-t-md ${index === 7 || index === 11 ? "bg-[#b13b19]" : "bg-[#e7b49b]"}`}
          key={index}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

export default function LandingPageLinktree({ planPrices }: { planPrices: LandingPlan[] }) {
  const { locale, setLocale, t } = useTranslate(messages);
  const currency = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return (
    <LandingMotion>
      <main className="bg-paper text-ink min-h-screen overflow-hidden">
        <header className="border-line sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            <Brand />
            <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label={t("nav.aria")}>
              <a className="hover:text-brand transition" href="#fitur">{t("nav.features")}</a>
              <a className="hover:text-brand transition" href="#galeri">{t("nav.gallery")}</a>
              <a className="hover:text-brand transition" href="#cara">{t("nav.steps")}</a>
              <a className="hover:text-brand transition" href="#harga">{t("nav.pricing")}</a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-4">
              <label className="border-line flex h-10 items-center gap-1.5 rounded-xl border bg-white px-2.5">
                <Globe2 className="text-muted" size={15} aria-hidden="true" />
                <span className="sr-only">{t("language.label")}</span>
                <select
                  aria-label={t("language.label")}
                  className="bg-transparent text-xs font-bold outline-none"
                  onChange={(event) => setLocale(event.target.value as Locale)}
                  value={locale}
                >
                  <option value="id">ID</option>
                  <option value="en">EN</option>
                </select>
              </label>
              <Link className="text-muted hover:text-ink hidden text-sm font-semibold transition sm:inline" href="/login">
                {t("nav.login")}
              </Link>
              <Link className="bg-brand hover:bg-brand-dark inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold text-white transition sm:px-5 sm:text-sm" href="/register">
                {t("nav.start")}
              </Link>
            </div>
          </div>
        </header>

        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute -left-40 top-10 size-[26rem] rounded-full bg-[#ffd5c2]/50 blur-3xl" />
          <div className="relative z-10 lg:col-span-6">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#efc7b5] bg-white/80 px-3 py-2 text-[10px] font-black tracking-[.13em] text-[#a03417]" data-hero-kicker>
              <Sparkles size={14} /> {t("hero.eyebrow")}
            </p>
            <h1 className="display-font max-w-2xl text-[2.8rem] leading-[.99] font-black tracking-[-.06em] sm:text-6xl lg:text-[4.35rem]" data-hero-title>
              {t("hero.title.first")} <span className="text-[#b13b19]">{t("hero.title.highlight")}</span>
            </h1>
            <p className="text-muted mt-6 max-w-xl text-sm leading-7 sm:text-base sm:leading-8" data-hero-copy>
              {t("hero.copy")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-hero-actions>
              <Link className="bg-brand hover:bg-brand-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-lg shadow-[#b13b19]/15 transition hover:-translate-y-0.5" href="/register">
                {t("hero.primary")} <ArrowRight size={16} />
              </Link>
              <a className="border-line inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-white/90 px-5 text-sm font-bold transition hover:border-[#c7a493]" href="#galeri">
                {t("hero.secondary")} <ArrowDownIcon />
              </a>
            </div>
            <div className="text-muted mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs" data-hero-actions>
              <span className="inline-flex items-center gap-2"><Check className="text-[#b13b19]" size={15} />{t("hero.point.one")}</span>
              <span className="inline-flex items-center gap-2"><Check className="text-[#b13b19]" size={15} />{t("hero.point.two")}</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px] lg:col-span-6" data-hero-preview>
            <div className="absolute -right-5 -top-8 size-32 rounded-full bg-[#ffb88e]/45 blur-2xl sm:-right-9 sm:-top-10 sm:size-44" />
            <div className="relative rotate-[1deg] rounded-[1.8rem] border border-white bg-white/85 p-2 shadow-[0_30px_90px_-28px_rgba(68,43,30,.3)] sm:rounded-[2rem] sm:p-3">
              <div className="overflow-hidden rounded-[1.35rem] bg-[#fffaf5] sm:rounded-[1.55rem]">
                <div className="flex items-center justify-between gap-3 border-b border-[#eee5dd] px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-[#b13b19] text-xs font-black text-white">KT</span>
                    <div><p className="text-sm font-extrabold">{t("hero.preview.cafe")}</p><p className="text-muted mt-0.5 text-[10px]">{t("hero.preview.description")}</p></div>
                  </div>
                  <span className="bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-800">{t("hero.preview.open")}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex gap-2 text-[10px] font-bold">
                    <span className="rounded-full bg-[#29251f] px-3 py-2 text-white">{t("hero.preview.category.one")}</span>
                    <span className="rounded-full bg-[#f0e9e2] px-3 py-2 text-[#60574e]">{t("hero.preview.category.two")}</span>
                  </div>
                  <div className="rounded-2xl border border-[#eee5dd] bg-white p-3 sm:p-4">
                    <div className="flex items-center gap-3 border-b border-[#f0ece7] pb-3">
                      <MenuThumbnail tone="peach" />
                      <div className="min-w-0 flex-1"><b className="block truncate text-xs sm:text-sm">{t("hero.preview.item.one")}</b><span className="text-muted mt-1 block text-[10px]">{t("hero.preview.status")}</span></div>
                      <b className="text-xs">{t("gallery.store.price.one")}</b>
                    </div>
                    <div className="flex items-center gap-3 pt-3">
                      <MenuThumbnail tone="green" />
                      <div className="min-w-0 flex-1"><b className="block truncate text-xs sm:text-sm">{t("hero.preview.item.two")}</b><span className="text-muted mt-1 block text-[10px]">{t("hero.preview.status")}</span></div>
                      <b className="text-xs">{t("gallery.store.price.two")}</b>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f4ede6] px-3 py-2.5 text-[10px] font-bold text-[#51473f]">
                    <span className="inline-flex items-center gap-2"><Globe2 size={13} /> digimenu.my.id/kopitemu</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl sm:-left-12 sm:bottom-11 sm:p-4" data-hero-float>
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Check size={18} /></span>
              <div><p className="text-xs font-extrabold">{t("hero.float.title")}</p><p className="text-muted mt-1 text-[10px]">{t("hero.float.copy")}</p></div>
            </div>
            <div className="bg-charcoal absolute -right-2 bottom-20 hidden rounded-2xl px-4 py-3 text-white shadow-xl sm:block sm:-right-8" data-hero-float>
              <p className="display-font text-xl font-black">{t("hero.metric.value")}</p><p className="mt-0.5 text-[9px] text-white/65">{t("hero.metric.label")}</p>
            </div>
          </div>
        </section>

        <section id="galeri" className="scroll-mt-24 border-y border-[#e9dfd7] bg-white py-16 sm:py-20" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
              <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{t("gallery.eyebrow")}</p>
              <h2 className="display-font text-3xl leading-tight font-black sm:text-4xl">{t("gallery.title")}</h2>
              <p className="text-muted mt-3 text-sm leading-6">{t("gallery.copy")}</p>
            </div>
            <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" data-bento>
              <article className="relative overflow-hidden rounded-[1.6rem] bg-[#f6eee6] p-5 sm:col-span-2 sm:row-span-2 sm:p-7" data-bento-card>
                <div className="absolute -right-12 -top-12 size-48 rounded-full bg-[#edc5a7]/45 blur-2xl" />
                <div className="relative flex h-full flex-col justify-between gap-8">
                  <div><p className="text-[9px] font-black tracking-[.14em] text-[#a03417]">{t("gallery.store.eyebrow")}</p><h3 className="display-font mt-3 max-w-sm text-2xl leading-tight font-black sm:text-3xl">{t("gallery.store.title")}</h3><p className="text-muted mt-2 max-w-sm text-xs leading-5">{t("gallery.store.copy")}</p></div>
                  <div className="mx-auto w-full max-w-[380px] rotate-[-1deg] rounded-2xl border border-white bg-white p-3 shadow-xl sm:p-4">
                    <div className="mb-3 flex items-center gap-2 border-b border-[#f0ece7] pb-3"><span className="grid size-8 place-items-center rounded-lg bg-[#b13b19] text-[9px] font-black text-white">KT</span><div><p className="text-xs font-extrabold">{t("hero.preview.cafe")}</p><p className="text-muted text-[9px]">{t("hero.preview.description")}</p></div><span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-800">{t("hero.preview.open")}</span></div>
                    <div className="grid gap-2.5">
                      <div className="flex items-center gap-2.5"><MenuThumbnail tone="peach" /><b className="min-w-0 flex-1 truncate text-[10px]">{t("hero.preview.item.one")}</b><span className="text-[9px] font-bold">{t("gallery.store.price.one")}</span></div>
                      <div className="flex items-center gap-2.5"><MenuThumbnail tone="green" /><b className="min-w-0 flex-1 truncate text-[10px]">{t("hero.preview.item.two")}</b><span className="text-[9px] font-bold">{t("gallery.store.price.two")}</span></div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="rounded-[1.6rem] bg-[#29251f] p-5 text-white sm:p-6" data-bento-card>
                <p className="text-[9px] font-black tracking-[.14em] text-[#ffb99c]">{t("gallery.analytics.eyebrow")}</p>
                <h3 className="display-font mt-3 text-lg leading-snug font-black">{t("gallery.analytics.title")}</h3>
                <div className="mt-5"><div className="mb-2 flex items-end justify-between gap-2"><span className="text-[9px] text-white/60">{t("gallery.analytics.visits")}</span><Activity className="text-[#ffb99c]" size={15} /></div><AnalyticsBars /></div>
                <p className="mt-3 text-[9px] font-bold text-emerald-300">{t("gallery.analytics.growth")}</p>
                <p className="mt-2 text-[9px] leading-4 text-white/55">{t("gallery.analytics.disclaimer")}</p>
              </article>
              <article className="flex flex-col justify-between rounded-[1.6rem] bg-[#e9f0df] p-5 sm:p-6" data-bento-card>
                <div><p className="text-[9px] font-black tracking-[.14em] text-[#477047]">{t("gallery.qr.eyebrow")}</p><h3 className="display-font mt-3 text-lg leading-snug font-black">{t("gallery.qr.title")}</h3><p className="text-muted mt-2 text-[10px] leading-5">{t("gallery.qr.copy")}</p></div>
                <div className="mt-5 flex items-center justify-between gap-3"><div className="grid size-[76px] grid-cols-5 gap-1 rounded-xl bg-white p-2.5 shadow-sm" aria-hidden="true">{Array.from({ length: 25 }, (_, index) => <span className={`${[0,1,2,4,5,7,10,12,14,16,18,20,21,22,24].includes(index) ? "bg-[#29251f]" : "bg-[#e9e2da]"} rounded-[2px]`} key={index} />)}</div><QrCode className="text-[#477047]" size={39} strokeWidth={1.5} /></div>
              </article>
              <article className="flex flex-col justify-between rounded-[1.6rem] border border-[#eee5dd] bg-[#fffaf6] p-5 sm:col-span-2 sm:flex-row sm:items-center sm:p-6" data-bento-card>
                <div className="max-w-sm"><p className="text-[9px] font-black tracking-[.14em] text-[#b13b19]">{t("gallery.links.eyebrow")}</p><h3 className="display-font mt-3 text-lg leading-snug font-black">{t("gallery.links.title")}</h3><p className="text-muted mt-2 text-[10px] leading-5">{t("gallery.links.copy")}</p></div>
                <div className="mt-5 flex flex-wrap gap-2 sm:mt-0 sm:max-w-[210px] sm:justify-end"><span className="grid size-11 place-items-center rounded-xl bg-[#e6f4ea] text-[#24834c]"><Globe2 size={18} /></span><span className="grid size-11 place-items-center rounded-xl bg-[#fce8df] text-[#b13b19]"><MapPin size={18} /></span><span className="grid size-11 place-items-center rounded-xl bg-[#eee9f8] text-[#6655a2]"><Instagram size={18} /></span><span className="grid size-11 place-items-center rounded-xl bg-[#f1eee8] text-[#29251f]"><Link2 size={18} /></span></div>
              </article>
            </div>
          </div>
        </section>

        <section id="fitur" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10" data-reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{t("features.eyebrow")}</p><h2 className="display-font max-w-xl text-3xl leading-tight font-black sm:text-4xl">{t("features.title")}</h2></div>
            <p className="text-muted max-w-xl text-sm leading-6 lg:col-span-5 lg:col-start-8">{t("features.copy")}</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {featureCards.map(({ icon: Icon, title, copy }) => <article className="group rounded-2xl border border-[#e9dfd7] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d2a28c] hover:shadow-xl hover:shadow-[#674c3e]/[.06]" key={title}><span className="grid size-11 place-items-center rounded-xl bg-[#fff0e8] text-[#b13b19] transition group-hover:bg-[#b13b19] group-hover:text-white"><Icon size={20} /></span><h3 className="display-font mt-5 text-base font-black">{t(title)}</h3><p className="text-muted mt-2 text-xs leading-5">{t(copy)}</p></article>)}
          </div>
        </section>

        <section id="cara" className="bg-charcoal scroll-mt-24 py-16 text-white sm:py-20" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#ffb99c]">{t("steps.eyebrow")}</p><h2 className="display-font text-3xl leading-tight font-black sm:text-4xl">{t("steps.title")}</h2><p className="mt-3 text-sm leading-6 text-white/65">{t("steps.copy")}</p></div>
            <div className="mt-8 grid gap-3 md:grid-cols-3" data-stagger>
              {steps.map((step) => <article className="rounded-2xl border border-white/10 bg-white/[.06] p-5" key={step.number}><span className="grid size-9 place-items-center rounded-xl bg-[#ff6534] text-xs font-black">{step.number}</span><h3 className="display-font mt-5 text-lg font-black">{t(step.title)}</h3><p className="mt-2 text-sm leading-6 text-white/65">{t(step.copy)}</p></article>)}
            </div>
          </div>
        </section>

        <section id="harga" className="border-y border-[#e9dfd7] bg-white scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-10" data-reveal>
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{t("pricing.eyebrow")}</p><h2 className="display-font text-3xl font-black sm:text-4xl">{t("pricing.title")}</h2><p className="text-muted mt-3 text-sm leading-6">{t("pricing.copy")}</p></div>
            <div className="mt-9 grid gap-4 md:grid-cols-3" data-stagger>
              {planPrices.map(({ code, price }) => {
                const featured = code === "premium";
                const featureCount = code === "free" ? 3 : code === "premium" ? 5 : 4;
                const features = Array.from({ length: featureCount }, (_, index) => `pricing.${code}.feature.${index + 1}`);
                return <article className={`relative flex flex-col rounded-2xl border p-5 shadow-sm sm:p-6 ${featured ? "border-[#b13b19] bg-[#fffaf6] shadow-xl shadow-[#b13b19]/[.08]" : "border-[#e9dfd7] bg-[#faf8f4]"}`} key={code}>
                  {featured && <span className="mb-3 inline-flex self-start rounded-full bg-[#b13b19] px-3 py-1 text-[9px] font-black tracking-wide text-white">{t("pricing.popular")}</span>}
                  <p className="display-font text-lg font-black">{code === "free" ? t("pricing.free") : code === "premium" ? "Premium" : "Business"}</p>
                  <p className="text-muted mt-1 min-h-5 text-xs">{t(`pricing.${code}.note`)}</p>
                  <p className="mt-5 text-2xl font-black tabular-nums">{price === 0 ? t("pricing.free") : currency.format(price)}<span className="text-muted ml-1 text-xs font-normal">{price === 0 ? t("pricing.forever") : t("pricing.month")}</span></p>
                  <ul className="my-5 grid flex-1 content-start gap-3 border-t border-[#e9dfd7] pt-5 text-xs leading-5 sm:text-sm">{features.map((feature) => <li className="flex items-start gap-2" key={feature}><Check className="mt-0.5 shrink-0 text-[#b13b19]" size={15} /><span>{t(feature)}</span></li>)}</ul>
                  <Link className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${featured ? "bg-[#b13b19] text-white hover:bg-[#8f2e14]" : "border border-[#e9dfd7] bg-white hover:border-[#b13b19]"}`} href={`/register?plan=${code}`}>{code === "free" ? t("pricing.cta.free") : t(`pricing.choose.${code}`)}<ArrowRight size={15} /></Link>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e9dfd7] py-14 sm:py-16" data-reveal>
          <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10">
            <div className="lg:col-span-4"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{t("payment.eyebrow")}</p><h2 className="display-font text-3xl font-black">{t("payment.title")}</h2><p className="text-muted mt-3 text-sm leading-6">{t("payment.copy")}</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5"><Banknote className="mb-4 text-[#b13b19]" size={20} /><h3 className="display-font text-base font-black">{t("payment.manual.title")}</h3><p className="text-muted mt-2 text-xs leading-5">{t("payment.manual.copy")}</p><span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold"><Clock3 size={13} /> {t("payment.manual.note")}</span></article>
              <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5"><QrCode className="mb-4 text-[#b13b19]" size={20} /><h3 className="display-font text-base font-black">{t("payment.qris.title")}</h3><p className="text-muted mt-2 text-xs leading-5">{t("payment.qris.copy")}</p><span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold"><Check className="text-[#b13b19]" size={13} /> {t("payment.qris.note")}</span></article>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto grid max-w-7xl scroll-mt-24 gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-10" data-reveal>
          <div className="lg:col-span-4"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{t("faq.eyebrow")}</p><h2 className="display-font max-w-sm text-3xl font-black sm:text-4xl">{t("faq.title")}</h2><p className="text-muted mt-4 max-w-sm text-sm leading-6">{t("faq.copy")}</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#b13b19]" href={supportWhatsAppUrl()} target="_blank" rel="noreferrer">{t("faq.contact")}<ArrowUpRight size={15} /></a></div>
          <div className="lg:col-span-8">{faqItems.map((item) => <details className="group border-b border-[#e9dfd7] py-4 first:border-t" key={item}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold">{t(`faq.${item}.question`)}<ChevronDown className="text-muted shrink-0 transition group-open:rotate-180" size={17} /></summary><p className="text-muted max-w-2xl pt-3 pr-6 text-sm leading-6">{t(`faq.${item}.answer`)}</p></details>)}</div>
        </section>

        <section className="mx-4 mb-8 overflow-hidden rounded-[1.8rem] bg-[#b13b19] px-5 py-10 text-white sm:mx-6 sm:px-8 sm:py-12 lg:mx-auto lg:max-w-7xl lg:px-12" data-reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl"><p className="mb-2 text-[10px] font-black tracking-[.15em] text-white/70">{t("cta.eyebrow")}</p><h2 className="display-font text-2xl leading-tight font-black sm:text-3xl">{t("cta.title")}</h2><p className="mt-2 text-sm text-white/75">{t("cta.copy")}</p></div>
            <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#9f3516] transition hover:-translate-y-0.5" href="/register">{t("cta.button")}<ArrowRight size={15} /></Link>
          </div>
        </section>

        <footer className="text-muted mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 text-xs sm:flex-row sm:items-center sm:px-6 lg:px-10">
          <Brand compact />
          <p className="sm:ml-auto">© 2026 Menuku. {t("footer.tagline")}</p>
          <Link className="text-ink font-bold" href="/login">{t("footer.login")}</Link>
          <a className="text-ink font-bold" href={supportWhatsAppUrl()} target="_blank" rel="noreferrer">{t("footer.contact")}</a>
        </footer>
      </main>
    </LandingMotion>
  );
}

function ArrowDownIcon() {
  return <ArrowRight className="rotate-90" size={15} aria-hidden="true" />;
}
