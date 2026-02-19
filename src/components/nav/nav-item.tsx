import type { ReactNode } from "react";
import { NAV_LABEL_CLASS, NAV_LABEL_CLASS_LIGHT } from "@/lib/nav-shared";

interface NavItemProps {
  label: string;
  children: ReactNode;
  valueClassName?: string;
  variant?: "default" | "light";
}

export function NavItem({
  label,
  children,
  valueClassName,
  variant = "default",
}: NavItemProps) {
  const labelClass =
    variant === "light" ? NAV_LABEL_CLASS_LIGHT : NAV_LABEL_CLASS;

  return (
    <div className="u-nav-item">
      <div className="flex w-full flex-wrap">
        <span className={labelClass}>{label}</span>
      </div>
      <div className={`flex w-full flex-wrap ${valueClassName || ""}`}>
        {children}
      </div>
    </div>
  );
}
