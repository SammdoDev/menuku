"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { supportWhatsAppUrl } from "@/config/site";
import type { LandingConstants } from "@/features/marketing/types";

const faqItems = ["one", "two", "three", "four", "five"] as const;

type FaqSectionProps = { constants: LandingConstants };
function MarketingFaqSection({ constants }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<(typeof faqItems)[number] | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative isolate mx-auto grid max-w-7xl scroll-mt-24 gap-8 overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-10"
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
        {faqItems.map((item) => {
          const isOpen = openFaq === item;
          const answerId = `faq-answer-${item}`;

          return (
            <article className="border-b border-[#e9dfd7] py-4 first:border-t" key={item}>
              <button
                aria-controls={answerId}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-sm font-extrabold"
                onClick={() => setOpenFaq(isOpen ? null : item)}
                type="button"
              >
                {constants.faq[item].question}
                <ChevronDown
                  className={`text-muted shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
                  size={17}
                />
              </button>
              <motion.div
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                aria-hidden={!isOpen}
                className="overflow-hidden"
                id={answerId}
                initial={false}
                transition={{
                  duration: reduceMotion ? 0 : 0.34,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="text-muted max-w-2xl pt-3 pr-6 text-sm leading-6">
                  {constants.faq[item].answer}
                </p>
              </motion.div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MarketingFaqSection;
