"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Search, Star, X } from "lucide-react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { formatRupiah } from "@/lib/format";
import { ALL_CATEGORY } from "../constants";
import { getContrastTextColor } from "../helpers";
import {
  formatStorefrontMessage,
  useStorefrontLocale,
} from "../storefront-locale";
import type { Item } from "../types";
import { NumericInput } from "../../../components/ui/numeric-input";

type AvailabilityFilter = "all" | "available" | "sold-out";
type SortOption = "default" | "name" | "price-low" | "price-high";
export type StorefrontMenuSheet = "browse" | null;

type StorefrontMenuProps = {
  items: Item[];
  categories: string[];
  active: string;
  query: string;
  onActiveChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSelect: (item: Item) => void;
  layout: "grid" | "list";
  showPrice: boolean;
  primaryColor: string;
  backgroundColor: string;
  sheet: StorefrontMenuSheet;
  onSheetChange: (sheet: StorefrontMenuSheet) => void;
};

function getCurrentPrice(item: Item) {
  return item.promo ?? item.price;
}

function normalizeMenuSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

function getMenuSearchRank(item: Item, query: string) {
  const name = normalizeMenuSearch(item.name);
  const category = normalizeMenuSearch(item.category);
  const description = normalizeMenuSearch(item.description);

  if (!query) return 0;
  if (name === query) return 100;
  if (name.startsWith(query)) return 90;
  if (name.split(/\s+/).some((word) => word.startsWith(query))) return 80;
  if (name.includes(query)) return 70;
  if (category.startsWith(query)) return 60;
  if (category.includes(query)) return 50;
  if (description.split(/\s+/).some((word) => word.startsWith(query))) return 40;
  if (description.includes(query)) return 30;
  return 0;
}

function StorefrontMenu({
  items,
  categories,
  active,
  query,
  onActiveChange,
  onQueryChange,
  onSelect,
  layout,
  showPrice,
  primaryColor,
  backgroundColor,
  sheet,
  onSheetChange,
}: StorefrontMenuProps) {
  const { locale, messages } = useStorefrontLocale();
  const text = messages.menu;
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const categoryCounts = useMemo(
    () =>
      items.reduce<Record<string, number>>((counts, item) => {
        counts[item.category] = (counts[item.category] ?? 0) + 1;
        return counts;
      }, {}),
    [items],
  );

  const visible = useMemo(() => {
    const normalizedQuery = normalizeMenuSearch(query);
    const min = minimumPrice === "" ? null : Number(minimumPrice);
    const max = maximumPrice === "" ? null : Number(maximumPrice);
    const matching = items.filter((item) => {
      const matchesCategory = active === ALL_CATEGORY || item.category === active;
      const matchesQuery =
        !normalizedQuery ||
        normalizeMenuSearch(`${item.name} ${item.description} ${item.category}`).includes(
          normalizedQuery,
        );
      const matchesAvailability =
        availability === "all" || (availability === "available" ? item.available : !item.available);
      const matchesFeatured = !featuredOnly || item.featured;
      const price = getCurrentPrice(item);
      const matchesMinimum = min === null || !Number.isFinite(min) || price >= min;
      const matchesMaximum = max === null || !Number.isFinite(max) || price <= max;

      return (
        matchesCategory &&
        matchesQuery &&
        matchesAvailability &&
        matchesFeatured &&
        matchesMinimum &&
        matchesMaximum
      );
    });

    if (sort === "name") {
      matching.sort((left, right) => left.name.localeCompare(right.name, locale));
    } else if (sort === "price-low") {
      matching.sort((left, right) => getCurrentPrice(left) - getCurrentPrice(right));
    } else if (sort === "price-high") {
      matching.sort((left, right) => getCurrentPrice(right) - getCurrentPrice(left));
    } else if (normalizedQuery) {
      matching.sort(
        (left, right) =>
          getMenuSearchRank(right, normalizedQuery) - getMenuSearchRank(left, normalizedQuery),
      );
    }

    return matching;
  }, [active, availability, featuredOnly, items, locale, maximumPrice, minimumPrice, query, sort]);

  const searchSuggestions = useMemo(() => {
    const normalizedQuery = normalizeMenuSearch(query);
    if (!normalizedQuery) return visible.slice(0, 5);

    return visible
      .map((item, index) => ({ item, index }))
      .sort((left, right) => {
        const relevance =
          getMenuSearchRank(right.item, normalizedQuery) -
          getMenuSearchRank(left.item, normalizedQuery);
        return relevance || left.index - right.index;
      })
      .slice(0, 5)
      .map(({ item }) => item);
  }, [query, visible]);

  const activeFilterCount =
    Number(active !== ALL_CATEGORY) +
    Number(availability !== "all") +
    Number(featuredOnly) +
    Number(minimumPrice !== "") +
    Number(maximumPrice !== "") +
    Number(sort !== "default");
  const hasAnyFilter = active !== ALL_CATEGORY || query.trim() !== "" || activeFilterCount > 0;
  const menuSheetStyle = {
    "--color-brand": primaryColor,
    backgroundColor: `color-mix(in srgb, ${backgroundColor} 22%, white)`,
  } as CSSProperties;

  useEffect(() => {
    if (!sheet) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (autocompleteOpen) {
        setAutocompleteOpen(false);
        return;
      }
      onSheetChange(null);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [autocompleteOpen, onSheetChange, sheet]);

  useEffect(() => {
    if (!sheet) setAutocompleteOpen(false);
  }, [sheet]);

  function clearFilters() {
    onActiveChange(ALL_CATEGORY);
    onQueryChange("");
    setAvailability("all");
    setFeaturedOnly(false);
    setMinimumPrice("");
    setMaximumPrice("");
    setSort("default");
  }

  function chooseItem(item: Item) {
    setAutocompleteOpen(false);
    onSheetChange(null);
    onSelect(item);
  }

  const sheetContent = (
    <AnimatePresence>
      {sheet && (
        <motion.div
          key="storefront-menu-panel"
          data-storefront-nav-panel
          className="fixed inset-x-0 bottom-[calc(4.3125rem+env(safe-area-inset-bottom))] z-[80] mx-auto flex w-full max-w-md justify-center sm:inset-x-auto sm:bottom-[5.75rem] sm:left-1/2 sm:w-[calc(100vw_-_2rem)] sm:-translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.section
            key="storefront-menu-sheet"
            className="text-ink flex h-fit max-h-[min(76dvh,44rem)] min-h-[min(46dvh,28rem)] w-full flex-col overflow-hidden rounded-3xl rounded-b-none shadow-[0_16px_70px_rgba(25,22,18,.22)]"
            style={menuSheetStyle}
            initial={{ scale: 0.985 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-labelledby="storefront-menu-sheet-title"
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-black/15" />
            <header className="relative z-20 w-full min-w-0 shrink-0 px-4 pt-3 pb-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 id="storefront-menu-sheet-title" className="display-font text-lg font-black">
                    {text.searchTitle}
                  </h2>
                  <p className="text-muted mt-0.5 text-xs leading-relaxed">{text.searchHint}</p>
                </div>
                <button
                  type="button"
                  className="focus-visible:outline-brand grid size-10 shrink-0 place-items-center rounded-full bg-white/70 text-[#5b554d] transition hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={() => onSheetChange(null)}
                  aria-label={text.close}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="border-line focus-within:border-brand focus-within:ring-brand/10 relative flex h-12 w-full max-w-full min-w-0 items-center gap-3 rounded-2xl border bg-white/85 px-3.5 shadow-sm transition focus-within:ring-4">
                <Search size={18} className="text-muted shrink-0" aria-hidden="true" />
                <label className="sr-only" htmlFor="storefront-menu-search">
                  {text.searchLabel}
                </label>
                <input
                  id="storefront-menu-search"
                  type="search"
                  className="text-ink min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a9a197]"
                  placeholder={text.searchPlaceholder}
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  onFocus={() => setAutocompleteOpen(true)}
                  onBlur={() => window.setTimeout(() => setAutocompleteOpen(false), 120)}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={autocompleteOpen}
                  aria-controls="storefront-menu-suggestions"
                  aria-label={text.searchLabel}
                />
                {query && (
                  <button
                    type="button"
                    className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-black/5"
                    onClick={() => onQueryChange("")}
                    aria-label={text.clearSearch}
                  >
                    <X size={16} />
                  </button>
                )}
                {autocompleteOpen && (
                  <div
                    id="storefront-menu-suggestions"
                    role="listbox"
                    aria-label={text.suggestions}
                    className="absolute top-full right-0 left-0 z-30 mt-2 max-h-[min(38dvh,18rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[#e6e2db] bg-white p-2 shadow-[0_16px_40px_rgba(25,22,18,.18)]"
                  >
                    <p className="px-2 py-1.5 text-[10px] font-bold tracking-wide text-[#898176] uppercase">
                      {query.trim() ? text.matching : text.picks}
                    </p>
                    {searchSuggestions.length ? (
                      searchSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected="false"
                          className="flex w-full min-w-0 items-center gap-2.5 rounded-xl p-2 text-left transition hover:bg-[#f6f4f0] focus-visible:bg-[#f6f4f0] focus-visible:outline-none"
                          onClick={() => chooseItem(item)}
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="size-10 shrink-0 rounded-lg object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold text-[#302b25]">
                              {item.name}
                            </span>
                            <span className="block truncate text-[10px] text-[#898176]">
                              {item.category}
                            </span>
                          </span>
                          {showPrice && (
                            <span className="shrink-0 text-[11px] font-extrabold text-[var(--color-brand)]">
                              {formatRupiah(getCurrentPrice(item))}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="px-2 py-4 text-center text-xs text-[#898176]">
                        {text.notFound}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-muted mt-2 text-[11px]" aria-live="polite">
                {formatStorefrontMessage(text.resultCount, { count: visible.length })}
              </p>
            </header>

            <div className="min-h-0 w-full max-w-full min-w-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-contain px-4 pb-4">
              <div className="grid w-full min-w-0 gap-4">
                <fieldset className="w-full max-w-full min-w-0">
                  <legend className="mb-2 text-xs font-extrabold">{text.category}</legend>
                  <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={active === category}
                        className={
                          "focus-visible:outline-brand inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 " +
                          (active === category
                            ? "border-brand bg-brand text-white shadow-sm"
                            : "border-line hover:border-brand/40 hover:bg-brand/5 hover:text-brand bg-white/80 text-[#5b554d]")
                        }
                        style={
                          active === category
                            ? {
                                backgroundColor: primaryColor,
                                borderColor: primaryColor,
                                color: getContrastTextColor(primaryColor),
                              }
                            : undefined
                        }
                        onClick={() => onActiveChange(category)}
                      >
                        <span>{category === ALL_CATEGORY ? text.all : category}</span>
                        <span
                          className={
                            "grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] " +
                            (active === category ? "bg-white/20" : "bg-black/5")
                          }
                        >
                          {category === ALL_CATEGORY
                            ? items.length
                            : (categoryCounts[category] ?? 0)}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="w-full max-w-full min-w-0">
                  <legend className="mb-2 text-xs font-extrabold">{text.availability}</legend>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["all", text.all],
                        ["available", text.available],
                        ["sold-out", text.soldOut],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={availability === value}
                        className={
                          "focus-visible:outline-brand rounded-full border px-3.5 py-2.5 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 " +
                          (availability === value
                            ? "border-brand bg-brand text-white shadow-sm"
                            : "border-line hover:border-brand/40 hover:bg-brand/5 hover:text-brand bg-white/80 text-[#5b554d]")
                        }
                        style={
                          availability === value
                            ? {
                                backgroundColor: primaryColor,
                                borderColor: primaryColor,
                                color: getContrastTextColor(primaryColor),
                              }
                            : undefined
                        }
                        onClick={() => setAvailability(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="border-line hover:border-brand/30 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border bg-white/75 px-4 py-3 text-xs font-semibold text-[#403a34] transition hover:bg-white">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--color-brand)]"
                    checked={featuredOnly}
                    onChange={(event) => setFeaturedOnly(event.target.checked)}
                  />
                  <span className="bg-brand/10 text-brand grid size-8 place-items-center rounded-xl">
                    <Star size={15} aria-hidden="true" />
                  </span>
                  <span className="flex-1">{text.featuredOnly}</span>
                </label>

                {showPrice && (
                  <fieldset className="w-full max-w-full min-w-0">
                    <legend className="mb-2 text-xs font-extrabold">{text.priceRange}</legend>
                    <div className="grid min-w-0 grid-cols-2 gap-2.5">
                      <label className="grid min-w-0 gap-1.5 text-[10px] font-bold text-[#70695f]">
                        {text.minPrice}
                        <NumericInput
                          prefix="Rp"
                          value={minimumPrice}
                          onChange={(event) => setMinimumPrice(event.target.value)}
                          placeholder="0"
                          aria-label={text.minPrice}
                        />
                      </label>
                      <label className="grid min-w-0 gap-1.5 text-[10px] font-bold text-[#70695f]">
                        {text.maxPrice}
                        <NumericInput
                          prefix="Rp"
                          value={maximumPrice}
                          onChange={(event) => setMaximumPrice(event.target.value)}
                          placeholder="0"
                          aria-label={text.maxPrice}
                        />
                      </label>
                    </div>
                  </fieldset>
                )}

                <label className="flex w-full min-w-0 flex-col gap-2 text-xs font-extrabold">
                  {text.sort}
                  <Autocomplete
                    id="storefront-menu-sort"
                    name={text.sort}
                    aria-label={text.sort}
                    options={[
                      {
                        value: "default",
                        label: query.trim() ? text.sortRelevant : text.sortDefault,
                      },
                      { value: "name", label: text.sortAZ },
                      ...(showPrice
                        ? [
                            { value: "price-low", label: text.priceLow },
                            { value: "price-high", label: text.priceHigh },
                          ]
                        : []),
                    ]}
                    value={sort}
                    onValueChange={(value) => setSort(value as SortOption)}
                    translations={{
                      chooseOption: text.sort,
                      notSelected: text.sortDefault,
                      close: text.close,
                      optionList: text.sort,
                      search: text.searchPlaceholder,
                      noResults: text.notFound,
                      noResultsHint: text.emptyQuery,
                      placeholder: text.sort,
                    }}
                  />
                </label>
              </div>
            </div>

            <footer className="border-line flex shrink-0 items-center gap-3 border-t bg-white/80 px-4 pt-3 pb-3 backdrop-blur-xl">
              {hasAnyFilter && (
                <button
                  type="button"
                  className="text-brand shrink-0 px-2 text-xs font-bold"
                  onClick={clearFilters}
                >
                  {text.reset}
                </button>
              )}
              <button
                type="button"
                className="bg-brand hover:bg-brand-dark shadow-brand/15 focus-visible:outline-brand flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-extrabold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0"
                style={{ backgroundColor: primaryColor, color: getContrastTextColor(primaryColor) }}
                onClick={() => onSheetChange(null)}
              >
                {formatStorefrontMessage(text.showResults, { count: visible.length })}
                <Check size={16} />
              </button>
            </footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <section id="menu" className="scroll-mt-3 px-5 py-8">
        <header className="mb-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
              {text.eyebrow}
            </span>
            <h2 className="display-font text-2xl font-black">{text.title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-muted text-xs" aria-live="polite">
              {formatStorefrontMessage(text.resultLead, { count: visible.length })}
            </span>
          </div>
        </header>

        {visible.length ? (
          <div className={layout === "list" ? "grid gap-3" : "grid grid-cols-2 gap-x-3 gap-y-7"}>
            {visible.map((item) => (
              <button
                type="button"
                className={`group focus-visible:outline-brand min-w-0 text-left transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[.99] ${
                  layout === "list"
                    ? "border-line hover:border-brand/35 grid grid-cols-[92px_1fr] gap-3 rounded-2xl border bg-white/90 p-2.5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
                    : "border-line/75 hover:border-brand/35 overflow-hidden rounded-2xl border bg-white/90 shadow-sm hover:-translate-y-1 hover:shadow-xl"
                } ${!item.available ? "opacity-60 grayscale" : ""}`}
                key={item.id}
                onClick={() => onSelect(item)}
              >
                <div
                  className={`relative overflow-hidden rounded-xl bg-[#eee] ${
                    layout === "list" ? "aspect-square rounded-xl" : "aspect-[4/3] rounded-none"
                  }`}
                >
                  <img
                    className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                    src={item.image}
                    alt={item.name}
                  />
                  {item.featured && (
                    <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-1 text-[9px] font-black">
                      {text.recommendation}
                    </span>
                  )}
                  {!item.available && (
                    <span className="bg-charcoal absolute top-2 left-2 rounded-full px-2 py-1 text-[9px] font-black text-white">
                      {text.soldOut}
                    </span>
                  )}
                </div>
                <div className={layout === "list" ? "min-w-0 self-center pr-2" : "min-w-0 p-3"}>
                  <h3 className="truncate text-sm font-extrabold">{item.name}</h3>
                  <p className="text-muted line-clamp-2 min-h-8 text-[11px] leading-4">
                    {item.description || text.descriptionFallback}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    {showPrice ? (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        {item.promo && <s className="text-muted">{formatRupiah(item.price)}</s>}
                        <strong className="text-brand">
                          {formatRupiah(getCurrentPrice(item))}
                        </strong>
                      </div>
                    ) : (
                      <span />
                    )}
                    {layout === "list" && (
                      <span
                        className="text-brand bg-brand/10 group-hover:bg-brand grid size-8 shrink-0 place-items-center rounded-full transition duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent-foreground)]"
                        style={
                          {
                            "--accent-foreground": getContrastTextColor(primaryColor),
                          } as CSSProperties
                        }
                      >
                        <ChevronRight size={16} />
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="border-line text-muted rounded-xl border border-dashed p-10 text-center text-sm">
            <h3 className="display-font text-ink text-xl font-black">
              {items.length === 0 ? text.noProducts : text.notFound}
            </h3>
            <p className="mt-1">{items.length === 0 ? text.merchantNoProducts : text.emptyQuery}</p>
            {items.length > 0 && hasAnyFilter && (
              <button
                type="button"
                className="text-brand mt-3 font-bold underline underline-offset-2"
                onClick={clearFilters}
              >
                {text.showAll}
              </button>
            )}
          </div>
        )}
      </section>
      {typeof document !== "undefined" && createPortal(sheetContent, document.body)}
    </>
  );
}

export default StorefrontMenu;
