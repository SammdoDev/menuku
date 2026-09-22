"use client";

import { ImagePlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { GlobalAutocomplete, GlobalInput, GlobalTextarea, NumericInput, SubmitButton } from "../../../components/ui/form-controls";
import { createProductAction } from "../actions";
import styles from "./product-form.module.css";

type Category = { id: string; name: string };

export default function ProductForm({ categories, slug }: { categories: Category[]; slug: string }) {
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
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Gambar belum dapat diunggah.");
      setImageUrl(data.url);
      setStatus("Foto menu siap dipakai.");
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "Gambar belum dapat diunggah.");
    } finally {
      setUploading(false);
    }
  }

  const options = [{ value: "", label: "Tanpa kategori" }, ...categories.map(category => ({ value: category.id, label: category.name }))];

  return <form className={styles.form} action={createProductAction}>
    <GlobalInput type="hidden" name="imageUrl" value={imageUrl} />
    <label className={styles.imageField} aria-busy={uploading}>
      {imageUrl ? <img src={imageUrl} alt="Preview produk" /> : <span><ImagePlus size={20} /> Tambahkan foto produk</span>}
      <GlobalInput type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => { const file = event.currentTarget.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} />
      {uploading && <em><LoaderCircle size={14} /> Mengunggah gambar…</em>}
    </label>
    {status && <p className={imageUrl ? styles.success : styles.error}>{status}</p>}
    <label>Nama menu<GlobalInput name="name" placeholder="Contoh: Kopi Susu Aren" required /></label>
    <label>Kategori<GlobalAutocomplete name="categoryId" defaultValue="" options={options} /></label>
    <label>Deskripsi <span>(opsional)</span><GlobalTextarea name="description" placeholder="Ceritakan menu ini secara singkat" /></label>
    <label>Harga normal<NumericInput name="price" placeholder="28000" required /></label>
    <label>Harga promo <span>(opsional)</span><NumericInput name="discountPrice" placeholder="24000" /></label>
    <label className={styles.check}><GlobalInput name="featured" type="checkbox" />Tandai sebagai rekomendasi</label>
    <SubmitButton className={styles.submit} pendingLabel="Menambahkan menu..." disabled={uploading}>Simpan menu</SubmitButton>
  </form>;
}
