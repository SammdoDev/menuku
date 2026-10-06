import { ArrowRight } from "lucide-react";

type CtaRegisterButtonProps = { label: string };

function CtaRegisterButton({ label }: CtaRegisterButtonProps) {
  return (
    <a
      className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#9f3516] transition hover:-translate-y-0.5"
      href="/register"
    >
      {label}
      <ArrowRight size={15} />
    </a>
  );
}

export default CtaRegisterButton;
