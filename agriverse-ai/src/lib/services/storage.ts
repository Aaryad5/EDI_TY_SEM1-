// ------------------------------------------------------------------
// Mock persistence layer.
// Backs every service with localStorage today. When the FastAPI +
// PostgreSQL backend is connected, these functions become URL calls.
// ------------------------------------------------------------------
"use client";

const PREFIX = "agriverse";

export const STORAGE_KEYS = {
  session: `${PREFIX}:session`,
  users: `${PREFIX}:users`,
  farms: `${PREFIX}:farms`,
  snapshots: `${PREFIX}:snapshots`,
  weather: `${PREFIX}:weather`,
  soil: `${PREFIX}:soil`,
  crops: `${PREFIX}:crops`,
  irrigation: `${PREFIX}:irrigation`,
  history: `${PREFIX}:history`,
  recommendations: `${PREFIX}:recommendations`,
  alerts: `${PREFIX}:alerts`,
  devices: `${PREFIX}:devices`,
  activeFarm: `${PREFIX}:activeFarm`,
  seeded: `${PREFIX}:seeded`,
} as const;

function canUseStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem("__t", "1");
    window.localStorage.removeItem("__t");
    return true;
  } catch {
    return false;
  }
}

export function read<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — ignore in mock mode
  }
}

export function remove(key: string): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(key);
}

export async function simulateLatency<T>(value: T, ms = 350): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));