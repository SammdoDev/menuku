import MarketingBrand from "../../components/marketing-brand";
import FooterActions from "./components/footer-actions";
import type { LandingConstants } from "../../types";

type FooterSectionProps = { constants: LandingConstants };

function MarketingFooterSection({ constants }: FooterSectionProps) {
  return (
    <footer className="marketing-deferred text-muted mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 text-xs sm:flex-row sm:items-center sm:px-6 lg:px-10">
      <MarketingBrand />
      <p className="sm:ml-auto">© 2026 Menuku. {constants.footer.tagline}</p>
      <FooterActions constants={constants} />
    </footer>
  );
}

export default MarketingFooterSection;
