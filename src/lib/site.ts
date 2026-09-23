export const PUBLIC_SITE_URL = "https://digimenu.my.id";

export function publicStoreUrl(slug: string) {
  return `${PUBLIC_SITE_URL}/store/${encodeURIComponent(slug)}`;
}
