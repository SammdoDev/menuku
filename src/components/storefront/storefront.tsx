"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PublicStore } from "../../lib/store";
import StorefrontBottomNav from "./components/storefront-bottom-nav";
import StorefrontDetail from "./components/storefront-detail";
import StorefrontFeatured from "./components/storefront-featured";
import StorefrontHeader from "./components/storefront-header";
import StorefrontMenu from "./components/storefront-menu";
import StorefrontToast from "./components/storefront-toast";
import { mapProducts, waUrl, type Item } from "./components/types";
import { trackStorefront } from "../../lib/analytics";

export default function Storefront({ store }: { store: PublicStore }) {
  const [active, setActive] = useState("Semua");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [notice, setNotice] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const items = useMemo(() => mapProducts(store), [store]);
  useEffect(() => trackStorefront(store.tenant.slug, "page_view"), [store.tenant.slug]);
  const categories = [
    "Semua",
    ...store.categories.map((category) => category.name),
    ...(!store.categories.length ? [...new Set(items.map((item) => item.category))] : []),
  ];
  const whatsapp = waUrl(store.tenant.whatsapp, `Halo ${store.tenant.name}, saya ingin bertanya.`);
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
  const goToMenu = () =>
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const focusSearch = () => {
    goToMenu();
    window.setTimeout(() => searchRef.current?.focus(), 450);
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
        />
        <footer className="border-line text-muted mx-5 mb-20 flex items-center justify-between border-t py-6 text-[10px] sm:mx-12 sm:mb-0 sm:text-xs">
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
