type MenuThumbnailProps = { tone: "peach" | "green" };

function MarketingMenuThumbnail({ tone }: MenuThumbnailProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="marketing-menu-thumbnail size-12 shrink-0 rounded-xl bg-center bg-no-repeat shadow-sm"
        style={{
          backgroundImage: "url('/landing-menu-food-strip.webp')",
          backgroundPosition: tone === "peach" ? "0% center" : "50% center",
          backgroundSize: "300% auto",
          animationDelay: tone === "peach" ? "0s" : "-2s",
        }}
      />
      <style>{`
        .marketing-menu-thumbnail { animation: marketing-menu-float 5s ease-in-out infinite; }
        @keyframes marketing-menu-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marketing-menu-thumbnail { animation: none; }
        }
      `}</style>
    </>
  );
}

export default MarketingMenuThumbnail;
