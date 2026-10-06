function MarketingBrand() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2 text-lg font-black tracking-[-0.06em] text-ink"
    >
      <img
        src="/brand-icon.svg"
        alt=""
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-[10px] shadow-[0_5px_12px_#ff65344a]"
      />
      <span>menuku</span>
    </a>
  );
}

export default MarketingBrand;
