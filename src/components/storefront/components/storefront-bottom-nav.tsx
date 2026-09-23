import { LayoutGrid, MessageCircle, Search } from "lucide-react";
import { trackStorefront } from "../../../lib/analytics";

export default function StorefrontBottomNav({
  onMenu,
  onSearch,
  onShare,
  whatsapp,
  primaryColor,
  backgroundColor,
  slug,
  active,
}: {
  onMenu: () => void;
  onSearch: () => void;
  onShare: () => void;
  whatsapp: string;
  primaryColor: string;
  backgroundColor: string;
  slug: string;
  active: "menu" | "search";
}) {
  const item =
    "grid min-h-12 place-items-center gap-0.5 rounded-xl text-[9px] font-extrabold transition hover:bg-black/[.04]";
  return (
    <nav
      className={`fixed inset-x-3 bottom-3 z-40 grid ${whatsapp ? "grid-cols-3" : "grid-cols-2"} items-center rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl sm:hidden`}
      style={{
        borderColor: `${primaryColor}35`,
        backgroundColor: `${backgroundColor}F2`,
      }}
    >
      <button
        className={`${item} ${active === "menu" ? "bg-[var(--color-brand)] text-white shadow-md" : "text-[var(--color-brand)]"}`}
        onClick={onMenu}
        aria-current={active === "menu" ? "page" : undefined}
      >
        <LayoutGrid size={19} />
        <span>Menu</span>
      </button>
      <button
        className={`${item} ${active === "search" ? "bg-[var(--color-brand)] text-white shadow-md" : "text-[var(--color-brand)]"}`}
        onClick={onSearch}
        aria-current={active === "search" ? "page" : undefined}
      >
        <Search size={19} />
        <span>Cari</span>
      </button>
      {whatsapp ? (
        <a
          className="-mt-3 grid min-h-13 place-items-center gap-0.5 rounded-xl text-[9px] font-extrabold text-white shadow-lg"
          style={{ backgroundColor: primaryColor, boxShadow: `0 10px 24px ${primaryColor}55` }}
          href={whatsapp}
          onClick={() => trackStorefront(slug, "whatsapp_click")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </a>
      ) : null}
    </nav>
  );
}
