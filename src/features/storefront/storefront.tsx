"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import type { PublicStore } from "@/features/storefront/types";
import StorefrontBottomNav from "@/features/storefront/components/storefront-bottom-nav";
import type {
  StorefrontNavActive,
  StorefrontNavPanel,
} from "@/features/storefront/components/storefront-bottom-nav";
import StorefrontDetail from "@/features/storefront/components/storefront-detail";
import StorefrontFeatured from "@/features/storefront/components/storefront-featured";
import StorefrontHeader from "@/features/storefront/components/storefront-header";
import StorefrontMenu from "@/features/storefront/components/storefront-menu";
import StorefrontPromo from "@/features/storefront/components/storefront-promo";
import StorefrontToast from "@/features/storefront/components/storefront-toast";
import { mapProducts } from "@/features/storefront/mapper";
import { buildWhatsAppUrl } from "@/features/storefront/helpers";
import type { Item } from "@/features/storefront/types";
import { trackStorefront } from "@/features/storefront/track-storefront";
import { ALL_CATEGORY } from "@/features/storefront/constants";
import {
  formatStorefrontMessage,
  StorefrontLocaleProvider,
  useStorefrontLocale,
} from "@/features/storefront/storefront-locale";

export default function Storefront({ store }: { store: PublicStore }) {
  return (
    <StorefrontLocaleProvider>
      <StorefrontPage store={store} />
    </StorefrontLocaleProvider>
  );
}

function StorefrontPage({ store }: { store: PublicStore }) {
  const { messages } = useStorefrontLocale();
  const [active, setActive] = useState(ALL_CATEGORY);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [notice, setNotice] = useState("");
  const [navPanel, setNavPanel] = useState<StorefrontNavPanel>(null);
  const [navActive, setNavActive] = useState<StorefrontNavActive>("menu");
  const changeMenuSheet = useCallback((sheet: "browse" | null) => {
    setNavPanel(sheet);
    setNavActive(sheet ? "browse" : "menu");
  }, []);
  useEffect(() => {
    if (!navPanel) return;

    function closeOnOutsidePress(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest("[data-storefront-nav-panel]") ||
        target.closest("[data-storefront-bottom-nav]")
      ) {
        return;
      }

      setNavPanel(null);
      setNavActive("menu");
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [navPanel]);
  const items = useMemo(() => mapProducts(store), [store]);
  useEffect(() => trackStorefront(store.tenant.slug, "page_view"), [store.tenant.slug]);
  const categories = [
    ALL_CATEGORY,
    ...store.categories.map((category) => category.name),
    ...(!store.categories.length ? [...new Set(items.map((item) => item.category))] : []),
  ];
  const whatsapp = buildWhatsAppUrl(
    store.tenant.whatsapp,
    formatStorefrontMessage(messages.header.greeting, { store: store.tenant.name }),
  );
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(location.href);
    } finally {
      showNotice(messages.footer.copied);
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
    setNavPanel(null);
    setNavActive("menu");
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const openMenuTools = () => {
    if (navPanel === "browse") {
      changeMenuSheet(null);
      return;
    }
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    changeMenuSheet("browse");
  };
  const themeStyle = {
    "--color-brand": store.tenant.primary_color || "#FF6534",
    "--store-background": store.tenant.background_color || "#EEECE5",
    backgroundColor: store.tenant.background_color || "#EEECE5",
  } as CSSProperties;
  return (
    <main className="min-h-dvh sm:p-8" style={themeStyle}>
      <section className="mx-auto w-full max-w-md overflow-hidden bg-[var(--store-background)] shadow-[0_22px_65px_#433d3022] sm:rounded-sm">
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
            setActive(ALL_CATEGORY);
            setQuery("");
            goToMenu();
          }}
        />
        <StorefrontMenu
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
          primaryColor={store.tenant.primary_color || "#FF6534"}
          backgroundColor={store.tenant.background_color || "#EEECE5"}
          sheet={navPanel === "browse" ? "browse" : null}
          onSheetChange={changeMenuSheet}
        />
        <footer className="border-line text-muted mx-5 mb-28 flex items-center justify-between border-t py-6 text-[10px]">
          <p>
            {formatStorefrontMessage(messages.footer.copyright, {
              year: new Date().getFullYear(),
              store: store.tenant.name,
            })}
          </p>
          <button className="text-ink font-bold" onClick={copy}>
            {messages.footer.copyLink}
          </button>
        </footer>
      </section>
      {selected && (
        <StorefrontDetail product={selected} store={store} close={() => setSelected(null)} />
      )}
      <StorefrontBottomNav
        onMenu={goToMenu}
        onBrowse={openMenuTools}
        panel={navPanel}
        onPanelChange={setNavPanel}
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
        storeName={store.tenant.name}
        openingHours={store.tenant.opening_hours}
        showOpeningHours={store.tenant.show_opening_hours}
      />
      <StorefrontToast message={notice} />
    </main>
  );
}
