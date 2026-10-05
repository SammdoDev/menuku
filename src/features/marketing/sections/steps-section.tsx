import { MenuSquare, Share2, UserRound } from "lucide-react";
import type { LandingConstants } from "@/features/marketing/types";

const steps = [
  { number: "01", step: "one", icon: UserRound },
  { number: "02", step: "two", icon: MenuSquare },
  { number: "03", step: "three", icon: Share2 },
] as const;

type StepsSectionProps = { constants: LandingConstants };
function MarketingStepsSection({ constants }: StepsSectionProps) {
  return (
    <section
      className="bg-charcoal relative isolate scroll-mt-24 overflow-hidden py-20 text-white sm:py-24"
      data-reveal
      id="cara"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(255,101,52,.17),transparent_45%),radial-gradient(ellipse_at_85%_100%,rgba(214,164,127,.1),transparent_38%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[10px] font-black tracking-[.15em] text-[#ffb99c]">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#ff6534] shadow-[0_0_0_4px_rgba(255,101,52,.16)]"
              />
              {constants.steps.eyebrow}
            </p>
            <h2 className="display-font text-3xl leading-[1.08] font-black sm:text-4xl lg:text-5xl">
              {constants.steps.title}
            </h2>
          </div>
          <p className="max-w-md pb-1 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
            {constants.steps.copy}
          </p>
        </div>

        <div className="relative mt-12 grid gap-4 md:grid-cols-3 md:gap-5" data-stagger>
          <div
            aria-hidden="true"
            className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-gradient-to-r from-[#ff6534]/50 via-white/20 to-[#ff6534]/50 md:block"
          />
          {steps.map(({ number, step, icon: StepIcon }, index) => (
            <article
              className="group relative isolate min-h-[290px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#302c26]/90 p-5 transition duration-500 hover:-translate-y-1 hover:border-[#ff6534]/45 hover:shadow-2xl hover:shadow-black/20 sm:p-7"
              key={number}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-10 -bottom-16 size-56 rounded-full blur-[70px] transition duration-500 group-hover:scale-125 motion-safe:animate-[ambient-glow-drift_15s_ease-in-out_infinite] ${index === 0 ? "bg-[#ff6534]/20" : index === 1 ? "bg-[#e7b49b]/10" : "bg-[#b5ca98]/10"}`}
              />
              <span
                aria-hidden="true"
                className="display-font pointer-events-none absolute top-16 right-4 text-[6rem] leading-none font-black text-white/[.035] transition duration-500 group-hover:text-white/[.07] sm:text-[7rem]"
              >
                {number}
              </span>
              <div className="relative z-10 flex min-h-12 items-center justify-center">
                <span
                  className={`grid size-12 place-items-center rounded-full border text-xs font-black shadow-[0_0_0_7px_rgba(255,255,255,.025)] ${index === 0 ? "border-[#ff6534] bg-[#ff6534] text-white" : "border-white/15 bg-[#39342d] text-[#ffb99c]"}`}
                >
                  {number}
                </span>
                <StepIcon
                  aria-hidden="true"
                  className="absolute right-0 text-white/25 transition duration-300 group-hover:scale-110 group-hover:text-[#ffb99c]"
                  size={23}
                />
              </div>
              <div className="relative z-10 mt-10">
                <div aria-hidden="true" className="mb-4 flex gap-1.5">
                  {[0, 1, 2].map((segment) => (
                    <span
                      className={`h-1 rounded-full transition-colors ${segment <= index ? "w-7 bg-[#ff6534]" : "w-3 bg-white/15"}`}
                      key={segment}
                    />
                  ))}
                </div>
                <h3 className="display-font text-xl font-black sm:text-2xl">
                  {constants.step[step].title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
                  {constants.step[step].copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketingStepsSection;
