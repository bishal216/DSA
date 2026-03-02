// theme-context.ts
import { createContext, useContext } from "react";

export const THEMES = [
  "green",
  "rainforest",
  "candy",
  "blue",
  "sunset",
  "mint",
  "purple",
  "dark",
] as const;
export type Theme = (typeof THEMES)[number];

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: typeof THEMES;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
