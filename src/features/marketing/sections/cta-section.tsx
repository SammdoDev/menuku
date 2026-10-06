import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LandingConstants } from "../types";

type CtaSectionProps = { constants: LandingConstants };
function MarketingCtaSection({ constants }: CtaSectionProps) {
  return (
    <section
      className="mx-4 mb-8 overflow-hidden rounded-[1.8rem] bg-[#b13b19] px-5 py-10 text-white sm:mx-6 sm:px-8 sm:py-12 lg:mx-auto lg:max-w-7xl lg:px-12"
      data-reveal
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <p className="mb-2 text-[10px] font-black tracking-[.15em] text-white/70">
            {constants.cta.eyebrow}
          </p>
          <h2 className="display-font text-2xl leading-tight font-black sm:text-3xl">
            {constants.cta.title}
          </h2>
          <p className="mt-2 text-sm text-white/75">{constants.cta.copy}</p>
        </div>
        <Link
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#9f3516] transition hover:-translate-y-0.5"
          href="/register"
        >
          {constants.cta.button}
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

export default MarketingCtaSection;
