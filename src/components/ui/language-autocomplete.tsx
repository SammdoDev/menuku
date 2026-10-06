"use client";

import { Check, ChevronDown, Globe2, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { languageOptions } from "@/i18n/language-options";
import type { Locale } from "@/i18n/config";

type LanguageAutocompleteProps = {
  value: Locale;
  label: string;
  searchLabel: string;
  noResultsLabel: string;
  onValueChange: (locale: Locale) => void;
  placement?: "top" | "bottom";
  compact?: boolean;
};

function getFlagCountryCode(flag: string) {
  const characters = Array.from(flag.trim());
  const isEmojiFlag =
    characters.length === 2 &&
    characters.every((character) => {
      const code = character.codePointAt(0) ?? 0;
      return code >= 127462 && code <= 127487;
    });
  if (isEmojiFlag)
    return characters
      .map((character) => String.fromCharCode((character.codePointAt(0) ?? 0) - 127397))
      .join("")
      .toLowerCase();
  const code = flag.trim().toLowerCase();
  return code === "uk" ? "gb" : code;
}

export function LanguageFlag({ flag }: { flag: string }) {
  const countryCode = getFlagCountryCode(flag);
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://flagcdn.com/28x21/${countryCode}.png`}
      srcSet={`https://flagcdn.com/56x42/${countryCode}.png 2x`}
      alt=""
      aria-hidden="true"
      width={28}
      height={21}
      draggable={false}
      className="block h-[21px] w-7 shrink-0 rounded-[3px] object-cover ring-1 ring-black/10"
    />
  );
}

function LanguageAutocomplete({
  value,
  label,
  searchLabel,
  noResultsLabel,
  onValueChange,
  placement = "bottom",
  compact = false,
}: LanguageAutocompleteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const generatedId = useId().replace(/:/g, "");
  const listboxId = `language-options-${generatedId}`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedOption =
    languageOptions.find((option) => option.value === value) ?? languageOptions[0];

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return languageOptions.filter((option) =>
      `${option.label} ${option.shortLabel} ${option.value}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);
  const safeActiveIndex = Math.max(0, Math.min(activeIndex, filteredOptions.length - 1));

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || !filteredOptions.length) return;
    const list = listRef.current;
    const option = document.getElementById(`${listboxId}-${safeActiveIndex}`);
    if (!list || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight)
      list.scrollTop = bottom - list.clientHeight;
  }, [open, safeActiveIndex, filteredOptions.length, listboxId]);

  function openMenu() {
    setQuery("");
    setActiveIndex(
      Math.max(
        languageOptions.findIndex((option) => option.value === value),
        0,
      ),
    );
    setOpen(true);
  }
  function closeMenu(restoreFocus = false) {
    setOpen(false);
    setQuery("");
    if (restoreFocus) triggerRef.current?.focus();
  }
  function selectOption(index: number) {
    const option = filteredOptions[index];
    if (!option) return;
    closeMenu(true);
    onValueChange(option.value);
  }
  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      closeMenu(true);
    }
  }
  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(filteredOptions.length ? (safeActiveIndex + 1) % filteredOptions.length : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        filteredOptions.length
          ? (safeActiveIndex - 1 + filteredOptions.length) % filteredOptions.length
          : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectOption(safeActiveIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
    }
  }

  return (
    <div
      ref={rootRef}
      className={compact ? "relative min-w-0 flex-1" : "relative shrink-0"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        title={`${label}: ${selectedOption.label}`}
        aria-label={`${label}: ${selectedOption.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={`flex items-center justify-center border text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b13b19] motion-reduce:transition-none ${compact ? "min-h-[3.5rem] w-full flex-col gap-1 rounded-2xl text-[9px]" : "h-10 gap-2 rounded-xl px-3"} ${open ? "border-[#efc7b5] bg-[#fff1e9] text-[#a03417]" : "border-transparent text-[#29251f] hover:border-[#eee5dd] hover:bg-[#f7f2ed]"}`}
      >
        <Globe2 aria-hidden="true" size={compact ? 18 : 16} className="shrink-0" />
        <span>{selectedOption.shortLabel}</span>
        {!compact && (
          <ChevronDown
            aria-hidden="true"
            size={12}
            className={`text-[#827b72] transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {open && (
        <div
          className={`absolute right-0 z-50 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#e9dfd7] bg-white p-2 shadow-[0_16px_40px_-16px_rgba(41,37,31,.25)] motion-safe:animate-[language-popup-in_.18s_ease-out_both] ${placement === "top" ? "bottom-[calc(100%+0.55rem)] origin-bottom-right" : "top-[calc(100%+0.55rem)] origin-top-right"}`}
        >
          <div className="flex h-10 items-center gap-2 rounded-xl border border-[#eee8e1] bg-[#faf8f5] px-3 focus-within:border-[#b13b19]/50 focus-within:ring-2 focus-within:ring-[#b13b19]/10">
            <Search aria-hidden="true" className="shrink-0 text-[#827b72]" size={15} />
            <input
              ref={searchRef}
              role="combobox"
              aria-label={searchLabel}
              aria-autocomplete="list"
              aria-expanded={true}
              aria-controls={listboxId}
              aria-activedescendant={
                filteredOptions.length ? `${listboxId}-${safeActiveIndex}` : undefined
              }
              autoComplete="off"
              placeholder={searchLabel}
              value={query}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#aaa39a]"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="relative mt-2 max-h-64 overflow-y-auto"
          >
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  id={`${listboxId}-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(index)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors duration-150 motion-reduce:transition-none ${index === safeActiveIndex ? "bg-[#fff1e9]" : "hover:bg-[#faf8f5]"}`}
                >
                  <span aria-hidden="true" className="inline-flex">
                    <LanguageFlag flag={option.flag} />
                  </span>
                  <span className="min-w-0 flex-1 font-semibold">{option.label}</span>
                  {option.value === value && (
                    <Check
                      aria-hidden="true"
                      size={16}
                      className="shrink-0 text-[#b13b19] motion-safe:animate-[language-flag-in_.2s_ease-out_both]"
                    />
                  )}
                </button>
              ))
            ) : (
              <p role="status" className="px-3 py-4 text-center text-xs text-[#827b72]">
                {noResultsLabel}
              </p>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes language-popup-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes language-flag-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default LanguageAutocomplete;
