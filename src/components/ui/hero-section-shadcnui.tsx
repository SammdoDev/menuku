"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, Check, Sparkles } from "lucide-react";
import { Highlight } from "./hero-highlight";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  points: readonly string[];
};

export function HeroSection({
  eyebrow,
  title,
  highlight,
  description,
  primaryLabel,
  secondaryLabel,
  points,
}: HeroSectionProps) {
  return (
    <motion.div
      animate="visible"
      className="relative z-10 lg:col-span-6"
      initial="hidden"
      variants={containerVariants}
    >
      <motion.p
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#efc7b5] bg-white/85 px-3 py-2 text-[10px] font-black tracking-[.13em] text-[#a03417] shadow-sm sm:text-xs"
        variants={itemVariants}
      >
        <Sparkles aria-hidden="true" size={14} /> {eyebrow}
      </motion.p>
      <motion.h1
        className="display-font max-w-2xl text-[2.8rem] leading-[.99] font-black tracking-[-.06em] sm:text-6xl lg:text-[4.35rem]"
        variants={itemVariants}
      >
        {title} <Highlight>{highlight}</Highlight>
      </motion.h1>
      <motion.p
        className="text-muted mt-6 max-w-xl text-sm leading-7 sm:text-base sm:leading-8"
        variants={itemVariants}
      >
        {description}
      </motion.p>
      <motion.div className="mt-8 flex flex-wrap items-center gap-3" variants={itemVariants}>
        <Link
          className="bg-brand hover:bg-brand-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-lg shadow-[#b13b19]/15 transition hover:-translate-y-0.5"
          href="/register"
        >
          {primaryLabel} <ArrowRight aria-hidden="true" size={16} />
        </Link>
        <a
          className="border-line inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-white/90 px-5 text-sm font-bold transition hover:border-[#c7a493]"
          href="#galeri"
        >
          {secondaryLabel} <ArrowDown aria-hidden="true" size={15} />
        </a>
      </motion.div>
      <motion.div
        className="text-muted mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs"
        variants={itemVariants}
      >
        {points.map((point) => (
          <span className="inline-flex items-center gap-2" key={point}>
            <Check aria-hidden="true" className="text-[#b13b19]" size={15} /> {point}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
