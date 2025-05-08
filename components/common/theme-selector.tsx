"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { THEME_SELECTOR_DATA } from "@/constants/theme-selector.data";

interface ThemeSelectorProps {
  lang?: "AR" | "EN";
}

export function ThemeSelector({ lang = "AR" }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
      aria-label={THEME_SELECTOR_DATA.ariaLabel[lang]}
      className=" p-3 border border-blue-950 cursor-pointer hover:bg-blue-950 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-blue-950 duration-300 transition-all"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
