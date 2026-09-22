import { LayoutGrid, MessageCircle, Search, Share2 } from "lucide-react";

export default function StorefrontBottomNav({
  onMenu,
  onSearch,
  onShare,
  whatsapp,
}: {
  onMenu: () => void;
  onSearch: () => void;
  onShare: () => void;
  whatsapp: string;
}) {
  const item =
    "grid min-h-12 place-items-center gap-0.5 rounded-xl text-[9px] font-extrabold text-muted";
  return (
    <nav className="border-line fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 items-center rounded-2xl border bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl sm:hidden">
      <button className={item} onClick={onMenu}>
        <LayoutGrid size={19} />
        <span>Menu</span>
      </button>
      <button className={item} onClick={onSearch}>
        <Search size={19} />
        <span>Cari</span>
      </button>
      {whatsapp ? (
        <a
          className="bg-brand shadow-brand/30 -mt-3 grid min-h-13 place-items-center gap-0.5 rounded-xl text-[9px] font-extrabold text-white shadow-lg"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </a>
      ) : (
        <button className={item} onClick={onShare}>
          <Share2 size={19} />
          <span>Bagikan</span>
        </button>
      )}
      <button className={item} onClick={onShare}>
        <Share2 size={19} />
        <span>Bagikan</span>
      </button>
    </nav>
  );
}
