"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const COLOR_BY_STATUS = {
  excellent: "#2d6a4f",
  good: "#52b788",
  fair: "#f5b041",
  poor: "#e59866",
  critical: "#e74c3c",
} as const;

export type GaugeStatus = keyof typeof COLOR_BY_STATUS;

function statusFor(value: number): GaugeStatus {
  if (value >= 80) return "excellent";
  if (value >= 60) return "good";
  if (value >= 40) return "fair";
  if (value >= 20) return "poor";
  return "critical";
}

type GaugeProps = {
  value: number; // 0..100
  label?: string;
  suffix?: string;
  size?: number;
  className?: string;
};

export function Gauge({ value, label, suffix = "%", size = 120, className }: GaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = COLOR_BY_STATUS[statusFor(clamped)];
  const r = size / 2 - 10;
  const circumference = 2 * Math.PI * r;
  const dash = (clamped / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e8f0eb"
            strokeWidth="10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-dark">
            {Math.round(clamped)}
            {suffix}
          </span>
        </div>
      </div>
      {label && <span className="text-xs font-medium text-dark/60">{label}</span>}
    </div>
  );
}