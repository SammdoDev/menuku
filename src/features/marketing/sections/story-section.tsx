import MarketingScrollStory from "./scroll-story";
import type { LandingConstants, LandingLocale } from "../types";

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
