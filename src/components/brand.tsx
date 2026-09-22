import Link from "next/link";

export default function Brand({
  href = "/",
  compact = false,
  inverse = false,
}: {
  href?: string;
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-black tracking-[-0.06em] ${inverse ? "text-white" : "text-ink"} ${compact ? "text-lg" : "text-2xl"}`}
    >
      <img
        src="/icon.svg"
        alt=""
        className={`shrink-0 rounded-[9px] shadow-[0_5px_12px_#ff65344a] ${compact ? "size-7" : "size-8"}`}
      />
      <span>menuku</span>
    </Link>
  );
}
