"use client";

import { Check, Palette } from "lucide-react";
import type { CSSProperties } from "react";
import { Input } from "@/components/ui/text-input";
import type { Tenant } from "../../types";

type StoreAppearanceSectionProps = {
  tenant: Tenant;
  canUseCustomStyle: boolean;
  logo: string;
  banner: string;
  primaryColor: string;
  backgroundColor: string;
  layout: "grid" | "list";
  onPrimaryColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onLayoutChange: (layout: "grid" | "list") => void;
};

const colorPresets = [
  ["Terracotta", "#FF6534", "#F7F6F2"],
  ["Forest", "#19715B", "#F1F6F3"],
  ["Berry", "#A23B72", "#FBF3F7"],
  ["Ocean", "#2563EB", "#F2F6FC"],
  ["Espresso", "#704214", "#F7F2EC"],
] as const;

function StoreAppearanceSection({
  tenant,
  canUseCustomStyle,
  logo,
  banner,
  primaryColor,
  backgroundColor,
  layout,
  onPrimaryColorChange,
  onBackgroundColorChange,
  onLayoutChange,
}: StoreAppearanceSectionProps) {
  const fieldClassName = "grid gap-2 text-sm font-bold";
  const previewStyle = {
    "--color-brand": primaryColor,
    backgroundColor,
  } as CSSProperties;

  return (
    <>
      <section
        className={`border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-6 ${!canUseCustomStyle ? "opacity-75" : ""}`}
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="text-brand grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50">
            <Palette size={19} />
          </span>
          <div>
            <h2 className="display-font text-xl font-black">Tampilan publik</h2>
            <p className="text-muted mt-1 text-xs">Warna dan layout langsung dipakai storefront.</p>
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
                disabled={!canUseCustomStyle}
                onClick={() => {
                  onPrimaryColorChange(primary);
                  onBackgroundColorChange(background);
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
          <label className={fieldClassName}>
            Warna utama
            <div className="flex items-center gap-2">
              <Input
                className="h-12 w-16 cursor-pointer p-1"
                type="color"
                name="primaryColor"
                value={primaryColor}
                disabled={!canUseCustomStyle}
                onChange={(event) => onPrimaryColorChange(event.target.value)}
              />
              <code className="text-muted text-xs font-bold uppercase">{primaryColor}</code>
            </div>
          </label>
          <label className={fieldClassName}>
            Warna latar
            <div className="flex items-center gap-2">
              <Input
                className="h-12 w-16 cursor-pointer p-1"
                type="color"
                name="backgroundColor"
                value={backgroundColor}
                disabled={!canUseCustomStyle}
                onChange={(event) => onBackgroundColorChange(event.target.value)}
              />
              <code className="text-muted text-xs font-bold uppercase">{backgroundColor}</code>
            </div>
          </label>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold">Layout menu</p>
          <Input type="hidden" name="layoutType" value={layout} />
          <div className="grid grid-cols-2 gap-2">
            {[
              ["grid", "Grid", "Kartu 2-3 kolom"],
              ["list", "List", "Baris lebih ringkas"],
            ].map(([value, title, note]) => (
              <button
                key={value}
                type="button"
                disabled={!canUseCustomStyle}
                onClick={() => onLayoutChange(value as "grid" | "list")}
                className={`rounded-xl border p-3 text-left transition ${layout === value ? "border-brand ring-brand/10 bg-orange-50/60 ring-2" : "border-line"}`}
              >
                <b className="block text-sm">{title}</b>
                <small className="text-muted text-[10px]">{note}</small>
              </button>
            ))}
          </div>
          {!canUseCustomStyle && (
            <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
              Pilihan layout menu dan warna tersedia mulai paket Premium.
            </p>
          )}
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
              <Input
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
            <div className={`grid gap-2 p-4 ${layout === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
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
    </>
  );
}

export default StoreAppearanceSection;
