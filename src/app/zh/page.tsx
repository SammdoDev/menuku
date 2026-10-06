import MarketingRoute from "@/features/marketing/marketing-route";
import { getLocalizedMarketingMetadata } from "@/features/marketing/metadata";

export const metadata = getLocalizedMarketingMetadata("zh");

export default function ChineseHomePage() {
  return <MarketingRoute locale="zh" />;
}
