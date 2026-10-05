import { ArrowUpRight, Check, Globe2 } from "lucide-react";
import { HeroSection as HeroCopy } from "@/components/ui/hero-section-shadcnui";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import MarketingMenuThumbnail from "@/features/marketing/components/menu-thumbnail";
import type { LandingConstants } from "@/features/marketing/types";

type HeroSectionProps = { constants: LandingConstants };
function MarketingHero({ constants }: HeroSectionProps) {
  return (
    <HeroHighlight className="relative" containerClassName="mx-auto w-full max-w-7xl">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pt-20 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 -left-40 size-[26rem] rounded-full bg-[#ffd5c2]/50 blur-3xl"
        />
        <HeroCopy
          description={constants.hero.copy}
          eyebrow={constants.hero.eyebrow}
          highlight={constants.hero.title.highlight}
          rotatingHighlights={constants.hero.title.rotating}
          points={[constants.hero.point.one, constants.hero.point.two]}
          primaryLabel={constants.hero.primary}
          secondaryLabel={constants.hero.secondary}
          title={constants.hero.title.first}
        />

        <div className="relative mx-auto w-full max-w-[590px] lg:col-span-6" data-hero-preview>
          <div className="absolute -top-8 -right-5 size-32 rounded-full bg-[#ffb88e]/45 blur-2xl sm:-top-10 sm:-right-9 sm:size-44" />
          <div className="relative rotate-[1deg] rounded-[1.8rem] border border-white bg-white/85 p-2 shadow-[0_30px_90px_-28px_rgba(68,43,30,.3)] motion-safe:animate-[menu-card-float_10s_ease-in-out_infinite] sm:rounded-[2rem] sm:p-3">
            <div className="overflow-hidden rounded-[1.35rem] bg-[#fffaf5] sm:rounded-[1.55rem]">
              <div className="flex items-center justify-between gap-3 border-b border-[#eee5dd] px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#b13b19] text-xs font-black text-white">
                    KT
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">{constants.hero.preview.cafe}</p>
                    <p className="text-muted mt-0.5 text-[10px]">
                      {constants.hero.preview.description}
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-800">
                  {constants.hero.preview.open}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex gap-2 text-[10px] font-bold">
                  <span className="rounded-full bg-[#29251f] px-3 py-2 text-white">
                    {constants.hero.preview.category.one}
                  </span>
                  <span className="rounded-full bg-[#f0e9e2] px-3 py-2 text-[#60574e]">
                    {constants.hero.preview.category.two}
                  </span>
                </div>
                <div className="rounded-2xl border border-[#eee5dd] bg-white p-3 sm:p-4">
                  <div className="flex items-center gap-3 border-b border-[#f0ece7] pb-3">
                    <MarketingMenuThumbnail tone="peach" />
                    <div className="min-w-0 flex-1">
                      <b className="block truncate text-xs sm:text-sm">
                        {constants.hero.preview.item.one}
                      </b>
                      <span className="text-muted mt-1 block text-[10px]">
                        {constants.hero.preview.status}
                      </span>
                    </div>
                    <b className="text-xs">{constants.gallery.store.price.one}</b>
                  </div>
                  <div className="flex items-center gap-3 pt-3">
                    <MarketingMenuThumbnail tone="green" />
                    <div className="min-w-0 flex-1">
                      <b className="block truncate text-xs sm:text-sm">
                        {constants.hero.preview.item.two}
                      </b>
                      <span className="text-muted mt-1 block text-[10px]">
                        {constants.hero.preview.status}
                      </span>
                    </div>
                    <b className="text-xs">{constants.gallery.store.price.two}</b>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f4ede6] px-3 py-2.5 text-[10px] font-bold text-[#51473f]">
                  <span className="inline-flex items-center gap-2">
                    <Globe2 size={13} /> {constants.hero.preview.url}
                  </span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-8 -left-4 flex items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl sm:bottom-11 sm:-left-12 sm:p-4"
            data-hero-float
          >
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Check size={18} />
            </span>
            <div>
              <p className="text-xs font-extrabold">{constants.hero.float.title}</p>
              <p className="text-muted mt-1 text-[10px]">{constants.hero.float.copy}</p>
            </div>
          </div>
          <div
            className="bg-charcoal absolute -right-2 bottom-20 hidden rounded-2xl px-4 py-3 text-white shadow-xl sm:-right-8 sm:block"
            data-hero-float
          >
            <p className="display-font text-xl font-black">{constants.hero.metric.value}</p>
            <p className="mt-0.5 text-[9px] text-white/65">{constants.hero.metric.label}</p>
          </div>
        </div>
      </section>
    </HeroHighlight>
  );
}

export default MarketingHero;
