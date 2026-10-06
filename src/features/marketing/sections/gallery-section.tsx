import { Activity, Globe2, Instagram, Link2, MapPin, QrCode } from "lucide-react";
import MarketingAnalyticsBars from "../components/analytics-bars";
import MarketingMenuThumbnail from "../components/menu-thumbnail";
import type { LandingConstants } from "../types";

type GallerySectionProps = { constants: LandingConstants };
function MarketingGallerySection({ constants }: GallerySectionProps) {
  return (
    <section
      id="galeri"
      className="scroll-mt-24 border-y border-[#e9dfd7] bg-white py-16 sm:py-20"
      data-reveal
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
          <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">
            {constants.gallery.eyebrow}
          </p>
          <h2 className="display-font text-3xl leading-tight font-black sm:text-4xl">
            {constants.gallery.title}
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">{constants.gallery.copy}</p>
        </div>
        <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" data-bento>
          <article
            className="relative overflow-hidden rounded-[1.6rem] bg-[#f6eee6] p-5 sm:col-span-2 sm:row-span-2 sm:p-7"
            data-bento-card
          >
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-[#edc5a7]/45 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-[9px] font-black tracking-[.14em] text-[#a03417]">
                  {constants.gallery.store.eyebrow}
                </p>
                <h3 className="display-font mt-3 max-w-sm text-2xl leading-tight font-black sm:text-3xl">
                  {constants.gallery.store.title}
                </h3>
                <p className="text-muted mt-2 max-w-sm text-xs leading-5">
                  {constants.gallery.store.copy}
                </p>
              </div>
              <div className="mx-auto w-full max-w-[380px] rotate-[-1deg] rounded-2xl border border-white bg-white p-3 shadow-xl sm:p-4">
                <div className="mb-3 flex items-center gap-2 border-b border-[#f0ece7] pb-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-[#b13b19] text-[9px] font-black text-white">
                    KT
                  </span>
                  <div>
                    <p className="text-xs font-extrabold">{constants.hero.preview.cafe}</p>
                    <p className="text-muted text-[9px]">{constants.hero.preview.description}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-800">
                    {constants.hero.preview.open}
                  </span>
                </div>
                <div className="grid gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <MarketingMenuThumbnail tone="peach" />
                    <b className="min-w-0 flex-1 truncate text-[10px]">
                      {constants.hero.preview.item.one}
                    </b>
                    <span className="text-[9px] font-bold">
                      {constants.gallery.store.price.one}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MarketingMenuThumbnail tone="green" />
                    <b className="min-w-0 flex-1 truncate text-[10px]">
                      {constants.hero.preview.item.two}
                    </b>
                    <span className="text-[9px] font-bold">
                      {constants.gallery.store.price.two}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article className="rounded-[1.6rem] bg-[#29251f] p-5 text-white sm:p-6" data-bento-card>
            <p className="text-[9px] font-black tracking-[.14em] text-[#ffb99c]">
              {constants.gallery.analytics.eyebrow}
            </p>
            <h3 className="display-font mt-3 text-lg leading-snug font-black">
              {constants.gallery.analytics.title}
            </h3>
            <div className="mt-5">
              <div className="mb-2 flex items-end justify-between gap-2">
                <span className="text-[9px] text-white/60">
                  {constants.gallery.analytics.visits}
                </span>
                <Activity className="text-[#ffb99c]" size={15} />
              </div>
              <MarketingAnalyticsBars />
            </div>
            <p className="mt-3 text-[9px] font-bold text-emerald-300">
              {constants.gallery.analytics.growth}
            </p>
            <p className="mt-2 text-[9px] leading-4 text-white/55">
              {constants.gallery.analytics.disclaimer}
            </p>
          </article>
          <article
            className="flex flex-col justify-between rounded-[1.6rem] bg-[#e9f0df] p-5 sm:p-6"
            data-bento-card
          >
            <div>
              <p className="text-[9px] font-black tracking-[.14em] text-[#477047]">
                {constants.gallery.qr.eyebrow}
              </p>
              <h3 className="display-font mt-3 text-lg leading-snug font-black">
                {constants.gallery.qr.title}
              </h3>
              <p className="text-muted mt-2 text-[10px] leading-5">{constants.gallery.qr.copy}</p>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div
                className="grid size-[76px] grid-cols-5 gap-1 rounded-xl bg-white p-2.5 shadow-sm"
                aria-hidden="true"
              >
                {Array.from({ length: 25 }, (_, index) => (
                  <span
                    className={`${[0, 1, 2, 4, 5, 7, 10, 12, 14, 16, 18, 20, 21, 22, 24].includes(index) ? "bg-[#29251f]" : "bg-[#e9e2da]"} rounded-[2px]`}
                    key={index}
                  />
                ))}
              </div>
              <QrCode className="text-[#477047]" size={39} strokeWidth={1.5} />
            </div>
          </article>
          <article
            className="flex flex-col justify-between rounded-[1.6rem] border border-[#eee5dd] bg-[#fffaf6] p-5 sm:col-span-2 sm:flex-row sm:items-center sm:p-6"
            data-bento-card
          >
            <div className="max-w-sm">
              <p className="text-[9px] font-black tracking-[.14em] text-[#b13b19]">
                {constants.gallery.links.eyebrow}
              </p>
              <h3 className="display-font mt-3 text-lg leading-snug font-black">
                {constants.gallery.links.title}
              </h3>
              <p className="text-muted mt-2 text-[10px] leading-5">
                {constants.gallery.links.copy}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-0 sm:max-w-[210px] sm:justify-end">
              <span className="grid size-11 place-items-center rounded-xl bg-[#e6f4ea] text-[#24834c]">
                <Globe2 size={18} />
              </span>
              <span className="grid size-11 place-items-center rounded-xl bg-[#fce8df] text-[#b13b19]">
                <MapPin size={18} />
              </span>
              <span className="grid size-11 place-items-center rounded-xl bg-[#eee9f8] text-[#6655a2]">
                <Instagram size={18} />
              </span>
              <span className="grid size-11 place-items-center rounded-xl bg-[#f1eee8] text-[#29251f]">
                <Link2 size={18} />
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default MarketingGallerySection;
