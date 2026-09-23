"use client";

import { Camera, ImagePlus, LoaderCircle } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import {
  GlobalAutocomplete,
  GlobalInput,
  GlobalTextarea,
  SubmitButton,
} from "../../components/ui/form-controls";
import { createTenantAction } from "./actions";
import { MAX_IMAGE_SIZE, optimizeImage, readImageUploadResponse } from "../../lib/image-upload";
import { normalizeImageUrl } from "../../lib/image-url";
import { PUBLIC_SITE_URL } from "../../lib/site";

type UploadKind = "logo" | "banner";
const businessTypes = [
  "Kedai kopi",
  "Restoran",
  "Warung makan",
  "Bakery",
  "Food truck",
  "Hotel atau penginapan",
  "Home business",
].map((value) => ({ value, label: value }));

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
      body.set("file", await optimizeImage(file));
      body.set("tenantSlug", slug || "draft");
      body.set("kind", kind);
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = await readImageUploadResponse(response);
      if (!response.ok || !data.url) throw new Error(data.error || "Upload gambar gagal.");
      if (kind === "logo") setLogo(data.url);
      else setBanner(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gambar gagal.");
    } finally {
      setUploading(null);
    }
  }
  function selectFile(event: ChangeEvent<HTMLInputElement>, kind: UploadKind) {
    const file = event.currentTarget.files?.[0];
    if (file && file.size > MAX_IMAGE_SIZE) setError("Ukuran gambar maksimal 4 MB.");
    else if (file) void upload(file, kind);
    event.currentTarget.value = "";
  }
  const label = "grid gap-2 text-sm font-bold";
  return (
    <form className="grid gap-6" action={createTenantAction}>
      <section className="border-line rounded-2xl border bg-[#fbfaf8] p-3 sm:p-4">
        <p className="text-brand mb-3 text-[10px] font-black tracking-[.12em]">IDENTITAS VISUAL</p>
        <div
          className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#2d2924] to-[#665849] bg-cover bg-center"
          style={banner ? { backgroundImage: `url("${banner}")` } : undefined}
        >
          {banner && (
            <img
              src={normalizeImageUrl(banner)}
              alt="Preview background"
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-extrabold text-[#4f4942]">
            {uploading === "banner" ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <ImagePlus size={16} />
            )}{" "}
            {uploading === "banner" ? "Mengunggah..." : "Upload background"}
            <b className="border-line text-muted hidden place-items-center border-r px-3 text-xs sm:grid">
              {PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}/store/
            </b>
            <GlobalInput
              className="hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={Boolean(uploading)}
              onChange={(event) => selectFile(event, "banner")}
            />
          </label>
        </div>
        <div className="-mt-7 ml-2 flex items-center gap-3">
          <div className="bg-brand relative grid size-[68px] shrink-0 place-items-center rounded-2xl border-4 border-white text-2xl font-black text-white">
            {logo ? (
              <img className="size-full rounded-[13px] object-cover" src={logo} alt="Logo bisnis" />
            ) : (
              "m"
            )}
            <label className="bg-charcoal absolute -right-2 -bottom-2 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-white text-white shadow-lg">
              {uploading === "logo" ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Camera size={15} />
              )}
              <GlobalInput
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={Boolean(uploading)}
                onChange={(event) => selectFile(event, "logo")}
              />
            </label>
          </div>
          <div className="pt-7">
            <b className="block text-xs">
              {uploading === "logo" ? "Mengunggah foto profil..." : "Foto profil bisnis"}
            </b>
            <small className="text-muted text-[10px]">JPG, PNG, WebP · maks. 5 MB</small>
          </div>
        </div>
        <GlobalInput type="hidden" name="logoUrl" value={logo} />
        <GlobalInput type="hidden" name="bannerUrl" value={banner} />
        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</div>}
      </section>
      <section className="grid gap-4">
        <label className={label}>
          Nama bisnis
          <GlobalInput name="name" placeholder="Contoh: Kopi Temu" required minLength={2} />
        </label>
        <div className={label}>
          <label htmlFor="business-type">Jenis bisnis</label>
          <GlobalAutocomplete
            id="business-type"
            name="businessType"
            defaultValue=""
            options={[{ value: "", label: "Pilih jenis bisnis", disabled: true }, ...businessTypes]}
          />
        </div>
        <label className={label}>
          Alamat halaman
          <div className="border-line focus-within:border-brand/60 focus-within:ring-brand/10 flex overflow-hidden rounded-xl border focus-within:ring-4">
            <GlobalInput
              className="rounded-none border-0 focus:ring-0"
              name="slug"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="kopitemu"
              required
              minLength={3}
              maxLength={30}
            />
          </div>
        </label>
        <label className={label}>
          Deskripsi singkat <span className="text-muted font-normal">(opsional)</span>
          <GlobalTextarea
            name="description"
            placeholder="Contoh: Kopi, pastry, dan ruang untuk bertemu."
            maxLength={300}
          />
        </label>
        <label className={label}>
          Nomor WhatsApp <span className="text-muted font-normal">(opsional)</span>
          <GlobalInput name="whatsapp" inputMode="tel" placeholder="Contoh: 081234567890" />
        </label>
      </section>
      <SubmitButton pendingLabel="Membuat halaman..." disabled={Boolean(uploading)}>
        Lanjut ke menu
      </SubmitButton>
    </form>
  );
}
