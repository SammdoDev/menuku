import { ArrowUpRight, Megaphone } from "lucide-react";
import type { PublicStore } from "../types";
import { normalizeImageUrl } from "@/lib/image-url";
import { useStorefrontLocale } from "../storefront-locale";

export default function StorefrontPromo({ tenant }: { tenant: PublicStore["tenant"] }) {
  const { messages } = useStorefrontLocale();
  if (
    tenant.plan === "free" ||
    !tenant.promo_enabled ||
    (!tenant.promo_title && !tenant.promo_image_url)
  )
    return null;
  const content = (
    <div className="relative min-h-36 overflow-hidden rounded-2xl bg-[#2c2924] text-white shadow-sm">
      {normalizeImageUrl(tenant.promo_image_url) && (
        <img
          src={normalizeImageUrl(tenant.promo_image_url)}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
      <div className="relative max-w-xl p-5">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black tracking-[.12em] uppercase backdrop-blur">
          <Megaphone size={13} /> {messages.promo.eyebrow}
        </span>
        {tenant.promo_title && (
          <h2 className="display-font text-2xl font-black">{tenant.promo_title}</h2>
        )}
        {tenant.promo_description && (
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/80">
            {tenant.promo_description}
          </p>
        )}
        {tenant.promo_link_url && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-extrabold text-[#2c2924]">
            {messages.promo.detail} <ArrowUpRight size={14} />
          </span>
        )}
      </div>
    </div>
  );
  return (
    <section className="px-5 pt-5">
      {tenant.promo_link_url ? (
        <a
          href={tenant.promo_link_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tenant.promo_title || messages.promo.view}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </section>
  );
}
