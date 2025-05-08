"use client";
import React, { useEffect, useState } from "react";
import Logo from "../common/logo";
import { SPLASH_SCREEN_DATA } from "@/constants/splash-screen.data";
import { useRouter } from "next/navigation";
import { useLanguage } from "../common/language-provider";
import { checkAuthStatus } from "@/lib/auth";
import { RiLoader2Fill } from "react-icons/ri";

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate a bit of delay for the splash screen to show
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isAuthenticated = checkAuthStatus();

      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-950 w-screen h-screen flex flex-col items-center justify-between overflow-hidden text-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <Logo size="large" splashScreen language={language} />
        <h1 className=" font-semibold mt-2 mb-10">
          {SPLASH_SCREEN_DATA.mainSubTitle[language]}
        </h1>
        <div className="flex items-center justify-center">
          <RiLoader2Fill className="h-8 w-8 animate-spin text-white/70" />
        </div>
      </div>
      <div className="flex flex-col items-center font-light space-y-1 p-2">
        <h3>
          {SPLASH_SCREEN_DATA.createdBy[language]}
          <span className="mx-1">
            {SPLASH_SCREEN_DATA.createdByName[language]}
          </span>
        </h3>
        <h2 className="text-yellow-500">
          {SPLASH_SCREEN_DATA.createdByAssistant[language]}
        </h2>
        <h5>{SPLASH_SCREEN_DATA.version[language]}</h5>
      </div>
    </div>
  );
}
