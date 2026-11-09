"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { uid } from "@/lib/utils";
import type { CropRecord } from "@/lib/types";

export type CropInput = Omit<
  CropRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

// ------------------------------------------------------------------
// cropService — mock implementation.
// Future: POST /api/farms/:id/crop
// ------------------------------------------------------------------
export const cropService = {
  async submitCrop(farmId: string, userId: string, input: CropInput): Promise<CropRecord> {
    const now = new Date().toISOString();
    const rec: CropRecord = {
      ...input,
      id: uid("crp"),
      snapshotId: null,
      farmId,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const list = read<CropRecord[]>(STORAGE_KEYS.crops, []);
    list.push(rec);
    write(STORAGE_KEYS.crops, list);
    return simulateLatency(rec, 350);
  },

  async getCrop(farmId: string): Promise<CropRecord | null> {
    const list = read<CropRecord[]>(STORAGE_KEYS.crops, []);
    return simulateLatency(list.filter((c) => c.farmId === farmId).at(-1) ?? null, 200);
  },
};