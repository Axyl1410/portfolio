import type { useTransitionRouter } from "next-view-transitions";
import type { MouseEvent } from "react";
import { pageAnimation } from "@/utils/page-animation";

export interface NavLink {
  label: string;
  url: string;
}

export const NAV_LABEL_CLASS = "text-(--color-gray) text-[0.725em]";
export const NAV_LABEL_CLASS_LIGHT = "text-[#A0A0A0] text-[0.725em]";
export const NAV_VALUE_CLASS =
  "font-medium text-[0.8725em] uppercase leading-[1.36] text-(--color-text)";
export const NAV_VALUE_CLASS_LIGHT =
  "font-medium text-[0.8725em] uppercase leading-[1.36] text-white";

export const ROUTES: NavLink[] = [
  { label: "index", url: "/" },
  { label: "about", url: "/about" },
  { label: "projects", url: "/projects" },
  { label: "services", url: "/services" },
  { label: "contact", url: "/contact" },
];

export const SOCIALS: NavLink[] = [
  { label: "Resume", url: "/resume" },
  { label: "Facebook", url: "https://facebook.com/alexsandrsenaviev" },
  { label: "Instagram", url: "https://instagram.com/axyl1410" },
  { label: "Email", url: "mailto:truonggiang.axyl@gmail.com" },
  { label: "Github", url: "https://github.com/axyl1410" },
];

// Constants for nav content
export const BRAND_NAME = "Axyl™";
export const STATUS_TEXT = "Currently available for Freelance Projects";
export const TIMEZONE_FORMAT = "GMT+7 ({time}, VN)";

export const formatTimeInVN = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

export const createNavClickHandler =
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
