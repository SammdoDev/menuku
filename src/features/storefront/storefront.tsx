"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PublicStore } from "@/features/storefront/types";
import StorefrontBottomNav from "@/features/storefront/components/storefront-bottom-nav";
import StorefrontDetail from "@/features/storefront/components/storefront-detail";
import StorefrontFeatured from "@/features/storefront/components/storefront-featured";
import StorefrontHeader from "@/features/storefront/components/storefront-header";
import StorefrontMenu from "@/features/storefront/components/storefront-menu";
import type { StorefrontMenuSheet } from "@/features/storefront/components/storefront-menu";
import StorefrontPromo from "@/features/storefront/components/storefront-promo";
import StorefrontToast from "@/features/storefront/components/storefront-toast";
import { mapProducts } from "@/features/storefront/mapper";
import { buildWhatsAppUrl } from "@/features/storefront/helpers";
import type { Item } from "@/features/storefront/types";
import { trackStorefront } from "@/features/storefront/track-storefront";

export default function Storefront({ store }: { store: PublicStore }) {
  const [active, setActive] = useState("Semua");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [notice, setNotice] = useState("");
  const [menuSheet, setMenuSheet] = useState<StorefrontMenuSheet>(null);
  const [navActive, setNavActive] = useState<"menu" | "search" | "filter" | "share" | "chat">(
    "menu",
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const changeMenuSheet = useCallback((sheet: StorefrontMenuSheet) => {
    setMenuSheet(sheet);
    if (!sheet) setNavActive("menu");
  }, []);
  const items = useMemo(() => mapProducts(store), [store]);
  useEffect(() => trackStorefront(store.tenant.slug, "page_view"), [store.tenant.slug]);
  const categories = [
    "Semua",
    ...store.categories.map((category) => category.name),
    ...(!store.categories.length ? [...new Set(items.map((item) => item.category))] : []),
  ];
  const whatsapp = buildWhatsAppUrl(
    store.tenant.whatsapp,
    `Halo ${store.tenant.name}, saya ingin bertanya.`,
  );
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(location.href);
    } finally {
      showNotice("Link halaman berhasil disalin");
    }
  };
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: store.tenant.name, url: location.href });
      return;
    }
    await copy();
  };
  const goToMenu = () => {
    setMenuSheet(null);
    setNavActive("menu");
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const focusSearch = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuSheet("search");
    setNavActive("search");
    window.setTimeout(() => searchRef.current?.focus(), 450);
  };
  const openFilters = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuSheet("filter");
    setNavActive("filter");
  };
  const themeStyle = {
    "--color-brand": store.tenant.primary_color || "#FF6534",
    "--store-background": store.tenant.background_color || "#EEECE5",
    backgroundColor: store.tenant.background_color || "#EEECE5",
  } as CSSProperties;
  return (
    <main className="min-h-dvh sm:p-8" style={themeStyle}>
      <section className="mx-auto max-w-5xl overflow-hidden bg-[var(--store-background)] shadow-[0_22px_65px_#433d3022] sm:rounded-sm">
        <StorefrontHeader
          store={store}
          onShare={() => {
            trackStorefront(store.tenant.slug, "share_click");
            void share();
          }}
        />
        <StorefrontPromo tenant={store.tenant} />
        <StorefrontFeatured
          items={items}
          showPrice={store.tenant.show_price}
          onSelect={(item) => {
            trackStorefront(store.tenant.slug, "product_view", { productId: item.id });
            setSelected(item);
          }}
          onSeeAll={() => {
            setActive("Semua");
            setQuery("");
            goToMenu();
          }}
        />
        <StorefrontMenu
          ref={searchRef}
          items={items}
          categories={categories}
          active={active}
          query={query}
          onActiveChange={(value) => {
            trackStorefront(store.tenant.slug, "category_click");
            setActive(value);
          }}
          onQueryChange={setQuery}
          onSelect={(item) => {
            trackStorefront(store.tenant.slug, "product_view", { productId: item.id });
            setSelected(item);
          }}
          layout={store.tenant.layout_type === "list" ? "list" : "grid"}
          showPrice={store.tenant.show_price}
          sheet={menuSheet}
          onSheetChange={changeMenuSheet}
        />
        <footer className="border-line text-muted mx-5 mb-28 flex items-center justify-between border-t py-6 text-[10px] sm:mx-12 sm:mb-0 sm:text-xs">
          <p>
            © 2026 {store.tenant.name} · Dibuat dengan <b>menuku</b>
          </p>
          <button className="text-ink font-bold" onClick={copy}>
            Salin link
          </button>
        </footer>
      </section>
      {selected && (
        <StorefrontDetail product={selected} store={store} close={() => setSelected(null)} />
      )}
      <StorefrontBottomNav
        onMenu={goToMenu}
        onSearch={focusSearch}
        onFilter={openFilters}
        onActiveChange={setNavActive}
        active={navActive}
        onShare={() => {
          trackStorefront(store.tenant.slug, "share_click");
          void share();
        }}
        whatsapp={whatsapp}
        primaryColor={store.tenant.primary_color || "#FF6534"}
        backgroundColor={store.tenant.background_color || "#EEECE5"}
        slug={store.tenant.slug}
      />
      <StorefrontToast message={notice} />
    </main>
  );
}
