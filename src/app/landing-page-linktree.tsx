import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Instagram,
  MapPin,
  MessageCircle,
  QrCode,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import Brand from "../components/brand";
import LandingMotion from "../components/landing-motion";
import { plans, rupiah, type PlanCode } from "../lib/plans";
import { supportWhatsAppUrl } from "../lib/site";

const planNotes: Record<PlanCode, string> = {
  free: "Untuk mulai menampilkan menu",
  premium: "Untuk bisnis kuliner yang berkembang",
  business: "Untuk tim dan usaha yang lebih besar",
};

const planCards = (Object.entries(plans) as [PlanCode, (typeof plans)[PlanCode]][]).map(
  ([code, plan]) => ({
    code,
    name: code === "free" ? "Free" : plan.name,
    price: rupiah(plan.price),
    note: planNotes[code],
    features: plan.features,
    href: `/register?plan=${code}`,
  }),
);

type MenuItem = {
  name: string;
  price: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  alt?: string;
  unavailable?: boolean;
};

const menuItems: MenuItem[] = [
  {
    name: "Kopi Susu Aren",
    price: "Rp24.000",
    description: "Espresso, susu segar, dan gula aren buatan sendiri.",
    icon: Coffee,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCVKn5UwejhQ74HeOmPH-f2nV2t3DaPvl_-60KHHuPtwmvoD9VJP0NhqPpXVfQiBprOXmm8XpeT8m1NGaYZxK1r6ahB0_yg7NYsZmJtnWUYP8VexYl8pCnUWZib1qAkPbTZM55KOkoJMrDjyCtWeCzSW3K-BsQ_X5iRYCntFlpRyDfrf9dZVVGt9CJQQnmCIKohe9rbNGca6dbVa7y0rXFa7ldieim1YVa0MlUT2VwuCJNJy4P3A",
    alt: "Segelas kopi susu dengan gula aren",
  },
  {
    name: "Cappuccino",
    price: "Rp32.000",
    description: "Espresso blend house dengan microfoam lembut.",
    icon: Coffee,
  },
  {
    name: "Matcha Cloud",
    price: "Rp35.000",
    description: "Uji matcha dengan foam dingin dan susu gandum.",
    icon: Coffee,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8Uf1fZVj4N9MEipbxcS1To-m704iLK4MAiNjj-OrOLD2gRdozsogX3oJrn-LWBjQlV-oY-ocfBDDfc282q_zZvTkD4xtV7AAnus-g5e0hMkAR43p8oVl8Zb-bBADDIjbckxmHK1uSs-G8ApNmrrLD8gGYM7WiYhgDtFu7vG26iFClGBLmT5lajaWfQNPNvzfa-ch10kQNe3eRwsI2AWvtqJyYZZyd7oG04WC5zXaPaHUrJEGkbw",
    alt: "Matcha latte dingin",
  },
  {
    name: "Butter Croissant",
    price: "Rp22.000",
    description: "Pastry mentega berlapis, dipanggang setiap pagi.",
    icon: Utensils,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXLAhvAImECYhGbMlm8mIjTQQCLdnBshrRL7vOzOJ9adAKVAr4nkY6nkqH9xDL8TEoQvEUDKzN0FsXnyq5f3-qSQ3cJIoo6Mq3s7XiUlk4tdfsCtKOQ0qYIW-EAlGbZ3T_pRnX9Ajt2l4QV9RlcHCyK552Jz8tYgL7apSYuTvnmkWy7ajAro2Fq5RFpmLfWES9F5zXtzXb1qGkdYav-wqX3N0ASyRletdLYljZHKSszRuSqeB5Xw",
    alt: "Croissant mentega di atas piring",
    unavailable: true,
  },
];

const businessDetails = [
  {
    icon: Clock3,
    title: "Jam operasional",
    value: "Selasa–Minggu, 08.00–21.00 WIB",
    note: "Senin untuk istirahat dan persiapan mingguan.",
  },
  {
    icon: MapPin,
    title: "Alamat dan akses",
    value: "Jl. Gandaria Tengah II No. 14, Jakarta Selatan",
    note: "Tampilkan titik Google Maps dan petunjuk menuju kedai.",
  },
  {
    icon: MessageCircle,
    title: "Kontak langsung",
    value: "+62 812-9840-2210",
    note: "Pelanggan bisa menghubungi kedai lewat WhatsApp.",
  },
  {
    icon: Instagram,
    title: "Media sosial",
    value: "@kopitemu.jkt",
    note: "Sertakan tautan untuk menu musiman dan kabar terbaru.",
  },
];

const steps = [
  [
    "01",
    "Buat profil usaha",
    "Isi nama kedai, jam buka, alamat, dan kontak yang ingin ditampilkan.",
  ],
  [
    "02",
    "Tambahkan menu",
    "Masukkan nama produk, kategori, harga, foto, serta tanda jika menu habis.",
  ],
  ["03", "Bagikan halaman", "Taruh link di bio, kirim lewat WhatsApp, atau cetak QR untuk meja."],
];

const faqs = [
  [
    "Apakah bisa mulai gratis?",
    "Bisa. Paket Free dapat dipakai tanpa batas waktu untuk menampilkan 2 kategori dan 4 produk.",
  ],
  [
    "Apakah pelanggan perlu membuat akun?",
    "Tidak. Pelanggan cukup membuka link atau memindai QR dari kamera ponsel untuk melihat menu.",
  ],
  [
    "Bisa mengubah menu setelah halaman dibagikan?",
    "Bisa. Perubahan harga, produk, dan informasi toko bisa dilakukan dari dashboard. Link toko tetap sama.",
  ],
  [
    "Bagaimana cara membayar paket berbayar?",
    "Pilih transfer manual sesuai nominal invoice dan tunggu verifikasi admin, atau bayar otomatis lewat QRIS Duitku.",
  ],
  [
    "Apakah Menuku menerima pesanan langsung?",
    "Menuku menampilkan katalog dan tombol WhatsApp agar pelanggan dapat bertanya atau memesan langsung ke tokomu.",
  ],
];

export default function LandingPageLinktree() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;500&display=swap"
        precedence="default"
      />
      <LandingMotion>
        <main className="landing-editorial min-h-screen overflow-hidden bg-[#faf9f5] text-[#181713]">
          <header className="sticky top-0 z-40 border-b border-[#e6e2db] bg-[#faf9f5]/95 backdrop-blur-sm">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
              <Brand />
              <nav
                className="hidden items-center gap-6 text-sm md:flex"
                aria-label="Navigasi utama"
              >
                <a className="font-semibold" href="#contoh-live">
                  Contoh menu
                </a>
                <a className="text-[#625e57] transition hover:text-[#181713]" href="#cara">
                  Cara kerja
                </a>
                <a className="text-[#625e57] transition hover:text-[#181713]" href="#harga">
                  Harga
                </a>
                <a className="text-[#625e57] transition hover:text-[#181713]" href="#pembayaran">
                  Pembayaran
                </a>
              </nav>
              <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <Link
                  className="hidden px-1 py-2 text-sm text-[#625e57] transition hover:text-[#181713] sm:inline"
                  href="/login"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#181713] px-4 text-xs font-semibold text-white transition hover:bg-[#30312e] active:scale-[.99] sm:px-5 sm:text-sm"
                >
                  Buat menu gratis
                </Link>
              </div>
            </div>
          </header>

          <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:px-10 lg:pt-16">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="pt-1 lg:col-span-5 lg:pt-8">
                <p
                  data-hero-item
                  className="mb-4 text-[11px] font-bold tracking-[.14em] text-[#625e57] uppercase"
                >
                  Katalog digital untuk usaha kuliner
                </p>
                <h1
                  data-hero-item
                  className="max-w-xl text-[2.65rem] leading-[1.04] tracking-[-.035em] sm:text-6xl lg:text-[3.6rem]"
                >
                  Menu kedaimu.
                  <br />
                  Siap dibagikan.
                </h1>
                <p
                  data-hero-item
                  className="mt-5 max-w-lg text-[15px] leading-7 text-[#625e57] sm:text-[17px]"
                >
                  Susun menu, harga, dan informasi usaha dalam satu halaman. Pelanggan tinggal buka
                  link untuk melihatnya.
                </p>
                <div data-hero-item className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/register"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#181713] px-6 text-sm font-semibold text-white transition hover:bg-[#30312e] active:scale-[.99]"
                  >
                    Buat menu gratis
                  </Link>
                  <a
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline decoration-[#e6e2db] underline-offset-4 transition hover:decoration-[#181713]"
                    href="#contoh-live"
                  >
                    Lihat contoh menu <ArrowUpRight size={16} />
                  </a>
                </div>
                <p data-hero-item className="mt-5 flex items-center gap-2 text-xs text-[#625e57]">
                  <span className="size-1.5 shrink-0 rounded-full bg-[#ff6534]" />
                  Mulai dengan 2 kategori dan 4 produk tanpa kartu kredit.
                </p>
              </div>

              <div id="contoh-live" data-hero-card className="min-w-0 scroll-mt-24 lg:col-span-7">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[.15em] text-[#625e57] uppercase">
                  <span className="size-2 rounded-full bg-[#ff6534]" /> Contoh tampilan toko
                </div>
                <div className="overflow-hidden rounded-xl border border-[#e6e2db] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[#e6e2db] bg-[#f5f4f0] px-3 py-2.5 sm:px-4">
                    <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
                      <span className="size-2 rounded-full bg-[#cac6bd]" />
                      <span className="size-2 rounded-full bg-[#cac6bd]" />
                      <span className="size-2 rounded-full bg-[#cac6bd]" />
                    </div>
                    <span className="max-w-[65%] truncate rounded border border-[#e6e2db] bg-white px-3 py-1 text-[10px] text-[#625e57] sm:text-xs">
                      www.digimenu.my.id/store/kopitemu
                    </span>
                    <span className="w-8 shrink-0" />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-7">
                    <div className="border-b border-[#e6e2db] pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-2xl leading-tight sm:text-3xl">Kopi Temu</h2>
                          <p className="mt-1 max-w-lg text-xs leading-5 text-[#625e57] sm:text-sm">
                            Kedai kopi dan roti artisan di Gandaria, Jakarta Selatan.
                          </p>
                        </div>
                        <span className="shrink-0 rounded bg-[#f5f4f0] px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase sm:text-[11px]">
                          Buka
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#625e57] sm:text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={13} className="text-[#af3100]" /> 08.00–21.00
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} /> Kebayoran Baru
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#e6e2db] px-3 text-xs font-medium">
                          <MessageCircle size={14} /> WhatsApp
                        </span>
                        <span className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#e6e2db] px-3 text-xs font-medium">
                          <MapPin size={14} /> Google Maps
                        </span>
                      </div>
                    </div>
                    <div className="no-scrollbar -mx-4 flex items-center gap-5 overflow-x-auto border-b border-[#e6e2db] px-4 pt-4 text-xs sm:mx-0 sm:gap-6 sm:px-0 sm:text-sm">
                      <span className="shrink-0 border-b-2 border-[#181713] pb-2 font-semibold">
                        Semua
                      </span>
                      <span className="shrink-0 pb-2 text-[#625e57]">Kopi</span>
                      <span className="shrink-0 pb-2 text-[#625e57]">Non-kopi</span>
                      <span className="shrink-0 pb-2 text-[#625e57]">Pastry</span>
                    </div>
                    <div className="divide-y divide-[#e6e2db]">
                      {menuItems.map(
                        ({ name, price, description, icon: Icon, image, alt, unavailable }) => (
                          <article
                            className={`flex items-start gap-3 py-3.5 sm:gap-4 ${unavailable ? "opacity-65" : ""}`}
                            key={name}
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={alt || ""}
                                loading="lazy"
                                className={`size-12 shrink-0 rounded border border-[#e6e2db] object-cover sm:size-14 ${unavailable ? "grayscale" : ""}`}
                              />
                            ) : (
                              <span className="grid size-12 shrink-0 place-items-center rounded border border-[#e6e2db] bg-[#f7f6f2] text-[#af3100] sm:size-14">
                                <Icon size={21} />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <h3 className="truncate text-sm font-semibold sm:text-base">
                                  {name}
                                </h3>
                                <span
                                  className={`shrink-0 text-xs font-medium tabular-nums sm:text-sm ${unavailable ? "text-[#625e57] line-through" : ""}`}
                                >
                                  {price}
                                </span>
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#625e57] sm:text-xs">
                                {description}
                              </p>
                              {unavailable && (
                                <span className="mt-1 inline-flex rounded bg-[#e9e8e4] px-1.5 py-0.5 text-[9px] font-bold text-[#625e57] uppercase">
                                  Habis
                                </span>
                              )}
                            </div>
                          </article>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section data-motion className="border-y border-[#e6e2db] bg-[#faf9f5] py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
              <div className="lg:col-span-5">
                <p className="mb-3 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                  Pengelolaan praktis
                </p>
                <h2 className="max-w-lg text-3xl leading-tight tracking-[-.03em] sm:text-4xl">
                  Harga berubah? Edit menunya.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#625e57] sm:text-[15px]">
                  Tambah produk, perbarui harga, atau tandai menu yang habis. Link katalog tetap
                  sama, jadi kamu tidak perlu mencetak ulang QR setiap ada perubahan.
                </p>
                <ul className="mt-6 grid gap-4 text-sm">
                  {[
                    "Tandai stok habis dari dashboard",
                    "Perubahan tampil di halaman toko yang sama",
                    "Bagikan link atau QR tanpa menyiapkan ulang katalog",
                  ].map((item) => (
                    <li className="flex items-start gap-2.5 leading-5" key={item}>
                      <Check className="mt-0.5 shrink-0 text-[#af3100]" size={16} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-xl border border-[#e6e2db] bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e2db] px-4 py-3 sm:px-5">
                    <div>
                      <h3 className="text-sm font-semibold">Ketersediaan menu</h3>
                      <p className="mt-0.5 text-[11px] text-[#625e57]">
                        Contoh pengelolaan dari dashboard
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#625e57]">
                      <Check size={13} className="text-[#af3100]" /> Perubahan tersimpan
                    </span>
                  </div>
                  <div className="divide-y divide-[#e6e2db] px-4 sm:px-5">
                    {menuItems
                      .filter((item) => item.name !== "Matcha Cloud")
                      .map(({ name, price, unavailable }) => (
                        <div className="flex items-center gap-3 py-3.5" key={name}>
                          <span className="grid size-10 shrink-0 place-items-center rounded border border-[#e6e2db] bg-[#f7f6f2] text-[#625e57]">
                            <Coffee size={17} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{name}</p>
                            <p className="mt-0.5 text-xs text-[#625e57]">{price}</p>
                          </div>
                          <span className="mr-1 text-[10px] font-medium text-[#625e57] sm:mr-2">
                            {unavailable ? "Habis" : "Tersedia"}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`relative h-5 w-9 shrink-0 rounded-full ${unavailable ? "bg-[#e3e2df]" : "bg-[#181713]"}`}
                          >
                            <span
                              className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${unavailable ? "left-0.5" : "left-[18px]"}`}
                            />
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#e6e2db] bg-[#f7f6f2] px-4 py-3 text-xs sm:px-5">
                    <span className="text-[#625e57]">2 dari 3 menu tersedia</span>
                    <span className="font-semibold text-[#181713]">+ Tambah menu</span>
                  </div>
                </div>
                <p className="mt-2 text-right text-[10px] text-[#625e57]">
                  Perubahan menu langsung terlihat di halaman toko publik.
                </p>
              </div>
            </div>
          </section>

          <section data-motion className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                Terpusat dan jelas
              </p>
              <h2 className="text-3xl leading-tight tracking-[-.03em] sm:text-4xl">
                Menu ada. Lokasi dan kontak juga.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#625e57] sm:text-[15px]">
                Bantu pelanggan menemukan informasi usaha tanpa harus mencari di banyak tempat atau
                bertanya berulang kali lewat chat.
              </p>
            </div>
            <div data-stagger className="mt-9 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {businessDetails.map(({ icon: Icon, title, value, note }) => (
                <article className="border-t border-[#e6e2db] py-5" key={title}>
                  <Icon className="mb-4 text-[#af3100]" size={19} strokeWidth={1.7} />
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-5 font-medium">{value}</p>
                  <p className="mt-2 text-xs leading-5 text-[#625e57]">{note}</p>
                </article>
              ))}
            </div>
            <p className="text-[10px] text-[#625e57]">
              Tautan tambahan mengikuti fitur paket yang digunakan.
            </p>
          </section>

          <section
            id="cara"
            data-motion
            className="border-y border-[#e6e2db] bg-[#f5f4f0] py-16 sm:py-20"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                    Langkah sederhana
                  </p>
                  <h2 className="text-3xl tracking-[-.03em] sm:text-4xl">Cara kerja Menuku</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-[#625e57]">
                  Mulai dari informasi yang sudah ada, lalu lengkapi halaman toko sedikit demi
                  sedikit.
                </p>
              </div>
              <div data-stagger className="mt-9 grid gap-x-8 md:grid-cols-3">
                {steps.map(([number, title, copy]) => (
                  <article className="border-t border-[#cac6bd] py-5" key={number}>
                    <span className="text-sm font-semibold text-[#af3100] tabular-nums">
                      {number}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#625e57]">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="harga"
            data-motion
            className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
          >
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                Paket Menuku
              </p>
              <h2 className="text-3xl tracking-[-.03em] sm:text-4xl">
                Mulai dari menu yang kamu punya.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#625e57] sm:text-[15px]">
                Pilih paket yang sesuai dengan skala usaha. Kamu bisa meningkatkannya saat toko
                berkembang.
              </p>
            </div>
            <div data-stagger className="mt-9 grid gap-4 md:grid-cols-3">
              {planCards.map((plan) => {
                const featured = plan.code === "premium";
                return (
                  <article
                    className={`flex flex-col rounded-xl border border-[#e6e2db] bg-white p-5 sm:p-6 ${featured ? "border-t-[3px] border-t-[#ff6534]" : ""}`}
                    key={plan.code}
                  >
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <p className="mt-1 min-h-5 text-xs text-[#625e57]">{plan.note}</p>
                    <p className="mt-5 text-2xl font-medium tracking-tight tabular-nums">
                      {plan.price}
                      <span className="ml-1 text-xs font-normal text-[#625e57]">
                        {plan.code === "free" ? "/ selamanya" : "/ bulan"}
                      </span>
                    </p>
                    <ul className="my-5 grid flex-1 content-start gap-3 border-t border-[#e6e2db] pt-5 text-xs leading-5 sm:text-sm">
                      {plan.features.map((feature) => (
                        <li className="flex items-start gap-2" key={feature}>
                          <Check className="mt-0.5 shrink-0 text-[#af3100]" size={15} />{" "}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition active:scale-[.99] ${featured ? "border-[#181713] bg-[#181713] text-white hover:bg-[#30312e]" : "border-[#e6e2db] bg-white text-[#181713] hover:border-[#181713]"}`}
                      href={plan.href}
                    >
                      {plan.code === "free" ? "Mulai gratis" : `Pilih ${plan.name}`}{" "}
                      <ArrowRight size={15} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          <section
            id="pembayaran"
            data-motion
            className="scroll-mt-16 border-y border-[#e6e2db] bg-white py-14 sm:py-16"
          >
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10">
              <div className="lg:col-span-4">
                <p className="mb-3 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                  Pembayaran paket
                </p>
                <h2 className="text-3xl tracking-[-.03em]">Nominal jelas, caranya fleksibel.</h2>
                <p className="mt-3 text-sm leading-6 text-[#625e57]">
                  Pilih metode yang paling nyaman saat membuat invoice dari dashboard.
                </p>
              </div>
              <div className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
                <article className="border-t border-[#e6e2db] py-4 sm:border-t-0 sm:border-l sm:pl-6">
                  <div className="flex items-center gap-2 text-[#af3100]">
                    <Banknote size={18} />
                    <h3 className="text-sm font-semibold text-[#181713]">Transfer manual</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625e57]">
                    Invoice menunjukkan total yang harus ditransfer. Hubungi admin untuk detail
                    rekening; paket aktif setelah pembayaran diverifikasi.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium">
                    <Clock3 size={13} /> Verifikasi oleh admin
                  </span>
                </article>
                <article className="border-t border-[#e6e2db] py-4 sm:border-t-0 sm:border-l sm:pl-6">
                  <div className="flex items-center gap-2 text-[#af3100]">
                    <QrCode size={18} />
                    <h3 className="text-sm font-semibold text-[#181713]">QRIS otomatis</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625e57]">
                    Selesaikan pembayaran dengan QRIS di checkout Duitku. Status paket diperbarui
                    otomatis setelah pembayaran diterima.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium">
                    <Check size={13} className="text-[#af3100]" /> Status lewat callback
                  </span>
                </article>
              </div>
            </div>
          </section>

          <section
            id="faq"
            data-motion
            className="mx-auto grid max-w-7xl scroll-mt-16 gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-10"
          >
            <div className="lg:col-span-4">
              <p className="mb-3 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                Pertanyaan umum
              </p>
              <h2 className="max-w-sm text-3xl tracking-[-.03em] sm:text-4xl">
                Sebelum kamu mulai.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#625e57]">
                Masih ada yang ingin ditanyakan? Admin kami siap membantu.
              </p>
              <a
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[#e6e2db] underline-offset-4 hover:decoration-[#181713]"
                href={supportWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                Tanya admin <ArrowUpRight size={15} />
              </a>
            </div>
            <div data-stagger className="lg:col-span-8">
              {faqs.map(([question, answer]) => (
                <details
                  className="group border-b border-[#e6e2db] py-4 first:border-t"
                  key={question}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                    {question}
                    <ChevronDown
                      className="shrink-0 text-[#625e57] transition group-open:rotate-180"
                      size={17}
                    />
                  </summary>
                  <p className="max-w-2xl pt-3 pr-6 text-sm leading-6 text-[#625e57]">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section
            data-motion
            className="border-y border-[#e6e2db] bg-[#f5f4f0] px-4 py-12 sm:px-6 sm:py-14 lg:px-10"
          >
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-[11px] font-bold tracking-[.14em] text-[#af3100] uppercase">
                  Mulai dari halaman pertamamu
                </p>
                <h2 className="text-2xl tracking-[-.02em] sm:text-3xl">
                  Buat katalog yang mudah ditemukan pelanggan.
                </h2>
                <p className="mt-2 text-sm text-[#625e57]">
                  Gratis untuk mulai. Tidak perlu menyiapkan semuanya sekaligus.
                </p>
              </div>
              <Link
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#181713] px-5 text-sm font-semibold text-white transition hover:bg-[#30312e]"
                href="/register"
              >
                Buat menu gratis <ArrowRight size={15} />
              </Link>
            </div>
          </section>

          <footer className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 text-xs text-[#625e57] sm:flex-row sm:items-center sm:px-6 lg:px-10">
            <Brand compact />
            <p className="sm:ml-auto">© 2026 Menuku. Katalog digital untuk bisnis kuliner.</p>
            <Link className="font-medium text-[#181713]" href="/login">
              Masuk
            </Link>
            <a
              className="font-medium text-[#181713]"
              href={supportWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
            >
              Hubungi admin
            </a>
          </footer>
        </main>
      </LandingMotion>
    </>
  );
}
