import { ChevronDown } from "lucide-react";
import type { LandingConstants } from "../../../types";

const faqItems = ["one", "two", "three", "four", "five"] as const;

type FaqAccordionProps = { constants: LandingConstants };

function FaqAccordion({ constants }: FaqAccordionProps) {
  return (
    <div>
      {faqItems.map((item) => (
        <details
          className="group border-b border-[#e9dfd7] py-4 first:border-t"
          key={item}
          name="menuku-faq"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-extrabold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b13b19] [&::-webkit-details-marker]:hidden">
            {constants.faq[item].question}
            <ChevronDown
              aria-hidden="true"
              className="text-muted shrink-0 transition-transform duration-300 ease-out group-open:rotate-180 motion-reduce:transition-none"
              size={17}
            />
          </summary>
          <p className="text-muted max-w-2xl pt-3 pr-6 text-sm leading-6">
            {constants.faq[item].answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export default FaqAccordion;
