"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LandingConstants } from "../../../types";

const faqItems = ["one", "two", "three", "four", "five"] as const;

type FaqAccordionProps = { constants: LandingConstants };

function FaqAccordion({ constants }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<(typeof faqItems)[number] | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div>
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
                aria-hidden="true"
                className={`text-muted shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
                size={17}
              />
            </button>
            <motion.div
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              aria-hidden={!isOpen}
              id={answerId}
              initial={false}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-muted max-w-2xl pt-3 pr-6 text-sm leading-6">
                {constants.faq[item].answer}
              </p>
            </motion.div>
          </article>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
