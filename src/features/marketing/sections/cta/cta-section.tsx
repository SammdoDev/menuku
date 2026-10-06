import CtaRegisterButton from "./components/cta-register-button";
import type { LandingConstants } from "../../types";

type CtaSectionProps = { constants: LandingConstants };

function MarketingCtaSection({ constants }: CtaSectionProps) {
  return (
    <section
      className="marketing-deferred mx-4 mb-8 overflow-hidden rounded-[1.8rem] bg-[#b13b19] px-5 py-10 text-white sm:mx-6 sm:px-8 sm:py-12 lg:mx-auto lg:max-w-7xl lg:px-12"
      data-reveal
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <p className="mb-2 text-[10px] font-black tracking-[.15em] text-white">
            {constants.cta.eyebrow}
          </p>
          <h2 className="display-font text-2xl leading-tight font-black sm:text-3xl">
            {constants.cta.title}
          </h2>
          <p className="mt-2 text-sm text-white">{constants.cta.copy}</p>
        </div>
        <CtaRegisterButton label={constants.cta.button} />
      </div>
    </section>
  );
}

export default MarketingCtaSection;
