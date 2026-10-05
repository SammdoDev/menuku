import { forwardRef, useEffect, useMemo, useState } from "react";
import type { ForwardedRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { Item } from "@/features/storefront/types";

type AvailabilityFilter = "all" | "available" | "sold-out";
type SortOption = "default" | "name" | "price-low" | "price-high";
export type StorefrontMenuSheet = "search" | "filter" | null;

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
  sheet: StorefrontMenuSheet;
  onSheetChange: (sheet: StorefrontMenuSheet) => void;
};

function getCurrentPrice(item: Item) {
  return item.promo ?? item.price;
}

function StorefrontMenuComponent(
  {
    items,
    categories,
    active,
    query,
    onActiveChange,
    onQueryChange,
    onSelect,
    layout,
    showPrice,
    sheet,
    onSheetChange,
  }: StorefrontMenuProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const categoryCounts = useMemo(
    () =>
      items.reduce<Record<string, number>>((counts, item) => {
        counts[item.category] = (counts[item.category] ?? 0) + 1;
        return counts;
      }, {}),
    [items],
  );

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    const min = minimumPrice === "" ? null : Number(minimumPrice);
    const max = maximumPrice === "" ? null : Number(maximumPrice);
    const matching = items.filter((item) => {
      const matchesCategory = active === "Semua" || item.category === active;
      const matchesQuery =
        !normalizedQuery ||
        `${item.name} ${item.description} ${item.category}`
          .toLocaleLowerCase("id-ID")
          .includes(normalizedQuery);
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
      matching.sort((left, right) => left.name.localeCompare(right.name, "id-ID"));
    } else if (sort === "price-low") {
      matching.sort((left, right) => getCurrentPrice(left) - getCurrentPrice(right));
    } else if (sort === "price-high") {
      matching.sort((left, right) => getCurrentPrice(right) - getCurrentPrice(left));
    }

    return matching;
  }, [active, availability, featuredOnly, items, maximumPrice, minimumPrice, query, sort]);

  const activeFilterCount =
    Number(availability !== "all") +
    Number(featuredOnly) +
    Number(minimumPrice !== "") +
    Number(maximumPrice !== "") +
    Number(sort !== "default");
  const hasAnyFilter = active !== "Semua" || query.trim() !== "" || activeFilterCount > 0;

  useEffect(() => {
    if (!sheet) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onSheetChange(null);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSheetChange, sheet]);

  function clearFilters() {
    onActiveChange("Semua");
    onQueryChange("");
    setAvailability("all");
    setFeaturedOnly(false);
    setMinimumPrice("");
    setMaximumPrice("");
    setSort("default");
  }

  function chooseItem(item: Item) {
    onSheetChange(null);
    onSelect(item);
  }

  const sheetContent = (
    <AnimatePresence>
      {sheet && (
        <motion.div
          key="storefront-menu-backdrop"
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onSheetChange(null)}
        >
          <motion.section
            key="storefront-menu-sheet"
            className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl sm:max-w-xl sm:rounded-t-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="storefront-menu-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#dedbd5]" />
            <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
              <div>
                <h2 id="storefront-menu-sheet-title" className="text-lg font-black">
                  {sheet === "search" ? "Cari menu" : "Filter menu"}
                </h2>
                <p className="text-muted mt-0.5 text-xs">
                  {sheet === "search"
                    ? "Cari nama menu, kategori, atau deskripsi."
                    : "Atur kategori, ketersediaan, dan urutan menu."}
                </p>
              </div>
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f4f2ef] text-[#5b554d]"
                onClick={() => onSheetChange(null)}
                aria-label="Tutup panel"
              >
                <X size={18} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
              {sheet === "search" ? (
                <div>
                  <div className="border-line focus-within:border-brand focus-within:ring-brand/10 flex h-12 items-center gap-2 rounded-xl border px-3 transition focus-within:ring-4">
                    <Search size={18} className="text-muted" aria-hidden="true" />
                    <label className="sr-only" htmlFor="storefront-menu-search">
                      Cari nama menu, kategori, atau deskripsi
                    </label>
                    <input
                      id="storefront-menu-search"
                      ref={ref}
                      type="search"
                      className="text-ink min-w-0 flex-1 bg-transparent text-sm outline-none"
                      placeholder="Contoh: nasi goreng..."
                      value={query}
                      onChange={(event) => onQueryChange(event.target.value)}
                      aria-label="Cari nama menu, kategori, atau deskripsi"
                    />
                    {query && (
                      <button
                        type="button"
                        className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-black/5"
                        onClick={() => onQueryChange("")}
                        aria-label="Hapus pencarian"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold">Menu yang cocok</h3>
                    <span className="text-muted text-xs" aria-live="polite">
                      {visible.length} menu
                    </span>
                  </div>
                  {visible.length ? (
                    <div className="mt-2 grid gap-2">
                      {visible.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="border-line flex min-w-0 items-center gap-3 rounded-xl border p-2 text-left transition hover:bg-[#faf9f6]"
                          onClick={() => chooseItem(item)}
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="size-12 shrink-0 rounded-lg object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{item.name}</span>
                            <span className="text-muted block truncate text-[11px]">
                              {item.category} · {item.available ? "Tersedia" : "Habis"}
                            </span>
                            {showPrice && (
                              <span className="text-brand mt-0.5 block text-xs font-extrabold">
                                {formatRupiah(getCurrentPrice(item))}
                              </span>
                            )}
                          </span>
                          <ChevronRight size={17} className="text-muted shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="border-line text-muted mt-2 rounded-xl border border-dashed p-6 text-center text-sm">
                      Menu yang cocok belum ditemukan.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-5">
                  <fieldset>
                    <legend className="mb-2 text-xs font-extrabold">Kategori</legend>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          aria-pressed={active === category}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active === category ? "border-charcoal bg-charcoal text-white" : "border-line hover:border-charcoal/40 bg-white text-[#5b554d]"}`}
                          onClick={() => onActiveChange(category)}
                        >
                          {category} (
                          {category === "Semua" ? items.length : (categoryCounts[category] ?? 0)})
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 text-xs font-extrabold">Ketersediaan</legend>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["all", "Semua"],
                          ["available", "Tersedia"],
                          ["sold-out", "Habis"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={availability === value}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${availability === value ? "border-charcoal bg-charcoal text-white" : "border-line hover:border-charcoal/40 bg-white text-[#5b554d]"}`}
                          onClick={() => setAvailability(value)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="border-line flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-[#403a34]">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--color-brand)]"
                      checked={featuredOnly}
                      onChange={(event) => setFeaturedOnly(event.target.checked)}
                    />
                    <Star size={15} className="text-brand" aria-hidden="true" />
                    Hanya menu rekomendasi
                  </label>

                  {showPrice && (
                    <fieldset>
                      <legend className="mb-2 text-xs font-extrabold">Rentang harga</legend>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="border-line text-muted focus-within:border-brand flex min-w-0 items-center gap-1 rounded-xl border px-3 py-2 text-xs">
                          <span>Rp</span>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            inputMode="numeric"
                            value={minimumPrice}
                            onChange={(event) => setMinimumPrice(event.target.value)}
                            className="text-ink w-full min-w-0 bg-transparent text-sm outline-none"
                            placeholder="Min"
                            aria-label="Harga minimum"
                          />
                        </label>
                        <label className="border-line text-muted focus-within:border-brand flex min-w-0 items-center gap-1 rounded-xl border px-3 py-2 text-xs">
                          <span>Rp</span>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            inputMode="numeric"
                            value={maximumPrice}
                            onChange={(event) => setMaximumPrice(event.target.value)}
                            className="text-ink w-full min-w-0 bg-transparent text-sm outline-none"
                            placeholder="Maks"
                            aria-label="Harga maksimum"
                          />
                        </label>
                      </div>
                    </fieldset>
                  )}

                  <label className="flex flex-col gap-2 text-xs font-extrabold">
                    Urutkan menu
                    <select
                      className="border-line focus:border-brand h-11 rounded-xl border bg-white px-3 text-sm font-medium outline-none"
                      value={sort}
                      onChange={(event) => setSort(event.target.value as SortOption)}
                    >
                      <option value="default">Urutan awal</option>
                      <option value="name">Nama, A–Z</option>
                      {showPrice && <option value="price-low">Harga terendah</option>}
                      {showPrice && <option value="price-high">Harga tertinggi</option>}
                    </select>
                  </label>
                </div>
              )}
            </div>

            <footer className="border-line flex shrink-0 items-center gap-3 border-t bg-white px-5 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {sheet === "filter" && hasAnyFilter && (
                <button
                  type="button"
                  className="text-brand shrink-0 text-xs font-bold"
                  onClick={clearFilters}
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                className="bg-brand hover:bg-brand-dark flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold text-white transition"
                onClick={() => onSheetChange(null)}
              >
                {sheet === "filter" ? `Tampilkan ${visible.length} menu` : "Selesai mencari"}
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
      <section id="menu" className="scroll-mt-3 px-5 py-8 sm:px-12 sm:py-10">
        <header className="mb-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
              Daftar menu
            </span>
            <h2 className="display-font text-2xl font-black sm:text-3xl">Temukan favoritmu</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-muted text-xs" aria-live="polite">
              {visible.length} menu
            </span>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                className="border-line grid size-10 place-items-center rounded-xl border bg-white text-[#5b554d]"
                onClick={() => onSheetChange("search")}
                aria-label="Cari menu"
              >
                <Search size={17} />
              </button>
              <button
                type="button"
                className="border-line relative grid size-10 place-items-center rounded-xl border bg-white text-[#5b554d]"
                onClick={() => onSheetChange("filter")}
                aria-label="Filter menu"
              >
                <SlidersHorizontal size={17} />
                {activeFilterCount > 0 && (
                  <span className="bg-brand absolute -top-1 -right-1 grid size-4 place-items-center rounded-full text-[9px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {visible.length ? (
          <div
            className={
              layout === "list"
                ? "grid gap-3"
                : "grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4"
            }
          >
            {visible.map((item) => (
              <button
                type="button"
                className={`min-w-0 text-left ${
                  layout === "list"
                    ? "border-line group grid grid-cols-[92px_1fr] gap-3 rounded-2xl border bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[124px_1fr] sm:gap-4 sm:p-3"
                    : ""
                } ${!item.available ? "opacity-60 grayscale" : ""}`}
                key={item.id}
                onClick={() => onSelect(item)}
              >
                <div
                  className={`relative overflow-hidden rounded-xl bg-[#eee] ${
                    layout === "list" ? "aspect-square sm:aspect-[4/3]" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    className="size-full object-cover transition duration-300 hover:scale-105"
                    src={item.image}
                    alt={item.name}
                  />
                  {item.featured && (
                    <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-1 text-[9px] font-black">
                      Rekomendasi
                    </span>
                  )}
                  {!item.available && (
                    <span className="bg-charcoal absolute top-2 left-2 rounded-full px-2 py-1 text-[9px] font-black text-white">
                      Habis
                    </span>
                  )}
                </div>
                <div className={layout === "list" ? "min-w-0 self-center pr-2" : ""}>
                  <h3
                    className={`${layout === "list" ? "mt-0" : "mt-2"} truncate text-sm font-extrabold`}
                  >
                    {item.name}
                  </h3>
                  <p className="text-muted line-clamp-2 min-h-8 text-[11px] leading-4">
                    {item.description || "Menu pilihan"}
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
                      <span className="text-brand group-hover:bg-brand grid size-7 shrink-0 place-items-center rounded-full bg-orange-50 transition group-hover:text-white">
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
              {items.length === 0 ? "Menu belum tersedia" : "Menu tidak ditemukan"}
            </h3>
            <p className="mt-1">
              {items.length === 0
                ? "Merchant belum menambahkan produk."
                : "Coba ubah kata kunci atau filter yang dipilih."}
            </p>
            {items.length > 0 && hasAnyFilter && (
              <button
                type="button"
                className="text-brand mt-3 font-bold underline underline-offset-2"
                onClick={clearFilters}
              >
                Tampilkan semua menu
              </button>
            )}
          </div>
        )}
      </section>
      {typeof document !== "undefined" && createPortal(sheetContent, document.body)}
    </>
  );
}

const StorefrontMenu = forwardRef(StorefrontMenuComponent);
StorefrontMenu.displayName = "StorefrontMenu";

export default StorefrontMenu;
