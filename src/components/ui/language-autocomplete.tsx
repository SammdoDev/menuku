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
};

function LanguageAutocomplete({
  value,
  label,
  searchLabel,
  noResultsLabel,
  onValueChange,
}: LanguageAutocompleteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
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

  function selectOption(index: number) {
    const option = filteredOptions[index];
    if (!option) return;
    onValueChange(option.value);
    setQuery("");
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        filteredOptions.length ? (index + 1) % filteredOptions.length : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        filteredOptions.length ? (index - 1 + filteredOptions.length) % filteredOptions.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectOption(activeIndex);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-label={`${label}: ${selectedOption.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="inline-flex h-10 min-w-[82px] items-center justify-center gap-2 rounded-xl px-2 text-xs font-bold text-[#29251f] transition hover:bg-[#f7f2ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b13b19]"
        onClick={() => {
          if (!open) {
            setQuery("");
            setActiveIndex(
              Math.max(
                languageOptions.findIndex((option) => option.value === value),
                0,
              ),
            );
          }
          setOpen((isOpen) => !isOpen);
        }}
        ref={triggerRef}
        type="button"
      >
        <Globe2 aria-hidden="true" className="text-[#a34a2b]" size={15} />
        <span aria-hidden="true" className="text-base leading-none">
          {selectedOption.flag}
        </span>
        <span>{selectedOption.shortLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`text-[#827b72] transition ${open ? "rotate-180" : ""}`}
          size={13}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+0.55rem)] right-0 z-50 w-64 overflow-hidden rounded-2xl border border-[#e9dfd7] bg-white p-2 shadow-[0_20px_60px_-20px_rgba(41,37,31,.32)]">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-[#eee8e1] bg-[#faf8f5] px-3 focus-within:border-[#b13b19]/50 focus-within:ring-2 focus-within:ring-[#b13b19]/10">
            <Search aria-hidden="true" className="shrink-0 text-[#827b72]" size={15} />
            <input
              aria-activedescendant={
                filteredOptions.length ? `${listboxId}-${activeIndex}` : undefined
              }
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-label={searchLabel}
              aria-expanded="true"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#aaa39a]"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchLabel}
              ref={searchRef}
              role="combobox"
              value={query}
            />
          </div>

          <div
            className="mt-2 max-h-64 overflow-y-auto"
            id={listboxId}
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => {
                const selected = option.value === value;
                const active = index === activeIndex;
                return (
                  <button
                    aria-selected={selected}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition ${active ? "bg-[#fff1e9]" : "hover:bg-[#faf8f5]"}`}
                    id={`${listboxId}-${index}`}
                    key={option.value}
                    onClick={() => selectOption(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    type="button"
                  >
                    <span aria-hidden="true" className="text-lg leading-none">
                      {option.flag}
                    </span>
                    <span className="min-w-0 flex-1 font-semibold">{option.label}</span>
                    {selected && <Check aria-hidden="true" className="text-[#b13b19]" size={16} />}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-4 text-center text-xs text-[#827b72]">{noResultsLabel}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageAutocomplete;
