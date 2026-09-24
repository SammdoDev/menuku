"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function DashboardMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-dashboard-reveal]", { y: 20, opacity: 0, duration: 0.65, stagger: 0.08, ease: "power2.out" });
    }, root);
    return () => context.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
