import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ThemeContext,
  type ThemePreference,
} from "./ThemeContext";

const STORAGE_KEY = "koi-theme";

function getInitialPreference(): ThemePreference {
  const savedPreference = localStorage.getItem(STORAGE_KEY);

  return savedPreference === "light" || savedPreference === "dark"
    ? savedPreference
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] =
    useState<ThemePreference>(getInitialPreference);
  const resolvedTheme = preference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference, resolvedTheme]);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
