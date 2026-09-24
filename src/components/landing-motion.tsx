"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-hero-item]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });
      gsap.from("[data-hero-card]", { x: 50, y: 20, opacity: 0, rotate: 4, duration: 1, delay: 0.2, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-motion]").forEach((element) => {
        gsap.from(element, { y: 35, opacity: 0, duration: 0.75, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, { y: 24, opacity: 0, duration: 0.55, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: group, start: "top 82%", once: true } });
      });
    }, root);
    return () => context.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
