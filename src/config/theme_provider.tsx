// theme-provider.tsx
import {
  applyTheme,
  ThemeContext,
  THEMES,
  type Theme,
} from "@/config/theme_context";
import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const resolved = THEMES.find((t) => t === stored) ?? THEMES[0];
    applyTheme(resolved);
    setThemeState(resolved);
  }, []);

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}
