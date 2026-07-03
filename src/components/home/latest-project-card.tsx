import Image from "next/image";
import { FEATURED_PROJECT } from "@/lib/featured-project";
import { PROJECT_CARD_IMAGE_SIZES } from "@/utils/image-sizes";

export function LatestProjectCard() {
  return (
    <a
      className="u-project-card transition-colors duration-300 hover:border-(--color-text)"
      href={FEATURED_PROJECT.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="relative aspect-[1200/630] w-[12em] shrink-0 overflow-hidden bg-black">
        <Image
          alt={FEATURED_PROJECT.imageAlt}
          className="object-cover object-center"
          draggable={false}
          fill
          sizes={PROJECT_CARD_IMAGE_SIZES}
          src={FEATURED_PROJECT.imageSrc}
        />
      </div>
      <div className="u-bottom-content min-w-0">
        <div className="flex flex-col gap-[0.75em]">
          <div className="u-meta">{FEATURED_PROJECT.meta}</div>
          <div className="line-clamp-2 min-h-[calc((0.8725em*1.36)*2)] text-[1.25em] leading-[1.36]">
            {FEATURED_PROJECT.name} — {FEATURED_PROJECT.description}
          </div>
        </div>
        <div className="flex">
          <div className="u-pill">{FEATURED_PROJECT.pill}</div>
        </div>
      </div>
    </a>
  );
}
