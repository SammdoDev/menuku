import type { Locale } from "./config";

export type LanguageOption = {
  value: Locale;
  label: string;
  shortLabel: string;
  flag: string;
};

export const languageOptions: LanguageOption[] = [
  { value: "id", label: "Bahasa Indonesia", shortLabel: "ID", flag: "🇮🇩" },
  { value: "en", label: "English", shortLabel: "EN", flag: "🇬🇧" },
  { value: "ms", label: "Bahasa Melayu", shortLabel: "MS", flag: "🇲🇾" },
  { value: "zh", label: "中文（简体）", shortLabel: "中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", shortLabel: "日本語", flag: "🇯🇵" },
];
