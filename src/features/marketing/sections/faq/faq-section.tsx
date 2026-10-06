import { ArrowUpRight } from "lucide-react";
import { supportWhatsAppUrl } from "@/config/site";
import FaqAccordion from "./components/faq-accordion";
import type { LandingConstants } from "../../types";

type FaqSectionProps = { constants: LandingConstants };

function MarketingFaqSection({ constants }: FaqSectionProps) {
  return (
    <section
      className="marketing-deferred relative isolate mx-auto grid max-w-7xl scroll-mt-24 gap-8 overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-10"
      data-reveal
      id="faq"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[16%] size-72 rounded-full bg-[#ffb88e]/20 blur-[90px] motion-safe:animate-[ambient-glow-drift_16s_ease-in-out_infinite]"
      />
      <div className="relative z-10 lg:col-span-4">
        <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">
          {constants.faq.eyebrow}
        </p>
        <h2 className="display-font max-w-sm text-3xl font-black sm:text-4xl">
          {constants.faq.title}
        </h2>
        <p className="text-muted mt-4 max-w-sm text-sm leading-6">{constants.faq.copy}</p>
        <a
          className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#b13b19]"
          href={supportWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
        >
          {constants.faq.contact}
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="relative z-10 lg:col-span-8">
        <FaqAccordion constants={constants} />
      </div>
    </section>
  );
}

export default MarketingFaqSection;
