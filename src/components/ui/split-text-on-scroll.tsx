"use client";

import type React from "react";
import {
  MaskedTextReveal,
  type MaskedTextRevealProps,
} from "@/components/ui/split-words-on-scroll";

type SplitTextOnScrollProps = Omit<MaskedTextRevealProps, "variant"> &
  React.HTMLAttributes<HTMLDivElement>;

function SplitTextOnScroll(props: SplitTextOnScrollProps) {
  return <MaskedTextReveal variant="chars" {...props} />;
}

export { SplitTextOnScroll };
