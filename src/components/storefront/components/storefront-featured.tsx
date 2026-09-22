import { rupiah } from "../../../lib/demo-data";
import type { Item } from "./types";

export default function StorefrontFeatured({
  items,
  onSelect,
  onSeeAll,
}: {
  items: Item[];
  onSelect: (item: Item) => void;
  onSeeAll: () => void;
}) {
  const featured = items.filter((item) => item.featured);
  if (!featured.length) return null;
  return (
    <section className="bg-[#f8f7f4] px-5 py-7 sm:px-12 sm:py-9">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <span className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
            Pilihan kami
          </span>
          <h2 className="display-font text-2xl font-black sm:text-3xl">Favorit minggu ini</h2>
        </div>
        <button className="text-brand text-xs font-extrabold" onClick={onSeeAll}>
          Lihat semua
        </button>
      </header>
      <div className="no-scrollbar flex gap-3 overflow-x-auto sm:grid sm:grid-cols-3">
        {featured.map((item) => (
          <button
            className="border-line min-w-44 overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-1 hover:shadow-lg sm:min-w-0"
            key={item.id}
            onClick={() => onSelect(item)}
          >
            <img className="h-28 w-full object-cover sm:h-32" src={item.image} alt="" />
            <div className="flex justify-between gap-2 p-3 text-xs font-bold">
              <span className="truncate">{item.name}</span>
              <strong className="text-brand shrink-0">{rupiah(item.promo ?? item.price)}</strong>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
