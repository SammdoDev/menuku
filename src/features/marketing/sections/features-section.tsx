import { Activity, Clock3, Globe2, Instagram, Link2, MapPin, MenuSquare } from "lucide-react";
import MarketingAnalyticsBars from "@/features/marketing/components/analytics-bars";
import MarketingMenuThumbnail from "@/features/marketing/components/menu-thumbnail";
import type { LandingConstants } from "@/features/marketing/types";

const featureCards = [
  { icon: MenuSquare, feature: "menu" },
  { icon: MapPin, feature: "store" },
  { icon: Link2, feature: "links" },
  { icon: Activity, feature: "analytics" },
] as const;

type FeaturesSectionProps = { constants: LandingConstants };
function MarketingFeaturesSection({ constants }: FeaturesSectionProps) {
  return (
    <section
      className="relative isolate scroll-mt-24 overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10"
      data-reveal
      id="fitur"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[8%] size-[28rem] rounded-full bg-[#ffb88e]/20 blur-[100px]"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#efc7b5] bg-white/80 px-3 py-1.5 text-[10px] font-black tracking-[.15em] text-[#a03417] shadow-sm">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#ff6534] shadow-[0_0_0_4px_rgba(255,101,52,.12)]"
              />
              {constants.features.eyebrow}
            </p>
            <h2 className="display-font max-w-3xl text-3xl leading-[1.08] font-black sm:text-4xl lg:text-5xl">
              {constants.features.title}
            </h2>
          </div>
          <p className="text-muted max-w-lg border-l-2 border-[#ffb99c] pl-4 text-sm leading-6 sm:text-base sm:leading-7 lg:col-span-4 lg:col-start-9">
            {constants.features.copy}
          </p>
        </div>

        <div
          className="mt-10 grid auto-rows-[minmax(240px,auto)] gap-4 sm:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-12"
          data-stagger
        >
          {featureCards.map(({ icon: Icon, feature }, index) => {
            const isMenu = feature === "menu";
            const cardLayout = [
              "sm:col-span-2 lg:col-span-6 lg:row-span-2",
              "lg:col-span-6",
              "lg:col-span-3",
              "lg:col-span-3",
            ][index];

            return (
              <article
                className={`group relative isolate min-h-[240px] overflow-hidden rounded-[1.7rem] border p-5 transition duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-6 ${cardLayout} ${isMenu ? "min-h-[420px] border-[#39342d] bg-[#29251f] text-white shadow-xl shadow-[#29251f]/10" : "border-[#e9dfd7] bg-white text-[#29251f] shadow-lg shadow-[#674c3e]/[.035] hover:border-[#d2a28c] hover:shadow-[#674c3e]/[.09]"}`}
                key={feature}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-12 -bottom-20 size-56 rounded-full blur-3xl transition duration-500 group-hover:scale-125 motion-safe:animate-[ambient-glow-drift_14s_ease-in-out_infinite] ${isMenu ? "bg-[#ff6534]/20" : "bg-[#f8d8c6]/35"}`}
                />
                <div
                  className={`relative z-10 grid h-full items-center gap-4 ${isMenu ? "grid-cols-1 sm:grid-cols-[.82fr_1.18fr]" : "grid-cols-[minmax(0,1fr)_minmax(70px,.52fr)]"}`}
                >
                  <div className="min-w-0">
                    <span
                      className={`grid size-11 place-items-center rounded-[.95rem] shadow-sm transition duration-300 group-hover:scale-105 group-hover:rotate-[-5deg] ${isMenu ? "bg-[#ff6534] text-white shadow-[#ff6534]/20" : "bg-[#fff0e8] text-[#b13b19]"}`}
                    >
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <div className="mt-4">
                      <h3 className="display-font text-lg leading-snug font-black sm:text-xl">
                        {constants.feature[feature].title}
                      </h3>
                      <p
                        className={`mt-2 text-xs leading-5 sm:text-[13px] sm:leading-6 ${isMenu ? "text-white/60" : "text-muted"}`}
                      >
                        {constants.feature[feature].copy}
                      </p>
                    </div>
                  </div>

                  {feature === "menu" && (
                    <div
                      aria-hidden="true"
                      className="w-full motion-safe:animate-[menu-card-float_8s_ease-in-out_infinite]"
                    >
                      <div className="w-full rotate-[-3deg] rounded-2xl border border-white/70 bg-white p-3 shadow-[0_20px_50px_-22px_rgba(0,0,0,.6)] transition duration-700 group-hover:scale-[1.03] group-hover:rotate-0 sm:p-4">
                        <div className="flex items-center gap-1.5 border-b border-[#eee8e1] pb-2.5">
                          <span className="size-1.5 rounded-full bg-[#ff9d79]" />
                          <span className="size-1.5 rounded-full bg-[#f4cf77]" />
                          <span className="size-1.5 rounded-full bg-[#b7d09e]" />
                          <span className="ml-auto h-1.5 w-12 rounded-full bg-[#eee8e1]" />
                        </div>
                        <div className="mt-3 grid gap-2.5">
                          {[0, 1, 2].map((row) => (
                            <div className="flex items-center gap-2.5" key={row}>
                              <span
                                className="size-8 shrink-0 rounded-lg bg-cover bg-center"
                                style={{
                                  backgroundImage: "url('/landing-menu-food-strip.webp')",
                                  backgroundPosition: `${row * 50}% center`,
                                  backgroundSize: "300% 100%",
                                }}
                              />
                              <span className="grid flex-1 gap-1.5">
                                <span className="h-1.5 w-3/4 rounded-full bg-[#d9d3cc]" />
                                <span className="h-1 w-1/2 rounded-full bg-[#eee8e1]" />
                              </span>
                              <span className="h-2 w-8 rounded-full bg-[#f2a27e]" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {feature === "store" && (
                    <div
                      aria-hidden="true"
                      className="relative aspect-[1.1] min-h-24 overflow-hidden rounded-2xl bg-[#f5f2eb] shadow-inner"
                    >
                      <div
                        className="absolute inset-0 opacity-70"
                        style={{
                          backgroundImage:
                            "linear-gradient(28deg, transparent 45%, white 46%, white 54%, transparent 55%), linear-gradient(110deg, transparent 42%, white 43%, white 50%, transparent 51%), linear-gradient(0deg, transparent 48%, #dce5d4 49%, #dce5d4 55%, transparent 56%)",
                          backgroundSize: "72px 58px, 90px 72px, 100% 100%",
                        }}
                      />
                      <span className="absolute top-5 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-[#b13b19] text-white shadow-lg shadow-[#b13b19]/25">
                        <MapPin aria-hidden="true" size={16} />
                      </span>
                      <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full border border-white bg-white/95 px-2 py-1 text-[9px] font-bold text-[#477047] shadow-sm">
                        <Clock3 aria-hidden="true" size={11} />
                        <span className="h-1.5 w-12 rounded-full bg-[#dce8cd]" />
                      </span>
                    </div>
                  )}

                  {feature === "links" && (
                    <div aria-hidden="true" className="grid grid-cols-2 justify-items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-xl bg-[#e6f4ea] text-[#24834c] shadow-sm">
                        <Globe2 size={16} />
                      </span>
                      <span className="grid size-9 place-items-center rounded-xl bg-[#fce8df] text-[#b13b19] shadow-sm">
                        <Instagram size={16} />
                      </span>
                      <span className="grid size-9 place-items-center rounded-xl bg-[#eee9f8] text-[#6655a2] shadow-sm">
                        <MapPin size={16} />
                      </span>
                      <span className="grid size-9 place-items-center rounded-xl bg-[#f1eee8] text-[#29251f] shadow-sm">
                        <Link2 size={16} />
                      </span>
                    </div>
                  )}

                  {feature === "analytics" && (
                    <div aria-hidden="true" className="w-full self-end">
                      <div className="mb-2 flex items-center justify-end gap-1.5">
                        <span className="size-1.5 rounded-full bg-[#ff6534]" />
                        <span className="h-1.5 w-12 rounded-full bg-[#eee8e1]" />
                      </div>
                      <MarketingAnalyticsBars />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MarketingFeaturesSection;
