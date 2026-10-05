"use client";

import { useEffect, useState } from "react";

export type Locale = "id" | "en";
export type TranslationMessages = Record<Locale, Record<string, string>>;

export function useTranslate(messages: TranslationMessages) {
  const [locale, setLocale] = useState<Locale>("id");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("menuku-language");
      if (saved === "id" || saved === "en") setLocale(saved);
    } catch {
      // Keep Indonesian as the default when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("menuku:translations-updated"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [locale]);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem("menuku-language", nextLocale);
    } catch {
      // The selected language still applies for this page session.
    }
  }

  return {
    locale,
    setLocale: changeLocale,
    t: (key: string) => messages[locale][key] ?? key,
  };
}
