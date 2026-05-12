"use client";

import type React from "react";
import { StaggerChars } from "@/components/ui/stagger-chars";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button">;

function Button({ className, children, ...props }: ButtonProps) {
  const text = typeof children === "string" ? children : null;

  return (
    <button
      className={cn(
        "group u-pill flex items-center justify-center bg-transparent transition-colors duration-300 hover:bg-black hover:text-white",
        className
      )}
      {...props}
    >
      {text ? <StaggerChars text={text} /> : children}
    </button>
  );
}

export { Button };
