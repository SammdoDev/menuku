import { HeroSection as HeroCopy } from "@/components/ui/hero-section-shadcnui";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import HeroMenuPreview from "./components/hero-menu-preview";
import type { LandingConstants } from "../../types";

type HeroSectionProps = {
  constants: LandingConstants;
};

function MarketingHero({ constants }: HeroSectionProps) {
  return (
    <HeroHighlight className="relative w-full" containerClassName="mx-auto w-full max-w-7xl">
      <section className="relative grid items-center gap-10 px-5 pt-12 pb-16 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-20">
        <div className="relative min-w-0 lg:col-span-7">
          <HeroCopy
            eyebrow={constants.hero.eyebrow}
            title={constants.hero.title.first}
            highlight={constants.hero.title.highlight}
            rotatingHighlights={constants.hero.title.rotating}
            description={constants.hero.copy}
            points={[constants.hero.point.one, constants.hero.point.two]}
            primaryLabel={constants.hero.primary}
            secondaryLabel={constants.hero.secondary}
          />
        </div>

        <HeroMenuPreview constants={constants} />
      </section>
    </HeroHighlight>
  );
}

export default MarketingHero;
