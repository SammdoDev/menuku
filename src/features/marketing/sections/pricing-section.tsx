import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { LandingConstants, LandingPlanPrice } from "@/features/marketing/types";

type PricingSectionProps = {
  constants: LandingConstants;
  planPrices: LandingPlanPrice[];
  currency: Intl.NumberFormat;
};
function MarketingPricingSection({ constants, planPrices, currency }: PricingSectionProps) {
  return (
    <section
      id="harga"
      className="scroll-mt-24 border-y border-[#e9dfd7] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
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
          {planPrices.map(({ code, price }) => {
            const featured = code === "premium";
            const features = constants.pricing[code].features;
            return (
              <article
                className={`relative flex flex-col rounded-2xl border p-5 shadow-sm sm:p-6 ${featured ? "border-[#b13b19] bg-[#fffaf6] shadow-xl shadow-[#b13b19]/[.08]" : "border-[#e9dfd7] bg-[#faf8f4]"}`}
                key={code}
              >
                {featured && (
                  <span className="mb-3 inline-flex self-start rounded-full bg-[#b13b19] px-3 py-1 text-[9px] font-black tracking-wide text-white">
                    {constants.pricing.popular}
                  </span>
                )}
                <p className="display-font text-lg font-black">{constants.pricing[code].name}</p>
                <p className="text-muted mt-1 min-h-5 text-xs">{constants.pricing[code].note}</p>
                <p className="mt-5 text-2xl font-black tabular-nums">
                  {price === 0 ? constants.pricing.free.priceLabel : currency.format(price)}
                  <span className="text-muted ml-1 text-xs font-normal">
                    {price === 0 ? constants.pricing.forever : constants.pricing.month}
                  </span>
                </p>
                <ul className="my-5 grid flex-1 content-start gap-3 border-t border-[#e9dfd7] pt-5 text-xs leading-5 sm:text-sm">
                  {features.map((feature) => (
                    <li className="flex items-start gap-2" key={feature}>
                      <Check className="mt-0.5 shrink-0 text-[#b13b19]" size={15} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${featured ? "bg-[#b13b19] text-white hover:bg-[#8f2e14]" : "border border-[#e9dfd7] bg-white hover:border-[#b13b19]"}`}
                  href={`/register?plan=${code}`}
                >
                  {code === "free" ? constants.pricing.cta.free : constants.pricing.choose[code]}
                  <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MarketingPricingSection;
