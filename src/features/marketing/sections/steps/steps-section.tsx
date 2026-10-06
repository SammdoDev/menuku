"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarketingStepsGrid from "./components/steps-grid";
import type { LandingConstants } from "../../types";

gsap.registerPlugin(ScrollTrigger);
type StepsSectionProps = { constants: LandingConstants };

function MarketingStepsSection({ constants }: StepsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (mediaContext) => {
        const { desktop, reducedMotion } = mediaContext.conditions ?? {};
        if (reducedMotion) return;
        const context = gsap.context(() => {
          const grid = section.querySelector("[data-steps-grid]");
          const cards = gsap.utils.toArray<HTMLElement>("[data-step-item]", section);
          gsap.from("[data-steps-heading]", {
            y: 20,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 85%", once: true },
          });
          if (!grid) return;
          if (desktop) {
            gsap
              .timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: grid, start: "top 85%", once: true },
              })
              .from(cards, {
                y: 36,
                autoAlpha: 0,
                duration: 0.75,
                stagger: 0.14,
              })
              .from(
                "[data-steps-line]",
                { scaleX: 0, transformOrigin: "left center", duration: 0.7 },
                0.3,
              )
              .from(
                "[data-step-progress]",
                {
                  scaleX: 0,
                  transformOrigin: "left center",
                  duration: 0.35,
                  stagger: 0.04,
                },
                "-=0.35",
              );
            return;
          }
          cards.forEach((card) => {
            gsap
              .timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: card, start: "top 90%", once: true },
              })
              .from(card, { y: 28, autoAlpha: 0, duration: 0.65 })
              .from(
                card.querySelectorAll("[data-step-progress]"),
                {
                  scaleX: 0,
                  transformOrigin: "left center",
                  duration: 0.35,
                  stagger: 0.07,
                },
                "-=0.25",
              );
          });
        }, section);
        return () => context.revert();
      },
    );
    return () => media.revert();
  }, [constants]);

  return (
    <section
      ref={sectionRef}
      id="cara"
      className="bg-charcoal relative isolate scroll-mt-24 overflow-hidden py-20 text-white sm:py-24"
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
