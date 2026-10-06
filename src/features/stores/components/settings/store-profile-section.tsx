"use client";

import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/text-input";
import type { UploadKind } from "../../hooks/use-settings-image-upload";

type StoreProfileSectionProps = {
  name: string;
  logo: string;
  banner: string;
  uploading: UploadKind | null;
  uploadError: string;
  onSelectFile: (event: ChangeEvent<HTMLInputElement>, kind: UploadKind) => void;
  onLogoChange: (url: string) => void;
  onBannerChange: (url: string) => void;
};

function StoreProfileSection({
  name,
  logo,
  banner,
  uploading,
  uploadError,
  onSelectFile,
  onLogoChange,
  onBannerChange,
}: StoreProfileSectionProps) {
  return (
    <section className="border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
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
          <Input
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={Boolean(uploading)}
            onChange={(event) => onSelectFile(event, "banner")}
          />
        </label>
        {banner && !uploading && (
          <button
            type="button"
            onClick={() => onBannerChange("")}
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
            <img className="size-full rounded-[19px] object-cover" src={logo} alt="Foto profil" />
          ) : (
            name.slice(0, 2).toUpperCase()
          )}
          <label className="bg-charcoal absolute -right-2 -bottom-2 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-white text-white shadow-lg">
            {uploading === "logo" ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
            <Input
              className="hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={Boolean(uploading)}
              onChange={(event) => onSelectFile(event, "logo")}
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
              onClick={() => onLogoChange("")}
              className="text-muted hover:text-brand border-line grid size-9 place-items-center rounded-lg border"
              aria-label="Hapus foto profil"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
      <Input type="hidden" name="logoUrl" value={logo} />
      <Input type="hidden" name="bannerUrl" value={banner} />
      {uploadError && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700" role="alert">
          {uploadError}
        </p>
      )}
    </section>
  );
}

export default StoreProfileSection;
