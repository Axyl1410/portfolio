"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
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
  renderLink: (item: NavLink) => React.ReactNode
) =>
  items.map((item, index) => (
    <span className={NAV_VALUE_CLASS} key={item.label}>
      {renderLink(item)}
      {index < items.length - 1 && <span>{",\u00A0"}</span>}
    </span>
  ));

const createNavClickHandler =
  (
    pathname: string,
    router: ReturnType<typeof useTransitionRouter>,
    url: string
  ) =>
  (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    <nav className="nav-layout container relative mx-auto flex flex-wrap items-center justify-between py-[calc(var(--row-gap)-0.15em)]">
      <div className="nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Name</span>
        </div>
        <div className="flex w-full flex-wrap">
          <span className={NAV_VALUE_CLASS}>
            <Link
              href="/"
              onClick={createNavClickHandler(pathname, router, "/")}
            >
              Axyl™
            </Link>
            , {currentYear}
          </span>
          <div className={NAV_VALUE_CLASS}>GMT+7 ({timeInVN}, VN)</div>
        </div>
      </div>

      <div className="nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Status</span>
        </div>
        <div className="flex w-full flex-wrap">
          <div className={NAV_VALUE_CLASS}>
            Currently available for Freelance Projects
          </div>
        </div>
      </div>

      <div className="nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Sitemap</span>
        </div>
        <div className="flex w-full flex-wrap">
          {renderCommaSeparated(ROUTES, (route) => (
            <Link
              href={route.url}
              onClick={createNavClickHandler(pathname, router, route.url)}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-item">
        <div className="flex w-full flex-wrap">
          <span className={NAV_LABEL_CLASS}>Let's connect</span>
        </div>
        <div className="flex w-full flex-wrap">
          {renderCommaSeparated(SOCIALS, (social) => (
            <Link href={social.url}>{social.label}</Link>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-(--container-padding) bottom-0 left-(--container-padding) h-px origin-left bg-(--color-border)" />
    </nav>
  );
};

export default Nav;
