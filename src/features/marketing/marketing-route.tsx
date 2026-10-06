import { plans, type PlanCode } from "@/features/billing/plans";
import type { Locale } from "@/i18n/config";
import MarketingPage from "./marketing-page";

type MarketingRouteProps = { locale: Locale };

export function getLandingPlanPrices() {
  return (Object.entries(plans) as [PlanCode, (typeof plans)[PlanCode]][]).map(
    ([code, plan]) => ({ code, price: plan.price }),
  );
}

export default function MarketingRoute({ locale }: MarketingRouteProps) {
  return <MarketingPage locale={locale} planPrices={getLandingPlanPrices()} />;
}
