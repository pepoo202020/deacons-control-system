import { LOGO_DATA } from "@/constants/logo.data";
import { cn } from "@/lib/utils";
interface LogoProps {
  language?: "AR" | "EN";
  size: "small" | "medium" | "large";
  splashScreen?: boolean;
}
export default function Logo({
  language = "AR",
  size,
  splashScreen = false,
}: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          splashScreen
            ? "bg-[url(/assets/dark-logo.png)]"
            : "bg-[url(/assets/light-logo.jpg)] dark:bg-[url(/assets/dark-logo.png)]",
          size === "small"
            ? "w-10 h-10"
            : size === "medium"
            ? "w-28 h-28"
            : "w-32 h-32",
          "bg-center bg-contain bg-no-repeat"
        )}
      />
      <div
        className={cn(
          size === "small"
            ? "text-sm"
            : size === "medium"
            ? "text-2xl"
            : "text-5xl",
          "flex flex-col items-start justify-center ",
          "font-bold",
          splashScreen ? "text-white" : "text-blue-950 dark:text-white"
        )}
      >
        {LOGO_DATA.mainTitle[language].split(" ").map((char, index) => {
          return <span key={index}>{char}</span>;
        })}
      </div>
    </div>
  );
}
