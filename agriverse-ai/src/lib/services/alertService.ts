"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_ALERTS } from "@/lib/data/demo";
import { dateParts, uid } from "@/lib/utils";
import type { AlertCategory, FarmAlert, Severity } from "@/lib/types";

export type AlertInput = {
  category: AlertCategory;
  severity: Severity;
  message: string;
  recommendedAction: string;
};

// ------------------------------------------------------------------
// alertService — mock implementation.
// Future: GET /api/farms/:id/alerts ; POST /api/alerts (from backend agents)
// ------------------------------------------------------------------
export const alertService = {
  async getAlerts(userId?: string, farmId?: string): Promise<FarmAlert[]> {
    const alerts = read<FarmAlert[]>(STORAGE_KEYS.alerts, []);
    let list = alerts;
    if (userId) list = list.filter((a) => a.userId === userId);
    if (farmId) list = list.filter((a) => a.farmId === farmId);
    return simulateLatency(
      [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      250
    );
  },

  async raiseAlert(userId: string, farmId: string, input: AlertInput): Promise<FarmAlert> {
    const d = dateParts();
    const alert: FarmAlert = {
      ...input,
      id: uid("alt"),
      farmId,
      userId,
      read: false,
      date: d.date,
      day: d.day,
      time: d.time,
      timezone: d.timezone,
      createdAt: d.iso,
      updatedAt: d.iso,
    };
    const alerts = read<FarmAlert[]>(STORAGE_KEYS.alerts, []);
    alerts.push(alert);
    write(STORAGE_KEYS.alerts, alerts);
    return simulateLatency(alert, 220);
  },

  async markRead(alertId: string): Promise<void> {
    const alerts = read<FarmAlert[]>(STORAGE_KEYS.alerts, []);
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx >= 0) {
      alerts[idx] = { ...alerts[idx]!, read: true, updatedAt: dateParts().iso };
      write(STORAGE_KEYS.alerts, alerts);
    }
    await simulateLatency(undefined, 120);
  },

  async clearAlerts(farmId?: string): Promise<void> {
    let alerts = read<FarmAlert[]>(STORAGE_KEYS.alerts, []);
    if (farmId) {
      alerts = alerts.filter((a) => a.farmId === farmId);
      alerts.forEach((a) => (a.read = true));
    } else {
      alerts = alerts.map((a) => ({ ...a, read: true }));
    }
    write(STORAGE_KEYS.alerts, alerts);
    await simulateLatency(undefined, 180);
  },
};

export function ensureSeedAlerts() {
  const alerts = read<FarmAlert[]>(STORAGE_KEYS.alerts, []);
  if (alerts.length === 0) {
    write<FarmAlert[]>(STORAGE_KEYS.alerts, DEMO_ALERTS);
  }
}