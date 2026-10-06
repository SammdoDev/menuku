import { Activity, ArrowUpRight, Globe2, Instagram, Link2, MapPin, QrCode } from "lucide-react";
import MarketingAnalyticsBars from "../../../components/analytics-bars";
import MarketingMenuThumbnail from "../../../components/menu-thumbnail";
import type { LandingConstants } from "../../../types";

type GalleryBentoGridProps = {
  constants: LandingConstants;
};

const businessLinks = [
  { Icon: Globe2, color: "bg-[#e6f4ea] text-[#24834c]" },
  { Icon: MapPin, color: "bg-[#fce8df] text-[#b13b19]" },
  { Icon: Instagram, color: "bg-[#eee9f8] text-[#6655a2]" },
  { Icon: Link2, color: "bg-[#f1eee8] text-[#29251f]" },
];

const qrCells = [0, 1, 2, 4, 5, 7, 10, 12, 14, 16, 18, 20, 21, 22, 24];

function MarketingGalleryBentoGrid({ constants }: GalleryBentoGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12" data-bento>
      {/* Katalog */}
      <article
        className="overflow-hidden rounded-[1.5rem] bg-[#f6eee6] p-6 sm:col-span-2 sm:p-8 lg:col-span-7"
        data-bento-card
      >
        <div className="flex h-full flex-col gap-8 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 sm:flex-1">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#a03417] uppercase">
              {constants.gallery.store.eyebrow}
            </p>

            <h3 className="display-font mt-4 max-w-[16ch] text-3xl leading-[1.08] font-black tracking-[-0.035em]">
              {constants.gallery.store.title}
            </h3>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#75695f]">
              {constants.gallery.store.copy}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[320px] min-w-0 rounded-2xl border border-[#29251f]/5 bg-white p-4 shadow-[0_12px_32px_-16px_rgba(41,37,31,0.35)] sm:w-[52%] sm:shrink-0">
            <div className="flex items-center gap-2.5 border-b border-[#f0ece7] pb-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#b13b19] text-[10px] font-black text-white">
                KT
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold">{constants.hero.preview.cafe}</p>
                <p className="mt-0.5 text-[9px] leading-4 text-[#62564b]">
                  {constants.hero.preview.description}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-800">
                {constants.hero.preview.open}
              </span>
            </div>

            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                <MarketingMenuThumbnail tone="peach" />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] leading-4 font-bold">
                    {constants.hero.preview.item.one}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-[#b13b19]">
                    {constants.gallery.store.price.one}
                  </p>
                </div>

                <ArrowUpRight size={14} className="shrink-0 text-[#a99a8d]" aria-hidden="true" />
              </div>

              <div className="h-px bg-[#f0ece7]" />

              <div className="flex items-center gap-3">
                <MarketingMenuThumbnail tone="green" />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] leading-4 font-bold">
                    {constants.hero.preview.item.two}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-[#b13b19]">
                    {constants.gallery.store.price.two}
                  </p>
                </div>

                <ArrowUpRight size={14} className="shrink-0 text-[#a99a8d]" aria-hidden="true" />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="flex items-center justify-between rounded-lg bg-[#f7f3ee] px-3 py-2"
            >
              <span className="h-1 w-20 rounded-full bg-[#ded4ca]" />
              <QrCode size={15} strokeWidth={1.5} className="text-[#86786c]" />
            </div>
          </div>
        </div>
      </article>

      {/* Analytics */}
      <article
        className="flex flex-col rounded-[1.5rem] bg-[#29251f] p-6 text-white sm:p-7 lg:col-span-5"
        data-bento-card
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#ffb99c] uppercase">
            {constants.gallery.analytics.eyebrow}
          </p>

          <Activity size={18} strokeWidth={1.5} className="text-[#ffb99c]" aria-hidden="true" />
        </div>

        <h3 className="display-font mt-4 max-w-[24ch] text-2xl leading-[1.15] font-black tracking-[-0.025em]">
          {constants.gallery.analytics.title}
        </h3>

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] text-white/65">{constants.gallery.analytics.visits}</p>

            <p className="text-[10px] font-semibold text-emerald-300">
              {constants.gallery.analytics.growth}
            </p>
          </div>

          <MarketingAnalyticsBars />
        </div>

        <p className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-5 text-white/55">
          {constants.gallery.analytics.disclaimer}
        </p>
      </article>

      {/* QR */}
      <article
        className="flex items-center justify-between gap-5 overflow-hidden rounded-[1.5rem] bg-[#e9f0df] p-6 sm:p-7 lg:col-span-5"
        data-bento-card
      >
        <div className="max-w-xs min-w-0">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#477047] uppercase">
            {constants.gallery.qr.eyebrow}
          </p>

          <h3 className="display-font mt-3 text-xl leading-tight font-black tracking-[-0.025em] sm:text-2xl">
            {constants.gallery.qr.title}
          </h3>

          <p className="mt-3 text-xs leading-6 text-[#536444]">{constants.gallery.qr.copy}</p>
        </div>

        <div
          aria-hidden="true"
          className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-[#477047]/10 bg-white p-3 shadow-[0_8px_20px_-12px_rgba(71,112,71,0.4)] sm:size-28 sm:p-4"
        >
          <div className="grid h-full grid-cols-5 grid-rows-5 gap-1">
            {Array.from({ length: 25 }, (_, index) => (
              <span
                key={index}
                className={`rounded-[2px] ${
                  qrCells.includes(index) ? "bg-[#29251f]" : "bg-[#edf1e7]"
                }`}
              />
            ))}
          </div>

          <span className="pointer-events-none absolute inset-x-2 top-3 h-px bg-[#477047]/70 shadow-[0_0_8px_rgba(71,112,71,0.5)]" />
        </div>
      </article>

      {/* Tautan */}
      <article
        className="flex flex-col justify-between gap-6 rounded-[1.5rem] border border-[#eee5dd] bg-[#fffaf6] p-6 sm:col-span-2 sm:flex-row sm:items-center sm:p-8 lg:col-span-7"
        data-bento-card
      >
        <div className="max-w-sm min-w-0">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#b13b19] uppercase">
            {constants.gallery.links.eyebrow}
          </p>

          <h3 className="display-font mt-3 text-xl leading-tight font-black tracking-[-0.025em] sm:text-2xl">
            {constants.gallery.links.title}
          </h3>

          <p className="mt-3 text-xs leading-6 text-[#75695f]">{constants.gallery.links.copy}</p>
        </div>

        <div aria-hidden="true" className="flex shrink-0 gap-2.5 sm:grid sm:grid-cols-2">
          {businessLinks.map(({ Icon, color }, index) => (
            <span key={index} className={`grid size-12 place-items-center rounded-2xl ${color}`}>
              <Icon size={21} strokeWidth={1.7} />
            </span>
          ))}
        </div>
      </article>

    </div>
  );
}

export default MarketingGalleryBentoGrid;
