"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";

gsap.registerPlugin(ScrollTrigger);

type ScrollScene = { title: string; copy: string };

type ScrollStoryProps = {
  eyebrow: string;
  title: string;
  copy: string;
  scrollHint: string;
  scenes: ScrollScene[];
  locale: Locale;
};

function MarketingScrollStory({
  eyebrow,
  title,
  copy,
  scrollHint,
  scenes,
  locale,
}: ScrollStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const activeTitleRef = useRef<HTMLHeadingElement>(null);
  const activeCopyRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScene = scenes[activeIndex] ?? scenes[0];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || scenes.length < 2) return;

    const context = gsap.context(() => {
      const sceneElements = gsap.utils.toArray<HTMLElement>("[data-scroll-scene]", section);
      const marker = window.innerHeight * 0.64;
      const visibleIndex = sceneElements.findIndex((scene) => {
        const bounds = scene.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom >= marker;
      });
      const initialIndex = visibleIndex >= 0 ? visibleIndex : 0;
      setActiveIndex(initialIndex);

      sceneElements.forEach((scene, index) => {
        ScrollTrigger.create({
          trigger: scene,
          start: () => (window.matchMedia("(max-width: 1023px)").matches ? "top 82%" : "top 64%"),
          end: "bottom 38%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, section);

    return () => context.revert();
  }, [locale, scenes]);

  useLayoutEffect(() => {
    const titleElement = activeTitleRef.current;
    const copyElement = activeCopyRef.current;
    if (
      !titleElement ||
      !copyElement ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    gsap.fromTo(
      [titleElement, copyElement],
      { autoAlpha: 0, y: 14, filter: "blur(6px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.42,
        stagger: 0.05,
        ease: "power2.out",
      },
    );
  }, [activeIndex]);

  return (
    <section
      className="relative overflow-hidden bg-[#29251f] py-16 text-white sm:py-24"
      id="cerita"
      ref={sectionRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 -right-36 size-[28rem] rounded-full bg-[#b13b19]/20 blur-[100px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="mb-3 text-[10px] font-black tracking-[.17em] text-[#ffb99c]">{eyebrow}</p>
          <h2 className="display-font text-3xl leading-tight font-black sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
            {copy}
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-12">
          <aside
            aria-hidden="true"
            className="sticky top-20 z-10 rounded-[1.7rem] border border-white/10 bg-[#34302a]/95 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7 lg:top-28 lg:col-span-5 lg:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-black tracking-[.16em] text-white/45">
                MENUKU / {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="flex gap-1.5">
                {scenes.map((scene, index) => (
                  <span
                    className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-[#ff845b]" : "w-3 bg-white/20"}`}
                    key={scene.title}
                  />
                ))}
              </span>
            </div>
            <div className="my-7 h-px bg-white/10 sm:my-10" />
            <h3
              className="display-font min-h-24 text-3xl leading-[1.04] font-black tracking-[-.04em] sm:min-h-32 sm:text-5xl"
              ref={activeTitleRef}
            >
              {activeScene?.title}
            </h3>
            <p
              className="mt-4 min-h-12 max-w-md text-sm leading-6 text-white/60 sm:mt-5 sm:text-base"
              ref={activeCopyRef}
            >
              {activeScene?.copy}
            </p>
            <div className="mt-8 flex items-center gap-3 text-[10px] font-bold text-white/45 sm:mt-12">
              <span className="grid size-8 place-items-center rounded-full border border-white/15 text-white/75">
                ↓
              </span>
              <span>{scrollHint}</span>
            </div>
          </aside>

          <div className="lg:col-span-7">
            {scenes.map((scene, index) => (
              <article
                aria-current={index === activeIndex ? "step" : undefined}
                className={`flex min-h-[34svh] items-end border-t px-1 pt-10 pb-7 transition-colors duration-500 sm:min-h-[39svh] sm:px-4 sm:pb-10 ${index === activeIndex ? "border-[#ff845b]/75" : "border-white/15"}`}
                data-scroll-scene
                key={scene.title}
              >
                <div className="grid w-full grid-cols-[3.3rem_1fr] items-start gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-5">
                  <span
                    className={`display-font pt-1 text-sm font-bold transition-colors ${index === activeIndex ? "text-[#ff9b78]" : "text-white/30"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className={`display-font text-xl leading-tight font-black transition-colors sm:text-2xl ${index === activeIndex ? "text-white" : "text-white/55"}`}
                    >
                      {scene.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-xs leading-5 text-white/45 sm:text-sm sm:leading-6">
                      {scene.copy}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketingScrollStory;
