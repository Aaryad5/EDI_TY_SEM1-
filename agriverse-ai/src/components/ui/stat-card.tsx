import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  trend?: { direction: "up" | "down" | "flat"; text: string };
  sub?: string;
  className?: string;
  accent?: string;
};

export function StatCard({ label, value, icon: Icon, trend, sub, className, accent }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn(
        "card-hover rounded-xl border border-agri/10 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-dark/50">{label}</p>
          <p className="mt-2 text-2xl font-bold text-dark">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow"
          style={{ background: accent ?? "linear-gradient(135deg,#2d6a4f,#52b788)" }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            trend.direction === "up" && "text-fresh",
            trend.direction === "down" && "text-red-500",
            trend.direction === "flat" && "text-dark/50"
          )}
        >
          <span>{trend.direction === "up" ? "▲" : trend.direction === "down" ? "▼" : "◆"}</span>
          {trend.text}
        </div>
      )}
      {sub && <p className="mt-1 text-xs text-dark/45">{sub}</p>}
    </motion.div>
  );
}