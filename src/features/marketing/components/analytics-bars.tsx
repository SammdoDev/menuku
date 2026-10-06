const barHeights = [35, 52, 42, 68, 55, 78, 64, 88, 72, 100];

function MarketingAnalyticsBars() {
  return (
    <div className="flex h-24 items-end gap-1.5" aria-hidden="true">
      {barHeights.map((height, index) => (
        <span
          key={index}
          className="marketing-analytics-bar min-w-0 flex-1 origin-bottom rounded-t-sm"
          style={{
            height: `${height}%`,
            backgroundColor: index > 6 ? "#ffb99c" : "#b96a4c",
            animationDelay: `${index * -0.25}s`,
          }}
        />
      ))}

      <style>{`
        .marketing-analytics-bar {
          animation: marketing-analytics-wave 3.5s ease-in-out infinite;
        }

        @keyframes marketing-analytics-wave {
          0%, 100% {
            transform: scaleY(0.55);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marketing-analytics-bar {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default MarketingAnalyticsBars;