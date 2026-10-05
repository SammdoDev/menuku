"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getMessages, type TranslationMessages } from "@/i18n/messages";
import { useLocale } from "@/i18n/use-locale";
import type { Locale } from "@/i18n/config";

type StorefrontLocaleValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  language: TranslationMessages["language"];
  messages: TranslationMessages["storefront"];
};

const StorefrontLocaleContext = createContext<StorefrontLocaleValue | null>(null);

export function StorefrontLocaleProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLocale();
  const translatedMessages = getMessages(locale);

  return (
    <StorefrontLocaleContext.Provider
      value={{
        locale,
        setLocale,
        language: translatedMessages.language,
        messages: translatedMessages.storefront,
      }}
    >
      {children}
    </StorefrontLocaleContext.Provider>
  );
}

export function useStorefrontLocale() {
  const value = useContext(StorefrontLocaleContext);
  if (!value) throw new Error("useStorefrontLocale must be used inside StorefrontLocaleProvider");
  return value;
}

export function formatStorefrontMessage(message: string, values: Record<string, string | number>) {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
