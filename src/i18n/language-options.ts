import type { Locale } from "./config";

export type LanguageOption = {
  value: Locale;
  label: string;
  shortLabel: string;
  flag: string;
};

export const languageOptions: LanguageOption[] = [
  { value: "id", label: "Bahasa Indonesia", shortLabel: "ID", flag: "\u{1f1ee}\u{1f1e9}" },
  { value: "en", label: "English", shortLabel: "EN", flag: "\u{1f1ec}\u{1f1e7}" },
  { value: "ms", label: "Bahasa Melayu", shortLabel: "MS", flag: "\u{1f1f2}\u{1f1fe}" },
  {
    value: "zh",
    label: "\u7b80\u4f53\u4e2d\u6587",
    shortLabel: "\u4e2d\u6587",
    flag: "\u{1f1e8}\u{1f1f3}",
  },
  {
    value: "ja",
    label: "\u65e5\u672c\u8a9e",
    shortLabel: "\u65e5\u672c\u8a9e",
    flag: "\u{1f1ef}\u{1f1f5}",
  },
];
