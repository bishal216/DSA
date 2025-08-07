import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Palette } from "lucide-react";

function changeTheme(themeName: string) {
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
}

export default function Theme() {
  // This component provides buttons to change the theme of the application.
  const themes = useMemo(
    () => [
      "green",
      "rainforest",
      "candy",
      "blue",
      "sunset",
      "mint",
      "purple",
      "dark",
    ],
    [],
  );
  const [theme, setTheme] = useState(themes[0]);

  // Initialize theme from localStorage or default to the first theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && themes.includes(storedTheme)) {
      changeTheme(storedTheme);
      setTheme(storedTheme);
    } else {
      changeTheme(themes[0]);
    }
  }, [themes]);
  return (
    <Button
      variant="primary"
      onClick={() => {
        const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
        changeTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className="text-dark"
    >
      <Palette className="h-6 w-6 text-dark" />
    </Button>
  );
}
