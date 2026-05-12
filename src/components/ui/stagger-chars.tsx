import { cn } from "@/lib/utils";

const CHAR_STAGGER = 0.01;

const groupHoverClass: Record<string, string> = {
  "": "group-hover:-translate-y-[1.3em]",
  link: "group-hover/link:-translate-y-[1.3em]",
};

interface StaggerCharsProps {
  text: string;
  groupName?: string;
}

export function StaggerChars({ text, groupName = "" }: StaggerCharsProps) {
  const hoverCls = groupHoverClass[groupName] ?? groupHoverClass[""];

  return (
    <span className="relative inline-block overflow-hidden leading-none">
      {[...text].map((char, i) => (
        <span
          className={cn(
            "relative inline-block translate-y-0 rotate-[0.001deg] transition-transform duration-600 ease-[cubic-bezier(0.625,0.05,0,1)] [text-shadow:0_1.3em_currentColor]",
            hoverCls,
            char === " " && "whitespace-pre"
          )}
          key={`${i}-${char}`}
          style={{ transitionDelay: `${i * CHAR_STAGGER}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
