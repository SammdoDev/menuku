import Link from "next/link";
import Brand from "@/components/brand/brand";
import { supportWhatsAppUrl } from "@/config/site";
import type { LandingConstants } from "@/features/marketing/types";

type FooterSectionProps = { constants: LandingConstants };
function MarketingFooterSection({ constants }: FooterSectionProps) {
  return (
    <footer className="text-muted mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 text-xs sm:flex-row sm:items-center sm:px-6 lg:px-10">
      <Brand compact />
      <p className="sm:ml-auto">© 2026 Menuku. {constants.footer.tagline}</p>
      <Link className="text-ink font-bold" href="/login">
        {constants.footer.login}
      </Link>
      <a
        className="text-ink font-bold"
        href={supportWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
      >
        {constants.footer.contact}
      </a>
    </footer>
  );
}

export default MarketingFooterSection;
