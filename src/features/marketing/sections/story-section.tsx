import MarketingScrollStory from "@/features/marketing/sections/scroll-story";
import type { LandingConstants, LandingLocale } from "@/features/marketing/types";

type StorySectionProps = { constants: LandingConstants; locale: LandingLocale };
function MarketingStorySection({ constants, locale }: StorySectionProps) {
  return (
    <MarketingScrollStory
      copy={constants.story.copy}
      eyebrow={constants.story.eyebrow}
      locale={locale}
      scenes={constants.story.scenes}
      scrollHint={constants.story.scrollHint}
      title={constants.story.title}
    />
  );
}

export default MarketingStorySection;
