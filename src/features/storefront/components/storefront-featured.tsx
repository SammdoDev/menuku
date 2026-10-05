import { formatRupiah } from "@/lib/format";
import type { Item } from "@/features/storefront/types";
import { useStorefrontLocale } from "@/features/storefront/storefront-locale";

export default function StorefrontFeatured({
  items,
  onSelect,
  onSeeAll,
  showPrice,
}: {
  items: Item[];
  onSelect: (item: Item) => void;
  onSeeAll: () => void;
  showPrice: boolean;
}) {
  const { messages } = useStorefrontLocale();
  const featured = items.filter((item) => item.featured);
  if (!featured.length) return null;
  return (
    <section className="bg-black/[.025] px-5 py-7">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <span className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
            {messages.featured.eyebrow}
          </span>
          <h2 className="display-font text-2xl font-black">{messages.featured.title}</h2>
        </div>
        <button
          className="text-brand hover:bg-brand/10 focus-visible:outline-brand rounded-full px-3 py-2 text-xs font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={onSeeAll}
        >
          {messages.featured.all}
        </button>
      </header>
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {featured.map((item) => (
          <button
            className="border-line group hover:border-brand/35 focus-visible:outline-brand min-w-44 overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2"
            key={item.id}
            onClick={() => onSelect(item)}
          >
            <img
              className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
              src={item.image}
              alt=""
            />
            <div className="flex justify-between gap-2 p-3 text-xs font-bold">
              <span className="truncate">{item.name}</span>
              {showPrice && (
                <strong className="text-brand shrink-0">
                  {formatRupiah(item.promo ?? item.price)}
                </strong>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
