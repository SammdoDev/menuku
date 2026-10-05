"use client";

import type { ChangeEvent } from "react";
import { Input, Textarea } from "@/components/ui/text-input";
import type { UploadKind } from "@/features/stores/hooks/use-settings-image-upload";
import type { Tenant } from "@/features/stores/types";

type StorePromoSectionProps = {
  tenant: Tenant;
  canUsePromo: boolean;
  promoImage: string;
  uploading: UploadKind | null;
  onSelectFile: (event: ChangeEvent<HTMLInputElement>, kind: UploadKind) => void;
};

function StorePromoSection({
  tenant,
  canUsePromo,
  promoImage,
  uploading,
  onSelectFile,
}: StorePromoSectionProps) {
  const fieldClassName = "grid gap-2 text-sm font-bold";

  return (
    <section
      className={`border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-6 ${!canUsePromo ? "opacity-75" : ""}`}
    >
      <div className="mb-5">
        <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
          Event & promo
        </p>
        <h2 className="display-font mt-1 text-xl font-black">Banner spesial</h2>
        <p className="text-muted mt-1 text-xs">
          Tampilkan promo, event, atau pengumuman penting di storefront.
        </p>
      </div>
      <Input type="hidden" name="promoImageUrl" value={promoImage} />
      <label
        className={`border-line relative flex min-h-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-[#f6f3ef] p-4 text-center ${canUsePromo ? "cursor-pointer" : "cursor-not-allowed"}`}
      >
        {promoImage && (
          <img
            src={promoImage}
            alt="Preview banner promo"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {promoImage && <span className="absolute inset-0 bg-black/35" />}
        <span
          className={`relative rounded-xl px-4 py-3 text-xs font-extrabold ${promoImage ? "text-ink bg-white" : "text-brand bg-white shadow-sm"}`}
        >
          {promoImage ? "Ganti gambar event" : "Upload gambar event"}
          <Input
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={!canUsePromo || Boolean(uploading)}
            onChange={(event) => onSelectFile(event, "promo")}
          />
        </span>
      </label>
      <div className="mt-4 grid gap-4">
        <label className={fieldClassName}>
          Judul event / promo
          <Input
            name="promoTitle"
            defaultValue={tenant.promo_title || ""}
            maxLength={120}
            placeholder="Contoh: Promo akhir pekan"
            disabled={!canUsePromo}
          />
        </label>
        <label className={fieldClassName}>
          Deskripsi singkat
          <Textarea
            name="promoDescription"
            defaultValue={tenant.promo_description || ""}
            maxLength={300}
            placeholder="Contoh: Diskon 20% untuk semua minuman."
            disabled={!canUsePromo}
          />
        </label>
        <label className={fieldClassName}>
          Link tombol (opsional)
          <Input
            name="promoLinkUrl"
            type="url"
            defaultValue={tenant.promo_link_url || ""}
            placeholder="https://..."
            disabled={!canUsePromo}
          />
        </label>
        <label className="border-line flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-bold">
          Tampilkan banner di storefront
          <Input
            className="accent-brand size-4"
            type="checkbox"
            name="promoEnabled"
            defaultChecked={tenant.promo_enabled}
            disabled={!canUsePromo}
          />
        </label>
        {!canUsePromo && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
            Fitur Event & Promo tersedia mulai paket Premium. Upgrade paket untuk mengaktifkannya.
          </p>
        )}
      </div>
    </section>
  );
}

export default StorePromoSection;
