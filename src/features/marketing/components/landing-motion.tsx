"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function MarketingMotionProvider({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      anchors: true,
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    let hasUserScrolled = false;

    function markUserScroll() {
      hasUserScrolled = true;
    }

    function markKeyboardScroll(event: KeyboardEvent) {
      const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (!scrollKeys.includes(event.key)) return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      hasUserScrolled = true;
    }

    window.addEventListener("wheel", markUserScroll, { passive: true });
    window.addEventListener("touchmove", markUserScroll, { passive: true });
    window.addEventListener("keydown", markKeyboardScroll);
    lenis.on("scroll", updateScrollTrigger);
    window.addEventListener("menuku:translations-updated", refreshScrollTrigger);

    const updateLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-preview]", { x: 46, y: 24, opacity: 0, rotate: 3, duration: 0.9 })
        .from(
          "[data-hero-float]",
          { y: 16, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.1 },
          "-=0.36",
        );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        let hasPlayed = false;
        const revealTween = gsap.fromTo(
          element,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            paused: true,
            immediateRender: false,
          },
        );

        ScrollTrigger.create({
          trigger: element,
          start: "top 86%",
          onEnter: playReveal,
          onEnterBack: playReveal,
          onUpdate: playReveal,
        });

        function playReveal() {
          if (!hasUserScrolled || hasPlayed) return;
          hasPlayed = true;
          revealTween.play(0);
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger], [data-bento]").forEach((group) => {
        const children = Array.from(group.children);
        if (!children.length) return;

        let hasPlayed = false;
        const revealTween = gsap.fromTo(
          children,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: group.matches("[data-bento]") ? 0.12 : 0.08,
            ease: "power2.out",
            paused: true,
            immediateRender: false,
          },
        );

        ScrollTrigger.create({
          trigger: group,
          start: "top 84%",
          onEnter: playReveal,
          onEnterBack: playReveal,
          onUpdate: playReveal,
        });

        function playReveal() {
          if (!hasUserScrolled || hasPlayed) return;
          hasPlayed = true;
          revealTween.play(0);
        }
      });
    }, root);

    return () => {
      context.revert();
      gsap.ticker.remove(updateLenis);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      window.removeEventListener("wheel", markUserScroll);
      window.removeEventListener("touchmove", markUserScroll);
      window.removeEventListener("keydown", markKeyboardScroll);
      window.removeEventListener("menuku:translations-updated", refreshScrollTrigger);
    };
  }, []);

  return <div ref={root}>{children}</div>;
}

export default MarketingMotionProvider;
