"use client";

import type { ReactNode } from "react";
import { NAV_LABEL_CLASS } from "@/lib/nav-shared";

interface NavItemProps {
  label: string;
  children: ReactNode;
  valueClassName?: string;
}

export function NavItem({ label, children, valueClassName }: NavItemProps) {
  return (
    <div className="u-nav-item">
      <div className="flex w-full flex-wrap">
        <span className={NAV_LABEL_CLASS}>{label}</span>
      </div>
      <div className={`flex w-full flex-wrap ${valueClassName || ""}`}>
        {children}
      </div>
    </div>
  );
}
