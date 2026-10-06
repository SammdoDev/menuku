import { Activity, Clock3, Globe2, Instagram, Link2, MapPin, MenuSquare } from "lucide-react";
import MarketingAnalyticsBars from "../../../components/analytics-bars";
import type { LandingConstants } from "../../../types";

const featureCards = [
  {
    icon: MenuSquare,
    feature: "menu",
    layout: "sm:col-span-2 lg:col-span-6 lg:row-span-2",
  },
  {
    icon: MapPin,
    feature: "store",
    layout: "lg:col-span-6",
  },
  {
    icon: Link2,
    feature: "links",
    layout: "lg:col-span-3",
  },
  {
    icon: Activity,
    feature: "analytics",
    layout: "lg:col-span-3",
  },
] as const;

const linkIcons = [
  { Icon: Globe2, color: "bg-[#e6f4ea] text-[#24834c]" },
  { Icon: Instagram, color: "bg-[#fce8df] text-[#b13b19]" },
  { Icon: MapPin, color: "bg-[#eee9f8] text-[#6655a2]" },
  { Icon: Link2, color: "bg-[#f1eee8] text-[#29251f]" },
];

type FeatureGridProps = {
  constants: LandingConstants;
};

function MarketingFeatureGrid({ constants }: FeatureGridProps) {
  return (
    <div className="mt-10 grid auto-rows-[minmax(240px,auto)] gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(190px,auto)] lg:grid-cols-12">
      {featureCards.map(({ icon: Icon, feature, layout }) => {
        const isMenu = feature === "menu";

        return (
          <div key={feature} className={`min-w-0 ${layout}`}>
            <article
              className={`group relative isolate h-full overflow-hidden rounded-[1.7rem] border p-5 transition duration-500 hover:shadow-2xl motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:p-6 ${
                isMenu
                  ? "min-h-[420px] border-[#39342d] bg-[#29251f] text-white shadow-xl shadow-[#29251f]/10"
                  : "min-h-[240px] border-[#e9dfd7] bg-white text-[#29251f] shadow-lg shadow-[#674c3e]/[.035] hover:border-[#d2a28c] hover:shadow-[#674c3e]/[.09] lg:min-h-0"
              }`}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-12 -bottom-20 size-56 rounded-full blur-3xl ${
                  isMenu ? "bg-[#ff6534]/20" : "bg-[#f8d8c6]/35"
                }`}
              />

              <div
                className={`relative z-10 grid h-full items-center gap-4 ${
                  isMenu
                    ? "grid-cols-1 sm:grid-cols-[.82fr_1.18fr]"
                    : "grid-cols-[minmax(0,1fr)_minmax(70px,.52fr)]"
                }`}
              >
                <div className="min-w-0">
                  <span
                    className={`grid size-11 place-items-center rounded-[.95rem] shadow-sm transition-transform duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:-rotate-6 motion-reduce:transition-none ${
                      isMenu
                        ? "bg-[#b13b19] text-white shadow-[#b13b19]/20"
                        : "bg-[#fff0e8] text-[#b13b19]"
                    }`}
                  >
                    <span className="inline-flex">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                  </span>

                  <div className="mt-4">
                    <h3 className="display-font text-lg leading-snug font-black sm:text-xl">
                      {constants.feature[feature].title}
                    </h3>

                    <p
                      className={`mt-2 text-xs leading-5 sm:text-[13px] sm:leading-6 ${
                        isMenu ? "text-white/60" : "text-muted"
                      }`}
                    >
                      {constants.feature[feature].copy}
                    </p>
                  </div>
                </div>

                {feature === "menu" && (
                  <div aria-hidden="true" className="w-full">
                    <div className="w-full rotate-[-3deg] rounded-2xl border border-white/70 bg-white p-3 shadow-[0_20px_50px_-22px_rgba(0,0,0,.6)] transition-transform duration-700 motion-safe:group-hover:scale-[1.03] motion-safe:group-hover:rotate-0 motion-reduce:transition-none sm:p-4">
                      <div className="flex items-center gap-1.5 border-b border-[#eee8e1] pb-2.5">
                        <span className="size-1.5 rounded-full bg-[#ff9d79]" />
                        <span className="size-1.5 rounded-full bg-[#f4cf77]" />
                        <span className="size-1.5 rounded-full bg-[#b7d09e]" />
                        <span className="ml-auto h-1.5 w-12 rounded-full bg-[#eee8e1]" />
                      </div>

                      <div className="mt-3 grid gap-2.5">
                        {[0, 1, 2].map((row) => (
                          <div
                            key={row}
                            className="flex items-center gap-2.5"
                          >
                            <span
                              className="size-8 shrink-0 rounded-lg bg-center bg-no-repeat"
                              style={{
                                backgroundImage: "url('/landing-menu-food-strip.webp')",
                                backgroundPosition: `${row * 50}% center`,
                                backgroundSize: "300% auto",
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
                      className="absolute -inset-3 opacity-70"
                      style={{
                        backgroundImage:
                          "linear-gradient(28deg, transparent 45%, white 46%, white 54%, transparent 55%), linear-gradient(110deg, transparent 42%, white 43%, white 50%, transparent 51%), linear-gradient(0deg, transparent 48%, #dce5d4 49%, #dce5d4 55%, transparent 56%)",
                        backgroundSize: "72px 58px, 90px 72px, 100% 100%",
                      }}
                    />

                    <div className="absolute top-5 left-1/2 size-9 -translate-x-1/2">
                      <span className="absolute inset-0 rounded-full border border-[#b13b19]/50 bg-[#b13b19]/10" />

                      <span className="relative grid size-9 place-items-center rounded-full bg-[#b13b19] text-white shadow-lg shadow-[#b13b19]/25">
                        <MapPin size={16} />
                      </span>
                    </div>

                    <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full border border-white bg-white/95 px-2 py-1 text-[9px] font-bold text-[#477047] shadow-sm">
                      <span className="inline-flex">
                        <Clock3 size={11} />
                      </span>
                      <span className="h-1.5 w-12 rounded-full bg-[#dce8cd]" />
                    </span>
                  </div>
                )}

                {feature === "links" && (
                  <div aria-hidden="true" className="grid grid-cols-2 justify-items-center gap-2">
                    {linkIcons.map(({ Icon: LinkIcon, color }, index) => (
                      <span
                        key={index}
                        className={`grid size-9 place-items-center rounded-xl shadow-sm ${color}`}
                      >
                        <LinkIcon size={16} />
                      </span>
                    ))}
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
          </div>
        );
      })}

    </div>
  );
}

export default MarketingFeatureGrid;
