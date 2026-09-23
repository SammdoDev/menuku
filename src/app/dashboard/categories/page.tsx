import { FolderPlus, Layers } from "lucide-react";
import DashboardShell from "../../../components/dashboard-shell";
import { GlobalInput, GlobalTextarea, SubmitButton } from "../../../components/ui/form-controls";
import { getCurrentMerchant } from "../../../lib/merchant";
import { createCategoryAction, deleteCategoryAction, toggleCategoryAction } from "../actions";
import CategoryEditButton from "./category-edit-button";
import AuthToast from "../../(auth)/auth-toast";
import PersistentForm from "../../../components/ui/persistent-form";

type Props = { searchParams: Promise<{ error?: string }> };
export default async function CategoriesPage({ searchParams }: Props) {
  const { tenant, supabase } = await getCurrentMerchant();
  if (!tenant) return null;
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,description,is_active,sort_order")
    .eq("tenant_id", tenant.id)
    .order("sort_order");
  const { error } = await searchParams;
  const card = "rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6";
  return (
    <DashboardShell tenant={tenant} active="categories" title="Kategori">
      <header className="mb-7">
        <h1 className="display-font text-3xl font-black">Kategori menu</h1>
        <p className="text-muted mt-2 text-sm">
          Kelompokkan menu agar pelanggan mudah menemukannya.
        </p>
      </header>
      <AuthToast error={error} />
      <div className="grid items-start gap-5 xl:grid-cols-[380px_1fr]">
        <article className={card}>
          <h2 className="display-font text-xl font-black">Tambah kategori</h2>
          <p className="text-muted mt-1 mb-5 text-xs">
            Buat kategori seperti Kopi, Makanan, atau Dessert.
          </p>
          <PersistentForm
            storageKey="menuku-category-create"
            className="grid gap-4"
            action={createCategoryAction}
          >
            <label className="grid gap-2 text-sm font-bold">
              Nama kategori
              <GlobalInput name="name" placeholder="Contoh: Minuman" required />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Deskripsi <span className="text-muted font-normal">(opsional)</span>
              <GlobalTextarea
                name="description"
                placeholder="Contoh: Kopi, teh, dan minuman segar"
              />
            </label>
            <SubmitButton pendingLabel="Menambahkan kategori...">Simpan kategori</SubmitButton>
          </PersistentForm>
        </article>
        <article className={card}>
          <h2 className="display-font text-xl font-black">Daftar kategori</h2>
          <p className="text-muted mt-1 mb-5 text-xs">
            {categories?.length ?? 0} kategori pada {tenant.name}
          </p>
          {categories?.length ? (
            <div className="grid gap-2">
              {categories.map((category) => (
                <div
                  className="border-line flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:flex-nowrap"
                  key={category.id}
                >
                  <span className="text-brand grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50">
                    <Layers size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{category.name}</b>
                    <small className="text-muted block truncate text-xs">
                      {category.description || "Tanpa deskripsi"}
                    </small>
                    <span
                      className={`text-[10px] font-extrabold ${category.is_active ? "text-emerald-700" : "text-amber-700"}`}
                    >
                      {category.is_active ? "Aktif" : "Disembunyikan"}
                    </span>
                  </div>
                  <div className="ml-13 flex w-full gap-2 sm:ml-0 sm:w-auto">
                    <CategoryEditButton category={category} />
                    <form action={toggleCategoryAction}>
                      <GlobalInput type="hidden" name="id" value={category.id} />
                      <GlobalInput type="hidden" name="active" value={String(category.is_active)} />
                      <button className="border-line rounded-lg border px-3 py-2 text-[10px] font-bold">
                        {category.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </form>
                    <form action={deleteCategoryAction}>
                      <GlobalInput type="hidden" name="id" value={category.id} />
                      <button className="rounded-lg border border-red-200 px-3 py-2 text-[10px] font-bold text-red-600">
                        Hapus
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-line text-muted rounded-xl border border-dashed p-10 text-center text-sm">
              <FolderPlus className="mx-auto mb-2" />
              <p>Belum ada kategori.</p>
            </div>
          )}
        </article>
      </div>
    </DashboardShell>
  );
}
