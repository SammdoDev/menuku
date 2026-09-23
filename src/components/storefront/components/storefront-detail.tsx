"use client";
import { useEffect } from "react";
import { ExternalLink, MessageCircle, X } from "lucide-react";
import type { PublicStore } from "../../../lib/store";
import { rupiah } from "../../../lib/demo-data";
import { waUrl, type Item } from "./types";

export default function StorefrontDetail({
  product,
  store,
  close,
}: {
  product: Item;
  store: PublicStore;
  close: () => void;
}) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [close]);
  const url = waUrl(
    store.tenant.whatsapp,
    `Halo ${store.tenant.name}, saya ingin bertanya tentang menu ${product.name}.`,
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/70 sm:items-center sm:justify-center sm:p-5"
      onClick={close}
    >
      <article
        className="relative max-h-[92dvh] w-full overflow-auto rounded-t-3xl bg-white sm:grid sm:max-w-2xl sm:grid-cols-2 sm:overflow-hidden sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-white/90"
          onClick={close}
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
        <img
          className="h-[min(36dvh,280px)] w-full object-cover sm:h-full sm:min-h-96"
          src={product.image}
          alt={product.name}
        />
        <div className="flex flex-col p-5 sm:p-8">
          <span className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
            {product.category}
          </span>
          <h2 className="display-font mt-1 text-3xl font-black">{product.name}</h2>
          <p className="text-muted mt-3 text-sm leading-6">
            {product.description || `Menu pilihan dari ${store.tenant.name}.`}
          </p>
          <div className="border-line mt-6 border-t pt-5 sm:mt-auto">
            {store.tenant.show_price && (
              <div className="mb-3">
                {product.promo && (
                  <s className="text-muted block text-xs">{rupiah(product.price)}</s>
                )}
                <strong className="text-brand text-xl">
                  {rupiah(product.promo ?? product.price)}
                </strong>
              </div>
            )}
            {product.available && url ? (
              <a
                className="bg-brand flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-extrabold text-white"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} />
                Tanya via WhatsApp <ExternalLink size={16} />
              </a>
            ) : (
              <span className="text-sm font-bold text-red-700">
                {product.available ? "Kontak belum tersedia" : "Sedang habis hari ini"}
              </span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
