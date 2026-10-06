import { ExternalLink, Instagram, MapPin, MessageCircle, Share2 } from "lucide-react";
import type { PublicStore } from "../types";
import { normalizeImageUrl } from "@/lib/image-url";
import { buildWhatsAppUrl, getContrastTextColor } from "../helpers";
import { trackStorefront } from "../track-storefront";
import {
  formatStorefrontMessage,
  useStorefrontLocale,
} from "../storefront-locale";

export default function StorefrontHeader({
  store,
  onShare,
}: {
  store: PublicStore;
  onShare: () => void;
}) {
  const { messages } = useStorefrontLocale();
  const initials = store.tenant.name
    .split(" ")
    .slice(0, 2)
    .map((value) => value[0])
    .join("")
    .toUpperCase();
  const whatsapp = buildWhatsAppUrl(
    store.tenant.whatsapp,
    formatStorefrontMessage(messages.header.greeting, { store: store.tenant.name }),
  );
  const instagram = store.tenant.instagram
    ? `https://instagram.com/${store.tenant.instagram.replace(/^@/, "")}`
    : "";
  return (
    <>
      <div
        className="h-52 bg-[linear-gradient(105deg,#3a251d60,#1a0e0950),url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center"
        style={
          store.tenant.banner_url
            ? {
                backgroundImage: `linear-gradient(105deg,#3a251d60,#1a0e0950),url("${normalizeImageUrl(store.tenant.banner_url)}")`,
              }
            : undefined
        }
      >
        <div className="flex justify-between p-4">
          <span className="self-center rounded-full bg-[#163d2f] px-3 py-2 text-[11px] font-bold text-white">
            <i className="mr-1.5 inline-block size-2 rounded-full bg-[#84e4bb]" />{" "}
            {store.tenant.is_published ? messages.header.open : messages.header.preview}
          </span>
          <button
            onClick={onShare}
            aria-label={messages.header.share}
            className="text-charcoal grid size-10 place-items-center rounded-full bg-white/90 backdrop-blur"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
      <header className="flex gap-3 px-5">
        {normalizeImageUrl(store.tenant.logo_url) ? (
          <img
            className="-mt-8 size-[76px] shrink-0 rounded-2xl border-4 border-white object-cover"
            src={normalizeImageUrl(store.tenant.logo_url)}
            alt={store.tenant.name}
          />
        ) : (
          <div
            className="bg-brand -mt-8 grid size-[76px] shrink-0 place-items-center rounded-2xl border-4 border-white text-xl font-black"
            style={{ color: getContrastTextColor(store.tenant.primary_color || "#FF6534") }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 pt-3">
          <h1 className="display-font truncate text-2xl font-black">{store.tenant.name}</h1>
          <p className="text-muted mt-1 max-w-xl text-sm leading-5">
            {store.tenant.description || messages.header.welcome}
          </p>
          {store.tenant.show_address && store.tenant.address && (
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-[#605b54]">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>{store.tenant.address}</span>
            </div>
          )}
        </div>
      </header>
      <div className="flex gap-2 px-5 py-5">
        {whatsapp && (
          <a
            className="bg-brand focus-visible:outline-brand inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-extrabold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[.99]"
            style={{ color: getContrastTextColor(store.tenant.primary_color || "#FF6534") }}
            href={whatsapp}
            onClick={() => trackStorefront(store.tenant.slug, "whatsapp_click")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            {messages.header.whatsapp}
          </a>
        )}
        {instagram && (
          <a
            className="grid size-12 place-items-center rounded-xl bg-[#f6f4f0]"
            href={instagram}
            onClick={() => trackStorefront(store.tenant.slug, "instagram_click")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={messages.header.instagram}
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
            aria-label={messages.header.location}
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
