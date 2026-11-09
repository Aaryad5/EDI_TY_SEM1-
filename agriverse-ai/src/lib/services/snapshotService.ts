"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_SNAPSHOT } from "@/lib/data/demo";
import { dateParts, uid } from "@/lib/utils";
import type {
  FarmSnapshot,
  CropRecord,
  FarmerPreferences,
  FarmManagement,
  IrrigationRecord,
  SoilRecord,
  WeatherRecord,
} from "@/lib/types";

export type SnapshotInput = {
  farm?: FarmSnapshot["farm"];
  weather?: WeatherRecord;
  soil?: SoilRecord;
  crop?: CropRecord;
  irrigation?: IrrigationRecord;
  management?: FarmManagement;
  preferences?: FarmerPreferences;
  changesMade?: string[];
  label?: string;
};

// ------------------------------------------------------------------
// snapshotService — the heart of the "do not overwrite history" model.
// Each submission creates a NEW FarmSnapshot (immutable history),
// while the "current state" per farm is derived from the latest snapshot.
// ------------------------------------------------------------------
export const snapshotService = {
  async createSnapshot(userId: string, farmId: string, input: SnapshotInput): Promise<FarmSnapshot> {
    // POST /api/farms/:id/snapshot
    const snapshots = read<FarmSnapshot[]>(STORAGE_KEYS.snapshots, []);
    const d = dateParts();
    const nowIso = d.iso;
    const snapshot: FarmSnapshot = {
      id: uid("snap"),
      userId,
      farmId,
      date: d.date,
      day: d.day,
      time: d.time,
      timezone: d.timezone,
      ...input,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    snapshots.push(snapshot);
    write(STORAGE_KEYS.snapshots, snapshots);
    return simulateLatency(snapshot, 300);
  },

  async saveSnapshot(snapshot: FarmSnapshot): Promise<FarmSnapshot> {
    const snapshots = read<FarmSnapshot[]>(STORAGE_KEYS.snapshots, []);
    snapshots.push(snapshot);
    write(STORAGE_KEYS.snapshots, snapshots);
    return simulateLatency(snapshot, 200);
  },

  async listSnapshots(farmId?: string, userId?: string): Promise<FarmSnapshot[]> {
    let snaps = read<FarmSnapshot[]>(STORAGE_KEYS.snapshots, []);
    if (farmId) snaps = snaps.filter((s) => s.farmId === farmId);
    if (userId) snaps = snaps.filter((s) => s.userId === userId);
    return simulateLatency(
      [...snaps].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      250
    );
  },

  async getLatestSnapshot(farmId: string): Promise<FarmSnapshot | null> {
    const snaps = await this.listSnapshots(farmId);
    return snaps[0] ?? null;
  },

  async updateSnapshot(
    snapshotId: string,
    patch: Partial<SnapshotInput>
  ): Promise<FarmSnapshot | null> {
    const snaps = read<FarmSnapshot[]>(STORAGE_KEYS.snapshots, []);
    const idx = snaps.findIndex((s) => s.id === snapshotId);
    if (idx < 0) return null;
    const updated: FarmSnapshot = {
      ...snaps[idx]!,
      ...patch,
      updatedAt: dateParts().iso,
    };
    snaps[idx] = updated;
    write(STORAGE_KEYS.snapshots, snaps);
    return simulateLatency(updated, 200);
  },

  async deleteSnapshot(snapshotId: string): Promise<boolean> {
    const snaps = read<FarmSnapshot[]>(STORAGE_KEYS.snapshots, []);
    const filtered = snaps.filter((s) => s.id !== snapshotId);
    write(STORAGE_KEYS.snapshots, filtered);
    return simulateLatency(true, 200);
  },
};

export function ensureSeedSnapshot() {
  const snaps = read<FarmSnapshot[]>(STORAGE_KEYS.snapshots, []);
  if (snaps.length === 0) {
    write(STORAGE_KEYS.snapshots, [DEMO_SNAPSHOT]);
  }
}