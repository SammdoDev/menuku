"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Brand from "@/components/brand/brand";
import LanguageAutocomplete from "@/components/ui/language-autocomplete";
import type { Locale } from "@/i18n/config";
import type { LandingConstants } from "../types";

type NavbarComponentEnhanceProps = {
  constants: LandingConstants;
  locale: Locale;
};

function NavbarComponentEnhance({
  constants,
  locale,
}: NavbarComponentEnhanceProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const navigation = [
    { href: "#fitur", label: constants.nav.features },
    { href: "#galeri", label: constants.nav.gallery },
    { href: "#cara", label: constants.nav.steps },
    { href: "#harga", label: constants.nav.pricing },
  ];
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLocaleChange(nextLocale: Locale) {
    const query = new URLSearchParams({ setLocale: nextLocale });
    router.push(`${pathname}?${query.toString()}`);
  }

  return (
    <header
      className={`border-line sticky top-0 z-40 border-b backdrop-blur-xl transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none ${scrolled ? "bg-white/95 shadow-[0_4px_20px_-12px_rgba(41,37,31,0.2)]" : "bg-white/90"}`}
    >
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <div className="shrink-0 motion-safe:animate-[navbar-enter_.5s_ease-out_both]">
          <Brand compact />
        </div>
        <nav
          aria-label={constants.nav.aria}
          className="hidden items-center gap-7 text-sm font-semibold motion-safe:animate-[navbar-enter_.5s_ease-out_both] md:flex"
          style={{ animationDelay: "80ms" }}
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
        <div
          className="flex items-center gap-2 motion-safe:animate-[navbar-enter_.5s_ease-out_both] sm:gap-4"
          style={{ animationDelay: "140ms" }}
        >
          <LanguageAutocomplete
            label={constants.language.label}
            noResultsLabel={constants.language.noResults}
            onValueChange={handleLocaleChange}
            searchLabel={constants.language.search}
            value={locale}
          />
          <Link
            className="text-muted hover:text-ink hidden text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b13b19] motion-reduce:transition-none sm:inline"
            href="/login"
          >
            {constants.nav.login}
          </Link>
          <Link
            className="bg-brand hover:bg-brand-dark inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold text-white transition-[transform,background-color,box-shadow] duration-200 hover:shadow-md hover:shadow-[#ff6534]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b13b19] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-reduce:transition-none sm:px-5 sm:text-sm"
            href="/register"
          >
            {constants.nav.start}
          </Link>
        </div>
      </div>
      <style>{`@keyframes navbar-enter { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
}

export default NavbarComponentEnhance;
