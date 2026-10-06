import MarketingStepsGrid from "./components/steps-grid";
import type { LandingConstants } from "../../types";

type StepsSectionProps = {
  constants: LandingConstants;
};

function MarketingStepsSection({ constants }: StepsSectionProps) {
  return (
    <section
      id="cara"
      className="marketing-deferred bg-charcoal relative isolate scroll-mt-24 overflow-hidden py-20 text-white sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(255,101,52,.17),transparent_45%),radial-gradient(ellipse_at_85%_100%,rgba(214,164,127,.1),transparent_38%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[10px] font-black tracking-[.15em] text-[#ffb99c]"
              data-steps-heading
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#ff6534] shadow-[0_0_0_4px_rgba(255,101,52,.16)]"
              />
              {constants.steps.eyebrow}
            </p>

            <h2
              className="display-font text-3xl leading-[1.08] font-black sm:text-4xl lg:text-5xl"
              data-steps-heading
            >
              {constants.steps.title}
            </h2>
          </div>

          <p
            className="max-w-md pb-1 text-sm leading-6 text-white/60 sm:text-base sm:leading-7"
            data-steps-heading
          >
            {constants.steps.copy}
          </p>
        </div>

        <MarketingStepsGrid constants={constants} />
      </div>
    </section>
  );
}

export default MarketingStepsSection;
