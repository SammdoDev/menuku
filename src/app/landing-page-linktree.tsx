import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  Layers3,
  Link2,
  MapPin,
  MessageCircle,
  MenuSquare,
  QrCode,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Brand from "../components/brand";
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

const dashboardLinks = [
  { label: "Dashboard", icon: Activity, active: true },
  { label: "Menu", icon: MenuSquare },
  { label: "Kategori", icon: Layers3 },
  { label: "Links", icon: Link2 },
  { label: "Publikasi", icon: QrCode },
  { label: "Settings", icon: Settings },
];

const dashboardMetrics = [
  ["Kunjungan hari ini", "1.284", Activity],
  ["Pengunjung unik", "428", Users],
  ["Menu dilihat", "96", MenuSquare],
  ["Link diklik", "38", Link2],
] as const;

const weeklyViews = [35, 52, 44, 73, 58, 86, 68];

const dashboardMenu = [
  ["Kopi Susu Aren", "Rp24.000", "Tersedia"],
  ["Matcha Cloud", "Rp35.000", "Tersedia"],
  ["Butter Croissant", "Rp22.000", "Habis"],
];

const features = [
  {
    icon: MenuSquare,
    title: "Menu dan kategori",
    copy: "Tambah produk, atur harga, kelompokkan kategori, lalu perbarui status ketersediaannya.",
  },
  {
    icon: Settings,
    title: "Profil bisnis",
    copy: "Atur nama toko, deskripsi, alamat, jam buka, WhatsApp, dan tampilan halaman publik.",
  },
  {
    icon: Link2,
    title: "Link penting",
    copy: "Simpan tautan WhatsApp, Instagram, TikTok, Maps, reservasi, atau website di halaman toko.",
  },
  {
    icon: QrCode,
    title: "Publikasi halaman",
    copy: "Atur status halaman, salin URL toko, dan buka versi publik untuk ditinjau.",
  },
];

const steps = [
  ["01", "Lengkapi profil", "Masukkan nama toko, informasi usaha, lokasi, jam buka, dan kontak."],
  [
    "02",
    "Atur menu dan link",
    "Buat kategori, masukkan produk, lalu tambahkan tautan yang dibutuhkan pelanggan.",
  ],
  ["03", "Publikasikan", "Tinjau halaman tokomu, aktifkan publikasi, lalu bagikan URL toko."],
];

const faqs = [
  [
    "Apa saja yang bisa dikelola dari dashboard?",
    "Dashboard berisi ringkasan kunjungan, menu dan kategori, link bisnis, informasi serta tampilan toko, publikasi, dan paket.",
  ],
  [
    "Apakah pelanggan perlu membuat akun?",
    "Tidak. Pelanggan bisa membuka URL toko untuk melihat halaman menu tanpa login.",
  ],
  [
    "Bisa mengubah menu setelah halaman dibagikan?",
    "Bisa. Perubahan menu dan informasi dilakukan dari dashboard. URL toko tetap sama.",
  ],
  [
    "Bagaimana cara membayar paket berbayar?",
    "Pilih transfer manual sesuai nominal invoice dan tunggu verifikasi admin, atau bayar otomatis melalui QRIS Duitku.",
  ],
  [
    "Apakah Menuku menerima pesanan langsung?",
    "Menuku menampilkan katalog dan tombol kontak supaya pelanggan bisa bertanya atau memesan langsung ke tokomu.",
  ],
];

export default function LandingPageLinktree() {
  return (
    <main className="bg-paper text-ink min-h-screen overflow-hidden">
      <header className="border-line sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Navigasi utama">
            <a className="font-bold" href="#fitur">
              Fitur
            </a>
            <a className="text-muted hover:text-ink transition" href="#cara">
              Cara kerja
            </a>
            <a className="text-muted hover:text-ink transition" href="#harga">
              Harga
            </a>
            <a className="text-muted hover:text-ink transition" href="#pembayaran">
              Pembayaran
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a
              className="text-muted hover:text-ink hidden px-1 py-2 text-sm transition sm:inline"
              href="/login"
            >
              Masuk
            </a>
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#b13b19] px-4 text-xs font-extrabold text-white transition hover:bg-[#8f2e14] active:scale-[.99] sm:px-5 sm:text-sm"
              href="/register"
            >
              Mulai gratis
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-16">
        <div className="lg:col-span-5">
          <p className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
            <Sparkles size={14} /> DASHBOARD UNTUK USAHA KULINER
          </p>
          <h1 className="display-font max-w-xl text-4xl leading-[1.02] font-black sm:text-5xl lg:text-[3.4rem]">
            Kelola tokomu.
            <br />
            Bagikan menu dengan mudah.
          </h1>
          <p className="text-muted mt-5 max-w-lg text-sm leading-7 sm:text-base">
            Pantau kunjungan, atur menu dan kategori, perbarui informasi toko, lalu publikasikan
            semuanya dari satu dashboard.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b13b19] px-5 text-sm font-extrabold text-white transition hover:bg-[#8f2e14]"
              href="/register"
            >
              Buat halaman gratis <ArrowRight size={16} />
            </a>
            <a
              className="border-line hover:border-brand inline-flex min-h-12 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-bold transition"
              href="#dashboard-preview"
            >
              Lihat dashboard <ArrowRight size={15} />
            </a>
          </div>
          <p className="text-muted mt-5 flex items-center gap-2 text-xs">
            <Check className="text-[#b13b19]" size={15} /> Mulai dengan 2 kategori dan 4 produk.
          </p>
        </div>

        <div id="dashboard-preview" className="min-w-0 scroll-mt-24 lg:col-span-7">
          <div className="text-muted mb-2 flex items-center gap-2 text-[10px] font-black tracking-[.14em]">
            <span className="bg-brand size-2 rounded-full" /> CONTOH RINGKASAN DASHBOARD
          </div>
          <div className="border-line overflow-hidden rounded-2xl border bg-white shadow-lg shadow-[#24211d]/[.08]">
            <div className="border-line flex h-12 items-center justify-between gap-3 border-b px-3 sm:px-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-[#b13b19] text-[9px] font-black text-white">
                  KT
                </span>
                <span className="text-xs font-extrabold">Kopi Temu</span>
              </div>
              <span className="text-muted hidden min-w-0 flex-1 truncate px-4 text-center text-[10px] sm:block">
                www.digimenu.my.id/store/kopitemu
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                Halaman publik
              </span>
            </div>
            <div className="grid min-h-[390px] sm:grid-cols-[112px_minmax(0,1fr)] lg:grid-cols-[128px_minmax(0,1fr)]">
              <aside
                className="bg-charcoal hidden flex-col gap-1 p-2.5 text-white/65 sm:flex"
                aria-hidden="true"
              >
                {dashboardLinks.map(({ label, icon: Icon, active }) => (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-bold ${active ? "bg-[#b13b19] text-white" : ""}`}
                    key={label}
                  >
                    <Icon size={13} /> <span className="truncate">{label}</span>
                  </div>
                ))}
              </aside>
              <div className="min-w-0 p-3 sm:p-4 lg:p-5">
                <div className="mb-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="mb-1 text-[8px] font-black tracking-[.12em] text-[#b13b19]">
                      RINGKASAN BISNIS
                    </p>
                    <h2 className="display-font text-lg font-black sm:text-xl">Halo, Raka.</h2>
                  </div>
                  <span className="text-muted text-[9px]">Contoh data</span>
                </div>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {dashboardMetrics.map(([label, value, Icon]) => (
                    <div className="border-line min-w-0 rounded-xl border p-2.5" key={label}>
                      <span className="text-muted flex items-center gap-1 text-[8px] leading-3">
                        <Icon className="shrink-0 text-[#b13b19]" size={11} />
                        {label}
                      </span>
                      <b className="display-font mt-1 block text-lg font-black tabular-nums">
                        {value}
                      </b>
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid gap-2 lg:grid-cols-[1.15fr_.85fr]">
                  <div className="border-line min-w-0 rounded-xl border p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[8px] font-black tracking-[.1em] text-[#b13b19]">
                          PERFORMA 7 HARI
                        </p>
                        <h3 className="mt-0.5 text-[10px] font-extrabold">Kunjungan storefront</h3>
                      </div>
                      <span className="text-[8px] font-bold text-emerald-700">↗ Live insight</span>
                    </div>
                    <div
                      className="flex h-[78px] items-end gap-1.5"
                      role="img"
                      aria-label="Grafik kunjungan selama tujuh hari"
                    >
                      {weeklyViews.map((height, index) => (
                        <div
                          className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                          key={index}
                        >
                          <span
                            className="bg-brand/80 w-full rounded-t-sm"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-muted text-[7px]">
                            {["S", "S", "R", "K", "J", "S", "M"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-line rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <p className="text-[8px] font-black tracking-[.1em] text-[#b13b19]">
                          SETUP SCORE
                        </p>
                        <h3 className="mt-0.5 text-[10px] font-extrabold">Siap dibagikan</h3>
                      </div>
                      <b className="text-sm text-[#b13b19]">75%</b>
                    </div>
                    <div className="bg-line mt-3 h-1.5 overflow-hidden rounded-full">
                      <span className="bg-brand block h-full w-3/4 rounded-full" />
                    </div>
                    <p className="text-muted mt-2 text-[8px]">3 dari 4 langkah selesai</p>
                  </div>
                </div>
                <div className="border-line mt-2 overflow-hidden rounded-xl border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <h3 className="text-[10px] font-extrabold">Menu terbaru</h3>
                    <span className="text-[9px] font-bold text-[#b13b19]">
                      Kelola <ArrowUpRight className="inline" size={11} />
                    </span>
                  </div>
                  <div className="divide-line divide-y">
                    {dashboardMenu.map(([name, price, status], index) => (
                      <div className="flex items-center gap-2 px-3 py-2" key={name}>
                        <span className="text-muted w-4 text-[8px]">0{index + 1}</span>
                        <span className="bg-paper grid size-6 place-items-center rounded-md text-[9px] font-black text-[#b13b19]">
                          {name[0]}
                        </span>
                        <b className="min-w-0 flex-1 truncate text-[9px]">{name}</b>
                        <span className="text-muted text-[8px]">{status}</span>
                        <span className="text-[8px] font-bold tabular-nums">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted mt-2 text-right text-[10px]">
            Gambaran fitur yang tersedia dari dashboard Menuku.
          </p>
        </div>
      </section>

      <section id="fitur" className="border-line border-y bg-white py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-10">
          <div className="lg:col-span-5">
            <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
              SATU DASHBOARD, HAL PENTING
            </p>
            <h2 className="display-font max-w-lg text-3xl font-black sm:text-4xl">
              Semua bagian tokomu punya tempatnya.
            </h2>
          </div>
          <p className="text-muted max-w-2xl text-sm leading-6 sm:text-base lg:col-span-7">
            Dashboard Menuku dirancang mengikuti alur yang kamu butuhkan: dari mengatur profil,
            merapikan katalog, sampai menyiapkan halaman untuk pelanggan.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
          {features.map(({ icon: Icon, title, copy }) => (
            <article className="border-line bg-paper rounded-2xl border p-5 shadow-sm" key={title}>
              <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-[#b13b19]">
                <Icon size={19} />
              </span>
              <h3 className="display-font mt-5 text-base font-black">{title}</h3>
              <p className="text-muted mt-2 text-xs leading-5">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:px-10">
        <div className="lg:col-span-5">
          <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
            MENU DAN KATEGORI
          </p>
          <h2 className="display-font text-3xl font-black sm:text-4xl">
            Perbarui katalog tanpa mengubah link toko.
          </h2>
          <p className="text-muted mt-4 text-sm leading-6">
            Atur harga dan produk, pisahkan menu dalam kategori, lalu tandai item yang sedang tidak
            tersedia.
          </p>
          <ul className="mt-5 grid gap-3 text-sm">
            {[
              "Kelola produk dan kategori dari dashboard",
              "Atur item tersedia atau habis",
              "Lihat perubahan pada halaman publik yang sama",
            ].map((item) => (
              <li className="flex items-start gap-2" key={item}>
                <Check className="mt-0.5 shrink-0 text-[#b13b19]" size={15} />
                {item}
              </li>
            ))}
          </ul>
          <a
            href="/register"
            className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-[#b13b19]"
          >
            Coba kelola menu <ArrowRight size={15} />
          </a>
        </div>
        <div className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm lg:col-span-7">
          <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-5">
            <div>
              <p className="text-[9px] font-black tracking-[.12em] text-[#b13b19]">KATALOG</p>
              <h3 className="display-font mt-1 text-lg font-black">Menu terbaru</h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#b13b19]">
              Kelola <ArrowUpRight size={14} />
            </span>
          </div>
          <div className="divide-line divide-y px-4 sm:px-5">
            {dashboardMenu.map(([name, price, status], index) => (
              <div className="flex items-center gap-3 py-3.5" key={name}>
                <span className="text-muted w-5 text-[10px] font-black">0{index + 1}</span>
                <span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-xs font-black text-[#b13b19]">
                  {name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-sm">{name}</b>
                  <span className="text-muted text-xs">{status}</span>
                </div>
                <b className="text-xs tabular-nums">{price}</b>
              </div>
            ))}
          </div>
          <div className="border-line bg-paper text-muted flex items-center justify-between border-t px-4 py-3 text-xs sm:px-5">
            <span>Menu dan kategori dikelola dari dashboard</span>
            <span className="font-bold text-[#b13b19]">+ Tambah menu</span>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-14 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-10">
          <div className="lg:col-span-4">
            <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#ff9c79]">
              INFO TOKO DAN KONTAK
            </p>
            <h2 className="display-font text-3xl font-black sm:text-4xl">
              Bantu pelanggan menemukan tokomu.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/65">
              Isi informasi yang biasa ditanyakan pelanggan di halaman settings, lalu tampilkan
              tautan yang mereka butuhkan.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {[
              [Clock3, "Jam operasional", "Perbarui jadwal buka dari profil toko."],
              [MapPin, "Alamat toko", "Tampilkan lokasi dan tautan Google Maps."],
              [MessageCircle, "WhatsApp", "Arahkan pelanggan ke chat tokomu."],
              [Instagram, "Tautan sosial", "Sertakan Instagram, TikTok, atau website."],
            ].map(([Icon, title, copy]) => {
              const DetailIcon = Icon as typeof Clock3;
              return (
                <article
                  className="rounded-2xl border border-white/10 bg-white/[.06] p-4"
                  key={title as string}
                >
                  <DetailIcon className="mb-3 text-[#ff9c79]" size={18} />
                  <h3 className="text-sm font-extrabold">{title as string}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/60">{copy as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cara" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
              CARA KERJA
            </p>
            <h2 className="display-font text-3xl font-black sm:text-4xl">
              Siap dibagikan dalam beberapa langkah.
            </h2>
          </div>
          <p className="text-muted max-w-md text-sm leading-6">
            Mulai dengan informasi yang sudah ada. Kamu bisa melengkapi halaman seiring tokomu
            berkembang.
          </p>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {steps.map(([number, title, copy]) => (
            <article className="border-line rounded-2xl border bg-white p-5 shadow-sm" key={number}>
              <span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-xs font-black text-[#b13b19]">
                {number}
              </span>
              <h3 className="display-font mt-5 text-lg font-black">{title}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="harga"
        className="border-line scroll-mt-16 border-y bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
              PAKET MENUKU
            </p>
            <h2 className="display-font text-3xl font-black sm:text-4xl">
              Pilih sesuai kebutuhan tokomu.
            </h2>
            <p className="text-muted mt-3 text-sm leading-6">
              Detail paket di landing dan dashboard menggunakan batas serta harga yang sama.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {planCards.map((plan) => {
              const featured = plan.code === "premium";
              return (
                <article
                  className={`border-line bg-paper relative flex flex-col rounded-2xl border p-5 shadow-sm sm:p-6 ${featured ? "border-brand" : ""}`}
                  key={plan.code}
                >
                  {featured && (
                    <span className="absolute -top-3 left-5 rounded-full bg-[#b13b19] px-3 py-1 text-[9px] font-black text-white">
                      PALING POPULER
                    </span>
                  )}
                  <p className="display-font text-lg font-black">{plan.name}</p>
                  <p className="text-muted mt-1 min-h-5 text-xs">{plan.note}</p>
                  <p className="mt-5 text-2xl font-black tabular-nums">
                    {plan.price}
                    <span className="text-muted ml-1 text-xs font-normal">
                      {plan.code === "free" ? "/ selamanya" : "/ bulan"}
                    </span>
                  </p>
                  <ul className="border-line my-5 grid flex-1 content-start gap-3 border-t pt-5 text-xs leading-5 sm:text-sm">
                    {plan.features.map((feature) => (
                      <li className="flex items-start gap-2" key={feature}>
                        <Check className="mt-0.5 shrink-0 text-[#b13b19]" size={15} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${featured ? "bg-[#b13b19] text-white hover:bg-[#8f2e14]" : "border-line hover:border-brand border bg-white"}`}
                    href={plan.href}
                  >
                    {plan.code === "free" ? "Mulai gratis" : `Pilih ${plan.name}`}{" "}
                    <ArrowRight size={15} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pembayaran" className="border-line scroll-mt-16 border-b py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10">
          <div className="lg:col-span-4">
            <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
              PAKET & PEMBAYARAN
            </p>
            <h2 className="display-font text-3xl font-black">Lanjutkan dari halaman billing.</h2>
            <p className="text-muted mt-3 text-sm leading-6">
              Kamu dapat memilih cara pembayaran saat membuat invoice di dashboard.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            <article className="border-line rounded-2xl border bg-white p-5 shadow-sm">
              <Banknote className="mb-4 text-[#b13b19]" size={20} />
              <h3 className="display-font text-base font-black">Transfer manual</h3>
              <p className="text-muted mt-2 text-xs leading-5">
                Invoice berisi total yang harus ditransfer. Hubungi admin untuk detail rekening;
                paket aktif setelah pembayaran diverifikasi.
              </p>
              <span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold">
                <Clock3 size={13} /> Verifikasi admin
              </span>
            </article>
            <article className="border-line rounded-2xl border bg-white p-5 shadow-sm">
              <QrCode className="mb-4 text-[#b13b19]" size={20} />
              <h3 className="display-font text-base font-black">QRIS otomatis</h3>
              <p className="text-muted mt-2 text-xs leading-5">
                Bayar melalui checkout Duitku. Status paket diperbarui otomatis setelah callback
                pembayaran.
              </p>
              <span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold">
                <Check className="text-[#b13b19]" size={13} /> Status otomatis
              </span>
            </article>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto grid max-w-7xl scroll-mt-16 gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-10"
      >
        <div className="lg:col-span-4">
          <p className="mb-3 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
            PERTANYAAN UMUM
          </p>
          <h2 className="display-font max-w-sm text-3xl font-black sm:text-4xl">
            Sebelum kamu mulai.
          </h2>
          <p className="text-muted mt-4 max-w-sm text-sm leading-6">
            Masih ada yang ingin ditanyakan? Admin kami siap membantu.
          </p>
          <a
            className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#b13b19]"
            href={supportWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Tanya admin <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="lg:col-span-8">
          {faqs.map(([question, answer]) => (
            <details className="border-line group border-b py-4 first:border-t" key={question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold">
                {question}
                <ChevronDown
                  className="text-muted shrink-0 transition group-open:rotate-180"
                  size={17}
                />
              </summary>
              <p className="text-muted max-w-2xl pt-3 pr-6 text-sm leading-6">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-line border-y bg-[#fff4ed] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-[10px] font-black tracking-[.14em] text-[#b13b19]">
              MULAI DARI HALAMAN PERTAMAMU
            </p>
            <h2 className="display-font text-2xl font-black sm:text-3xl">
              Buat katalog yang siap dibagikan.
            </h2>
            <p className="text-muted mt-2 text-sm">
              Gratis untuk mulai. Tidak perlu menyiapkan semuanya sekaligus.
            </p>
          </div>
          <a
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#b13b19] px-5 text-sm font-extrabold text-white transition hover:bg-[#8f2e14]"
            href="/register"
          >
            Buat menu gratis <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <footer className="text-muted mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 text-xs sm:flex-row sm:items-center sm:px-6 lg:px-10">
        <Brand compact />
        <p className="sm:ml-auto">© 2026 Menuku. Katalog digital untuk bisnis kuliner.</p>
        <a className="text-ink font-bold" href="/login">
          Masuk
        </a>
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
