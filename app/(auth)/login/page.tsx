"use client";

import { useLanguage } from "@/components/common/language-provider";
import { LanguageSelector } from "@/components/common/language-selector";
import { ThemeSelector } from "@/components/common/theme-selector";
import { checkAuthStatus } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/forms/login";
import Logo from "@/components/common/logo";

export default function LoginPage() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
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
      <div className="flex-1 flex flex-col gap-5 items-center justify-center">
        <Logo size="large" language={language} />
        <LoginForm isRTL={isRTL} language={language} />
      </div>
    </div>
  );
}
