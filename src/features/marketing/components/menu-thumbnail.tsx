type MenuThumbnailProps = { tone: "peach" | "green" };

function MarketingMenuThumbnail({ tone }: MenuThumbnailProps) {
  return (
    <span
      aria-hidden="true"
      className="size-12 shrink-0 rounded-xl bg-cover bg-center shadow-sm"
      style={{
        backgroundImage: "url('/landing-menu-food-strip.webp')",
        backgroundPosition: tone === "peach" ? "0% center" : "50% center",
        backgroundSize: "300% 100%",
      }}
    />
  );
}

export default MarketingMenuThumbnail;
