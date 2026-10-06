import MarketingScrollStory from "../scroll-story";
import type { LandingConstants } from "../../types";
import type { Locale } from "@/i18n/config";

type StorySectionProps = { constants: LandingConstants; locale: Locale };
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
