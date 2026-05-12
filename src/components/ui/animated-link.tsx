import Link, { type LinkProps } from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { StaggerChars } from "@/components/ui/stagger-chars";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export const AnimatedLink = ({
  children,
  className,
  onClick,
  ...linkProps
}: AnimatedLinkProps) => {
  const text = typeof children === "string" ? children : null;

  return (
    <Link
      {...linkProps}
      className={cn("group/link relative inline-block", className)}
      onClick={onClick}
    >
      {text ? (
        <StaggerChars groupName="link" text={text} />
      ) : (
        <span>{children}</span>
      )}
    </Link>
  );
};
