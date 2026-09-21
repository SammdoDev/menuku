"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
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
      body.set("image", file);
      body.set("tenantSlug", slug);
      body.set("kind", "product");
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gambar belum dapat diunggah.");
      setImageUrl(data.url);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gambar belum dapat diunggah.");
    } finally {
      setUploading(false);
    }
  }

  return <form className={styles.form} action={createProductAction}>
    <input type="hidden" name="imageUrl" value={imageUrl} />
    <label className={styles.imageField}>
      {imageUrl ? <img src={imageUrl} alt="Preview produk" /> : <span><ImagePlus size={20} /> Tambahkan foto produk</span>}
      <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => {
        const file = event.currentTarget.files?.[0];
        if (file) upload(file);
      }} />
      {uploading && <em><LoaderCircle size={14} /> Mengunggah gambar…</em>}
    </label>
    {status && <p className={styles.error}>{status}</p>}
    <label>Nama menu<input name="name" placeholder="Contoh: Kopi Susu Aren" required /></label>
    <label>Kategori<select name="categoryId" defaultValue=""><option value="">Tanpa kategori</option>{categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
    <label>Deskripsi <span>(opsional)</span><textarea name="description" placeholder="Ceritakan menu ini secara singkat" /></label>
    <label>Harga normal<input name="price" type="number" min="0" placeholder="28000" required /></label>
    <label>Harga promo <span>(opsional)</span><input name="discountPrice" type="number" min="0" placeholder="24000" /></label>
    <label className={styles.check}><input name="featured" type="checkbox" />Tandai sebagai rekomendasi</label>
    <button className={styles.submit} type="submit" disabled={uploading}>{uploading ? "Menunggu upload…" : "Simpan menu"}</button>
  </form>;
}
