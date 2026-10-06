import MarketingRoute from "@/features/marketing/marketing-route";
import { getLocalizedMarketingMetadata } from "@/features/marketing/metadata";

export const metadata = getLocalizedMarketingMetadata("ja");

export default function JapaneseHomePage() {
  return <MarketingRoute locale="ja" />;
}
