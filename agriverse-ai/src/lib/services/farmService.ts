"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_FARM } from "@/lib/data/demo";
import { dateParts, uid } from "@/lib/utils";
import type { Farm, FarmBoundary } from "@/lib/types";

export type FarmInput = Omit<
  Farm,
  "id" | "farmId" | "userId" | "createdAt" | "updatedAt" | "isActive"
>;

// ------------------------------------------------------------------
// farmService — mock implementation.
// Future: GET/POST/PUT/DELETE on ENDPOINTS.farms
// ------------------------------------------------------------------
export const farmService = {
  async listFarms(userId: string): Promise<Farm[]> {
    // GET /api/farms
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    const mine = farms.filter((f) => f.userId === userId);
    return simulateLatency(mine, 250);
  },

  async getFarm(farmId: string): Promise<Farm | null> {
    // GET /api/farms/:id
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    return simulateLatency(farms.find((f) => f.id === farmId) ?? null, 200);
  },

  async createFarm(userId: string, input: FarmInput): Promise<Farm> {
    // POST /api/farms
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    const now = dateParts().iso;
    const farm: Farm = {
      ...input,
      id: uid("farm"),
      farmId: uid("farm"),
      userId,
      isActive: farms.every((f) => f.userId !== userId),
      createdAt: now,
      updatedAt: now,
    };
    farms.forEach((f) => {
      if (f.userId === userId) f.isActive = false;
    });
    farms.push(farm);
    write(STORAGE_KEYS.farms, farms);
    write(STORAGE_KEYS.activeFarm, farm.id);
    return simulateLatency(farm, 350);
  },

  async updateFarm(farmId: string, patch: Partial<FarmInput>): Promise<Farm> {
    // PUT /api/farms/:id
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    const idx = farms.findIndex((f) => f.id === farmId);
    if (idx < 0) throw new Error("Farm not found.");
    const updated: Farm = { ...farms[idx]!, ...patch, updatedAt: dateParts().iso };
    farms[idx] = updated;
    write(STORAGE_KEYS.farms, farms);
    return simulateLatency(updated, 300);
  },

  async updateBoundary(farmId: string, boundary: FarmBoundary): Promise<Farm> {
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    const idx = farms.findIndex((f) => f.id === farmId);
    if (idx < 0) throw new Error("Farm not found.");
    const updated: Farm = { ...farms[idx]!, boundary, updatedAt: dateParts().iso };
    farms[idx] = updated;
    write(STORAGE_KEYS.farms, farms);
    return simulateLatency(updated, 200);
  },

  async deleteFarm(farmId: string): Promise<void> {
    // DELETE /api/farms/:id
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    write(
      STORAGE_KEYS.farms,
      farms.filter((f) => f.id !== farmId)
    );
    return simulateLatency(undefined, 250);
  },

  async setActiveFarm(farmId: string): Promise<Farm | null> {
    const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
    const updated = farms.map((f) => ({ ...f, isActive: f.id === farmId }));
    write(STORAGE_KEYS.farms, updated);
    write(STORAGE_KEYS.activeFarm, farmId);
    return simulateLatency(updated.find((f) => f.id === farmId) ?? null, 150);
  },

  getActiveFarmId(): string | null {
    return read<string | null>(STORAGE_KEYS.activeFarm, null);
  },
};

export { DEMO_FARM as SEED_FARM };