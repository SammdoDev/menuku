"use client";

import { useCallback, type CSSProperties } from "react";
import { Clock3, Globe2, LayoutGrid, MessageCircle, Search, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { languageOptions } from "@/i18n/language-options";
import StorefrontLanguagePanel from "./storefront-language-panel";
import StorefrontOpeningHours from "./storefront-opening-hours";
import { getContrastTextColor } from "../helpers";
import { trackStorefront } from "../track-storefront";
import { useStorefrontLocale } from "../storefront-locale";

export type StorefrontNavActive = "menu" | "browse" | "hours" | "language" | "share" | "chat";
export type StorefrontNavPanel = "browse" | "hours" | "language" | null;

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
  const style: CSSProperties = active
    ? { color: getContrastTextColor(primaryColor), backgroundColor: primaryColor }
    : { color: primaryColor };
  const className = `flex min-h-[3.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1 text-[9px] leading-none font-bold transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand active:translate-y-0 active:scale-[.96] ${active ? "shadow-sm" : ""}`;
  const content = (
    <>
      <Icon size={18} className="shrink-0" aria-hidden="true" />
      <span className="max-w-full truncate">{label}</span>
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
      aria-pressed={active}
    >
      {content}
    </button>
  );
}

export default function StorefrontBottomNav({
  onMenu,
  onBrowse,
  panel,
  onPanelChange,
  onShare,
  onActiveChange,
  whatsapp,
  primaryColor,
  backgroundColor,
  slug,
  active,
  storeName,
  openingHours,
  showOpeningHours,
}: {
  onMenu: () => void;
  onBrowse: () => void;
  panel: StorefrontNavPanel;
  onPanelChange: (panel: StorefrontNavPanel) => void;
  onShare: () => void;
  onActiveChange: (active: StorefrontNavActive) => void;
  whatsapp: string;
  primaryColor: string;
  backgroundColor: string;
  slug: string;
  active: StorefrontNavActive;
  storeName: string;
  openingHours: unknown;
  showOpeningHours: boolean;
}) {
  const { locale, setLocale, language, messages } = useStorefrontLocale();
  const selectedLanguage =
    languageOptions.find((option) => option.value === locale) ?? languageOptions[0];
  const navStyle = {
    "--color-brand": primaryColor,
    backgroundColor: `color-mix(in srgb, ${backgroundColor} 22%, white)`,
    borderColor: `color-mix(in srgb, ${primaryColor} 25%, transparent)`,
  } as CSSProperties;

  function toggleOpeningHours() {
    const nextOpen = panel !== "hours";
    onPanelChange(nextOpen ? "hours" : null);
    onActiveChange(nextOpen ? "hours" : "menu");
  }

  function toggleLanguagePanel() {
    const nextOpen = panel !== "language";
    onPanelChange(nextOpen ? "language" : null);
    onActiveChange(nextOpen ? "language" : "menu");
  }

  const closeOpeningHours = useCallback(() => {
    onPanelChange(null);
    onActiveChange("menu");
  }, [onActiveChange, onPanelChange]);

  const closeLanguagePanel = useCallback(() => {
    onPanelChange(null);
    onActiveChange("menu");
  }, [onActiveChange, onPanelChange]);

  return (
    <>
      <nav
        data-storefront-bottom-nav
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-0 border-t px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-8px_28px_#00000012] backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:w-[calc(100vw_-_2rem)] sm:max-w-md sm:-translate-x-1/2 sm:border sm:px-3 sm:py-2 sm:shadow-[0_14px_50px_rgba(0,0,0,.16)] ${panel ? "sm:rounded-t-none sm:rounded-b-3xl" : "sm:rounded-3xl"}`}
        style={navStyle}
        aria-label={messages.nav.aria}
      >
        <StorefrontNavItem
          label={messages.nav.menu}
          icon={LayoutGrid}
          active={active === "menu"}
          primaryColor={primaryColor}
          onClick={onMenu}
        />
        <StorefrontNavItem
          label={messages.nav.browse}
          icon={Search}
          active={active === "browse"}
          primaryColor={primaryColor}
          onClick={onBrowse}
        />
        {showOpeningHours && (
          <StorefrontNavItem
            label={messages.nav.hours}
            icon={Clock3}
            active={active === "hours"}
            primaryColor={primaryColor}
            onClick={toggleOpeningHours}
          />
        )}
        <StorefrontNavItem
          label={messages.nav.share}
          icon={Share2}
          active={active === "share"}
          primaryColor={primaryColor}
          onClick={() => {
            onPanelChange(null);
            onActiveChange("share");
            onShare();
          }}
        />
        {whatsapp ? (
          <StorefrontNavItem
            label={messages.nav.chat}
            icon={MessageCircle}
            active={active === "chat"}
            primaryColor={primaryColor}
            href={whatsapp}
            onClick={() => {
              onPanelChange(null);
              onActiveChange("chat");
              trackStorefront(slug, "whatsapp_click");
            }}
          />
        ) : null}
        <button
          type="button"
          data-storefront-language-trigger
          className="hover:bg-brand/10 focus-visible:outline-brand flex min-h-[3.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1 text-[9px] leading-none font-bold transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-1 active:translate-y-0 active:scale-[.96]"
          style={
            active === "language"
              ? { color: getContrastTextColor(primaryColor), backgroundColor: primaryColor }
              : { color: primaryColor }
          }
          onClick={toggleLanguagePanel}
          aria-label={`${language.label}: ${selectedLanguage.label}`}
          aria-expanded={panel === "language"}
          aria-haspopup="dialog"
          aria-pressed={panel === "language"}
        >
          <Globe2 size={17} aria-hidden="true" />
          <span className="max-w-full truncate">{selectedLanguage.shortLabel}</span>
        </button>
      </nav>
      <StorefrontLanguagePanel
        open={panel === "language"}
        label={language.label}
        closeLabel={messages.menu.close}
        value={locale}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
        onValueChange={setLocale}
        onClose={closeLanguagePanel}
      />
      {showOpeningHours && (
        <StorefrontOpeningHours
          openingHours={openingHours}
          storeName={storeName}
          primaryColor={primaryColor}
          backgroundColor={backgroundColor}
          open={panel === "hours"}
          onClose={closeOpeningHours}
        />
      )}
    </>
  );
}
