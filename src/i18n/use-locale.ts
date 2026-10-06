"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/i18n/config";

export type { Locale } from "@/i18n/config";
const LANGUAGE_PREFERENCE_KEY = "menuku-language-v2";

function getCookieLocale() {
  const cookiePrefix = `${LANGUAGE_PREFERENCE_KEY}=`;
  const cookie = document.cookie.split("; ").find((part) => part.startsWith(cookiePrefix));

  return cookie ? decodeURIComponent(cookie.slice(cookiePrefix.length)) : null;
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = getCookieLocale() ?? window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      if (SUPPORTED_LOCALES.includes(saved as Locale)) setLocale(saved as Locale);
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

  function setSelectedLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, nextLocale);
    } catch {
      // The selected language still applies for this page session.
    }
    try {
      document.cookie = `${LANGUAGE_PREFERENCE_KEY}=${encodeURIComponent(nextLocale)}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    } catch {
      // The selected language still applies for this page session.
    }
  }

  return {
    locale,
    setLocale: setSelectedLocale,
  };
}
