import { LayoutGrid, MessageCircle, Search, Share2 } from "lucide-react";

export default function StorefrontBottomNav({
  onMenu,
  onSearch,
  onShare,
  whatsapp,
  primaryColor,
  backgroundColor,
}: {
  onMenu: () => void;
  onSearch: () => void;
  onShare: () => void;
  whatsapp: string;
  primaryColor: string;
  backgroundColor: string;
}) {
  const item =
    "grid min-h-12 place-items-center gap-0.5 rounded-xl text-[9px] font-extrabold transition hover:bg-black/[.04]";
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 items-center rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl sm:hidden"
      style={{
        borderColor: `${primaryColor}35`,
        backgroundColor: `${backgroundColor}F2`,
      }}
    >
      <button className={`${item} text-[var(--color-brand)]`} onClick={onMenu}>
        <LayoutGrid size={19} />
        <span>Menu</span>
      </button>
      <button className={`${item} text-[var(--color-brand)]`} onClick={onSearch}>
        <Search size={19} />
        <span>Cari</span>
      </button>
      {whatsapp ? (
        <a
          className="-mt-3 grid min-h-13 place-items-center gap-0.5 rounded-xl text-[9px] font-extrabold text-white shadow-lg"
          style={{ backgroundColor: primaryColor, boxShadow: `0 10px 24px ${primaryColor}55` }}
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </a>
      ) : (
        <button className={`${item} text-[var(--color-brand)]`} onClick={onShare}>
          <Share2 size={19} />
          <span>Bagikan</span>
        </button>
      )}
    </nav>
  );
}
