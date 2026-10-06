import MarketingRoute from "@/features/marketing/marketing-route";
import { getLocalizedMarketingMetadata } from "@/features/marketing/metadata";

export const metadata = getLocalizedMarketingMetadata("en");

export default function EnglishHomePage() {
  return <MarketingRoute locale="en" />;
}
