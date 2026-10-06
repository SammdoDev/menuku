"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarketingFeatureGrid from "./components/feature-grid";
import type { LandingConstants } from "../../types";

gsap.registerPlugin(ScrollTrigger);
type FeaturesSectionProps = { constants: LandingConstants };

function MarketingFeaturesSection({ constants }: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-feature-item]", section);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target.querySelector<HTMLElement>("[data-feature-card]");
          if (card) card.dataset.motionActive = String(entry.isIntersecting);
        });
      },
      { threshold: 0.1 },
    );
    cards.forEach((card) => observer.observe(card));
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-features-heading]", {
          y: 22,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        });
        cards.forEach((card) =>
          gsap.from(card, {
            y: 32,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          }),
        );
      }, section);
      return () => context.revert();
    });
    return () => {
      observer.disconnect();
      media.revert();
      cards.forEach((item) => {
        const card = item.querySelector<HTMLElement>("[data-feature-card]");
        if (card) card.dataset.motionActive = "false";
      });
    };
  }, [constants]);

  return (
    <section
      ref={sectionRef}
      id="fitur"
      className="relative isolate scroll-mt-24 overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[8%] size-[28rem] rounded-full bg-[#ffb88e]/20 blur-[100px]"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#efc7b5] bg-white/80 px-3 py-1.5 text-[10px] font-black tracking-[.15em] text-[#a03417] shadow-sm"
              data-features-heading
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#ff6534] shadow-[0_0_0_4px_rgba(255,101,52,.12)]"
              />
              {constants.features.eyebrow}
            </p>
            <h2
              className="display-font max-w-3xl text-3xl leading-[1.08] font-black sm:text-4xl lg:text-5xl"
              data-features-heading
            >
              {constants.features.title}
            </h2>
          </div>
          <p
            className="text-muted max-w-lg border-l-2 border-[#ffb99c] pl-4 text-sm leading-6 sm:text-base sm:leading-7 lg:col-span-4 lg:col-start-9"
            data-features-heading
          >
            {constants.features.copy}
          </p>
        </div>
        <MarketingFeatureGrid constants={constants} />
      </div>
    </section>
  );
}

export default MarketingFeaturesSection;
