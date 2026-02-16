"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/page-animation";

const Nav = () => {
  const router = useTransitionRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "About",
      url: "/about",
    },
  ];

  return (
    <nav className="p-6">
      <ul className="flex gap-4">
        {routes.map((route) => (
          <li key={route.label}>
            <Link
              href={route.url}
              onClick={(e) => {
                e.preventDefault();
                if (pathname === route.url) {
                  return;
                }
                router.push(route.url, {
                  onTransitionReady: pageAnimation,
                });
              }}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
