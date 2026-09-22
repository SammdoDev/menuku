import { forwardRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import { rupiah } from "../../../lib/demo-data";
import type { Item } from "./types";

const StorefrontMenu = forwardRef<
  HTMLInputElement,
  {
    items: Item[];
    categories: string[];
    active: string;
    query: string;
    onActiveChange: (value: string) => void;
    onQueryChange: (value: string) => void;
    onSelect: (item: Item) => void;
  }
>(({ items, categories, active, query, onActiveChange, onQueryChange, onSelect }, ref) => {
  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          (active === "Semua" || item.category === active) &&
          `${item.name} ${item.description} ${item.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [active, query, items],
  );
  return (
    <section id="menu" className="scroll-mt-3 px-5 py-8 sm:px-12 sm:py-10">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <span className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
            Daftar menu
          </span>
          <h2 className="display-font text-2xl font-black sm:text-3xl">Temukan favoritmu</h2>
        </div>
        <span className="text-muted text-xs">{visible.length} menu</span>
      </header>
      <div className="sticky top-0 z-10 -mx-5 mb-5 bg-white/95 px-5 pt-2 backdrop-blur sm:static sm:mx-0 sm:px-0 sm:pt-0">
        <label className="border-line text-muted focus-within:border-brand/50 focus-within:ring-brand/10 mb-3 flex h-12 items-center gap-2 rounded-xl border px-3 transition focus-within:ring-4">
          <Search size={19} />
          <input
            ref={ref}
            className="text-ink min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
            placeholder="Cari menu..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query && (
            <button onClick={() => onQueryChange("")} aria-label="Hapus pencarian">
              <X size={16} />
            </button>
          )}
        </label>
        <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full border px-3.5 py-2 text-xs whitespace-nowrap transition ${active === category ? "border-charcoal bg-charcoal text-white" : "border-line bg-white text-[#5b554d]"}`}
              onClick={() => onActiveChange(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
      {visible.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4">
          {visible.map((item) => (
            <button
              className={`min-w-0 text-left ${!item.available ? "opacity-60 grayscale" : ""}`}
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#eee]">
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
              <h3 className="mt-2 truncate text-sm font-extrabold">{item.name}</h3>
              <p className="text-muted line-clamp-2 min-h-8 text-[11px] leading-4">
                {item.description || "Menu pilihan"}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <>{item.promo && <s className="text-muted">{rupiah(item.price)}</s>}</>
                <strong className="text-brand">{rupiah(item.promo ?? item.price)}</strong>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="border-line text-muted rounded-xl border border-dashed p-10 text-center text-sm">
          <h3 className="display-font text-ink text-xl font-black">Menu belum tersedia</h3>
          <p className="mt-1">Merchant belum menambahkan produk.</p>
        </div>
      )}
    </section>
  );
});
StorefrontMenu.displayName = "StorefrontMenu";
export default StorefrontMenu;
