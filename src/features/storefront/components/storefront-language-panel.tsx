"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Check, Globe2, X } from "lucide-react";
import { LanguageFlag } from "@/components/ui/language-autocomplete";
import { languageOptions } from "@/i18n/language-options";
import type { Locale } from "@/i18n/config";
import { getContrastTextColor } from "../helpers";

type StorefrontLanguagePanelProps = {
  open: boolean;
  label: string;
  closeLabel: string;
  value: Locale;
  primaryColor: string;
  backgroundColor: string;
  onValueChange: (locale: Locale) => void;
  onClose: () => void;
};

function focusLanguageTrigger() {
  document
    .querySelector<HTMLButtonElement>("[data-storefront-language-trigger]")
    ?.focus({ preventScroll: true });
}

function StorefrontLanguagePanel({
  open,
  label,
  closeLabel,
  value,
  primaryColor,
  backgroundColor,
  onValueChange,
  onClose,
}: StorefrontLanguagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const selectedLanguage =
    languageOptions.find((option) => option.value === value) ?? languageOptions[0];

  const contrastColor = getContrastTextColor(primaryColor);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      const selected = selectedRef.current;
      const list = listRef.current;

      selected?.focus({ preventScroll: true });

      if (!selected || !list) return;

      const selectedBounds = selected.getBoundingClientRect();
      const listBounds = list.getBoundingClientRect();

      // Scroll hanya daftar bahasa, bukan halaman.
      if (selectedBounds.top < listBounds.top) {
        list.scrollTop += selectedBounds.top - listBounds.top;
      } else if (selectedBounds.bottom > listBounds.bottom) {
        list.scrollTop += selectedBounds.bottom - listBounds.bottom;
      }
    });

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      onClose();
      focusLanguageTrigger();
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      if (panelRef.current?.contains(target) || target.closest("[data-storefront-bottom-nav]")) {
        return;
      }

      onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onClose]);

  function closePanel() {
    onClose();
    focusLanguageTrigger();
  }

  function selectLanguage(locale: Locale) {
    onValueChange(locale);
    onClose();
    focusLanguageTrigger();
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[95] flex justify-center sm:bottom-[5.75rem] sm:px-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-labelledby={titleId}
        aria-modal={false}
        className="pointer-events-auto flex max-h-[calc(100dvh_-_5.5rem_-_env(safe-area-inset-bottom))] w-full min-w-0 flex-col overflow-hidden rounded-t-[1.75rem] border border-b-0 p-4 shadow-[0_-12px_40px_-20px_rgba(0,0,0,.25)] motion-safe:animate-[storefront-language-panel-in_.22s_ease-out_both] sm:max-h-[calc(100dvh_-_6.75rem)] sm:max-w-md sm:p-5"
        style={
          {
            "--color-brand": primaryColor,
            backgroundColor: `color-mix(in srgb, ${backgroundColor} 22%, white)`,
            borderColor: `color-mix(in srgb, ${primaryColor} 25%, transparent)`,
          } as CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-black/15"
        />

        <div className="mb-4 flex shrink-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-xl"
            style={{
              backgroundColor: primaryColor,
              color: contrastColor,
            }}
          >
            <Globe2 size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-base font-extrabold text-[#29251f]">
              {label}
            </h2>

            <p className="mt-0.5 text-xs text-[#756f65]">{selectedLanguage.label}</p>
          </div>

          <button
            type="button"
            aria-label={closeLabel}
            onClick={closePanel}
            className="focus-visible:outline-brand grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-[#62594f] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div
          ref={listRef}
          className="grid min-h-0 grid-cols-2 content-start gap-2.5 overflow-y-auto overscroll-contain p-1"
        >
          {languageOptions.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                ref={selected ? selectedRef : undefined}
                type="button"
                aria-pressed={selected}
                onClick={() => selectLanguage(option.value)}
                className="focus-visible:outline-brand flex min-h-14 min-w-0 items-center gap-2.5 rounded-2xl border px-3 py-3 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[.98] motion-reduce:transition-none"
                style={
                  selected
                    ? {
                        backgroundColor: primaryColor,
                        color: contrastColor,
                        borderColor: primaryColor,
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,.85)",
                        color: "#514a42",
                        borderColor: "rgba(0,0,0,.04)",
                      }
                }
              >
                <span aria-hidden="true" className="inline-flex shrink-0">
                  <LanguageFlag flag={option.flag} />
                </span>

                <span className="min-w-0 flex-1 text-xs leading-5 font-semibold break-words">
                  {option.label}
                </span>

                {selected && <Check aria-hidden="true" size={15} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        <style>{`
          @keyframes storefront-language-panel-in {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>,
    document.body,
  );
}

export default StorefrontLanguagePanel;
