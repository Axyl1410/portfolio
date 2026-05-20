import Image from "next/image";
import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-client";
import {
  clearIntroPending,
  INTRO_LOADER_SESSION_KEY,
  markIntroPending,
  markIntroReady,
} from "@/lib/intro-loader";
import { LOADER_IMAGE_SIZES } from "@/utils/image-sizes";
import { prefersReducedMotion } from "@/utils/motion";
import { waitForImages } from "@/utils/wait-for-images";

interface LoaderImage {
  src: string;
  alt?: string;
}

interface HomeIntroLoaderProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  imageSrc?: string;
  imageAlt?: string;
  images?: LoaderImage[];
}

function setElementsVisible(elements: (HTMLElement | null)[], opacity: number) {
  for (const el of elements) {
    if (el) {
      gsap.set(el, { opacity });
    }
  }
}

const CLIP_HIDDEN = "inset(50% 50% 50% 50%)";
const CLIP_REVEALED = "inset(0% 0% 0% 0%)";

function setupLoaderPhotos(photos: NodeListOf<Element>) {
  photos.forEach((photo, index) => {
    gsap.set(photo, {
      opacity: 1,
      zIndex: index,
      clipPath: index === 0 ? "none" : CLIP_HIDDEN,
      willChange: index > 0 ? "clip-path" : "auto",
    });
  });
}

function getLoaderPositions(loaderEl: HTMLDivElement) {
  const finalRect = loaderEl.getBoundingClientRect();
  loaderEl.style.transform = "none";
  const baseRect = loaderEl.getBoundingClientRect();
  loaderEl.style.removeProperty("transform");

  const cssOffsetX = finalRect.left - baseRect.left;
  const cssOffsetY = finalRect.top - baseRect.top;

  const toCenterX = (window.innerWidth - finalRect.width) / 2 - finalRect.left;
  const toCenterY = (window.innerHeight - finalRect.height) / 2 - finalRect.top;

  return {
    cssOffsetX,
    cssOffsetY,
    toCenterX,
    toCenterY,
  };
}

function createLoaderTimeline(
  loaderEl: HTMLDivElement,
  positions: ReturnType<typeof getLoaderPositions>,
  revealTargets: HTMLElement[],
  textEl: HTMLDivElement | null,
  options: {
    imageCount: number;
  }
) {
  const tl = gsap.timeline();

  const photos = loaderEl.querySelectorAll(".u-loader-photo");
  setupLoaderPhotos(photos);

  const revealOnce = () => {
    tl.to(loaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.inOut",
    });
  };

  const imageCount = Math.max(1, options.imageCount);

  revealOnce();

  for (let i = 1; i < imageCount; i += 1) {
    tl.to(loaderEl, { duration: 0.25, ease: "power3.inOut" });
    tl.fromTo(
      photos[i],
      { clipPath: CLIP_HIDDEN },
      {
        clipPath: CLIP_REVEALED,
        duration: 0.65,
        ease: "power3.inOut",
      }
    );
    tl.set(photos[i - 1], { opacity: 0 }, "<0.55");
  }

  tl.to(loaderEl, { duration: 0.4 }).to(loaderEl, {
    x: positions.cssOffsetX,
    y: positions.cssOffsetY,
    scale: 1,
    duration: 1.2,
    ease: "power3.inOut",
    onComplete: () => {
      gsap.set(loaderEl, { clearProps: "all" });
      document.body.style.background = "black";
      sessionStorage.setItem(INTRO_LOADER_SESSION_KEY, "true");
    },
  });

  tl.addLabel("reveal").call(clearIntroPending, undefined, "reveal").to(
    revealTargets,
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    },
    "reveal"
  );

  if (textEl) {
    tl.to(
      textEl,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "reveal"
    );
  }

  tl.call(
    () => {
      window.dispatchEvent(new Event("home-intro-complete"));
    },
    undefined,
    "reveal"
  );

  return tl;
}

function initializeLoader(
  loaderEl: HTMLDivElement,
  contentEl: HTMLDivElement,
  textEl: HTMLDivElement | null,
  options: {
    imageCount: number;
  }
): gsap.core.Timeline | undefined {
  const navEl = document.querySelector<HTMLElement>("nav");
  const menuButtonEl = document.querySelector<HTMLButtonElement>(".u-menu");
  const hasPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);
  const reduceMotion = prefersReducedMotion();

  if (hasPlayed || reduceMotion) {
    clearIntroPending();
    setElementsVisible([contentEl, navEl, menuButtonEl, textEl], 1);
    document.body.style.background = "black";
    if (!hasPlayed) {
      sessionStorage.setItem(INTRO_LOADER_SESSION_KEY, "true");
    }
    return;
  }

  markIntroPending();
  setElementsVisible([navEl, menuButtonEl, contentEl, textEl], 0);

  const positions = getLoaderPositions(loaderEl);
  gsap.set(loaderEl, {
    willChange: "transform, clip-path, opacity",
    x: positions.cssOffsetX + positions.toCenterX,
    y: positions.cssOffsetY + positions.toCenterY,
    scale: 0.5,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  });

  markIntroReady();

  const revealTargets = [navEl, menuButtonEl, contentEl].filter(
    (el): el is HTMLElement => Boolean(el)
  );

  return createLoaderTimeline(
    loaderEl,
    positions,
    revealTargets,
    textEl,
    options
  );
}

export default function HomeIntroLoader({
  contentRef,
  imageSrc = "/images/hero.jpg",
  imageAlt = "Loading image",
  images,
}: HomeIntroLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const normalizedImages = useMemo<LoaderImage[]>(() => {
    if (images && images.length > 0) {
      return images;
    }
    return [{ src: imageSrc, alt: imageAlt }];
  }, [images, imageAlt, imageSrc]);

  useGSAP(
    () => {
      const loaderEl = loaderRef.current;
      const contentEl = contentRef.current;
      const textEl = textRef.current;

      if (!(loaderEl && contentEl)) {
        return;
      }

      const hasPlayed = sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);
      const reduceMotion = prefersReducedMotion();

      if (!(hasPlayed || reduceMotion)) {
        markIntroPending();
      }

      let cancelled = false;
      let tl: gsap.core.Timeline | undefined;

      const start = async () => {
        if (hasPlayed || reduceMotion) {
          // Skip preload when intro won't run
        } else {
          await waitForImages(loaderEl, {
            timeout: 10_000,
            minCount: normalizedImages.length,
          });
        }

        if (cancelled) {
          return;
        }

        tl = initializeLoader(loaderEl, contentEl, textEl, {
          imageCount: normalizedImages.length,
        });
      };

      start().catch(() => undefined);

      return () => {
        cancelled = true;
        tl?.kill();
        if (sessionStorage.getItem(INTRO_LOADER_SESSION_KEY) !== "true") {
          clearIntroPending();
          const navEl = document.querySelector<HTMLElement>("nav");
          const menuButtonEl =
            document.querySelector<HTMLButtonElement>(".u-menu");
          gsap.set([navEl, menuButtonEl].filter(Boolean), {
            opacity: 1,
            clearProps: "opacity",
          });
        }
      };
    },
    { dependencies: [normalizedImages.length] }
  );

  return (
    <div className="u-loader-image" ref={loaderRef}>
      <div className="u-meta u-meta-hidden text-left" ref={textRef}>
        Use menu to explore
      </div>

      <div className="u-loader-image-inner">
        {/* Render all images stacked with absolute positioning */}
        <div className="relative h-full w-full overflow-hidden">
          {normalizedImages.map((img, index) => (
            <Image
              alt={img.alt ?? imageAlt}
              className="u-loader-photo object-cover"
              data-loader-index={index}
              draggable={false}
              fetchPriority="high"
              fill
              key={img.src}
              priority
              sizes={LOADER_IMAGE_SIZES}
              src={img.src}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: index,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
