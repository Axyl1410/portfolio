"use client";

import { Cog } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/components/settings/settings-context";
import { SettingsSheet } from "@/components/settings/settings-sheet";
import {
  ThemeToggleDarkIcon,
  ThemeToggleLightIcon,
} from "@/components/theme/theme-toggle-icon";
import { isTypingTarget } from "@/lib/is-typing-target";
import { setThemeWithTransition } from "@/lib/theme/set-theme-with-transition";
import { cn } from "@/lib/utils";

const dockButtonClassName =
  "flex size-7 cursor-pointer items-center justify-center rounded-xl transition-all ease-in-out hover:bg-foreground/5 active:scale-95";

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = useCallback(() => {
    setThemeWithTransition(setTheme, isDark ? "light" : "dark", "bottom-right");
  }, [isDark, setTheme]);

  if (!isClient) {
    return <div aria-hidden className={dockButtonClassName} />;
  }

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={dockButtonClassName}
      onClick={handleToggle}
      type="button"
    >
      <span className="relative block size-4">
        <ThemeToggleLightIcon
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            isDark ? "opacity-0" : "opacity-100"
          )}
        />
        <ThemeToggleDarkIcon
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            isDark ? "opacity-100" : "opacity-0"
          )}
        />
      </span>
    </button>
  );
}

function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-haspopup="dialog"
      aria-label="Open settings"
      className={dockButtonClassName}
      onClick={onClick}
      type="button"
    >
      <Cog aria-hidden className="size-4 text-foreground" strokeWidth={2} />
    </button>
  );
}

export function SettingsDock() {
  const { open, setOpen, settings, setSettings } = useSettings();

  const openSettings = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== "k") {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  return (
    <>
      <SettingsSheet
        onOpenChange={setOpen}
        onSettingsChange={setSettings}
        open={open}
        settings={settings}
      />

      <div className="fixed right-4 bottom-4 z-20 flex gap-0.5 rounded-2xl bg-muted p-1">
        <ThemeToggleButton />
        <SettingsButton onClick={openSettings} />
      </div>
    </>
  );
}
