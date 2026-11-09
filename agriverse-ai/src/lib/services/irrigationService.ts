"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { uid } from "@/lib/utils";
import type { IrrigationRecord } from "@/lib/types";

export type IrrigationInput = Omit<
  IrrigationRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

// ------------------------------------------------------------------
// irrigationService — mock implementation.
// Future: POST /api/farms/:id/irrigation
// ------------------------------------------------------------------
export const irrigationService = {
  async submitIrrigation(
    farmId: string,
    userId: string,
    input: IrrigationInput
  ): Promise<IrrigationRecord> {
    const now = new Date().toISOString();
    const rec: IrrigationRecord = {
      ...input,
      id: uid("irr"),
      snapshotId: null,
      farmId,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const list = read<IrrigationRecord[]>(STORAGE_KEYS.irrigation, []);
    list.push(rec);
    write(STORAGE_KEYS.irrigation, list);
    return simulateLatency(rec, 350);
  },

  async getIrrigation(farmId: string): Promise<IrrigationRecord | null> {
    const list = read<IrrigationRecord[]>(STORAGE_KEYS.irrigation, []);
    return simulateLatency(list.filter((i) => i.farmId === farmId).at(-1) ?? null, 200);
  },
};