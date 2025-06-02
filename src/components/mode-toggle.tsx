import { useEffect } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Get next theme in cycle
  const handleToggle = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Icon for current theme
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
    >
      <Icon strokeWidth={1} className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
