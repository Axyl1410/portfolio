"use client";

import { Navbar } from "@/components/navbar";
import { SettingsProvider } from "@/components/settings/settings-context";
import { SettingsDock } from "@/components/settings-dock";

export function IndexChrome({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <Navbar />
      <SettingsDock />
      {children}
    </SettingsProvider>
  );
}
