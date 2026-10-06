import MarketingScrollStory from "./components/scroll-story";
import type { LandingConstants } from "../../types";

type StorySectionProps = { constants: LandingConstants };
function MarketingStorySection({ constants }: StorySectionProps) {
  return (
    <MarketingScrollStory
      copy={constants.story.copy}
      eyebrow={constants.story.eyebrow}
      scenes={constants.story.scenes}
      scrollHint={constants.story.scrollHint}
      title={constants.story.title}
    />
  );
}

export default MarketingStorySection;
