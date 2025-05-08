"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";
import { Button } from "../ui/button";
import { LANGUAGE_SELECTOR_DATA } from "@/constants/language-selector.data";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState<boolean>(false);

  // After mounting, we have access to the window object
  useEffect(() => {
    setMounted(true);
  }, []);
  // Avoid hydration mismatch by only rendering after mounting
  if (!mounted) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "AR" ? "EN" : "AR")}
      aria-label={LANGUAGE_SELECTOR_DATA.ariaLabel[language]}
      className=" p-3 border border-blue-950 cursor-pointer hover:bg-blue-950 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-blue-950 duration-300 transition-all"
    >
      <Languages className="h-4 w-4" />
      <span className="ml-2 text-xs">
        {language === "AR"
          ? LANGUAGE_SELECTOR_DATA.arLanguage[language]
          : LANGUAGE_SELECTOR_DATA.enLanguage[language]}
      </span>
    </Button>
  );
}
