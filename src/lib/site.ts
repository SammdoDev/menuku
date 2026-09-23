export const PUBLIC_SITE_URL = "https://www.digimenu.my.id";
export const SUPPORT_WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "6282264274973";

export function publicStoreUrl(slug: string) {
  return `${PUBLIC_SITE_URL}/store/${encodeURIComponent(slug)}`;
}

export function supportWhatsAppUrl(message = "Halo admin Menuku, saya ingin bertanya.") {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
