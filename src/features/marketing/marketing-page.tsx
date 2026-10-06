"use client";

import MarketingMotionProvider from "./components/landing-motion";
import MarketingNavbar from "./components/marketing-navbar";
import MarketingCtaSection from "./sections/cta-section";
import MarketingFaqSection from "./sections/faq-section";
import MarketingFeaturesSection from "./sections/features-section";
import MarketingFooterSection from "./sections/footer-section";
import MarketingGallerySection from "./sections/gallery-section";
import MarketingHero from "./sections/hero-section";
import MarketingPaymentSection from "./sections/payment-section";
import MarketingPricingSection from "./sections/pricing-section";
import MarketingStepsSection from "./sections/steps-section";
import type { LandingPlanPrice } from "./types";
import MarketingStorySection from "./sections/story-section";
import { useLocale } from "../../i18n/use-locale";
import { getMessages } from "../../i18n/messages";

type MarketingPageProps = { planPrices: LandingPlanPrice[] };

function MarketingPage({ planPrices }: MarketingPageProps) {
  const { locale, setLocale } = useLocale();
  const constants = getMessages(locale);
  const currencyLocaleMap = {
    id: "id-ID",
    en: "en-US",
    ms: "ms-MY",
    zh: "zh-CN",
    ja: "ja-JP",
  } as const;
  const currency = new Intl.NumberFormat(
    currencyLocaleMap[locale as keyof typeof currencyLocaleMap] ?? currencyLocaleMap.id,
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    },
  );

  return (
    <MarketingMotionProvider>
      <main className="bg-paper text-ink min-h-screen overflow-hidden">
        <MarketingNavbar constants={constants} locale={locale} onLocaleChange={setLocale} />
        <MarketingHero constants={constants} />
        <MarketingGallerySection constants={constants} />
        <MarketingStorySection constants={constants} locale={locale} />
        <MarketingFeaturesSection constants={constants} />
        <MarketingStepsSection constants={constants} />
        <MarketingPricingSection
          constants={constants}
          currency={currency}
          planPrices={planPrices}
        />
        <MarketingPaymentSection constants={constants} />
        <MarketingFaqSection constants={constants} />
        <MarketingCtaSection constants={constants} />
        <MarketingFooterSection constants={constants} />
      </main>
    </MarketingMotionProvider>
  );
}

export default MarketingPage;
