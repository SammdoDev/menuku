import { LayoutGrid, MessageCircle, Search, Share2, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { trackStorefront } from "@/features/storefront/track-storefront";

type StorefrontNavItemProps = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  primaryColor: string;
  onClick: () => void;
  href?: string;
};

function StorefrontNavItem({
  label,
  icon: Icon,
  active,
  primaryColor,
  onClick,
  href,
}: StorefrontNavItemProps) {
  const className = `flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-0.5 text-[10px] font-bold transition-all duration-300 ease-out ${active ? "text-white shadow-sm" : "hover:bg-black/[.05]"}`;
  const style = {
    color: active ? "#fff" : primaryColor,
    backgroundColor: active ? primaryColor : undefined,
  };
  const content = (
    <>
      <Icon size={18} className="shrink-0" aria-hidden="true" />
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${active ? "max-w-20 translate-x-0 opacity-100" : "max-w-0 -translate-x-1 opacity-0"}`}
        aria-hidden={!active}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={onClick}
        aria-label={label}
        aria-current={active ? "page" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      {content}
    </button>
  );
}

export default function StorefrontBottomNav({
  onMenu,
  onSearch,
  onFilter,
  onShare,
  onActiveChange,
  whatsapp,
  primaryColor,
  backgroundColor,
  slug,
  active,
}: {
  onMenu: () => void;
  onSearch: () => void;
  onShare: () => void;
  onFilter: () => void;
  onActiveChange: (active: "menu" | "search" | "filter" | "share" | "chat") => void;
  whatsapp: string;
  primaryColor: string;
  backgroundColor: string;
  slug: string;
  active: "menu" | "search" | "filter" | "share" | "chat";
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-1 border-t px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_28px_#00000012] backdrop-blur-xl sm:hidden"
      style={{
        borderColor: `${primaryColor}35`,
        backgroundColor: `${backgroundColor}F2`,
      }}
      aria-label="Navigasi toko"
    >
      <StorefrontNavItem
        label="Menu"
        icon={LayoutGrid}
        active={active === "menu"}
        primaryColor={primaryColor}
        onClick={onMenu}
      />
      <StorefrontNavItem
        label="Cari"
        icon={Search}
        active={active === "search"}
        primaryColor={primaryColor}
        onClick={onSearch}
      />
      <StorefrontNavItem
        label="Filter"
        icon={SlidersHorizontal}
        active={active === "filter"}
        primaryColor={primaryColor}
        onClick={onFilter}
      />
      <StorefrontNavItem
        label="Bagikan"
        icon={Share2}
        active={active === "share"}
        primaryColor={primaryColor}
        onClick={() => {
          onActiveChange("share");
          onShare();
        }}
      />
      {whatsapp ? (
        <StorefrontNavItem
          label="Chat"
          icon={MessageCircle}
          active={active === "chat"}
          primaryColor={primaryColor}
          href={whatsapp}
          onClick={() => {
            onActiveChange("chat");
            trackStorefront(slug, "whatsapp_click");
          }}
        />
      ) : null}
    </nav>
  );
}
