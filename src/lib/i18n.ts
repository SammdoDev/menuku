import en from "../locales/en.json";
import id from "../locales/id.json";
import ja from "../locales/ja.json";
import ms from "../locales/ms.json";
import zh from "../locales/zh.json";

export type Locale = "id" | "en" | "ms" | "zh" | "ja";
export type DeepStringValues<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? DeepStringValues<Item>[]
    : T extends object
      ? { [Key in keyof T]: DeepStringValues<T[Key]> }
      : never;
export type TranslationConstants = DeepStringValues<typeof en>;

const messages: Record<Locale, TranslationConstants> = { id, en, ms, zh, ja };

export const languageOptions: {
  value: Locale;
  label: string;
  shortLabel: string;
  flag: string;
}[] = [
  { value: "id", label: "Bahasa Indonesia", shortLabel: "ID", flag: "🇮🇩" },
  { value: "en", label: "English", shortLabel: "EN", flag: "🇬🇧" },
  { value: "ms", label: "Bahasa Melayu", shortLabel: "MS", flag: "🇲🇾" },
  { value: "zh", label: "中文（简体）", shortLabel: "中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", shortLabel: "日本語", flag: "🇯🇵" },
];

export function getConstants(locale: Locale) {
  return messages[locale] ?? messages.en;
}
