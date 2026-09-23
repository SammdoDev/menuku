import { Clock3, ExternalLink, Instagram, MapPin, MessageCircle, Share2 } from "lucide-react";
import type { PublicStore } from "../../../lib/store";
import { normalizeImageUrl } from "../../../lib/image-url";
import { waUrl } from "./types";
import { trackStorefront } from "../../../lib/analytics";

export default function StorefrontHeader({
  store,
  onShare,
}: {
  store: PublicStore;
  onShare: () => void;
}) {
  const initials = store.tenant.name
    .split(" ")
    .slice(0, 2)
    .map((value) => value[0])
    .join("")
    .toUpperCase();
  const whatsapp = waUrl(store.tenant.whatsapp, `Halo ${store.tenant.name}, saya ingin bertanya.`);
  const instagram = store.tenant.instagram
    ? `https://instagram.com/${store.tenant.instagram.replace(/^@/, "")}`
    : "";
  return (
    <>
      <div
        className="h-52 bg-[linear-gradient(105deg,#3a251d60,#1a0e0950),url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center sm:h-64"
        style={
          store.tenant.banner_url
            ? {
                backgroundImage: `linear-gradient(105deg,#3a251d60,#1a0e0950),url("${normalizeImageUrl(store.tenant.banner_url)}")`,
              }
            : undefined
        }
      >
        <div className="flex justify-between p-4 sm:p-5">
          <span className="self-center rounded-full bg-[#163d2f] px-3 py-2 text-[11px] font-bold text-white sm:text-sm">
            <i className="mr-1.5 inline-block size-2 rounded-full bg-[#84e4bb]" />{" "}
            {store.tenant.is_published ? "Buka untuk pelanggan" : "Pratinjau pemilik"}
          </span>
          <button
            onClick={onShare}
            aria-label="Bagikan halaman"
            className="text-charcoal grid size-10 place-items-center rounded-full bg-white/90 backdrop-blur"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
      <header className="flex gap-3 px-5 sm:gap-5 sm:px-12">
        {normalizeImageUrl(store.tenant.logo_url) ? (
          <img
            className="-mt-8 size-[76px] shrink-0 rounded-2xl border-4 border-white object-cover sm:-mt-10 sm:size-24 sm:rounded-[26px] sm:border-[5px]"
            src={normalizeImageUrl(store.tenant.logo_url)}
            alt={store.tenant.name}
          />
        ) : (
          <div className="bg-brand -mt-8 grid size-[76px] shrink-0 place-items-center rounded-2xl border-4 border-white text-xl font-black text-white sm:-mt-10 sm:size-24 sm:rounded-[26px] sm:text-3xl">
            {initials}
          </div>
        )}
        <div className="min-w-0 pt-3 sm:pt-5">
          <h1 className="display-font truncate text-2xl font-black sm:text-3xl">
            {store.tenant.name}
          </h1>
          <p className="text-muted mt-1 max-w-xl text-sm leading-5">
            {store.tenant.description || "Selamat datang di halaman menu kami."}
          </p>
          <div className="mt-2 grid gap-1 text-[11px] text-[#605b54] sm:flex sm:gap-4 sm:text-sm">
            {store.tenant.show_address && store.tenant.address && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {store.tenant.address}
              </span>
            )}
            {store.tenant.show_opening_hours && (
              <span className="flex items-center gap-1">
                <Clock3 size={14} />
                Lihat menu terbaru kami
              </span>
            )}
          </div>
        </div>
      </header>
      <div className="flex gap-2 px-5 py-5 sm:px-12 sm:py-7">
        {whatsapp && (
          <a
            className="bg-brand hover:bg-brand-dark inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-extrabold text-white transition sm:flex-none"
            href={whatsapp}
            onClick={() => trackStorefront(store.tenant.slug, "whatsapp_click")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            Tanya via WhatsApp
          </a>
        )}
        {instagram && (
          <a
            className="grid size-12 place-items-center rounded-xl bg-[#f6f4f0]"
            href={instagram}
            onClick={() => trackStorefront(store.tenant.slug, "instagram_click")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        )}
        {store.tenant.maps_url && (
          <a
            className="grid size-12 place-items-center rounded-xl bg-[#f6f4f0]"
            href={store.tenant.maps_url}
            onClick={() => trackStorefront(store.tenant.slug, "maps_click")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lokasi"
          >
            <MapPin size={20} />
          </a>
        )}
        {store.links.slice(0, 2).map((link) => (
          <a
            className="grid size-12 place-items-center rounded-xl bg-[#f6f4f0]"
            href={link.url}
            onClick={() => trackStorefront(store.tenant.slug, "link_click", { linkId: link.id })}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.title}
            key={link.id}
          >
            <ExternalLink size={20} />
          </a>
        ))}
      </div>
    </>
  );
}
