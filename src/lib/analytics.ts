export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "category_click"
  | "link_click"
  | "whatsapp_click"
  | "instagram_click"
  | "maps_click"
  | "share_click";

function sessionId() {
  const key = "menuku_analytics_session";
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const value = crypto.randomUUID();
    localStorage.setItem(key, value);
    return value;
  } catch {
    return "anonymous";
  }
}

export function trackStorefront(
  slug: string,
  eventType: AnalyticsEvent,
  metadata: { productId?: string; categoryId?: string; linkId?: string } = {},
) {
  const payload = JSON.stringify({
    slug,
    eventType,
    sessionId: sessionId(),
    ...metadata,
    deviceType: window.matchMedia("(max-width: 640px)").matches ? "mobile" : "desktop",
  });
  const body = new Blob([payload], { type: "application/json" });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/analytics", body);
  else void fetch("/api/analytics", { method: "POST", body, keepalive: true });
}
