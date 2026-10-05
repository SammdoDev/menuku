"use client";

import MarketingMotionProvider from "@/features/marketing/components/landing-motion";
import MarketingNavbar from "@/features/marketing/components/marketing-navbar";
import MarketingCtaSection from "@/features/marketing/sections/cta-section";
import MarketingFaqSection from "@/features/marketing/sections/faq-section";
import MarketingFeaturesSection from "@/features/marketing/sections/features-section";
import MarketingFooterSection from "@/features/marketing/sections/footer-section";
import MarketingGallerySection from "@/features/marketing/sections/gallery-section";
import MarketingHero from "@/features/marketing/sections/hero-section";
import MarketingPaymentSection from "@/features/marketing/sections/payment-section";
import MarketingPricingSection from "@/features/marketing/sections/pricing-section";
import MarketingStepsSection from "@/features/marketing/sections/steps-section";
import MarketingStorySection from "@/features/marketing/sections/story-section";
import { getMessages } from "@/i18n/messages";
import { useLocale } from "@/i18n/use-locale";
import type { LandingPlanPrice } from "@/features/marketing/types";

type MarketingPageProps = { planPrices: LandingPlanPrice[] };

function MarketingPage({ planPrices }: MarketingPageProps) {
  const { locale, setLocale } = useLocale();
  const constants = getMessages(locale);
  const currency = new Intl.NumberFormat(
    { id: "id-ID", en: "en-US", ms: "ms-MY", zh: "zh-CN", ja: "ja-JP" }[locale],
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
