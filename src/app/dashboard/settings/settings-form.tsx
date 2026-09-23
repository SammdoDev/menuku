"use client";

import { Camera, Check, ImagePlus, LoaderCircle, Palette, Trash2 } from "lucide-react";
import { useState, type ChangeEvent, type CSSProperties } from "react";
import type { Tenant } from "../../../lib/merchant";
import {
  GlobalAutocomplete,
  GlobalInput,
  GlobalTextarea,
  SubmitButton,
} from "../../../components/ui/form-controls";
import { updateStoreSettingsAction } from "../actions";
import { MAX_IMAGE_SIZE, optimizeImage, readImageUploadResponse } from "../../../lib/image-upload";
import { normalizeImageUrl } from "../../../lib/image-url";

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

const colorPresets = [
  ["Terracotta", "#FF6534", "#F7F6F2"],
  ["Forest", "#19715B", "#F1F6F3"],
  ["Berry", "#A23B72", "#FBF3F7"],
  ["Ocean", "#2563EB", "#F2F6FC"],
  ["Espresso", "#704214", "#F7F2EC"],
] as const;

export default function SettingsForm({
  tenant,
  siteOrigin,
}: {
  tenant: Tenant;
  siteOrigin: string;
}) {
  const [logo, setLogo] = useState(normalizeImageUrl(tenant.logo_url));
  const [banner, setBanner] = useState(normalizeImageUrl(tenant.banner_url));
  const [slug, setSlug] = useState(tenant.slug);
  const [primaryColor, setPrimaryColor] = useState(tenant.primary_color || "#FF6534");
  const [backgroundColor, setBackgroundColor] = useState(tenant.background_color || "#F7F6F2");
  const [layout, setLayout] = useState(tenant.layout_type === "list" ? "list" : "grid");
  const [uploading, setUploading] = useState<UploadKind | null>(null);
  const [uploadError, setUploadError] = useState("");

  async function upload(file: File, kind: UploadKind) {
    setUploadError("");
    setUploading(kind);
    try {
      const body = new FormData();
      body.set("file", await optimizeImage(file));
      body.set("tenantSlug", slug || tenant.slug);
      body.set("kind", kind);
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = await readImageUploadResponse(response);
      if (!response.ok || !data.url) throw new Error(data.error || "Upload gambar gagal.");
      if (kind === "logo") setLogo(data.url);
      else setBanner(data.url);
    } catch (caught) {
      setUploadError(caught instanceof Error ? caught.message : "Upload gambar gagal.");
    } finally {
      setUploading(null);
    }
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>, kind: UploadKind) {
    const file = event.currentTarget.files?.[0];
    if (file && file.size > MAX_IMAGE_SIZE) setUploadError("Ukuran gambar maksimal 4 MB.");
    else if (file) void upload(file, kind);
    event.currentTarget.value = "";
  }

  const field = "grid gap-2 text-sm font-bold";
  const card = "rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6";
  const availableBusinessTypes = tenant.business_type
    ? businessTypes.some((item) => item.value === tenant.business_type)
      ? businessTypes
      : [{ value: tenant.business_type, label: tenant.business_type }, ...businessTypes]
    : businessTypes;
  const businessOptions = [
    { value: "", label: "Pilih jenis bisnis", disabled: true },
    ...availableBusinessTypes,
  ];
  const previewStyle = {
    "--color-brand": primaryColor,
    backgroundColor,
  } as CSSProperties;

  return (
    <form
      action={updateStoreSettingsAction}
      className="grid items-start gap-5 xl:grid-cols-[1.15fr_.85fr]"
    >
      <div className="grid gap-5">
        <section className={card}>
          <div className="mb-5">
            <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
              Profil bisnis
            </p>
            <h2 className="display-font mt-1 text-xl font-black">Identitas halaman</h2>
            <p className="text-muted mt-1 text-xs">
              Foto profil dan background sekarang dapat diganti dari sini.
            </p>
          </div>

          <div
            className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d2924] to-[#665849] bg-cover bg-center"
            style={banner ? { backgroundImage: `url("${banner}")` } : undefined}
          >
            {banner && <span className="absolute inset-0 bg-black/20" aria-hidden="true" />}
            {banner && (
              <img
                src={banner}
                alt="Preview background"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-extrabold text-[#4f4942] shadow-lg">
              {uploading === "banner" ? (
                <LoaderCircle size={17} className="text-brand animate-spin" />
              ) : (
                <ImagePlus size={17} className="text-brand" />
              )}
              {uploading === "banner"
                ? "Mengunggah..."
                : banner
                  ? "Ganti background"
                  : "Upload background"}
              <GlobalInput
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={Boolean(uploading)}
                onChange={(event) => selectFile(event, "banner")}
              />
            </label>
            {banner && !uploading && (
              <button
                type="button"
                onClick={() => setBanner("")}
                className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur"
                aria-label="Hapus background"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="-mt-9 ml-4 flex items-end gap-4">
            <div className="bg-brand relative grid size-24 shrink-0 place-items-center overflow-visible rounded-3xl border-[5px] border-white text-2xl font-black text-white shadow-lg">
              {logo ? (
                <img
                  className="size-full rounded-[19px] object-cover"
                  src={logo}
                  alt="Foto profil"
                />
              ) : (
                tenant.name.slice(0, 2).toUpperCase()
              )}
              <label className="bg-charcoal absolute -right-2 -bottom-2 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-white text-white shadow-lg">
                {uploading === "logo" ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
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
            <div className="flex min-w-0 flex-1 items-center justify-between pb-1">
              <div>
                <b className="block text-sm">Foto profil bisnis</b>
                <small className="text-muted text-xs">JPG, PNG, WebP, maksimal 5 MB</small>
              </div>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo("")}
                  className="text-muted hover:text-brand border-line grid size-9 place-items-center rounded-lg border"
                  aria-label="Hapus foto profil"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
          <GlobalInput type="hidden" name="logoUrl" value={logo} />
          <GlobalInput type="hidden" name="bannerUrl" value={banner} />
          {uploadError && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700" role="alert">
              {uploadError}
            </p>
          )}
        </section>

        <section className={card}>
          <div className="mb-5">
            <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
              Informasi
            </p>
            <h2 className="display-font mt-1 text-xl font-black">Detail bisnis</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={field}>
              Nama bisnis
              <GlobalInput name="name" defaultValue={tenant.name} required maxLength={120} />
            </label>
            <div className={field}>
              <label htmlFor="settings-business-type">Jenis bisnis</label>
              <GlobalAutocomplete
                id="settings-business-type"
                name="businessType"
                defaultValue={tenant.business_type || ""}
                options={businessOptions}
              />
            </div>
            <label className={`${field} sm:col-span-2`}>
              Deskripsi singkat
              <GlobalTextarea
                name="description"
                defaultValue={tenant.description || ""}
                maxLength={300}
                placeholder="Ceritakan bisnis kamu secara singkat"
              />
            </label>
            <label className={field}>
              Nomor WhatsApp
              <GlobalInput
                name="whatsapp"
                inputMode="tel"
                defaultValue={tenant.whatsapp || ""}
                placeholder="081234567890"
              />
            </label>
            <label className={field}>
              Username Instagram
              <GlobalInput
                name="instagram"
                defaultValue={tenant.instagram || ""}
                placeholder="@ruangrasa"
              />
            </label>
            <label className={`${field} sm:col-span-2`}>
              Alamat bisnis
              <GlobalTextarea
                name="address"
                defaultValue={tenant.address || ""}
                placeholder="Alamat yang tampil di halaman publik"
              />
            </label>
            <label className={`${field} sm:col-span-2`}>
              Link Google Maps
              <GlobalInput
                name="mapsUrl"
                type="url"
                defaultValue={tenant.maps_url || ""}
                placeholder="https://maps.google.com/..."
              />
            </label>
          </div>
        </section>

        <section className={card}>
          <div className="mb-5">
            <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
              Alamat halaman
            </p>
            <h2 className="display-font mt-1 text-xl font-black">URL publik</h2>
            <p className="text-muted mt-1 text-xs">
              Mengubah URL membuat link lama tidak dapat digunakan lagi.
            </p>
          </div>
          <label className={field}>
            Slug halaman
            <div className="border-line focus-within:border-brand/60 focus-within:ring-brand/10 flex overflow-hidden rounded-xl border bg-white focus-within:ring-4">
              <span className="text-muted border-line hidden items-center border-r bg-[#faf8f5] px-3 text-xs sm:flex">
                {siteOrigin}/store/
              </span>
              <GlobalInput
                className="rounded-none border-0 focus:ring-0"
                name="slug"
                value={slug}
                onChange={(event) =>
                  setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                required
                minLength={3}
                maxLength={30}
              />
            </div>
          </label>
          <p className="text-muted mt-3 rounded-xl bg-[#f6f3ef] p-3 text-xs break-all">
            URL baru:{" "}
            <b className="text-ink">
              {siteOrigin}/store/{slug || "alamat-bisnis"}
            </b>
          </p>
        </section>
      </div>

      <aside className="grid gap-5 xl:sticky xl:top-24">
        <section className={card}>
          <div className="mb-5 flex items-start gap-3">
            <span className="text-brand grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50">
              <Palette size={19} />
            </span>
            <div>
              <h2 className="display-font text-xl font-black">Tampilan publik</h2>
              <p className="text-muted mt-1 text-xs">
                Warna dan layout langsung dipakai storefront.
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-5 gap-2">
            {colorPresets.map(([name, primary, background]) => {
              const selected = primaryColor === primary && backgroundColor === background;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-label={`Tema ${name}`}
                  onClick={() => {
                    setPrimaryColor(primary);
                    setBackgroundColor(background);
                  }}
                  className={`relative grid aspect-square place-items-center rounded-xl border-2 transition ${selected ? "border-charcoal" : "border-transparent"}`}
                  style={{ backgroundColor: background }}
                >
                  <span className="size-5 rounded-full" style={{ backgroundColor: primary }} />
                  {selected && (
                    <span className="bg-charcoal absolute -top-1 -right-1 grid size-4 place-items-center rounded-full text-white">
                      <Check size={10} strokeWidth={4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className={field}>
              Warna utama
              <div className="flex items-center gap-2">
                <GlobalInput
                  className="h-12 w-16 cursor-pointer p-1"
                  type="color"
                  name="primaryColor"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                />
                <code className="text-muted text-xs font-bold uppercase">{primaryColor}</code>
              </div>
            </label>
            <label className={field}>
              Warna latar
              <div className="flex items-center gap-2">
                <GlobalInput
                  className="h-12 w-16 cursor-pointer p-1"
                  type="color"
                  name="backgroundColor"
                  value={backgroundColor}
                  onChange={(event) => setBackgroundColor(event.target.value)}
                />
                <code className="text-muted text-xs font-bold uppercase">{backgroundColor}</code>
              </div>
            </label>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-bold">Layout menu</p>
            <GlobalInput type="hidden" name="layoutType" value={layout} />
            <div className="grid grid-cols-2 gap-2">
              {[
                ["grid", "Grid", "Kartu 2-3 kolom"],
                ["list", "List", "Baris lebih ringkas"],
              ].map(([value, title, note]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLayout(value)}
                  className={`rounded-xl border p-3 text-left transition ${layout === value ? "border-brand ring-brand/10 bg-orange-50/60 ring-2" : "border-line"}`}
                >
                  <b className="block text-sm">{title}</b>
                  <small className="text-muted text-[10px]">{note}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {[
              ["showPrice", "Tampilkan harga", tenant.show_price],
              ["showAddress", "Tampilkan alamat", tenant.show_address],
              ["showOpeningHours", "Tampilkan info jam buka", tenant.show_opening_hours],
            ].map(([name, label, checked]) => (
              <label
                key={String(name)}
                className="border-line flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-sm font-bold"
              >
                {String(label)}
                <GlobalInput
                  className="accent-brand size-4"
                  type="checkbox"
                  name={String(name)}
                  defaultChecked={Boolean(checked)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-line border-b px-4 py-3">
            <p className="text-muted text-[10px] font-black tracking-[.12em] uppercase">
              Preview singkat
            </p>
          </div>
          <div className="p-3" style={previewStyle}>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div
                className="h-24 bg-gradient-to-br from-[#3a251d] to-[#1a0e09] bg-cover bg-center"
                style={banner ? { backgroundImage: `url(${banner})` } : undefined}
              />
              <div className="flex gap-3 px-4">
                <div className="bg-brand -mt-5 grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-white text-xs font-black text-white">
                  {logo ? (
                    <img className="size-full object-cover" src={logo} alt="" />
                  ) : (
                    tenant.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 py-2">
                  <b className="block truncate text-sm">{tenant.name}</b>
                  <small className="text-muted text-[10px]">Tampilan halaman publik</small>
                </div>
              </div>
              <div
                className={`grid gap-2 p-4 ${layout === "grid" ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {["Menu favorit", "Menu terbaru"].map((item) => (
                  <div key={item} className="border-line rounded-lg border p-2">
                    <span className="mb-2 block h-8 rounded-md bg-[#eee9e3]" />
                    <b className="block text-[9px]">{item}</b>
                    <small className="text-brand text-[8px] font-bold">Rp25.000</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SubmitButton pendingLabel="Menyimpan pengaturan..." disabled={Boolean(uploading)}>
          Simpan semua perubahan
        </SubmitButton>
      </aside>
    </form>
  );
}
