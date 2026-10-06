import type { LucideIcon } from "lucide-react";

type PaymentMethodCardProps = {
  icon: LucideIcon;
  title: string;
  copy: string;
  note: string;
  noteIcon: LucideIcon;
  noteHighlighted?: boolean;
};

function PaymentMethodCard({
  icon: Icon,
  title,
  copy,
  note,
  noteIcon: NoteIcon,
  noteHighlighted = false,
}: PaymentMethodCardProps) {
  return (
    <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5">
      <Icon className="mb-4 text-[#b13b19]" size={20} />
      <h3 className="display-font text-base font-black">{title}</h3>
      <p className="text-muted mt-2 text-xs leading-5">{copy}</p>
      <span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold">
        <NoteIcon className={noteHighlighted ? "text-[#b13b19]" : undefined} size={13} /> {note}
      </span>
    </article>
  );
}

export default PaymentMethodCard;
