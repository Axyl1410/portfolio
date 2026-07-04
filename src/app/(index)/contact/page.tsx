"use client";

import NumberFlow from "@number-flow/react";
import { CircleArrowOutUpRight, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AnimatedRuleLine,
  LINE_STAGGER_S,
  PageTitleRule,
} from "@/components/page-title-rule";
import {
  Highlight,
  HighlightItem,
} from "@/components/sora-ui/effects/highlight";

const CONTACT_LINKS = [
  {
    href: "mailto:truonggiang.axyl@gmail.com",
    id: "email",
    label: "truonggiang.axyl@gmail.com",
    tag: "Email",
  },
  {
    href: "https://x.com/axyl1410",
    id: "x",
    label: "@axyl1410",
    tag: "x.com",
  },
  {
    href: "https://github.com/axyl1410",
    id: "github",
    label: "@axyl1410",
    tag: "Github",
  },
] as const;

const CONTACT_COUNT = CONTACT_LINKS.length;

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

function getVnTimeParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    month: "short",
    timeZone: VN_TIMEZONE,
  });

  const parts = formatter.formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0
  );
  const dayPeriod =
    parts.find((part) => part.type === "dayPeriod")?.value?.toUpperCase() ?? "";

  return {
    dateLabel: `${month} ${day},`,
    dayPeriod,
    hour,
    minute,
  };
}

function ContactClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { dateLabel, dayPeriod, hour, minute } = getVnTimeParts(now);

  return (
    <>
      <span>
        {dateLabel} <NumberFlow className="inline-block" value={hour} />
        :
        <NumberFlow
          className="inline-block"
          format={{ minimumIntegerDigits: 2 }}
          value={minute}
        />{" "}
        {dayPeriod}
      </span>{" "}
      ICT (GMT+7) Ho Chi Minh City, Vietnam
    </>
  );
}

export default function Contact() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(CONTACT_COUNT);
  }, []);

  return (
    <div className="flex h-dvh w-full max-w-2xl justify-center overflow-hidden px-4">
      <div className="flex h-full w-full min-w-0 flex-col items-center justify-between py-[20vh]">
        <h1 className="flex w-fit max-w-full shrink-0 items-center gap-2 font-display text-4xl uppercase lg:text-5xl">
          Contact
          <PageTitleRule delay={0} />
          <NumberFlow trend={1} value={count} />
        </h1>

        <div className="relative max-w-full text-pretty px-1 text-center text-foreground/50 text-sm lg:text-base">
          Here to make a dent in the universe.
          <br />
          If you&apos;re building something coool, weird or fun, always down to
          talk.
          <br />
          <ContactClock />
        </div>

        <div className="w-full min-w-0 shrink-0">
          <Highlight
            className="rounded-xl bg-muted"
            containerClassName="flex w-full min-w-0 flex-col gap-2"
            exitDelay={80}
            mode="parent"
            trigger="hover"
          >
            {CONTACT_LINKS.map((link, index) => (
              <HighlightItem asChild key={link.id} value={link.id}>
                <a
                  className="relative z-10 flex min-w-0 items-center gap-2 rounded-xl py-2 pr-2 pl-1 sm:gap-4 sm:pr-4 sm:pl-2"
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={link.label}
                >
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                    <span className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/20 hover:bg-foreground/5 hover:text-foreground/40 active:scale-95">
                      <Copy
                        aria-hidden
                        className="size-4 transition group-hover:opacity-100"
                      />
                    </span>
                    <span className="truncate">{link.label}</span>
                  </div>
                  <AnimatedRuleLine
                    className="h-px min-w-4 flex-1 bg-foreground/20"
                    delay={(index + 1) * LINE_STAGGER_S}
                  />
                  <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                    <span className="shrink-0 text-foreground/50 text-xs sm:text-sm">
                      {link.tag}
                    </span>
                    <CircleArrowOutUpRight
                      aria-hidden
                      className="size-3.5 shrink-0 text-foreground/20"
                    />
                  </div>
                </a>
              </HighlightItem>
            ))}
          </Highlight>
        </div>
      </div>
    </div>
  );
}
