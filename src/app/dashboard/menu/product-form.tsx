"use client";

import { ImagePlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import {
  GlobalAutocomplete,
  GlobalInput,
  GlobalTextarea,
  NumericInput,
  SubmitButton,
} from "../../../components/ui/form-controls";
import { createProductAction } from "../actions";

type Category = { id: string; name: string };
export default function ProductForm({
  categories,
  slug,
}: {
  categories: Category[];
  slug: string;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    setStatus("");
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("tenantSlug", slug);
      body.set("kind", "product");
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Gambar belum dapat diunggah.");
      setImageUrl(data.url);
      setStatus("Foto menu siap dipakai.");
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "Gambar belum dapat diunggah.");
    } finally {
      setUploading(false);
    }
  }
  const field = "grid gap-2 text-sm font-bold";
  const options = [
    { value: "", label: "Tanpa kategori" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];
  return (
    <form className="grid gap-4" action={createProductAction}>
      <GlobalInput type="hidden" name="imageUrl" value={imageUrl} />
      <label className="border-brand/30 text-brand relative grid min-h-36 cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed bg-orange-50/50">
        {imageUrl ? (
          <img className="h-40 w-full object-cover" src={imageUrl} alt="Preview produk" />
        ) : (
          <span className="flex items-center gap-2 text-sm font-extrabold">
            <ImagePlus size={20} />
            Tambahkan foto produk
          </span>
        )}
        <GlobalInput
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void upload(file);
            event.currentTarget.value = "";
          }}
        />
        {uploading && (
          <em className="bg-charcoal/90 absolute right-2 bottom-2 flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-white not-italic">
            <LoaderCircle size={14} className="animate-spin" />
            Mengunggah…
          </em>
        )}
      </label>
      {status && (
        <p
          className={`rounded-xl p-3 text-xs ${imageUrl ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
        >
          {status}
        </p>
      )}
      <label className={field}>
        Nama menu
        <GlobalInput name="name" placeholder="Contoh: Kopi Susu Aren" required />
      </label>
      <div className={field}>
        <label htmlFor="product-category">Kategori</label>
        <GlobalAutocomplete
          id="product-category"
          name="categoryId"
          defaultValue=""
          options={options}
        />
      </div>
      <label className={field}>
        Deskripsi <span className="text-muted font-normal">(opsional)</span>
        <GlobalTextarea name="description" placeholder="Ceritakan menu ini secara singkat" />
      </label>
      <label className={field}>
        Harga normal
        <NumericInput name="price" placeholder="28000" required />
      </label>
      <label className={field}>
        Harga promo <span className="text-muted font-normal">(opsional)</span>
        <NumericInput name="discountPrice" placeholder="24000" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <GlobalInput className="accent-brand size-4" name="featured" type="checkbox" />
        Tandai sebagai rekomendasi
      </label>
      <SubmitButton pendingLabel="Menambahkan menu..." disabled={uploading}>
        Simpan menu
      </SubmitButton>
    </form>
  );
}
