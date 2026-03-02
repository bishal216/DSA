// theme-toggle.tsx
import { Button } from "@/components/ui/button";
import { useTheme } from "@/config/theme_context";
import { Palette } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();

  const handleClick = () => {
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <Button variant="primary" onClick={handleClick} className="text-dark">
      <Palette className="h-6 w-6 text-dark" />
    </Button>
  );
}
