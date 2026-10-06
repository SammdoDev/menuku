import { supportWhatsAppUrl } from "@/config/site";
import type { LandingConstants } from "../../../types";

type FooterActionsProps = { constants: LandingConstants };

function FooterActions({ constants }: FooterActionsProps) {
  return (
    <>
      <a className="text-ink font-bold" href="/login">
        {constants.footer.login}
      </a>
      <a
        className="text-ink font-bold"
        href={supportWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
      >
        {constants.footer.contact}
      </a>
    </>
  );
}

export default FooterActions;
