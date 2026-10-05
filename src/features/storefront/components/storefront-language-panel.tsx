"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe2, X } from "lucide-react";
import { languageOptions } from "@/i18n/language-options";
import type { Locale } from "@/i18n/config";
import { getContrastTextColor } from "@/features/storefront/helpers";

export default function StorefrontLanguagePanel({
  open,
  label,
  closeLabel,
  value,
  primaryColor,
  backgroundColor,
  onValueChange,
  onClose,
}: {
  open: boolean;
  label: string;
  closeLabel: string;
  value: Locale;
  primaryColor: string;
  backgroundColor: string;
  onValueChange: (locale: Locale) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const selectedOption = languageOptions.find((option) => option.value === value);
  const panelStyle = {
    backgroundColor: `color-mix(in srgb, ${backgroundColor} 22%, white)`,
  } as CSSProperties;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.section
          ref={panelRef}
          className="text-ink fixed inset-x-0 bottom-[calc(4.3125rem+env(safe-area-inset-bottom))] z-[95] mx-auto flex max-h-[min(72dvh,38rem)] min-h-[min(40dvh,24rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl rounded-b-none border border-[#e9dfd7] p-4 shadow-[0_16px_70px_rgba(25,22,18,.24)] sm:inset-x-auto sm:bottom-[5.75rem] sm:left-1/2 sm:w-[calc(100vw_-_2rem)] sm:-translate-x-1/2 sm:rounded-b-none"
          style={panelStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-labelledby="storefront-language-title"
        >
          <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-black/15" />
          <header className="mb-3 flex shrink-0 items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-2xl"
              style={{
                color: getContrastTextColor(primaryColor),
                backgroundColor: primaryColor,
              }}
            >
              <Globe2 size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="storefront-language-title" className="display-font text-base font-black">
                {label}
              </h2>
              <p className="text-muted text-xs">{selectedOption?.label}</p>
            </div>
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/75 text-[#5b554d] transition hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b13b19]"
              onClick={onClose}
              aria-label={closeLabel}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto">
            {languageOptions.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  className={`flex min-h-12 min-w-0 items-center gap-2 rounded-2xl border px-3 text-left text-xs font-bold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b13b19] ${selected ? "shadow-sm" : "border-black/5 bg-white/75 text-[#4d473f] hover:bg-white"}`}
                  style={
                    selected
                      ? {
                          borderColor: primaryColor,
                          color: getContrastTextColor(primaryColor),
                          backgroundColor: primaryColor,
                        }
                      : undefined
                  }
                  onClick={() => {
                    onValueChange(option.value);
                    onClose();
                  }}
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    {option.flag}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {selected && <Check size={15} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </motion.section>
      )}
    </AnimatePresence>,
    document.body,
  );
}
