export const RESERVED_STORE_SLUGS = new Set([
  "www",
  "community",
  "onboarding",
  "verify-otp",
  "forgot-password",
  "update-password",
  "auth",
  "store",
  "admin",
  "api",
  "dashboard",
  "login",
  "register",
  "support",
  "help",
  "pricing",
  "settings",
  "en",
  "ja",
  "ms",
  "zh",
]);

export function getStorefrontPath(slug: string) {
  const encodedSlug = encodeURIComponent(slug);
  return RESERVED_STORE_SLUGS.has(slug) ? `/store/${encodedSlug}` : `/${encodedSlug}`;
}
