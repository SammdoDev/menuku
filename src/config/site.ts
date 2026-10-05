export const INDEXABLE_SITE_URL = "https://www.digimenu.my.id";

function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return INDEXABLE_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    const usesVercelHostname = url.hostname.endsWith(".vercel.app");
    if (process.env.VERCEL_ENV === "production" && usesVercelHostname) {
      return INDEXABLE_SITE_URL;
    }
    return url.origin;
  } catch {
    return INDEXABLE_SITE_URL;
  }
}

export const PUBLIC_SITE_URL = getPublicSiteUrl();
export const SUPPORT_WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "6282264274973";

export function publicStoreUrl(slug: string) {
  return `${PUBLIC_SITE_URL}/${encodeURIComponent(slug)}`;
}

export function supportWhatsAppUrl(message = "Halo admin Menuku, saya ingin bertanya.") {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
