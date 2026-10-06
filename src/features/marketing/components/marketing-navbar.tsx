"use client";

import Link from "next/link";
import Brand from "@/components/brand/brand";
import LanguageAutocomplete from "@/components/ui/language-autocomplete";
import type { Locale } from "@/i18n/config";
import type { LandingConstants } from "../types";

type NavbarComponentEnhanceProps = {
  constants: LandingConstants;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

const NavbarComponentEnhance = ({
  constants,
  locale,
  onLocaleChange,
}: NavbarComponentEnhanceProps) => (
  <header className="border-line sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
      <Brand compact />
      <nav
        className="hidden items-center gap-7 text-sm font-semibold md:flex"
        aria-label={constants.nav.aria}
      >
        <a className="hover:text-brand transition" href="#fitur">
          {constants.nav.features}
        </a>
        <a className="hover:text-brand transition" href="#galeri">
          {constants.nav.gallery}
        </a>
        <a className="hover:text-brand transition" href="#cara">
          {constants.nav.steps}
        </a>
        <a className="hover:text-brand transition" href="#harga">
          {constants.nav.pricing}
        </a>
      </nav>
      <div className="flex items-center gap-2 sm:gap-4">
        <LanguageAutocomplete
          label={constants.language.label}
          noResultsLabel={constants.language.noResults}
          onValueChange={onLocaleChange}
          searchLabel={constants.language.search}
          value={locale}
        />
        <Link
          className="text-muted hover:text-ink hidden text-sm font-semibold transition sm:inline"
          href="/login"
        >
          {constants.nav.login}
        </Link>
        <Link
          className="bg-brand hover:bg-brand-dark inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold text-white transition sm:px-5 sm:text-sm"
          href="/register"
        >
          {constants.nav.start}
        </Link>
      </div>
    </div>
  </header>
);

export default NavbarComponentEnhance;
