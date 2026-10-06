import { ArrowDown, ArrowRight, Check, Sparkles } from "lucide-react";
import { Highlight } from "@/components/ui/hero-highlight";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  rotatingHighlights: readonly string[];
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  points: readonly string[];
};

export function HeroSection({
  eyebrow,
  title,
  highlight,
  rotatingHighlights,
  description,
  primaryLabel,
  secondaryLabel,
  points,
}: HeroSectionProps) {
  const highlights = rotatingHighlights.length ? rotatingHighlights : [highlight];
  const activeHighlight = highlights[0] ?? highlight;

  return (
    <div className="relative z-10 lg:col-span-6">
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#efc7b5] bg-white/85 px-3 py-2 text-[10px] font-black tracking-[.13em] text-[#a03417] shadow-sm sm:text-xs">
        <Sparkles aria-hidden="true" size={14} /> {eyebrow}
      </p>
      <h1 className="display-font max-w-2xl text-[2.8rem] leading-[.99] font-black tracking-[-.06em] sm:text-6xl lg:text-[4.35rem]">
        {title}{" "}
        <span className="relative inline-grid max-w-full align-baseline">
          <span className="max-w-full">
            <Highlight>{activeHighlight}</Highlight>
          </span>
        </span>
      </h1>
      <p className="text-muted mt-6 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          className="bg-brand hover:bg-brand-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-lg shadow-[#b13b19]/15 transition hover:-translate-y-0.5"
          href="/register"
        >
          {primaryLabel} <ArrowRight aria-hidden="true" size={16} />
        </a>
        <a
          className="border-line inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-white/90 px-5 text-sm font-bold transition hover:border-[#c7a493]"
          href="#galeri"
        >
          {secondaryLabel} <ArrowDown aria-hidden="true" size={15} />
        </a>
      </div>
      <div className="text-muted mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
        {points.map((point) => (
          <span className="inline-flex items-center gap-2" key={point}>
            <Check aria-hidden="true" className="text-[#b13b19]" size={15} /> {point}
          </span>
        ))}
      </div>
    </div>
  );
}
