const barHeights = [35, 52, 42, 68, 55, 78, 64, 88, 72, 100];

function MarketingAnalyticsBars() {
  return (
    <div className="flex h-24 items-end gap-1.5" aria-hidden="true">
      {barHeights.map((height, index) => (
        <span
          key={index}
          className="min-w-0 flex-1 rounded-t-sm"
          style={{
            height: `${height}%`,
            backgroundColor: index > 6 ? "#ffb99c" : "#b96a4c",
          }}
        />
      ))}
    </div>
  );
}

export default MarketingAnalyticsBars;
