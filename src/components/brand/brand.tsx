import Link from "next/link";

const Brand = ({
  href = "/",
  compact = false,
  inverse = false,
  prominent = false,
}: {
  href?: string;
  compact?: boolean;
  inverse?: boolean;
  prominent?: boolean;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center font-black tracking-[-0.06em] ${inverse ? "text-white" : "text-ink"} ${compact ? "gap-2 text-lg" : prominent ? "gap-2.5 text-[1.8rem] sm:gap-3 sm:text-[2rem]" : "gap-2 text-2xl"}`}
  >
    <img
      src="/brand-icon.svg"
      alt=""
      className={`shrink-0 rounded-[10px] shadow-[0_5px_12px_#ff65344a] ${compact ? "size-7" : prominent ? "size-11 sm:size-[3.25rem]" : "size-8"}`}
    />
    <span>menuku</span>
  </Link>
);

export default Brand;
