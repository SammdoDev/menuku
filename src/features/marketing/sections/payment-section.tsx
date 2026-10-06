import { Banknote, Check, Clock3, QrCode } from "lucide-react";
import type { LandingConstants } from "../types";

type PaymentSectionProps = { constants: LandingConstants };
function MarketingPaymentSection({ constants }: PaymentSectionProps) {
  return (
    <section className="border-b border-[#e9dfd7] py-14 sm:py-16" data-reveal>
      <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10">
        <div className="lg:col-span-4">
          <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">
            {constants.payment.eyebrow}
          </p>
          <h2 className="display-font text-3xl font-black">{constants.payment.title}</h2>
          <p className="text-muted mt-3 text-sm leading-6">{constants.payment.copy}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
          <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5">
            <Banknote className="mb-4 text-[#b13b19]" size={20} />
            <h3 className="display-font text-base font-black">{constants.payment.manual.title}</h3>
            <p className="text-muted mt-2 text-xs leading-5">{constants.payment.manual.copy}</p>
            <span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold">
              <Clock3 size={13} /> {constants.payment.manual.note}
            </span>
          </article>
          <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5">
            <QrCode className="mb-4 text-[#b13b19]" size={20} />
            <h3 className="display-font text-base font-black">{constants.payment.qris.title}</h3>
            <p className="text-muted mt-2 text-xs leading-5">{constants.payment.qris.copy}</p>
            <span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold">
              <Check className="text-[#b13b19]" size={13} /> {constants.payment.qris.note}
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}

export default MarketingPaymentSection;
