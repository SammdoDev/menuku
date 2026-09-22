"use client";

import { Camera, ImagePlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { GlobalAutocomplete, GlobalInput, GlobalTextarea, SubmitButton } from "../../components/ui/form-controls";
import { createTenantAction } from "./actions";
import styles from "./onboarding-form.module.css";

type UploadKind = "logo" | "banner";

const businessTypes = [
  { value: "", label: "Pilih jenis bisnis", disabled: true },
  { value: "Kedai kopi", label: "Kedai kopi" },
  { value: "Restoran", label: "Restoran" },
  { value: "Warung makan", label: "Warung makan" },
  { value: "Bakery", label: "Bakery" },
  { value: "Food truck", label: "Food truck" },
  { value: "Hotel atau penginapan", label: "Hotel atau penginapan" },
  { value: "Home business", label: "Home business" },
];

export default function OnboardingForm() {
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<UploadKind | null>(null);

  async function upload(file: File, kind: UploadKind) {
    setError("");
    setUploading(kind);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("tenantSlug", slug || "draft");
      body.set("kind", kind);
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Upload gambar gagal.");
      if (kind === "logo") setLogo(data.url);
      else setBanner(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gambar gagal.");
    } finally {
      setUploading(null);
    }
  }

  function selectFile(event: React.ChangeEvent<HTMLInputElement>, kind: UploadKind) {
    const file = event.currentTarget.files?.[0];
    if (file) void upload(file, kind);
    event.currentTarget.value = "";
  }

  return <form className={styles.form} action={createTenantAction}>
    <section className={styles.identity}>
      <p>IDENTITAS VISUAL</p>
      <div className={styles.banner} style={banner ? { backgroundImage: `url(${banner})` } : undefined}>
        <label className={styles.bannerPicker}>
          <ImagePlus size={16} />{uploading === "banner" ? "Mengunggah..." : "Upload background"}
          <GlobalInput type="file" accept="image/jpeg,image/png,image/webp" disabled={Boolean(uploading)} onChange={event => selectFile(event, "banner")} />
        </label>
      </div>
      <div className={styles.logoRow}>
        <div className={styles.logo}>
          {logo ? <img src={logo} alt="Logo bisnis" /> : <span>m</span>}
          <label className={styles.logoPicker} aria-label="Upload foto profil bisnis">
            {uploading === "logo" ? <LoaderCircle size={15} /> : <Camera size={15} />}
            <GlobalInput type="file" accept="image/jpeg,image/png,image/webp" disabled={Boolean(uploading)} onChange={event => selectFile(event, "logo")} />
          </label>
        </div>
        <div><b>{uploading === "logo" ? "Mengunggah foto profil..." : "Foto profil bisnis"}</b><small>Logo JPG, PNG, WebP · maks. 5 MB</small></div>
      </div>
      <GlobalInput type="hidden" name="logoUrl" value={logo} />
      <GlobalInput type="hidden" name="bannerUrl" value={banner} />
      {error && <div className={styles.error}>{error}</div>}
    </section>
    <section className={styles.fields}>
      <label>Nama bisnis<GlobalInput name="name" placeholder="Contoh: Kopi Temu" required minLength={2} /></label>
      <label>Jenis bisnis<GlobalAutocomplete name="businessType" defaultValue="" options={businessTypes} /></label>
      <label>Alamat halaman<div className={styles.slug}><GlobalInput name="slug" value={slug} onChange={event => setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="kopitemu" required minLength={3} maxLength={30} /><b>.menuku.id</b></div><small>Isi alamat sebelum upload agar nama file ImgBB memakai slug merchant.</small></label>
      <label>Deskripsi singkat <span>(opsional)</span><GlobalTextarea name="description" placeholder="Contoh: Kopi, pastry, dan ruang untuk bertemu." maxLength={300} /></label>
      <label>Nomor WhatsApp <span>(opsional)</span><GlobalInput name="whatsapp" inputMode="tel" placeholder="Contoh: 081234567890" /></label>
    </section>
    <SubmitButton className={styles.submit} pendingLabel="Membuat halaman..." disabled={Boolean(uploading)}>Lanjut ke menu</SubmitButton>
  </form>;
}
