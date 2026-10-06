import PricingPlanCard from "./components/pricing-plan-card";
import type { LandingConstants, LandingPlanPrice } from "../../types";

type PricingSectionProps = {
  constants: LandingConstants;
  planPrices: LandingPlanPrice[];
  currency: Intl.NumberFormat;
};
function MarketingPricingSection({ constants, planPrices, currency }: PricingSectionProps) {
  return (
    <section
      id="harga"
      className="marketing-deferred scroll-mt-24 border-y border-[#e9dfd7] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
      data-reveal
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">
            {constants.pricing.eyebrow}
          </p>
          <h2 className="display-font text-3xl font-black sm:text-4xl">
            {constants.pricing.title}
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">{constants.pricing.copy}</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3" data-stagger>
          {planPrices.map((plan) => (
            <PricingPlanCard
              constants={constants}
              currency={currency}
              key={plan.code}
              plan={plan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketingPricingSection;
