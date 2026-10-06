import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroHighlightProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function HeroHighlight({ children, className, containerClassName }: HeroHighlightProps) {
  const dotPattern = (color: string): CSSProperties => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "16px 16px",
  });

  return (
    <div className={cn("group relative isolate w-full bg-[#f7f6f2]", containerClassName)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={dotPattern("rgb(212 212 212)")}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          ...dotPattern("rgb(255 101 52)"),
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 78%)",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 78%)",
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
}

type HighlightProps = { children: ReactNode; className?: string };

export function Highlight({ children, className }: HighlightProps) {
  return (
    <span
      className={cn(
        "relative inline-block rounded-lg bg-gradient-to-r from-[#ffc9a9] to-[#ffe5b8] px-1 pb-1 text-[#a03417]",
        className,
      )}
    >
      {children}
    </span>
  );
}
