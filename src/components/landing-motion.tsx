"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function LandingMotion({ children }: { children: React.ReactNode }) {
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
    lenis.on("scroll", updateScrollTrigger);
    window.addEventListener("menuku:translations-updated", refreshScrollTrigger);

    const updateLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-preview]", { x: 46, y: 24, opacity: 0, rotate: 3, duration: 0.9 })
        .from("[data-hero-float]", { y: 16, opacity: 0, scale: 0.94, duration: 0.45, stagger: 0.1 }, "-=0.36");

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger], [data-bento]").forEach((group) => {
        gsap.from(group.children, {
          y: 22,
          opacity: 0,
          duration: 0.55,
          stagger: group.matches("[data-bento]") ? 0.12 : 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: group, start: "top 84%", once: true },
        });
      });
    }, root);

    return () => {
      context.revert();
      gsap.ticker.remove(updateLenis);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      window.removeEventListener("menuku:translations-updated", refreshScrollTrigger);
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
