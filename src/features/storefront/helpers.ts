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
