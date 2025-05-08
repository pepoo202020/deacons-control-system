"use client";
import { PAGE_NOT_FOUND_DATA } from "@/constants/not-found.data";
import Link from "next/link";

export default function NotFound() {
  const lang = localStorage.getItem("language") as "AR" | "EN";
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/75 font-bold mb-4">
          {PAGE_NOT_FOUND_DATA.text[lang]}
        </p>
        <p className="text-2xl text-white/60 font-semibold mb-4">
          {PAGE_NOT_FOUND_DATA.subText[lang]}
        </p>
        <Link
          href="/"
          className="text-white bg-transparent border p-3 rounded-lg hover:bg-white hover:text-blue-950 duration-500 transition-all"
        >
          {PAGE_NOT_FOUND_DATA.link[lang]}
        </Link>
      </div>
    </div>
  );
}
