"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import type { ReactNode } from "react";
import { AnimatedLink } from "@/components/ui/animated-link";
import {
  BRAND_NAME,
  createNavClickHandler,
  NAV_VALUE_CLASS,
  NAV_VALUE_CLASS_LIGHT,
  type NavLink,
  ROUTES,
  SOCIALS,
  STATUS_TEXT,
  TIMEZONE_FORMAT,
} from "@/lib/nav-shared";
import { useNavData } from "@/lib/use-nav-data";
import { NavItem } from "./nav-item";

interface NavSectionsProps {
  variant?: "default" | "light";
}

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

export function NameSection({ variant = "default" }: NavSectionsProps) {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { currentYear, timeInVN } = useNavData();
  const valueClass =
    variant === "light" ? NAV_VALUE_CLASS_LIGHT : NAV_VALUE_CLASS;

  return (
    <NavItem label="Name" valueClassName={valueClass}>
      <span className={valueClass} style={{ display: "inline-block" }}>
        <AnimatedLink
          href="/"
          onClick={createNavClickHandler(pathname, router, "/")}
        >
          {BRAND_NAME}
        </AnimatedLink>
        <span>, {currentYear}</span>
      </span>
      <div className={valueClass}>
        {TIMEZONE_FORMAT.replace("{time}", timeInVN)}
      </div>
    </NavItem>
  );
}

export function StatusSection({ variant = "default" }: NavSectionsProps) {
  const valueClass =
    variant === "light" ? NAV_VALUE_CLASS_LIGHT : NAV_VALUE_CLASS;

  return (
    <NavItem label="Status" valueClassName={valueClass}>
      <div className={valueClass}>{STATUS_TEXT}</div>
    </NavItem>
  );
}

export function SitemapSection({ variant = "default" }: NavSectionsProps) {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const valueClass =
    variant === "light" ? NAV_VALUE_CLASS_LIGHT : NAV_VALUE_CLASS;

  return (
    <NavItem label="Sitemap" valueClassName={valueClass}>
      {renderCommaSeparated(ROUTES, (route) => (
        <span className={valueClass}>
          <AnimatedLink
            href={route.url}
            onClick={createNavClickHandler(pathname, router, route.url)}
          >
            {route.label}
          </AnimatedLink>
        </span>
      ))}
    </NavItem>
  );
}

export function SocialsSection({ variant = "default" }: NavSectionsProps) {
  const valueClass =
    variant === "light" ? NAV_VALUE_CLASS_LIGHT : NAV_VALUE_CLASS;

  return (
    <NavItem label="Let's connect" valueClassName={valueClass}>
      {renderCommaSeparated(SOCIALS, (social) => (
        <span className={valueClass}>
          <AnimatedLink href={social.url}>{social.label}</AnimatedLink>
        </span>
      ))}
    </NavItem>
  );
}
