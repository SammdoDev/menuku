import MarketingRoute from "@/features/marketing/marketing-route";
import { getLocalizedMarketingMetadata } from "@/features/marketing/metadata";
import { DEFAULT_LOCALE } from "@/i18n/config";

export const metadata = getLocalizedMarketingMetadata(DEFAULT_LOCALE);

export default function HomePage() {
  return <MarketingRoute locale={DEFAULT_LOCALE} />;
}
