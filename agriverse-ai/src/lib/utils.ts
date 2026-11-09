import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ------------------------------------------------------------------
// Date / time helpers — stored machine-readable, displayed derived
// ------------------------------------------------------------------
export function nowISO(): string {
  return new Date().toISOString();
}

export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function dateParts(d = new Date()) {
  return {
    iso: d.toISOString(),
    date: d.toISOString().slice(0, 10),
    day: d.toLocaleDateString("en-US", { weekday: "long" }),
    time: d.toLocaleTimeString("en-US", { hour12: false }),
    timezone: getTimezone(),
  };
}

export function stampFromISO(iso: string): {
  date: string;
  day: string;
  time: string;
  timezone: string;
} {
  const d = new Date(iso);
  return {
    date: d.toISOString().slice(0, 10),
    day: d.toLocaleDateString("en-US", { weekday: "long" }),
    time: d.toLocaleTimeString("en-US", { hour12: false }),
    timezone: getTimezone(),
  };
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTime12(timeHHMMSS: string): string {
  const [h, m] = timeHHMMSS.split(":").map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ------------------------------------------------------------------
// Number formatting
// ------------------------------------------------------------------
export function formatNumber(n: number, digits = 0): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function formatPercent(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function round(n: number, digits = 1): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// ------------------------------------------------------------------
// Small string helpers
// ------------------------------------------------------------------
export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function truncate(s: string, n = 60): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}