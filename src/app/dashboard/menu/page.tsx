import Link from "next/link";
import { MenuSquare, PackagePlus } from "lucide-react";
import { getCurrentMerchant } from "../../../lib/merchant";
import { deleteProductAction, toggleProductAction } from "../actions";
import ProductForm from "./product-form";
import styles from "../management.module.css";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function MenuPage({ searchParams }: Props) {
  const { tenant, supabase } = await getCurrentMerchant();
  if (!tenant) return null;
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id,name,is_active").eq("tenant_id", tenant.id).order("sort_order"),
    supabase.from("products").select("id,name,description,price,discount_price,image_url,is_active,is_available,is_featured,category_id").eq("tenant_id", tenant.id).order("sort_order"),
  ]);
  const categoryName = new Map((categories ?? []).map(category => [category.id, category.name]));
  const { error } = await searchParams;

  return <main className={styles.page}>
    <header className={styles.top}>
      <Link className={styles.brand} href="/dashboard"><span>m</span>menuku</Link>
      <nav><Link href="/dashboard">Dashboard</Link><Link className={styles.active} href="/dashboard/menu">Menu</Link><Link href="/dashboard/categories">Kategori</Link></nav>
      <Link href={`/store/${tenant.slug}`} target="_blank">Lihat halaman</Link>
    </header>
    <section className={styles.content}>
      <div className={styles.heading}><div><h1 className="display">Menu produk</h1><p>Tambahkan menu yang tampil di halaman publik bisnismu.</p></div></div>
      {error && <p className={styles.notice}>{error}</p>}
      <div className={styles.grid}>
        <article className={styles.formCard}>
          <h2 className="display">Tambah menu</h2>
          <p>Upload foto, lalu lengkapi detail menu terbaikmu.</p>
          <ProductForm categories={(categories ?? []).filter(category => category.is_active)} slug={tenant.slug} />
        </article>
        <article className={styles.listCard}>
          <h2 className="display">Daftar menu</h2>
          <p>{products?.length ?? 0} menu tersimpan</p>
          {products?.length ? <div className={styles.list}>{products.map(product => <div className={styles.item} key={product.id}>
            <span className={styles.itemIcon} style={product.image_url ? { backgroundImage: `url(${product.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>{!product.image_url && <MenuSquare size={18} />}</span>
            <div className={styles.itemInfo}><b>{product.name}{product.is_featured ? " · Rekomendasi" : ""}</b><small>{categoryName.get(product.category_id) || "Tanpa kategori"} · Rp{product.discount_price ?? product.price}</small><span className={product.is_active && product.is_available ? styles.state : styles.inactive}>{!product.is_active ? "Disembunyikan" : product.is_available ? "Tersedia" : "Habis"}</span></div>
            <div className={styles.itemActions}>
              <form action={toggleProductAction}><input type="hidden" name="id" value={product.id} /><input type="hidden" name="field" value="is_available" /><input type="hidden" name="value" value={String(product.is_available)} /><button>{product.is_available ? "Tandai habis" : "Tersedia"}</button></form>
              <form action={toggleProductAction}><input type="hidden" name="id" value={product.id} /><input type="hidden" name="field" value="is_active" /><input type="hidden" name="value" value={String(product.is_active)} /><button>{product.is_active ? "Sembunyikan" : "Tampilkan"}</button></form>
              <form action={deleteProductAction}><input type="hidden" name="id" value={product.id} /><button className={styles.danger}>Hapus</button></form>
            </div>
          </div>)}</div> : <div className={styles.empty}><PackagePlus size={25} /><p>Belum ada menu. Tambahkan produk pertama di form sebelah.</p></div>}
        </article>
      </div>
    </section>
  </main>;
}
