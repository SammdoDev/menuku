import { Check, QrCode } from "lucide-react";
import type { LandingConstants } from "../../../types";
import HeroPreviewUrl from "./hero-preview-url";

type HeroMenuPreviewProps = {
  constants: LandingConstants;
};

function HeroMenuPreview({ constants }: HeroMenuPreviewProps) {
  const products = [
    {
      position: "0% center",
      name: constants.hero.preview.item.one,
      price: constants.gallery.store.price.one,
    },
    {
      position: "50% center",
      name: constants.hero.preview.item.two,
      price: constants.gallery.store.price.two,
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[480px] min-w-0 lg:col-span-5" data-hero-preview>
      <div className="overflow-hidden rounded-2xl border border-[#ded5c9] bg-[#fffdf8] shadow-[0_20px_50px_-30px_rgba(57,42,28,0.35)]">
        <HeroPreviewUrl url={constants.hero.preview.url} />

        <div className="px-5 pt-6 pb-5 sm:px-7 sm:pt-8 sm:pb-7">
          {/* Identitas kedai */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-serif text-3xl leading-tight tracking-[-0.035em] text-[#382a21] sm:text-4xl">
                {constants.hero.preview.cafe}
              </p>

              <p className="mt-2 max-w-[26ch] text-xs leading-5 text-[#62564b]">
                {constants.hero.preview.description}
              </p>
            </div>

            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#ded5c9] text-[#6c5949]"
            >
              <QrCode size={24} strokeWidth={1.4} />
            </span>
          </div>

          {/* Kategori */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[#e5dcd1]">
            <div className="flex gap-5 text-[11px] font-semibold">
              <span className="-mb-px border-b-2 border-[#a03417] pb-3 text-[#a03417]">
                {constants.hero.preview.category.one}
              </span>

              <span className="pb-3 text-[#6d6053]">{constants.hero.preview.category.two}</span>
            </div>

            <span className="mb-3 flex items-center gap-1.5 text-[9px] text-[#477047]">
              <span className="size-1.5 shrink-0 rounded-full bg-[#477047]" aria-hidden="true" />
              {constants.hero.preview.open}
            </span>
          </div>

          {/* Menu */}
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5">
            {products.map((product) => (
              <div key={product.position} className="group min-w-0">
                <div className="aspect-square overflow-hidden rounded-lg bg-[#eaded1]">
                  <span
                    aria-hidden="true"
                    className="block size-full bg-no-repeat transition-transform duration-700 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                    style={{
                      backgroundImage: "url('/landing-menu-food-strip.webp')",
                      backgroundPosition: product.position,
                      backgroundSize: "300% auto",
                    }}
                  />
                </div>

                <div className="pt-3">
                  <p className="min-h-10 text-xs leading-5 font-semibold text-[#382a21] sm:text-sm">
                    {product.name}
                  </p>

                  <p className="mt-1 font-mono text-xs font-semibold tracking-tight text-[#a03417] sm:text-sm">
                    {product.price}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-[9px] leading-4 text-[#62564b] sm:text-[10px]">
                    <Check
                      size={11}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#477047]"
                      aria-hidden="true"
                    />
                    {constants.hero.preview.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informasi pendukung */}
        <div className="grid gap-4 border-t border-[#e5dcd1] bg-[#f5efe6] px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-start gap-2.5">
            <Check
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[#477047]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[11px] leading-5 font-semibold text-[#382a21]">
                {constants.hero.float.title}
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-[#62564b]">
                {constants.hero.float.copy}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 border-t border-[#e0d5c7] pt-3 sm:block sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
            <p className="font-serif text-2xl leading-none tracking-tight text-[#a03417]">
              {constants.hero.metric.value}
            </p>
            <p className="text-[9px] leading-4 text-[#62564b] sm:mt-1">
              {constants.hero.metric.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroMenuPreview;
