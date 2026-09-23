export function normalizeImageUrl(value: string | null | undefined) {
  const candidate = value?.trim();
  if (!candidate) return "";
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}
