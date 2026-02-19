import type { MouseEvent } from "react";
import { NameSection, StatusSection } from "@/components/nav/nav-sections";
import { AnimatedLink } from "@/components/ui/animated-link";
import { NAV_VALUE_CLASS_LIGHT, ROUTES, SOCIALS } from "@/lib/nav-shared";
import { cn } from "@/lib/utils";

export type MenuLinkClickHandler = (
  event: MouseEvent<HTMLAnchorElement>,
  url: string
) => void;

interface MenuOverlayContentProps {
  onLinkClick: MenuLinkClickHandler;
}

export function MenuOverlayContent({ onLinkClick }: MenuOverlayContentProps) {
  return (
    <>
      <nav className="u-gap relative flex w-full flex-wrap items-center justify-between py-[calc(var(--row-gap)-0.15em)]">
        <NameSection variant="light" />
        <StatusSection variant="light" />
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px origin-left bg-(--color-border)" />
      </nav>

      <div className="mt-[6vh] text-[#A0A0A0] text-[1.1em]">Sitemap</div>

      <div className="my-[2vh] border-(--color-border) border-t" />

      <div className="flex w-full flex-wrap gap-y-[1.5vh]">
        {ROUTES.map((route) => (
          <div
            className={cn(NAV_VALUE_CLASS_LIGHT, "w-1/2 max-w-[13em]")}
            key={route.url}
          >
            <AnimatedLink
              className="text-[1.3em] text-white"
              href={route.url}
              onClick={(event) => onLinkClick(event, route.url)}
            >
              {route.label}
            </AnimatedLink>
          </div>
        ))}
      </div>

      <div className="mt-[6vh] text-[#A0A0A0] text-[1.1em]">Let's connect</div>

      <div className="my-[2vh] border-(--color-border) border-t" />

      <div className="flex w-full flex-wrap gap-y-[1.5vh]">
        {SOCIALS.map((route) => (
          <div
            className={cn(NAV_VALUE_CLASS_LIGHT, "w-1/2 max-w-[13em]")}
            key={route.url}
          >
            <AnimatedLink
              className="text-[1.3em] text-white"
              href={route.url}
              onClick={(event) => onLinkClick(event, route.url)}
            >
              {route.label}
            </AnimatedLink>
          </div>
        ))}
      </div>
    </>
  );
}
