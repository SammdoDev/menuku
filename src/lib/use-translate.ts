"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./i18n";

export type { Locale } from "./i18n";
const LANGUAGE_PREFERENCE_KEY = "menuku-language-v2";

export function useTranslate() {
  const [locale, setLocale] = useState<Locale>("id");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      if (saved === "id" || saved === "en" || saved === "ms" || saved === "zh" || saved === "ja")
        setLocale(saved);
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
      window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, nextLocale);
    } catch {
      // The selected language still applies for this page session.
    }
  }

  return {
    locale,
    setLocale: changeLocale,
  };
}
