import { MenuSquare, Share2, UserRound } from "lucide-react";
import type { LandingConstants } from "../../../types";

const steps = [
  { number: "01", step: "one", icon: UserRound },
  { number: "02", step: "two", icon: MenuSquare },
  { number: "03", step: "three", icon: Share2 },
] as const;
type StepsGridProps = { constants: LandingConstants };

function MarketingStepsGrid({ constants }: StepsGridProps) {
  return (
    <div className="relative mt-12 grid gap-4 md:grid-cols-3 md:gap-5" data-steps-grid>
      <div
        aria-hidden="true"
        className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-gradient-to-r from-[#ff6534]/50 via-white/20 to-[#ff6534]/50 md:block"
        data-steps-line
      />
      {steps.map(({ number, step, icon: StepIcon }, index) => (
        <div key={number} className="h-full" data-step-item>
          <article className="group relative isolate h-full min-h-[290px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#302c26]/90 p-5 transition duration-500 hover:border-[#ff6534]/45 hover:shadow-2xl hover:shadow-black/20 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:p-7">
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -right-10 -bottom-16 size-56 rounded-full blur-[70px] transition-transform duration-500 motion-safe:group-hover:scale-125 motion-reduce:transition-none ${index === 0 ? "bg-[#ff6534]/20" : index === 1 ? "bg-[#e7b49b]/10" : "bg-[#b5ca98]/10"}`}
            />
            <span
              aria-hidden="true"
              className="display-font pointer-events-none absolute top-16 right-4 text-[6rem] leading-none font-black text-white/[.035] transition-colors duration-500 group-hover:text-white/[.07] motion-reduce:transition-none sm:text-[7rem]"
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
                className="absolute right-0 text-white/25 transition duration-300 group-hover:text-[#ffb99c] motion-safe:group-hover:scale-110 motion-reduce:transition-none"
                size={23}
              />
            </div>
            <div className="relative z-10 mt-10">
              <div aria-hidden="true" className="mb-4 flex gap-1.5">
                {[0, 1, 2].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1 rounded-full ${segment <= index ? "w-7 bg-[#ff6534]" : "w-3 bg-white/15"}`}
                    data-step-progress
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
        </div>
      ))}
    </div>
  );
}

export default MarketingStepsGrid;
