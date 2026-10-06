import MarketingNavbar from "./components/marketing-navbar";
import MarketingMotionProvider from "./components/landing-motion";
import MarketingCtaSection from "./sections/cta/cta-section";
import MarketingFaqSection from "./sections/faq/faq-section";
import MarketingFeaturesSection from "./sections/features/features-section";
import MarketingFooterSection from "./sections/footer/footer-section";
import MarketingGallerySection from "./sections/gallery/gallery-section";
import MarketingHero from "./sections/hero/hero-section";
import MarketingPaymentSection from "./sections/payment/payment-section";
import MarketingPricingSection from "./sections/pricing/pricing-section";
import MarketingStepsSection from "./sections/steps/steps-section";
import type { LandingPlanPrice } from "./types";
import MarketingStorySection from "./sections/story/story-section";
import { getMessages } from "../../i18n/messages";
import type { Locale } from "@/i18n/config";

type MarketingPageProps = { planPrices: LandingPlanPrice[]; locale: Locale };

function MarketingPage({ planPrices, locale }: MarketingPageProps) {
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
      <main lang={locale} className="bg-paper text-ink min-h-screen overflow-hidden">
        <MarketingNavbar constants={constants} locale={locale} />
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
