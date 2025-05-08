"use client";

import { useLanguage } from "@/components/common/language-provider";
import { LanguageSelector } from "@/components/common/language-selector";
import { ThemeSelector } from "@/components/common/theme-selector";
import { checkAuthStatus } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  useEffect(() => {
    if (checkAuthStatus()) {
      router.push("/dashboard`");
    }
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-blue-950 p-4">
      <div className="flex items-center justify-between">
        <ThemeSelector lang={language} />
        <LanguageSelector />
      </div>
    </div>
  );
}
