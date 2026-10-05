export const openingHourDays = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
] as const;

export type OpeningHourDayKey = (typeof openingHourDays)[number]["key"];
export type OpeningHourEntry = { closed: true } | { closed?: false; open: string; close: string };
export type OpeningHours = Partial<Record<OpeningHourDayKey, OpeningHourEntry>>;

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function isValidOpeningTime(value: string) {
  return timePattern.test(value);
}

export function parseOpeningHours(value: unknown): OpeningHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const raw = value as Record<string, unknown>;
  const hours: OpeningHours = {};

  for (const { key } of openingHourDays) {
    const entry = raw[key];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;

    const day = entry as Record<string, unknown>;
    if (day.closed === true) {
      hours[key] = { closed: true };
      continue;
    }

    if (
      typeof day.open === "string" &&
      typeof day.close === "string" &&
      isValidOpeningTime(day.open) &&
      isValidOpeningTime(day.close)
    ) {
      hours[key] = { open: day.open, close: day.close };
    }
  }

  return hours;
}

export function formatOpeningTime(value: string) {
  return value.replace(":", ".");
}
