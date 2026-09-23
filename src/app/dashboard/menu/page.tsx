import { MenuSquare, PackagePlus } from "lucide-react";
import DashboardShell from "../../../components/dashboard-shell";
import { GlobalInput } from "../../../components/ui/form-controls";
import { getCurrentMerchant } from "../../../lib/merchant";
import { deleteProductAction, toggleProductAction } from "../actions";
import ProductEditButton from "./product-edit-button";
import ProductForm from "./product-form";
import AuthToast from "../../(auth)/auth-toast";

type Props = { searchParams: Promise<{ error?: string }> };
export default async function MenuPage({ searchParams }: Props) {
  const { tenant, supabase } = await getCurrentMerchant();
  if (!tenant) return null;
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,is_active")
      .eq("tenant_id", tenant.id)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id,name,description,price,discount_price,image_url,is_active,is_available,is_featured,category_id",
      )
      .eq("tenant_id", tenant.id)
      .order("sort_order"),
  ]);
  const categoryName = new Map((categories ?? []).map((category) => [category.id, category.name]));
  const { error } = await searchParams;
  const card = "rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6";
  return (
    <DashboardShell tenant={tenant} active="menu" title="Menu">
      <header className="mb-7">
        <h1 className="display-font text-3xl font-black">Menu produk</h1>
        <p className="text-muted mt-2 text-sm">
          Tambahkan menu yang tampil di halaman publik bisnismu.
        </p>
      </header>
      <AuthToast error={error} />
      <div className="grid items-start gap-5 xl:grid-cols-[380px_1fr]">
        <article className={card}>
          <h2 className="display-font text-xl font-black">Tambah menu</h2>
          <p className="text-muted mt-1 mb-5 text-xs">
            Upload foto, lalu lengkapi detail menu terbaikmu.
          </p>
          <ProductForm
            categories={(categories ?? []).filter((category) => category.is_active)}
            slug={tenant.slug}
          />
        </article>
        <article className={card}>
          <h2 className="display-font text-xl font-black">Daftar menu</h2>
          <p className="text-muted mt-1 mb-5 text-xs">{products?.length ?? 0} menu tersimpan</p>
          {products?.length ? (
            <div className="grid gap-2">
              {products.map((product) => (
                <div
                  className="border-line flex flex-wrap items-start gap-3 rounded-xl border p-3 sm:flex-nowrap sm:items-center"
                  key={product.id}
                >
                  <span
                    className="text-brand grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 bg-cover bg-center"
                    style={
                      product.image_url
                        ? { backgroundImage: `url(${product.image_url})` }
                        : undefined
                    }
                  >
                    {!product.image_url && <MenuSquare size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm">
                      {product.name}
                      {product.is_featured ? " · Rekomendasi" : ""}
                    </b>
                    <small className="text-muted block truncate text-xs">
                      {categoryName.get(product.category_id) || "Tanpa kategori"} · Rp
                      {product.discount_price ?? product.price}
                    </small>
                    <span
                      className={`text-[10px] font-extrabold ${product.is_active && product.is_available ? "text-emerald-700" : "text-amber-700"}`}
                    >
                      {!product.is_active
                        ? "Disembunyikan"
                        : product.is_available
                          ? "Tersedia"
                          : "Habis"}
                    </span>
                  </div>
                  <div className="ml-14 flex w-full flex-wrap gap-1.5 sm:ml-0 sm:w-auto">
                    <ProductEditButton
                      product={product}
                      categories={(categories ?? []).map((category) => ({
                        id: category.id,
                        name: category.name,
                      }))}
                      slug={tenant.slug}
                    />
                    {[
                      [
                        toggleProductAction,
                        "is_available",
                        String(product.is_available),
                        product.is_available ? "Tandai habis" : "Tersedia",
                      ],
                      [
                        toggleProductAction,
                        "is_active",
                        String(product.is_active),
                        product.is_active ? "Sembunyikan" : "Tampilkan",
                      ],
                    ].map(([action, field, value, label]) => (
                      <form action={action as typeof toggleProductAction} key={field as string}>
                        <GlobalInput type="hidden" name="id" value={product.id} />
                        <GlobalInput type="hidden" name="field" value={field as string} />
                        <GlobalInput type="hidden" name="value" value={value as string} />
                        <button className="border-line rounded-lg border px-2.5 py-2 text-[10px] font-bold">
                          {label as string}
                        </button>
                      </form>
                    ))}
                    <form action={deleteProductAction}>
                      <GlobalInput type="hidden" name="id" value={product.id} />
                      <button className="rounded-lg border border-red-200 px-2.5 py-2 text-[10px] font-bold text-red-600">
                        Hapus
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-line text-muted rounded-xl border border-dashed p-10 text-center text-sm">
              <PackagePlus className="mx-auto mb-2" />
              <p>Belum ada menu.</p>
            </div>
          )}
        </article>
      </div>
    </DashboardShell>
  );
}
