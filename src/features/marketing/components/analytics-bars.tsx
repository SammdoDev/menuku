const barHeights = [34, 53, 42, 69, 57, 86, 74, 100, 78, 92, 68, 100];

function MarketingAnalyticsBars() {
  return (
    <div aria-hidden="true" className="flex h-24 items-end gap-2">
      {barHeights.map((height, index) => (
        <span
          className={`min-w-0 flex-1 origin-bottom rounded-t-md motion-safe:animate-[chart-breathe_6s_ease-in-out_infinite] ${index === 7 || index === 11 ? "bg-[#b13b19]" : "bg-[#e7b49b]"}`}
          key={index}
          style={{ height: `${height}%`, animationDelay: `${index * 0.14}s` }}
        />
      ))}
    </div>
  );
}

export default MarketingAnalyticsBars;
