import { Check, ChevronDown } from "lucide-react";
import MarketingBrand from "./marketing-brand";
import { languageOptions } from "@/i18n/language-options";
import type { Locale } from "@/i18n/config";
import type { LandingConstants } from "../types";

type MarketingNavbarProps = {
  constants: LandingConstants;
  locale: Locale;
};

function localeHref(locale: Locale) {
  const pathname = locale === "id" ? "/" : `/${locale}`;
  return `${pathname}?setLocale=${locale}`;
}

function MarketingNavbar({ constants, locale }: MarketingNavbarProps) {
  const navigation = [
    { href: "#fitur", label: constants.nav.features },
    { href: "#galeri", label: constants.nav.gallery },
    { href: "#cara", label: constants.nav.steps },
    { href: "#harga", label: constants.nav.pricing },
  ];
  const selectedLanguage = languageOptions.find((option) => option.value === locale)!;

  return (
    <header className="border-line sticky top-0 z-40 border-b bg-white/95 shadow-[0_4px_20px_-12px_rgba(41,37,31,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <MarketingBrand />

        <nav
          aria-label={constants.nav.aria}
          className="hidden items-center gap-7 text-sm font-semibold md:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group hover:text-brand relative py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b13b19] motion-reduce:transition-none"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="bg-brand absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <details className="group relative shrink-0">
            <summary
              aria-label={`${constants.language.label}: ${selectedLanguage.label}`}
              className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-transparent transition-colors hover:border-[#eee5dd] hover:bg-[#f7f2ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b13b19] [&::-webkit-details-marker]:hidden"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {selectedLanguage.flag}
              </span>
              <ChevronDown
                aria-hidden="true"
                size={12}
                className="absolute right-0.5 bottom-1 text-[#686157] transition-transform group-open:rotate-180"
              />
            </summary>

            <nav
              aria-label={constants.language.label}
              className="absolute top-[calc(100%+0.55rem)] right-0 z-50 w-64 overflow-hidden rounded-2xl border border-[#e9dfd7] bg-white p-2 shadow-[0_16px_40px_-16px_rgba(41,37,31,.25)]"
            >
              {languageOptions.map((option) => {
                const selected = option.value === locale;

                return (
                  <a
                    key={option.value}
                    href={localeHref(option.value)}
                    lang={option.value}
                    aria-current={selected ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150 motion-reduce:transition-none ${selected ? "bg-[#fff1e9]" : "hover:bg-[#faf8f5]"}`}
                  >
                    <span aria-hidden="true" className="text-lg leading-none">
                      {option.flag}
                    </span>
                    <span className="min-w-0 flex-1 font-semibold">{option.label}</span>
                    {selected && (
                      <Check aria-hidden="true" size={16} className="shrink-0 text-[#912f15]" />
                    )}
                  </a>
                );
              })}
            </nav>
          </details>

          <a
            className="text-muted hover:text-ink hidden text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b13b19] motion-reduce:transition-none sm:inline"
            href="/login"
          >
            {constants.nav.login}
          </a>

          <a
            className="bg-brand hover:bg-brand-dark inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold text-white transition-[transform,background-color,box-shadow] duration-200 hover:shadow-md hover:shadow-[#b13b19]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b13b19] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-reduce:transition-none sm:px-5 sm:text-sm"
            href="/register"
          >
            {constants.nav.start}
          </a>
        </div>
      </div>
    </header>
  );
}

export default MarketingNavbar;
