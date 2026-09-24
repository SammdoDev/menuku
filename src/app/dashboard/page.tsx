import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Link2,
  MenuSquare,
  QrCode,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import DashboardShell from "../../components/dashboard-shell";
import DashboardMotion from "../../components/dashboard-motion";
import { getCurrentMerchant } from "../../lib/merchant";
import { publicStoreUrl } from "../../lib/site";

type Daily = {
  page_views: number;
  unique_visitors: number;
  product_views: number;
  link_clicks: number;
  event_date: string;
};
type Product = {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  is_active: boolean;
  is_available: boolean;
};

export default async function DashboardPage() {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant) return null;
  const [{ data: daily }, { data: products }, { data: links }] = await Promise.all([
    supabase
      .from("analytics_daily")
      .select("page_views,unique_visitors,product_views,link_clicks,event_date")
      .eq("tenant_id", tenant.id)
      .order("event_date", { ascending: false })
      .limit(7),
    supabase
      .from("products")
      .select("id,name,price,discount_price,is_active,is_available")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase.from("custom_links").select("id").eq("tenant_id", tenant.id).eq("is_active", true),
  ]);
  const today = (daily?.[0] ?? {
    page_views: 0,
    unique_visitors: 0,
    product_views: 0,
    link_clicks: 0,
  }) as Daily;
  const menu = (products ?? []) as Product[];
  const name = user.user_metadata.name?.split(" ")[0] ?? "Merchant";
  const chartData = [...(daily ?? [])].reverse() as Daily[];
  const maxViews = Math.max(...chartData.map((item) => item.page_views), 1);
  const setupItems = [
    { label: "Profil bisnis", done: Boolean(tenant.description || tenant.business_type), href: "/dashboard/settings" },
    { label: "Menu pertama", done: menu.length > 0, href: "/dashboard/menu" },
    { label: "Link WhatsApp", done: Boolean(tenant.whatsapp), href: "/dashboard/settings" },
    { label: "Publikasikan halaman", done: tenant.is_published, href: "/dashboard/publish" },
  ];
  const setupProgress = Math.round((setupItems.filter((item) => item.done).length / setupItems.length) * 100);
  const metrics = [
    ["Kunjungan hari ini", today.page_views, "Page views", Activity],
    ["Pengunjung unik", today.unique_visitors, "Hari ini", Activity],
    [
      "Menu dilihat",
      today.product_views,
      `${menu.filter((item) => item.is_active).length} menu aktif`,
      MenuSquare,
    ],
    ["Link diklik", today.link_clicks, `${links?.length ?? 0} link aktif`, Link2],
  ] as const;
  const card = "rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6";
  return (
    <DashboardMotion><DashboardShell tenant={tenant} active="dashboard" title="Ringkasan">
      <section data-dashboard-reveal className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-[.12em]">
            <Sparkles size={14} />
            RINGKASAN BISNIS
          </p>
          <h1 className="display-font text-3xl font-black sm:text-4xl">Halo, {name}.</h1>
          <p className="text-muted mt-2 text-sm">
            Lihat perkembangan <b>{tenant.name}</b> dan lanjutkan menyiapkan katalogmu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/menu" className="border-line hidden items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-extrabold sm:inline-flex"><Zap size={14} className="text-brand" /> Tambah menu</Link>
        <span
          className={`w-fit rounded-full px-3 py-2 text-xs font-extrabold ${tenant.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
        >
          ● {tenant.is_published ? "Halaman publik" : "Masih draft"}
        </span></div>
      </section>
      <section data-dashboard-reveal className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(([label, value, note, Icon]) => (
          <article
            key={label}
            className="border-line rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <small className="text-muted text-xs">{label}</small>
            <strong className="display-font my-3 block text-3xl font-black">{value}</strong>
            <span className="text-muted flex items-center gap-1 text-[10px]">
              <Icon size={13} className="text-brand" />
              {note}
            </span>
          </article>
        ))}
      </section>
      <section data-dashboard-reveal className="mb-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className={card + " xl:col-span-1"}>
          <header className="mb-5 flex items-start justify-between"><div><p className="text-brand mb-1 text-[10px] font-black tracking-[.12em]">PERFORMA 7 HARI</p><h2 className="display-font text-xl font-black">Kunjungan storefront</h2></div><span className="bg-emerald-50 text-emerald-700 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"><TrendingUp size={12} /> Live insight</span></header>
          {chartData.length ? <div className="flex h-36 items-end gap-2 sm:gap-3">{chartData.map((item) => <div className="group flex h-full flex-1 flex-col items-center justify-end gap-2" key={item.event_date}><div className="relative flex w-full flex-1 items-end"><div className="bg-brand/80 group-hover:bg-brand w-full rounded-t-lg transition-all" style={{ height: `${Math.max((item.page_views / maxViews) * 100, 8)}%` }}><span className="bg-charcoal absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md px-2 py-1 text-[9px] text-white group-hover:block">{item.page_views}</span></div></div><span className="text-muted text-[9px]">{new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(new Date(item.event_date))}</span></div>)}</div> : <div className="border-line text-muted grid h-36 place-items-center rounded-xl border border-dashed text-center text-xs">Belum ada data kunjungan.<br />Bagikan halamanmu untuk mulai mengumpulkan insight.</div>}
          <div className="border-line mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center"><div><b className="block text-lg">{chartData.reduce((sum, item) => sum + item.page_views, 0)}</b><span className="text-muted text-[10px]">Total view</span></div><div><b className="block text-lg">{chartData.reduce((sum, item) => sum + item.unique_visitors, 0)}</b><span className="text-muted text-[10px]">Pengunjung</span></div><div><b className="block text-lg">{chartData.reduce((sum, item) => sum + item.product_views, 0)}</b><span className="text-muted text-[10px]">Menu dilihat</span></div></div>
        </article>
        <article className={card}>
          <header className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-brand mb-1 text-[10px] font-black tracking-[.12em]">
                LANGKAH BERIKUTNYA
              </p>
              <h2 className="display-font text-xl font-black">Siapkan halamanmu</h2>
            </div>
            <ArrowUpRight className="text-brand" />
          </header>
          <div className="grid gap-2">
            {[
              [
                "01",
                "Buat kategori menu",
                "Kelompokkan produk agar mudah dicari.",
                "/dashboard/categories",
              ],
              [
                "02",
                "Tambah menu pertama",
                "Masukkan produk, harga, dan promo.",
                "/dashboard/menu",
              ],
              [
                "03",
                "Publikasikan halaman",
                "Bagikan link setelah katalog siap.",
                "/dashboard/publish",
              ],
            ].map(([number, title, note, href]) => (
              <Link
                key={number}
                href={href}
                className="border-line hover:border-brand/30 flex items-center gap-3 rounded-xl border p-3 transition hover:bg-orange-50/40"
              >
                <i className="text-brand grid size-8 place-items-center rounded-lg bg-orange-50 text-[10px] font-black not-italic">
                  {number}
                </i>
                <div className="min-w-0 flex-1">
                  <b className="block text-sm">{title}</b>
                  <span className="text-muted text-xs">{note}</span>
                </div>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </article>
        <article className="bg-charcoal relative overflow-hidden rounded-2xl p-6 text-white shadow-sm">
          <QrCode className="absolute top-5 right-5 text-[#ff9c79]" />
          <p className="mb-2 text-[10px] font-black tracking-[.12em] text-[#ff9c79]">
            ALAMAT HALAMAN
          </p>
          <h2 className="display-font max-w-[85%] text-xl font-black break-all sm:text-2xl">
            www.digimenu.my.id/store/
            <em className="text-[#ff9c79] not-italic">{tenant.slug}</em>
          </h2>
          <p className="my-4 max-w-xs text-xs leading-5 text-white/60">
            {tenant.is_published
              ? "Halaman ini sudah dapat dibuka pelanggan."
              : "Halaman belum terlihat oleh pelanggan."}
          </p>
          <div className="flex gap-2">
            <Link
              className="bg-brand rounded-xl px-4 py-2.5 text-xs font-extrabold"
              href="/dashboard/publish"
            >
              {tenant.is_published ? "Kelola publikasi" : "Publikasikan"}
            </Link>
            <Link
              className="grid size-10 place-items-center rounded-xl bg-white/10"
              href={publicStoreUrl(tenant.slug)}
              target="_blank"
            >
              <ExternalLink size={16} />
            </Link>
          </div>
        </article>
      </section>
      <section data-dashboard-reveal className="mb-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <article className={card}>
          <header className="mb-4 flex items-start justify-between"><div><p className="text-brand mb-1 text-[10px] font-black tracking-[.12em]">SETUP SCORE</p><h2 className="display-font text-xl font-black">Siap untuk dibagikan</h2></div><b className="text-brand text-2xl">{setupProgress}%</b></header>
          <div className="bg-line h-2 overflow-hidden rounded-full"><div className="bg-brand h-full rounded-full transition-all" style={{ width: `${setupProgress}%` }} /></div>
          <div className="mt-4 grid gap-2">{setupItems.map((item) => <Link className="flex items-center gap-2 rounded-lg py-1 text-xs hover:bg-orange-50" href={item.href} key={item.label}>{item.done ? <CheckCircle2 size={15} className="text-emerald-600" /> : <span className="border-line size-[15px] rounded-full border" />}<span className={item.done ? "text-muted line-through" : "font-bold"}>{item.label}</span>{!item.done && <ArrowUpRight size={13} className="text-brand ml-auto" />}</Link>)}</div>
        </article>
        <article className="border-brand/20 relative overflow-hidden rounded-2xl border bg-[#fff4ed] p-6"><div className="relative z-10"><p className="text-brand mb-1 text-[10px] font-black tracking-[.12em]">QUICK WIN</p><h2 className="display-font max-w-md text-2xl font-black">Buat satu menu unggulan hari ini.</h2><p className="text-muted mt-2 max-w-md text-sm leading-6">Menu dengan foto, harga promo, dan status tersedia biasanya lebih cepat dipahami pelanggan.</p><Link href="/dashboard/menu" className={"bg-brand mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold text-white"}>Tambah menu unggulan <ArrowRight size={14} /></Link></div><Sparkles className="text-brand/20 absolute -right-2 -bottom-6 size-36" /></article>
      </section>
      <section className={card}>
        <header className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-brand mb-1 text-[10px] font-black tracking-[.12em]">KATALOG</p>
            <h2 className="display-font text-xl font-black">Menu terbaru</h2>
          </div>
          <Link
            className="text-brand flex items-center gap-1 text-xs font-extrabold"
            href="/dashboard/menu"
          >
            Kelola <ArrowUpRight size={15} />
          </Link>
        </header>
        {menu.length ? (
          <div>
            {menu.map((item, index) => (
              <div key={item.id} className="border-line flex items-center gap-3 border-t py-3">
                <span className="w-5 text-[10px] font-black text-[#aaa299]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <i className="text-brand grid size-9 place-items-center rounded-lg bg-orange-50 text-sm font-black not-italic">
                  {item.name[0]}
                </i>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-sm">{item.name}</b>
                  <small className="text-muted text-xs">
                    {item.is_active ? (item.is_available ? "Tersedia" : "Habis") : "Disembunyikan"}
                  </small>
                </div>
                <strong className="text-xs">Rp{item.discount_price ?? item.price}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-line text-muted rounded-xl border border-dashed p-8 text-center text-sm">
            <MenuSquare className="mx-auto mb-2" />
            <p>Belum ada menu.</p>
            <Link className="text-brand mt-2 inline-block font-extrabold" href="/dashboard/menu">
              Tambah menu
            </Link>
          </div>
        )}
      </section>
    </DashboardShell></DashboardMotion>
  );
}
