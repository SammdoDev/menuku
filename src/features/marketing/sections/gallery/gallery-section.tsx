import MarketingGalleryBentoGrid from "./components/gallery-bento-grid";
import type { LandingConstants } from "../../types";

type GallerySectionProps = { constants: LandingConstants };

function MarketingGallerySection({ constants }: GallerySectionProps) {
  return (
    <section
      id="galeri"
      className="marketing-deferred scroll-mt-24 border-y border-[#e9dfd7] bg-white py-16 sm:py-20"
      data-reveal
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
          <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">
            {constants.gallery.eyebrow}
          </p>
          <h2 className="display-font text-3xl leading-tight font-black sm:text-4xl">
            {constants.gallery.title}
          </h2>
          <p className="text-muted mt-3 text-sm leading-6">{constants.gallery.copy}</p>
        </div>
        <MarketingGalleryBentoGrid constants={constants} />
      </div>
    </section>
  );
}

export default MarketingGallerySection;
