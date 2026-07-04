"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import {
  initialSettings,
  type SettingsState,
} from "@/components/settings/settings-sheet";

interface SettingsContextValue {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSettings: Dispatch<SetStateAction<SettingsState>>;
  settings: SettingsState;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(initialSettings);

  return (
    <SettingsContext.Provider value={{ open, setOpen, settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
