import { Banknote, Check, Clock3, QrCode } from "lucide-react";
import PaymentMethodCard from "./components/payment-method-card";
import type { LandingConstants } from "../../types";

type PaymentSectionProps = { constants: LandingConstants };

function MarketingPaymentSection({ constants }: PaymentSectionProps) {
  return (
    <section className="marketing-deferred border-b border-[#e9dfd7] py-14 sm:py-16" data-reveal>
      <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10">
        <div className="lg:col-span-4">
          <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">
            {constants.payment.eyebrow}
          </p>
          <h2 className="display-font text-3xl font-black">{constants.payment.title}</h2>
          <p className="text-muted mt-3 text-sm leading-6">{constants.payment.copy}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
          <PaymentMethodCard
            icon={Banknote}
            note={constants.payment.manual.note}
            noteIcon={Clock3}
            title={constants.payment.manual.title}
            copy={constants.payment.manual.copy}
          />
          <PaymentMethodCard
            icon={QrCode}
            note={constants.payment.qris.note}
            noteIcon={Check}
            title={constants.payment.qris.title}
            copy={constants.payment.qris.copy}
            noteHighlighted
          />
        </div>
      </div>
    </section>
  );
}

export default MarketingPaymentSection;
