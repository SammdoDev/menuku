const fallbackImages = [
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
];

export function getFallbackProductImage(index: number) {
  return fallbackImages[index % fallbackImages.length];
}

export function buildWhatsAppUrl(number: string | null, message: string) {
  return number
    ? `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : "";
}

export function getContrastTextColor(color: string) {
  const normalized = color.trim().replace(/^#/, "");
  const hex = normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized;
  if (!/^[\da-f]{6}$/i.test(hex)) return "#ffffff";

  const channels = [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const [red = 0, green = 0, blue = 0] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const whiteContrast = 1.05 / (luminance + 0.05);
  const darkTextContrast = (luminance + 0.05) / 0.058;

  return darkTextContrast > whiteContrast ? "#181713" : "#ffffff";
}
