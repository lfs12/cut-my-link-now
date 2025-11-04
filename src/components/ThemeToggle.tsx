import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme;
    return saved || "auto";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = () => {
      if (theme === "auto") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      } else if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    applyTheme();
    localStorage.setItem("theme", theme);

    // Listen for system theme changes when in auto mode
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "auto"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const icons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    auto: <Monitor className="h-5 w-5" />,
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/40 transition-all"
      title={`Current: ${theme}`}
    >
      {icons[theme]}
    </Button>
  );
};
