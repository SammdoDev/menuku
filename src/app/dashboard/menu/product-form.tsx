"use client";

import { ImagePlus, LoaderCircle } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import {
  GlobalAutocomplete,
  GlobalInput,
  GlobalTextarea,
  NumericInput,
  SubmitButton,
} from "../../../components/ui/form-controls";
import { createProductAction, updateProductAction } from "../actions";
import { MAX_IMAGE_SIZE, readImageUploadResponse } from "../../../lib/image-upload";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  category_id: string | null;
};
export default function ProductForm({
  categories,
  slug,
  product,
  onCancel,
}: {
  categories: Category[];
  slug: string;
  product?: Product;
  onCancel?: () => void;
}) {
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("tenantSlug", slug);
      body.set("kind", "product");
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = await readImageUploadResponse(response);
      if (!response.ok || !data.url) throw new Error(data.error || "Upload gambar gagal.");
      setImageUrl(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gambar gagal.");
    } finally {
      setUploading(false);
    }
  }
  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file && file.size > MAX_IMAGE_SIZE) setError("Ukuran gambar maksimal 4 MB.");
    else if (file) void upload(file);
    event.currentTarget.value = "";
  }
  const field = "grid gap-2 text-sm font-bold";
  const options = [
    { value: "", label: "Tanpa kategori" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];
  return (
    <form className="grid gap-4" action={product ? updateProductAction : createProductAction}>
      <GlobalInput type="hidden" name="imageUrl" value={imageUrl} />
      {product && <GlobalInput type="hidden" name="id" value={product.id} />}
      <div
        className="border-brand/30 relative flex h-44 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-gradient-to-br from-orange-50 to-[#eee7df] bg-cover bg-center"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        role={imageUrl ? "img" : undefined}
        aria-label={imageUrl ? "Preview foto produk" : undefined}
      >
        {imageUrl && <span className="absolute inset-0 bg-black/20" aria-hidden="true" />}
        <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-extrabold text-[#4f4942] shadow-lg transition hover:bg-white">
          {uploading ? (
            <LoaderCircle size={17} className="text-brand animate-spin" />
          ) : (
            <ImagePlus size={17} className="text-brand" />
          )}
          {uploading ? "Mengunggah..." : imageUrl ? "Ganti foto produk" : "Upload foto produk"}
          <GlobalInput
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={selectFile}
          />
        </label>
        {imageUrl && !uploading && (
          <span className="absolute right-2 bottom-2 rounded-lg bg-emerald-600/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            Foto siap dipakai
          </span>
        )}
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
      <label className={field}>
        Nama menu
        <GlobalInput
          name="name"
          defaultValue={product?.name || ""}
          placeholder="Contoh: Kopi Susu Aren"
          required
        />
      </label>
      <div className={field}>
        <label htmlFor="product-category">Kategori</label>
        <GlobalAutocomplete
          id="product-category"
          name="categoryId"
          defaultValue={product?.category_id || ""}
          options={options}
        />
      </div>
      <label className={field}>
        Deskripsi <span className="text-muted font-normal">(opsional)</span>
        <GlobalTextarea
          name="description"
          defaultValue={product?.description || ""}
          placeholder="Ceritakan menu ini secara singkat"
        />
      </label>
      <label className={field}>
        Harga normal
        <NumericInput
          name="price"
          defaultValue={product?.price || ""}
          placeholder="28000"
          required
        />
      </label>
      <label className={field}>
        Harga promo <span className="text-muted font-normal">(opsional)</span>
        <NumericInput
          name="discountPrice"
          defaultValue={product?.discount_price || ""}
          placeholder="24000"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <GlobalInput
          className="accent-brand size-4"
          name="featured"
          type="checkbox"
          defaultChecked={product?.is_featured || false}
        />
        Tandai sebagai rekomendasi
      </label>
      <div className="flex gap-2">
        <SubmitButton
          pendingLabel={product ? "Menyimpan perubahan..." : "Menambahkan menu..."}
          disabled={uploading}
        >
          {product ? "Simpan perubahan" : "Simpan menu"}
        </SubmitButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border-line min-h-12 rounded-xl border px-4 text-sm font-extrabold"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
