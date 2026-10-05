"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cn } from "../../lib/utils";

type HeroHighlightProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function HeroHighlight({ children, className, containerClassName }: HeroHighlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightMask = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;
  const dotPattern = (color: string): CSSProperties => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "16px 16px",
  });

  return (
    <div
      className={cn("group relative isolate w-full bg-[#f7f6f2]", containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={dotPattern("rgb(212 212 212)")}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          ...dotPattern("rgb(255 101 52)"),
          WebkitMaskImage: spotlightMask,
          maskImage: spotlightMask,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
}

type HighlightProps = { children: ReactNode; className?: string };

export function Highlight({ children, className }: HighlightProps) {
  return (
    <motion.span
      animate={{ backgroundSize: "100% 100%" }}
      className={cn(
        "relative inline-block rounded-lg bg-gradient-to-r from-[#ffc9a9] to-[#ffe5b8] px-1 pb-1 text-[#a03417]",
        className,
      )}
      initial={{ backgroundSize: "0% 100%" }}
      style={{
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        display: "inline",
      }}
      transition={{ duration: 1.2, ease: "linear", delay: 0.5 }}
    >
      {children}
    </motion.span>
  );
}
