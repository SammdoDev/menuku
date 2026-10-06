import { ArrowDown, ArrowUpRight, Link2, QrCode } from "lucide-react";

type ScrollScene = {
  title: string;
  copy: string;
};

type ScrollStoryProps = {
  eyebrow: string;
  title: string;
  copy: string;
  scrollHint: string;
  scenes: ScrollScene[];
};

const thumbnailPositions = ["0% center", "50% center", "100% center"];

function MarketingScrollStory({
  eyebrow,
  title,
  copy,
  scrollHint,
  scenes,
}: ScrollStoryProps) {
  const currentIndex = 0;
  const progress = scenes.length ? 1 / scenes.length : 0;

  return (
    <section
      id="cerita"
      className="marketing-deferred bg-[#f7f3ed] py-16 text-[#29251f] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border-b border-[#29251f]/15 pb-9 sm:pb-12">
          <p
            className="mb-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.16em] text-[#a03417] uppercase"
          >
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            {eyebrow}
          </p>

          <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2
              className="display-font max-w-3xl text-4xl leading-[1.05] font-black tracking-[-0.045em] sm:text-5xl lg:col-span-7 lg:text-6xl"
            >
              {title}
            </h2>

            <p
              className="max-w-lg text-sm leading-7 text-[#62564b] sm:text-base lg:col-span-5 lg:pb-1"
            >
              {copy}
            </p>
          </div>
        </div>

        <div className="mt-9 grid items-start gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:col-span-5">
            <div
              className="relative overflow-hidden rounded-[1.75rem] bg-[#29251f] p-5 sm:p-7"
            >
              <div aria-hidden="true" className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-white/70">
                    <span className="size-1.5 rounded-full bg-[#ff9b78]" />
                    MENUKU
                  </span>

                  <ArrowUpRight size={17} className="text-white/40" strokeWidth={1.5} />
                </div>

                <div className="mx-auto max-w-sm rounded-2xl bg-[#fffaf6] p-4 shadow-xl shadow-black/15 sm:p-5">
                  <div className="flex items-center gap-3 border-b border-[#29251f]/10 pb-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#b13b19] text-sm font-black text-white">
                      M
                    </span>

                    <div className="flex-1 space-y-2">
                      <span className="block h-2 w-24 rounded-full bg-[#29251f]/80" />
                      <span className="block h-1.5 w-16 rounded-full bg-[#29251f]/20" />
                    </div>

                    <QrCode size={23} className="text-[#29251f]/65" strokeWidth={1.5} />
                  </div>

                  <div className="flex gap-2 py-4">
                    <span className="h-5 w-14 rounded-full bg-[#b13b19]" />
                    <span className="h-5 w-12 rounded-full bg-[#eee7de]" />
                    <span className="h-5 w-16 rounded-full bg-[#eee7de]" />
                  </div>

                  <div className="space-y-3">
                    {thumbnailPositions.map((position, index) => (
                      <div
                        key={position}
                        className="flex items-center gap-3 rounded-xl border border-[#29251f]/5 bg-white p-2"
                      >
                        <span
                          className="size-12 shrink-0 rounded-lg bg-cover bg-center sm:size-14"
                          style={{
                            backgroundImage: "url('/landing-menu-food-strip.webp')",
                            backgroundPosition: position,
                            backgroundSize: "300% 100%",
                          }}
                        />

                        <div className="flex-1 space-y-2">
                          <span
                            className="block h-1.5 rounded-full bg-[#29251f]/65"
                            style={{ width: `${72 - index * 10}%` }}
                          />
                          <span className="block h-1 w-4/5 rounded-full bg-[#29251f]/15" />
                          <span className="block h-1.5 w-10 rounded-full bg-[#b13b19]/60" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-[#f1ece5] px-3 py-2.5">
                    <span className="h-1.5 w-24 rounded-full bg-[#29251f]/20" />
                    <Link2 size={15} className="text-[#b13b19]" strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <span className="font-mono text-xs text-[#ffb99c]">
                    {String(scenes.length ? currentIndex + 1 : 0).padStart(2, "0")}
                  </span>

                  <div className="h-px flex-1 overflow-hidden bg-white/15">
                    <span
                      className="block h-full origin-left bg-[#ffb99c] transition-transform duration-500 motion-reduce:transition-none"
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </div>

                  <span className="font-mono text-xs text-white/70">
                    {String(scenes.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 hidden items-center gap-2 text-xs text-[#62564b] lg:flex">
              <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>{scrollHint}</span>
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-7">
            {scenes.map((scene, index) => {
              const isActive = index === currentIndex;

              return (
                <article
                  key={`${index}-${scene.title}`}
                  aria-current={isActive ? "step" : undefined}
                  data-story-scene
                  className={`relative border-b py-8 transition-colors duration-300 first:pt-0 last:border-b-0 motion-reduce:transition-none sm:py-10 lg:flex lg:min-h-[35svh] lg:items-center lg:py-12 ${
                    isActive ? "border-[#b13b19]/35" : "border-[#29251f]/15"
                  }`}
                >
                  <div
                    className="grid w-full grid-cols-[2.5rem_1fr] gap-4 sm:grid-cols-[3rem_1fr] sm:gap-6"
                  >
                    <span
                      className={`mt-1 flex size-9 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-300 motion-reduce:transition-none sm:size-10 ${
                        isActive
                          ? "border-[#b13b19] bg-[#b13b19] text-white"
                          : "border-[#686157]/40 text-[#686157]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="max-w-lg">
                      <h3
                        className={`display-font text-2xl leading-[1.15] font-black tracking-[-0.025em] transition-colors duration-300 motion-reduce:transition-none sm:text-3xl lg:text-4xl ${
                          isActive ? "text-[#a03417]" : "text-[#29251f]"
                        }`}
                      >
                        {scene.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-[#62564b] sm:text-base sm:leading-8">
                        {scene.copy}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketingScrollStory;
