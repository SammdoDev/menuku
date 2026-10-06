import MarketingRoute from "@/features/marketing/marketing-route";
import { getLocalizedMarketingMetadata } from "@/features/marketing/metadata";

export const metadata = getLocalizedMarketingMetadata("ms");

export default function MalayHomePage() {
  return <MarketingRoute locale="ms" />;
}
