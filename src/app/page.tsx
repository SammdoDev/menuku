import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  LayoutTemplate,
  MessageCircle,
  MapPin,
  MenuSquare,
  QrCode,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import Brand from "../components/brand";
import { plans, rupiah } from "../lib/plans";
import { supportWhatsAppUrl } from "../lib/site";
export { default } from "./landing-page-editorial";

const marketingPlans = [
  {
    name: "Free",
    price: rupiah(plans.free.price),
    note: "Untuk mulai menampilkan menu",
    features: [
      "Maks. 2 kategori",
      "Maks. 4 produk",
      "Halaman katalog dasar",
      "Tanpa custom link & analytics",
    ],
    href: "/register?plan=free",
    cta: "Mulai gratis",
  },
  {
    name: "Premium",
    price: rupiah(plans.premium.price),
    note: "per bulan · untuk bisnis berkembang",
    features: ["Maks. 6 kategori & 30 produk", "5 custom link", "Analytics dasar", "Custom style"],
    href: "/register?plan=premium",
    cta: "Pilih Premium",
    featured: true,
  },
  {
    name: "Business",
    price: rupiah(plans.business.price),
    note: "per bulan · untuk tim",
    features: ["Semua fitur Premium", "3 anggota tim", "Custom domain", "Dukungan prioritas"],
    href: "/register?plan=business",
    cta: "Pilih Business",
  },
];
const kicker = "mb-3 text-[11px] font-black uppercase tracking-[.13em] text-brand";

function LegacyHome() {
  return (
    <main className="bg-paper text-ink overflow-hidden">
      <header className="mx-auto flex h-18 max-w-7xl items-center px-4 sm:px-6 lg:px-10">
        <Brand />
        <nav className="text-muted mx-auto hidden gap-7 text-sm font-bold md:flex">
          <a href="#fitur">Fitur</a>
          <a href="#harga">Harga</a>
          <a href="#cara">Cara kerja</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link className="hidden px-3 py-2 text-sm font-bold sm:block" href="/login">
            Masuk
          </Link>
          <Link
            className="bg-brand inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-extrabold text-white sm:px-4"
            href="/register"
          >
            Buat gratis <ArrowRight size={15} />
          </Link>
        </div>
      </header>
      <section className="relative mx-auto grid min-h-[calc(100dvh-72px)] max-w-7xl items-center gap-12 overflow-hidden rounded-b-[2.5rem] bg-[#f7eee7] px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div className="pointer-events-none absolute -top-40 -right-40 size-[30rem] rounded-full bg-orange-200/40 blur-3xl" />
        <div>
          <p className={kicker}>
            <Sparkles className="mr-1 inline" size={14} />
            Katalog digital untuk bisnis kuliner
          </p>
          <h1 className="display-font max-w-2xl text-5xl leading-[.98] font-black sm:text-6xl lg:text-7xl">
            Satu link untuk membuat menu kamu <em className="text-brand not-italic">lebih laku.</em>
          </h1>
          <p className="text-muted mt-6 max-w-xl text-base leading-7 sm:text-lg">
            Bangun halaman menu yang cantik, letakkan WhatsApp, lokasi, dan sosial media dalam satu
            tempat. Tanpa perlu coding.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="bg-brand shadow-brand/20 inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-lg"
              href="/register"
            >
              Buat menu gratis <ArrowRight size={17} />
            </Link>
            <Link
              className="border-line inline-flex min-h-12 items-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold"
              href="/store/kopitemu"
            >
              Lihat contoh <Eye size={16} />
            </Link>
          </div>
          <small className="text-muted mt-4 flex items-center gap-1 text-xs">
            <Check size={14} className="text-emerald-600" />
            Gratis selamanya · Tanpa kartu kredit
          </small>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="bg-brand/20 absolute inset-8 rounded-full blur-3xl" />
          <div className="border-charcoal relative mx-auto w-[min(310px,85vw)] rounded-[34px] border-[8px] bg-white p-3 shadow-2xl">
            <div className="h-28 rounded-2xl bg-[linear-gradient(120deg,#2c1d1760,#1a0e0960),url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=85')] bg-cover p-3">
              <div className="flex justify-between">
                <span className="rounded-full bg-emerald-900 px-2 py-1 text-[8px] font-bold text-white">
                  ● Buka sampai 22.00
                </span>
                <Share2 size={15} className="text-white" />
              </div>
            </div>
            <div className="-mt-6 flex items-end gap-2 px-2">
              <strong className="bg-brand grid size-14 place-items-center rounded-2xl border-4 border-white text-sm text-white">
                KT
              </strong>
              <div className="pb-1">
                <h3 className="display-font text-lg font-black">Kopi Temu</h3>
                <p className="text-muted flex items-center text-[9px]">
                  <MapPin size={9} />
                  Kemang, Jakarta
                </p>
              </div>
            </div>
            <div className="bg-brand mx-2 mt-4 rounded-xl py-2 text-center text-[10px] font-bold text-white">
              Pesan via WhatsApp
            </div>
            <p className="text-brand mx-2 mt-4 text-[8px] font-black">FAVORIT MINGGU INI</p>
            <div className="m-2 grid grid-cols-2 gap-2">
              {["Kopi Susu Aren", "Matcha Cloud"].map((name, index) => (
                <article className="rounded-xl bg-orange-50 p-3" key={name}>
                  <MenuSquare size={20} />
                  <b className="mt-2 block text-[9px]">{name}</b>
                  <small className="text-brand text-[8px]">{index ? "Rp35.000" : "Rp24.000"}</small>
                </article>
              ))}
            </div>
            <div className="border-line text-muted m-2 flex items-center gap-2 rounded-xl border p-2 text-[9px]">
              <Search size={13} />
              Cari menu...
            </div>
          </div>
          <div className="absolute -right-1 -bottom-5 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-xl sm:-right-8">
            <BarChart3 className="text-brand" />
            <div>
              <b className="block text-sm">1.284</b>
              <span className="text-muted text-[9px]">kunjungan minggu ini</span>
            </div>
            <strong className="text-xs text-emerald-600">+18%</strong>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-3 sm:px-8">
        {[
          ["1 link", "untuk menu, lokasi, dan kontak"],
          ["4 produk", "sudah cukup untuk mulai gratis"],
          ["15 menit", "dari daftar sampai siap dibagikan"],
        ].map(([value, label]) => (
          <div className="border-line rounded-2xl border bg-white p-5" key={value}>
            <b className="display-font text-2xl font-black">{value}</b>
            <p className="text-muted mt-1 text-sm">{label}</p>
          </div>
        ))}
      </section>
      <section id="fitur" className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <header className="mx-auto max-w-2xl text-center">
          <p className={kicker}>SEMUA DALAM SATU TEMPAT</p>
          <h2 className="display-font text-4xl font-black sm:text-5xl">
            Lebih dari sekadar daftar menu.
          </h2>
          <p className="text-muted mt-4">
            Halaman yang dirancang supaya pelanggan mendapat informasi yang mereka butuhkan dengan
            cepat.
          </p>
        </header>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              MenuSquare,
              "Katalog yang enak dilihat",
              "Foto produk, kategori, pencarian, harga promo, dan status habis.",
            ],
            [
              QrCode,
              "Bagikan di mana saja",
              "Satu link dan QR code untuk meja, Instagram, WhatsApp, atau Google.",
            ],
            [
              BarChart3,
              "Analytics sederhana",
              "Lihat menu populer, sumber kunjungan, dan link yang paling banyak diklik.",
            ],
            [
              LayoutTemplate,
              "Terasa seperti brand kamu",
              "Pilih warna, tema, tombol, dan layout yang sesuai bisnismu.",
            ],
          ].map(([Icon, title, text]) => (
            <article
              className="border-line rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg"
              key={title as string}
            >
              <span className="text-brand grid size-11 place-items-center rounded-xl bg-orange-50">
                <Icon size={21} />
              </span>
              <h3 className="display-font mt-5 text-xl font-black">{title as string}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{text as string}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        id="cara"
        className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-28"
      >
        <div>
          <p className={kicker}>MULAI DALAM HITUNGAN MENIT</p>
          <h2 className="display-font text-4xl font-black sm:text-5xl">
            Dari dapur ke layar pelanggan.
          </h2>
        </div>
        <ol className="grid gap-3">
          {[
            [
              "01",
              "Buat profil bisnismu",
              "Tentukan nama, alamat, jam buka, dan alamat halaman unik.",
            ],
            ["02", "Masukkan menu & link", "Tambah produk, foto, WhatsApp, Instagram, dan lokasi."],
            ["03", "Bagikan ke pelanggan", "Taruh link di semua kanal bisnismu."],
          ].map(([number, title, text]) => (
            <li className="border-line flex gap-4 rounded-2xl border bg-white p-5" key={number}>
              <b className="bg-charcoal grid size-10 shrink-0 place-items-center rounded-xl text-xs text-white">
                {number}
              </b>
              <div>
                <h3 className="font-extrabold">{title}</h3>
                <p className="text-muted mt-1 text-sm">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section id="harga" className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <header className="mx-auto max-w-2xl text-center">
          <p className={kicker}>PILIH SESUAI KEBUTUHAN</p>
          <h2 className="display-font text-4xl font-black sm:text-5xl">
            Mulai kecil, berkembang kapan saja.
          </h2>
        </header>
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
          {marketingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-3xl border p-6 ${plan.featured ? "border-brand bg-charcoal text-white shadow-xl" : "border-line bg-paper"}`}
            >
              {plan.featured && (
                <i className="bg-brand absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black text-white not-italic">
                  Paling populer
                </i>
              )}
              <h3 className="display-font text-2xl font-black">{plan.name}</h3>
              <div className="mt-5">
                <b className="text-4xl">{plan.price}</b>
                {plan.name !== "Free" && <span className="text-sm opacity-60">/bulan</span>}
              </div>
              <p className="mt-2 text-sm opacity-60">{plan.note}</p>
              <Link
                className={`my-6 flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-extrabold ${plan.featured ? "bg-brand text-white" : "border-line border bg-white"}`}
                href={plan.href}
              >
                {plan.cta}
                <ArrowRight size={15} />
              </Link>
              <ul className="grid gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li className="flex items-center gap-2" key={feature}>
                    <Check size={15} className="text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section
        id="faq"
        className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:py-28"
      >
        <div>
          <p className={kicker}>PERTANYAAN UMUM</p>
          <h2 className="display-font text-4xl font-black sm:text-5xl">
            Semua yang perlu kamu tahu sebelum mulai.
          </h2>
          <p className="text-muted mt-4 leading-7">
            Masih bingung soal paket, pembayaran, atau cara mengelola menu? Jawabannya ada di sini.
          </p>
          <a
            href={supportWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="text-brand mt-6 inline-flex items-center gap-2 text-sm font-extrabold"
          >
            <MessageCircle size={17} /> Tanya admin langsung
          </a>
        </div>
        <div className="grid gap-3">
          {[
            [
              "Apa itu Menuku?",
              "Menuku adalah halaman katalog digital untuk bisnis kuliner. Kamu bisa menampilkan kategori, produk, foto, harga, WhatsApp, lokasi, dan link penting dalam satu URL.",
            ],
            [
              "Apa batas paket Free, Premium, dan Business?",
              "Free cocok untuk mulai: maksimal 2 kategori dan 4 produk. Premium memberi 6 kategori, 30 produk, 5 link, analytics dasar, dan custom style. Business membuka kebutuhan yang lebih besar, termasuk akses tim dan custom domain sesuai konfigurasi akun.",
            ],
            [
              "Bagaimana cara membayar paket?",
              "Pilih paket dan durasi di halaman Billing. Menuku membuat invoice dan menampilkan QRIS. Transfer sesuai nominal invoice, lalu kirim bukti transfer melalui WhatsApp agar admin bisa memverifikasi.",
            ],
            [
              "Apakah pembayaran otomatis aktif?",
              "Belum. Pembayaran QRIS saat ini diverifikasi manual oleh admin. Paket aktif setelah transfer cocok dengan invoice dan status subscription diperbarui.",
            ],
            [
              "Kalau ingin upgrade saat paket masih berjalan bagaimana?",
              "Sistem menghitung kredit sisa masa aktif paket lama untuk mengurangi tagihan upgrade. Karena itu total upgrade bisa lebih kecil dari harga paket baru penuh.",
            ],
            [
              "Berapa lama invoice harus dibayar?",
              "Invoice memiliki countdown pembayaran selama 1 jam. Jika kedaluwarsa atau pembayaran belum terverifikasi, hubungi admin untuk konfirmasi dan pembuatan invoice baru.",
            ],
            [
              "Bisa mengubah isi menu setelah dipublikasikan?",
              "Bisa. Masuk ke Dashboard, ubah kategori atau produk, lalu simpan. Perubahan akan tampil di link storefront yang sama.",
            ],
            [
              "Bagaimana cara menghubungi admin?",
              "Klik tombol WhatsApp di halaman billing, email invoice, atau FAQ ini. Admin Menuku bisa membantu pengecekan pembayaran, paket, dan kendala akun.",
            ],
          ].map(([question, answer]) => (
            <details className="border-line group rounded-2xl border bg-white p-5" key={question}>
              <summary className="cursor-pointer list-none pr-6 font-extrabold">{question}</summary>
              <p className="text-muted mt-3 text-sm leading-6">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="bg-charcoal rounded-3xl p-8 text-white sm:p-12">
          <p className={kicker}>SIAP UNTUK MULAI?</p>
          <h2 className="display-font max-w-2xl text-4xl font-black sm:text-5xl">
            Buat halaman menu yang pantas untuk bisnismu.
          </h2>
          <p className="my-4 text-white/60">Gratis, cepat, dan siap dibagikan hari ini.</p>
          <Link
            className="bg-brand inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-sm font-extrabold"
            href="/register"
          >
            Buat menu gratis <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <footer className="border-line text-muted mx-auto flex max-w-7xl flex-col items-center gap-3 border-t px-5 py-8 text-xs sm:flex-row">
        <Brand compact />
        <p className="sm:ml-auto">© 2026 Menuku. Katalog digital untuk bisnis kuliner.</p>
        <Link className="text-ink font-bold" href="/login">
          Masuk
        </Link>
        <a
          className="text-ink font-bold"
          href={supportWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
        >
          Hubungi admin
        </a>
      </footer>
    </main>
  );
}
