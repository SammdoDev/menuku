"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";

type HeroPreviewUrlProps = { url: string };
const storeExamples = [
  "kopi-kenangan",
  "warung-bu-sari",
  "bakso-pak-budi",
  "roti-rumahan",
  "kedai-senja",
];

function HeroPreviewUrl({ url }: HeroPreviewUrlProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typing, setTyping] = useState({
    index: 0,
    length: storeExamples[0].length,
    deleting: false,
  });
  const domain = url.replace(/^https?:\/\//, "").split("/")[0] || "digimenu.my.id";
  const currentStore = storeExamples[typing.index];
  const visibleStore = reducedMotion ? storeExamples[0] : currentStore.slice(0, typing.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function updateMotionPreference() {
      setReducedMotion(media.matches);
    }
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const isComplete = typing.length === currentStore.length;
    const delay = typing.deleting ? (typing.length === 0 ? 280 : 40) : isComplete ? 1800 : 85;
    const timeout = window.setTimeout(() => {
      setTyping((previous) => {
        if (previous.deleting) {
          if (previous.length === 0)
            return {
              index: (previous.index + 1) % storeExamples.length,
              length: 0,
              deleting: false,
            };
          return { ...previous, length: previous.length - 1 };
        }
        if (previous.length === currentStore.length) return { ...previous, deleting: true };
        return { ...previous, length: previous.length + 1 };
      });
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [typing, currentStore, reducedMotion]);

  return (
    <div className="border-b border-[#eee5dd] bg-[#fffdfb] p-3">
      <span className="sr-only">{url}</span>
      <div
        aria-hidden="true"
        className="flex items-center gap-2 rounded-full border border-[#e8ddd2] bg-[#f4eee7] py-1.5 pr-3 pl-1.5 shadow-[inset_0_1px_2px_rgba(41,37,31,0.03)]"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#ece5dc] bg-white text-[#477047] shadow-sm">
          <LockKeyhole size={12} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden font-mono text-[9px] tracking-tight whitespace-nowrap sm:text-[10px]">
          <span className="text-[#86786c]">{domain}/</span>
          <span className="font-semibold text-[#a03417]">{visibleStore}</span>
          <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-[#b13b19] motion-safe:animate-[hero-url-caret_1s_steps(1)_infinite] motion-reduce:hidden" />
        </div>
        <ArrowUpRight size={13} className="shrink-0 text-[#a99a8d]" strokeWidth={1.5} />
      </div>
      <style>{`@keyframes hero-url-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
    </div>
  );
}

export default HeroPreviewUrl;
