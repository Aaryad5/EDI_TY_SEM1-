"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_SOIL } from "@/lib/data/demo";
import { uid } from "@/lib/utils";
import type { SoilRecord } from "@/lib/types";

export type SoilInput = Omit<
  SoilRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

// ------------------------------------------------------------------
// soilService — mock implementation.
// Future: POST /api/farms/:id/soil ; auto mode -> SoilGrids / GIS adapter.
// ------------------------------------------------------------------
export const soilService = {
  async submitSoil(farmId: string, userId: string, input: SoilInput): Promise<SoilRecord> {
    const now = new Date().toISOString();
    const rec: SoilRecord = {
      ...input,
      id: uid("sld"),
      snapshotId: null,
      farmId,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const list = read<SoilRecord[]>(STORAGE_KEYS.soil, []);
    list.push(rec);
    write(STORAGE_KEYS.soil, list);
    return simulateLatency(rec, 350);
  },

  async getSoil(farmId: string): Promise<SoilRecord | null> {
    const list = read<SoilRecord[]>(STORAGE_KEYS.soil, []);
    return simulateLatency(list.filter((s) => s.farmId === farmId).at(-1) ?? null, 200);
  },

  /** Placeholder for SoilGrids / GIS auto-sampling. */
  async autoFetchSoil(): Promise<SoilInput | null> {
    // GET /api/soil/auto?farmId=...  (SoilGrids integration placeholder)
    return simulateLatency(
      {
        ...DEMO_SOIL,
        source: "auto",
        moisturePct: Math.round(35 + Math.random() * 25),
      },
      900
    );
  },
};