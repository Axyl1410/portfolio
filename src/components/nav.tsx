"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import type { MouseEvent, ReactNode } from "react";
import { AnimatedLink } from "@/components/animated-link";
import { pageAnimation } from "@/utils/page-animation";

interface NavLink {
  label: string;
  url: string;
}

const NAV_LABEL_CLASS = "text-(--color-gray) text-[0.725em]";
const NAV_VALUE_CLASS =
  "font-medium text-[0.8725em] uppercase leading-[1.36] text-(--color-text)";

const ROUTES: NavLink[] = [
  { label: "index", url: "/" },
  { label: "about", url: "/about" },
  { label: "projects", url: "/projects" },
  { label: "services", url: "/services" },
  { label: "contact", url: "/contact" },
];

const SOCIALS: NavLink[] = [
  { label: "Resume", url: "/resume" },
  { label: "Facebook", url: "https://facebook.com" },
  { label: "Instagram", url: "https://instagram.com" },
  { label: "Email", url: "mailto:you@example.com" },
  { label: "Github", url: "https://github.com" },
];
const formatTimeInVN = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

const renderCommaSeparated = (
  items: NavLink[],
  renderItem: (item: NavLink) => ReactNode
) =>
  items.map((item, index) => (
    <span key={item.label}>
      {renderItem(item)}
      {index < items.length - 1 && <span>{",\u00A0"}</span>}
    </span>
  ));

const createNavClickHandler =
  (
    pathname: string,
    router: ReturnType<typeof useTransitionRouter>,
    url: string
  ) =>
  (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === url) {
      return;
    }
    router.push(url, { onTransitionReady: pageAnimation });
  };

const Nav = () => {
  const router = useTransitionRouter();
  const pathname = usePathname();

  const now = new Date();
  const currentYear = now.getFullYear();
  const timeInVN = formatTimeInVN(now);

  return (
    <nav className="u-gap relative flex w-full flex-wrap items-center justify-between py-[calc(var(--row-gap)-0.15em)]">
      <div className="u-nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Name</span>
        </div>
        <div className="flex w-full flex-wrap">
          <span className={NAV_VALUE_CLASS}>
            <AnimatedLink
              href="/"
              onClick={createNavClickHandler(pathname, router, "/")}
            >
              Axyl™
            </AnimatedLink>
            , {currentYear}
          </span>
          <div className={NAV_VALUE_CLASS}>GMT+7 ({timeInVN}, VN)</div>
        </div>
      </div>

      <div className="u-nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Status</span>
        </div>
        <div className="flex w-full flex-wrap">
          <div className={NAV_VALUE_CLASS}>
            Currently available for Freelance Projects
          </div>
        </div>
      </div>

      <div className="u-nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Sitemap</span>
        </div>
        <div className="flex w-full flex-wrap">
          {renderCommaSeparated(ROUTES, (route) => (
            <span className={NAV_VALUE_CLASS}>
              <AnimatedLink
                href={route.url}
                onClick={createNavClickHandler(pathname, router, route.url)}
              >
                {route.label}
              </AnimatedLink>
            </span>
          ))}
        </div>
      </div>

      <div className="u-nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Let's connect</span>
        </div>
        <div className="flex w-full flex-wrap">
          {renderCommaSeparated(SOCIALS, (social) => (
            <span className={NAV_VALUE_CLASS}>
              <AnimatedLink href={social.url}>{social.label}</AnimatedLink>
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-px origin-left bg-(--color-border)" />
    </nav>
  );
};

export default Nav;
