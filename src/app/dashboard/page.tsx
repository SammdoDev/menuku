import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  ExternalLink,
  Link2,
  MenuSquare,
  QrCode,
  Sparkles,
} from "lucide-react";
import DashboardShell from "../../components/dashboard-shell";
import { getCurrentMerchant } from "../../lib/merchant";

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
    <DashboardShell tenant={tenant} active="dashboard" title="Ringkasan">
      <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        <span
          className={`w-fit rounded-full px-3 py-2 text-xs font-extrabold ${tenant.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
        >
          ● {tenant.is_published ? "Halaman publik" : "Masih draft"}
        </span>
      </section>
      <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
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
      <section className="mb-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
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
          <h2 className="display-font max-w-[85%] text-2xl font-black break-all">
            {tenant.slug}.<em className="text-[#ff9c79] not-italic">menuku.id</em>
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
              href={`/store/${tenant.slug}`}
              target="_blank"
            >
              <ExternalLink size={16} />
            </Link>
          </div>
        </article>
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
    </DashboardShell>
  );
}
