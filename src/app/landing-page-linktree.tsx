import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Banknote,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  MapPin,
  MenuSquare,
  MessageCircle,
  QrCode,
  Share2,
  Sparkles,
  Star,
  Store,
  Utensils,
} from "lucide-react";
import Brand from "../components/brand";
import LandingMotion from "../components/landing-motion";
import { plans, rupiah, type PlanCode } from "../lib/plans";
import { supportWhatsAppUrl } from "../lib/site";

const button =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e96b45] px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#d95c38]";
const softButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e9dfd5] bg-white px-6 text-sm font-bold text-[#332c27] transition hover:-translate-y-0.5 hover:border-[#e96b45]";

const planDetails: Record<PlanCode, { note: string; features: string[] }> = {
  free: {
    note: "Coba susun katalog pertamamu.",
    features: ["2 kategori menu", "4 produk", "Halaman katalog publik"],
  },
  premium: {
    note: "Untuk kedai yang menunya terus berkembang.",
    features: ["6 kategori dan 30 produk", "5 tautan tambahan", "Analitik dan gaya halaman"],
  },
  business: {
    note: "Untuk usaha yang dikelola bersama tim.",
    features: ["Semua fitur Premium", "3 anggota tim", "Domain khusus dan dukungan prioritas"],
  },
};

const plansData = (Object.entries(plans) as [PlanCode, (typeof plans)[PlanCode]][]).map(
  ([code, plan]) => ({
    code,
    name: code === "free" ? "Free" : plan.name,
    price: rupiah(plan.price),
    ...planDetails[code],
    href: code === "free" ? "/register?plan=free" : `/register?plan=${code}`,
  }),
);

const practicalDetails = [
  {
    icon: MenuSquare,
    title: "Menu yang gampang dibaca",
    copy: "Kelompokkan makanan dan minuman, tambahkan foto, lalu tulis harga dengan jelas.",
    className: "sm:col-span-2",
  },
  {
    icon: MessageCircle,
    title: "Pesanan dekat ke WhatsApp",
    copy: "Pelanggan bisa langsung bertanya atau memesan tanpa mencari nomor kontakmu.",
    className: "",
  },
  {
    icon: BarChart3,
    title: "Tahu menu yang sering dilihat",
    copy: "Lihat kunjungan halaman dan produk yang paling banyak dibuka dari dashboard.",
    className: "",
  },
  {
    icon: Share2,
    title: "Satu link untuk dibagikan",
    copy: "Taruh link Menuku di bio, status WhatsApp, kemasan, atau QR di meja kasir.",
    className: "sm:col-span-2",
  },
];

const faqs = [
  ["Apa itu Menuku?", "Menuku membantu bisnis kuliner menyusun menu, informasi toko, dan kontak dalam satu halaman yang mudah dibagikan."],
  ["Bisa mulai tanpa bayar?", "Bisa. Paket Free menyediakan 2 kategori dan 4 produk supaya kamu bisa mencoba alurnya dulu."],
  ["Kalau harga atau menu berubah, harus buat link baru?", "Tidak. Edit dari dashboard, lalu perubahan tampil di link toko yang sama."],
  ["Bagaimana cara membayar paket?", "Di halaman billing, pilih transfer manual dengan nominal invoice yang pas atau QRIS otomatis lewat Duitku. Pembayaran manual menunggu verifikasi admin; QRIS diperbarui otomatis lewat callback."],
  ["Apa pelanggan bisa memesan dari Menuku?", "Pelanggan bisa membuka tombol WhatsApp dari halamanmu untuk bertanya atau mengirim pesanan. Menuku tidak memotong alur komunikasi dengan pelanggan."],
];

export default function LandingPageLinktree() {
  return (
    <LandingMotion>
      <main className="overflow-hidden bg-[#fcf9f5] text-[#332c27]">
        <header className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#887a70] md:flex">
            <a className="transition hover:text-[#e96b45]" href="#fitur">Fitur</a>
            <a className="transition hover:text-[#e96b45]" href="#cara">Cara kerja</a>
            <a className="transition hover:text-[#e96b45]" href="#harga">Harga</a>
            <a className="transition hover:text-[#e96b45]" href="#pembayaran">Pembayaran</a>
            <a className="transition hover:text-[#e96b45]" href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link className="hidden rounded-full px-3 py-2 text-sm font-bold sm:block" href="/login">Masuk</Link>
            <Link href="/register" className={`${button} min-h-10 px-5`}>Mulai gratis</Link>
          </div>
        </header>

        <section className="relative px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:pb-28">
          <div className="absolute -top-16 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-[#f5d9c8]/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
            <div>
              <p data-hero-item className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white/80 px-3 py-2 text-[11px] font-bold text-[#756a60]">
                <Sparkles className="text-[#e96b45]" size={14} />
                Katalog digital untuk usaha kuliner
              </p>
              <h1 data-hero-item className="mt-6 max-w-2xl text-[2.65rem] leading-[1.04] font-black tracking-[-.055em] sm:text-6xl">
                Biar pelanggan tahu harus pesan apa dan ke mana.
              </h1>
              <p data-hero-item className="mt-6 max-w-xl text-base leading-7 text-[#756a60] sm:text-lg">
                Rapikan menu, jam buka, lokasi, dan WhatsApp dalam satu halaman. Bagikan link-nya, lalu lanjut ngobrol dengan pelanggan seperti biasa.
              </p>
              <div data-hero-item className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className={button}>Buat halaman gratis <ArrowRight size={16} /></Link>
                <Link href="/store/kopitemu" target="_blank" className={softButton}>Lihat contoh toko <ExternalLink size={15} /></Link>
              </div>
              <div data-hero-item className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#756a60]">
                <span className="inline-flex items-center gap-1.5"><Check className="text-[#e96b45]" size={14} /> Tidak perlu coding</span>
                <span className="inline-flex items-center gap-1.5"><Check className="text-[#e96b45]" size={14} /> Bisa mulai gratis</span>
                <span className="inline-flex items-center gap-1.5"><Check className="text-[#e96b45]" size={14} /> Bisa diubah kapan saja</span>
              </div>
            </div>

            <div data-hero-card className="relative mx-auto w-full max-w-[470px] lg:ml-auto">
              <div className="absolute -inset-5 rounded-[3rem] bg-[#f1d7c8]/55 blur-2xl" />
              <div className="relative rotate-[1deg] rounded-[2rem] border border-[#eadfd5] bg-white p-4 shadow-[0_30px_80px_-35px_rgba(75,48,34,.4)] sm:p-5">
                <div className="flex items-center justify-between border-b border-[#f0e9e2] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#e96b45]" />
                    <span className="text-[10px] font-bold tracking-wide text-[#887a70]">CONTOH HALAMAN TOKO</span>
                  </div>
                  <Share2 className="text-[#887a70]" size={15} />
                </div>
                <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-[#f8f2eb]">
                  <div className="relative h-36 bg-[linear-gradient(120deg,#38251b99,#38251b20),url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=85')] bg-cover bg-center sm:h-44">
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold">Buka sampai 22.00</span>
                    <span className="absolute right-3 bottom-3 rounded-full bg-[#fffaf5] px-3 py-1.5 text-[9px] font-bold">Kemang, Jakarta</span>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="-mt-6 flex items-end gap-3">
                      <div className="grid size-14 shrink-0 place-items-center rounded-2xl border-4 border-[#f8f2eb] bg-[#e96b45] text-sm font-black text-white">KT</div>
                      <div className="min-w-0 pb-1"><h2 className="truncate text-lg font-black">Kopi Temu</h2><p className="text-[10px] text-[#887a70]">Kopi, kudapan, dan ruang untuk bertemu.</p></div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e96b45] px-3 py-3 text-xs font-bold text-white">
                      <MessageCircle size={15} /> Pesan lewat WhatsApp <ArrowRight className="ml-auto" size={14} />
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-[10px] font-black tracking-[.13em] text-[#e96b45]">MENU FAVORIT</p>
                      <span className="text-[9px] text-[#887a70]">Lihat semua <ArrowRight className="ml-1 inline" size={10} /></span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2.5">
                      {[["Kopi Susu Aren", "Rp24.000"], ["Roti Panggang", "Rp22.000"]].map(([name, price]) => (
                        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white p-2" key={name}>
                          <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#f5d9c8]/60"><Utensils className="text-[#e96b45]" size={17} /></div>
                          <div className="min-w-0"><b className="block truncate text-[9px]">{name}</b><small className="text-[9px] font-bold text-[#e96b45]">{price}</small></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[#332c27] px-4 py-3 text-[10px] text-white">
                  <span className="flex items-center gap-2"><Store size={13} className="text-[#f2a184]" /> Satu halaman untuk toko</span>
                  <span className="font-bold text-[#f2a184]">menuku.my.id</span>
                </div>
              </div>
              <div className="absolute -right-2 -bottom-5 hidden rounded-2xl border border-[#eadfd5] bg-white p-3 shadow-lg sm:block">
                <div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-xl bg-[#f9eee6] text-[#e96b45]"><QrCode size={16} /></div><div><b className="block text-[10px]">Mudah dibagikan</b><span className="text-[9px] text-[#887a70]">Link dan QR tersedia</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#eee4da] bg-white px-5 py-7 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-semibold text-[#756a60] sm:justify-between sm:text-left">
            <span className="inline-flex items-center gap-2"><MenuSquare className="text-[#e96b45]" size={16} /> Menu dan harga</span>
            <span className="inline-flex items-center gap-2"><MessageCircle className="text-[#e96b45]" size={16} /> WhatsApp</span>
            <span className="inline-flex items-center gap-2"><MapPin className="text-[#e96b45]" size={16} /> Lokasi dan jam buka</span>
            <span className="inline-flex items-center gap-2"><QrCode className="text-[#e96b45]" size={16} /> Link dan QR</span>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-xs font-black tracking-[.16em] text-[#e96b45]">KENAPA SATU HALAMAN?</p>
              <h2 className="mt-4 text-3xl leading-tight font-black tracking-[-.04em] sm:text-5xl">Biar pelanggan tidak perlu bertanya hal yang sama berulang kali.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#756a60] sm:text-base">
              “Menunya ada di mana?”, “Hari ini buka sampai jam berapa?”, “Bisa pesan lewat WhatsApp?” Informasi seperti ini sering tercecer di beberapa tempat. Menuku menyatukannya dalam satu link yang bisa kamu kirim kapan saja.
            </p>
          </div>
          <div data-stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {practicalDetails.map(({ icon: Icon, title, copy, className }) => (
              <article className={`rounded-[1.5rem] border border-[#eee4da] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg ${className}`} key={title}>
                <span className="grid size-11 place-items-center rounded-xl bg-[#fcf1e9] text-[#e96b45]"><Icon size={20} /></span>
                <h3 className="mt-6 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#887a70]">{copy}</p>
              </article>
            ))}
            <article className="relative overflow-hidden rounded-[1.5rem] bg-[#f4ddcf] p-6 sm:col-span-2 lg:col-span-1">
              <p className="text-[10px] font-black tracking-[.14em] text-[#a95438]">CONTOH SEHARI-HARI</p>
              <h3 className="mt-4 text-lg font-black">Menu favorit habis? Tandai dari dashboard.</h3>
              <p className="mt-2 text-sm leading-6 text-[#756a60]">Pelanggan akan melihat status terbaru saat membuka link toko. Tidak perlu cetak ulang daftar menu.</p>
              <MenuSquare className="absolute -right-4 -bottom-5 size-28 rotate-12 text-[#e96b45]/15" />
            </article>
          </div>
        </section>

        <section id="fitur" className="bg-[#332c27] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-xs font-black tracking-[.16em] text-[#f2a184]">MULAI DARI YANG PENTING</p>
              <h2 className="mt-4 text-3xl leading-tight font-black tracking-[-.04em] sm:text-5xl">Atur katalog dari dashboard. Pelanggan melihat versi terbarunya.</h2>
              <p className="mt-5 text-sm leading-7 text-white/65">Tambah produk, rapikan kategori, ubah harga, atau sembunyikan menu yang sedang tidak tersedia. Semuanya dilakukan dari satu tempat.</p>
              <Link href="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#f2a184]">Coba dashboard gratis <ArrowRight size={15} /></Link>
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-white/[.06] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div><p className="text-[9px] font-black tracking-[.15em] text-[#f2a184]">RINGKASAN TOKO</p><h3 className="mt-1 text-lg font-black">Kopi Temu</h3></div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold text-emerald-200">Halaman aktif</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[["Kopi Susu Aren", "Rp24.000", "Tersedia"], ["Roti Panggang", "Rp22.000", "Tersedia"], ["Matcha Cloud", "Rp35.000", "Menu favorit"]].map(([name, price, status], index) => (
                  <div className="flex items-center gap-3 rounded-xl bg-white/[.06] p-3" key={name}>
                    <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${index === 2 ? "bg-[#e96b45]" : "bg-white/10"}`}><Utensils size={16} /></div>
                    <div className="min-w-0 flex-1"><b className="block truncate text-xs">{name}</b><span className="text-[10px] text-white/50">{price}</span></div>
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[8px] font-bold text-white/70">{status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#f5d9c8]/10 p-4 sm:flex-row sm:items-center">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e96b45] text-white"><Share2 size={16} /></div>
                <p className="min-w-0 flex-1 text-xs leading-5 text-white/70">Link katalog tetap sama meski menu atau jam buka diperbarui.</p>
                <span className="truncate rounded-lg bg-white/10 px-3 py-2 text-[9px] font-bold text-[#f2a184]">menuku.my.id/store/kopitemu</span>
              </div>
            </div>
          </div>
        </section>

        <section id="cara" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-black tracking-[.16em] text-[#e96b45]">CARA KERJA</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-5xl">Tidak harus disiapkan sekaligus.</h2>
            <p className="mt-4 text-sm leading-7 text-[#887a70]">Mulai dari informasi yang sudah kamu punya, lalu lengkapi bagian lain ketika sempat.</p>
          </div>
          <div data-stagger className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              ["01", "Buat halaman toko", "Tentukan nama dan link yang mudah diingat pelanggan."],
              ["02", "Masukkan menu", "Mulai dari beberapa produk dulu. Foto dan deskripsi bisa ditambahkan kemudian."],
              ["03", "Bagikan link", "Taruh di bio atau kirim langsung saat ada pelanggan bertanya."],
            ].map(([number, title, copy]) => (
              <article className="rounded-[1.5rem] border border-[#eee4da] bg-white p-6" key={number}>
                <span className="grid size-10 place-items-center rounded-xl bg-[#fcf1e9] text-xs font-black text-[#e96b45]">{number}</span>
                <h3 className="mt-8 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#887a70]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="harga" className="border-y border-[#eee4da] bg-white px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black tracking-[.16em] text-[#e96b45]">PILIHAN PAKET</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-5xl">Mulai sederhana, naikkan paket saat perlu.</h2>
              <p className="mt-4 text-sm leading-6 text-[#887a70]">Coba Free lebih dulu. Paket berbayar bisa dipilih dari dashboard ketika kebutuhanmu bertambah.</p>
            </div>
            <div data-stagger className="mt-10 grid items-stretch gap-4 lg:grid-cols-3">
              {plansData.map((plan) => {
                const featured = plan.code === "premium";
                return (
                  <article className={`relative flex flex-col rounded-[1.6rem] p-6 ring-1 ${featured ? "bg-[#332c27] text-white ring-[#332c27] shadow-xl lg:-translate-y-2" : "bg-[#fcf9f5] ring-[#eee4da]"}`} key={plan.code}>
                    {featured && <span className="absolute -top-3 left-6 rounded-full bg-[#e96b45] px-3 py-1 text-[9px] font-black tracking-wide text-white">PALING SERING DIPILIH</span>}
                    <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black">{plan.name}</h3>{featured && <Star className="fill-[#f2a184] text-[#f2a184]" size={17} />}</div>
                    <p className="mt-2 min-h-10 text-xs leading-5 opacity-65">{plan.note}</p>
                    <p className="mt-6 text-3xl font-black">{plan.price}<span className="ml-1 text-xs font-normal opacity-60">{plan.code === "free" ? "" : "/ bulan"}</span></p>
                    <ul className="my-6 grid gap-3 text-xs">
                      {plan.features.map((feature) => <li className="flex items-start gap-2" key={feature}><Check className="mt-0.5 shrink-0 text-[#e96b45]" size={14} /><span>{feature}</span></li>)}
                    </ul>
                    <Link href={plan.href} className={`mt-auto flex min-h-11 items-center justify-center gap-2 rounded-full text-xs font-bold ${featured ? "bg-[#e96b45] text-white" : "border border-[#e9dfd5] bg-white"}`}>
                      {plan.code === "free" ? "Mulai gratis" : `Pilih ${plan.name}`} <ArrowRight size={14} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pembayaran" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black tracking-[.16em] text-[#e96b45]">BAYAR SESUAI CARA YANG KAMU SUKA</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-4xl">Nominalnya jelas. Pilih proses yang paling nyaman.</h2>
              <p className="mt-4 text-sm leading-7 text-[#887a70]">Saat memilih paket di dashboard, kamu bisa transfer manual sesuai nominal invoice atau menyelesaikan pembayaran otomatis dengan QRIS.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-[#eee4da] bg-white p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-[#fcf1e9] text-[#e96b45]"><Banknote size={20} /></span>
                <h3 className="mt-5 text-lg font-black">Transfer manual</h3>
                <p className="mt-2 text-sm leading-6 text-[#887a70]">Invoice menampilkan nominal pas. Hubungi admin untuk detail rekening, lalu admin akan mencocokkan pembayaranmu.</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#756a60]"><Clock3 size={13} /> Aktivasi setelah verifikasi</span>
              </article>
              <article className="rounded-[1.5rem] border border-[#332c27] bg-[#332c27] p-6 text-white">
                <span className="grid size-11 place-items-center rounded-xl bg-[#e96b45] text-white"><QrCode size={20} /></span>
                <h3 className="mt-5 text-lg font-black">QRIS otomatis</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">Bayar dari checkout Duitku. Setelah pembayaran berhasil, status paket diperbarui otomatis.</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#f2a184]"><Check size={13} /> Diproses oleh Duitku</span>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="border-y border-[#eee4da] bg-white px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-xs font-black tracking-[.16em] text-[#e96b45]">PERTANYAAN UMUM</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-5xl">Sebelum mulai.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#887a70]">Kalau masih ada yang ingin ditanyakan, admin kami siap membantu.</p>
              <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#e96b45]" href={supportWhatsAppUrl()} target="_blank" rel="noreferrer">Tanya admin <ArrowRight size={15} /></a>
            </div>
            <div data-stagger className="grid gap-1">
              {faqs.map(([question, answer]) => (
                <details className="group border-b border-[#e9dfd5] py-5" key={question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">{question}<ChevronDown className="shrink-0 transition group-open:rotate-180" size={16} /></summary>
                  <p className="max-w-2xl pt-3 pr-6 text-sm leading-6 text-[#887a70]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#f3d7c7] p-7 sm:p-12">
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-black tracking-[.16em] text-[#a95438]">MULAI DARI HALAMAN PERTAMAMU</p>
                <h2 className="mt-3 text-3xl leading-tight font-black tracking-[-.04em] sm:text-4xl">Susun informasi toko dengan rapi, lalu bagikan saat pelanggan membutuhkannya.</h2>
              </div>
              <Link href="/register" className={`${button} shrink-0 bg-[#332c27] hover:bg-[#1f1b18]`}>Buat halaman gratis <ArrowRight size={16} /></Link>
            </div>
            <Utensils className="absolute -right-8 -bottom-16 size-56 rotate-12 text-white/35" />
          </div>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col items-center gap-3 border-t border-[#eee4da] px-5 py-8 text-xs text-[#887a70] sm:flex-row sm:px-8">
          <Brand compact />
          <p className="sm:ml-auto">© 2026 Menuku. Katalog digital untuk bisnis kuliner.</p>
          <Link className="font-bold text-[#332c27]" href="/login">Masuk</Link>
          <a className="font-bold text-[#332c27]" href={supportWhatsAppUrl()} target="_blank" rel="noreferrer">Hubungi admin</a>
        </footer>
      </main>
    </LandingMotion>
  );
}
