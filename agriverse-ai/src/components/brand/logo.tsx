import { cn } from "@/lib/utils";
import { Sprout } from "lucide-react";

type LogoProps = {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Logo({ variant = "dark", size = "md", className }: LogoProps) {
  const sizes = {
    sm: { box: "h-8 w-8", text: "text-lg", img: "h-4.5 w-4.5" },
    md: { box: "h-10 w-10", text: "text-xl", img: "h-5.5 w-5.5" },
    lg: { box: "h-12 w-12", text: "text-2xl", img: "h-6 w-6" },
  };
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl shadow-lg",
          s.box,
          "gradient-brand"
        )}
      >
        <Sprout className={cn("text-white", s.img)} />
      </div>
      <div className="leading-tight">
        <p className={cn("font-bold tracking-tight", s.text, variant === "light" ? "text-white" : "text-dark")}>
          AgriVerse AI
        </p>
        <p
          className={cn(
            "text-[10px] font-medium tracking-wide",
            variant === "light" ? "text-white/70" : "text-agri/70"
          )}
        >
          Smarter Farming · Better Decisions
        </p>
      </div>
    </div>
  );
}