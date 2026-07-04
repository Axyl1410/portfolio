"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetList,
  BottomSheetPanel,
  BottomSheetRow,
  BottomSheetTitle,
} from "@/components/sora-ui/radix/bottom-sheet";
import { setThemeWithTransition } from "@/lib/theme/set-theme-with-transition";

export interface SettingsState {
  preloader: boolean;
  showShortcuts: boolean;
  systemTheme: boolean;
  theme: "dark" | "light";
}

export const initialSettings: SettingsState = {
  preloader: true,
  showShortcuts: true,
  systemTheme: true,
  theme: "dark",
};

interface SettingsSheetProps {
  onOpenChange: (open: boolean) => void;
  onSettingsChange: (
    updater: SettingsState | ((current: SettingsState) => SettingsState)
  ) => void;
  open: boolean;
  settings: SettingsState;
}

export function SettingsSheet({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: SettingsSheetProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const applyTheme = useCallback(
    (theme: "dark" | "light") => {
      setThemeWithTransition(setTheme, theme, "bottom-right");
      onSettingsChange((current) => ({
        ...current,
        theme,
        systemTheme: false,
      }));
    },
    [onSettingsChange, setTheme]
  );

  const toggleSystemTheme = useCallback(() => {
    if (settings.systemTheme) {
      const theme = resolvedTheme === "dark" ? "dark" : "light";
      applyTheme(theme);
      return;
    }

    setTheme("system");
    onSettingsChange((current) => ({ ...current, systemTheme: true }));
  }, [
    applyTheme,
    onSettingsChange,
    resolvedTheme,
    setTheme,
    settings.systemTheme,
  ]);

  const toggleTheme = useCallback(() => {
    const currentTheme =
      resolvedTheme === "dark" || resolvedTheme === "light"
        ? resolvedTheme
        : settings.theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }, [applyTheme, resolvedTheme, settings.theme]);

  return (
    <BottomSheet onOpenChange={onOpenChange} open={open}>
      <BottomSheetContent
        className="max-w-[361px]"
        defaultSnap={0}
        showHandle={false}
        snapPoints={["auto"]}
      >
        <BottomSheetTitle>Settings</BottomSheetTitle>
        <BottomSheetPanel>
          <BottomSheetList>
            <BottomSheetRow
              label="preloader"
              onClick={() =>
                onSettingsChange((current) => ({
                  ...current,
                  preloader: !current.preloader,
                }))
              }
              value={String(settings.preloader)}
            />
            <BottomSheetRow
              label="shortcuts"
              onClick={() =>
                onSettingsChange((current) => ({
                  ...current,
                  showShortcuts: !current.showShortcuts,
                }))
              }
              value={settings.showShortcuts ? "on" : "off"}
            />
            <BottomSheetRow
              label="theme"
              onClick={toggleTheme}
              value={
                settings.systemTheme
                  ? "system"
                  : (resolvedTheme ?? settings.theme)
              }
            />
            <BottomSheetRow
              label="system theme"
              onClick={toggleSystemTheme}
              value={settings.systemTheme ? "on" : "off"}
            />
          </BottomSheetList>
        </BottomSheetPanel>
      </BottomSheetContent>
    </BottomSheet>
  );
}
