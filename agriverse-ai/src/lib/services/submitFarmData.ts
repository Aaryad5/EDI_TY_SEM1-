"use client";

import { snapshotService, type SnapshotInput } from "./snapshotService";
import { historyService } from "./historyService";
import type { FarmSnapshot, HistoryRecord } from "@/lib/types";

export type SubmitResult = {
  snapshot: FarmSnapshot;
  historyRecord: HistoryRecord;
};

// ------------------------------------------------------------------
// submitFarmData — the single entry point used by every data form.
// Enforces the core data contract:
//   1. create a NEW FarmSnapshot (never overwrite history),
//   2. append a HistoryRecord,
//   3. (caller re-fetches latest snapshot to refresh the dashboard)
// Future: this becomes a FastAPI transaction
//   (POST /api/farms/:id/snapshot + POST /api/farms/:id/history)
// ------------------------------------------------------------------
export async function submitFarmData(
  userId: string,
  farmId: string,
  input: SnapshotInput & { changes?: string[]; title?: string }
): Promise<SubmitResult> {
  const snapshot = await snapshotService.createSnapshot(userId, farmId, {
    farm: input.farm,
    weather: input.weather,
    soil: input.soil,
    crop: input.crop,
    irrigation: input.irrigation,
    management: input.management,
    preferences: input.preferences,
    changesMade: input.changes ?? input.changesMade,
    label: input.label ?? "Farm data submitted",
  });

  const historyRecord = await historyService.addRecord({
    userId,
    farmId,
    farm: snapshot.farm,
    weather: snapshot.weather,
    soil: snapshot.soil,
    crop: snapshot.crop,
    irrigation: snapshot.irrigation,
    management: snapshot.management,
    preferences: snapshot.preferences,
    changesMade: snapshot.changesMade,
    label: snapshot.label,
    type: "snapshot_created",
    title: input.title ?? "Farm Update",
    changes: snapshot.changesMade,
  });

  return { snapshot, historyRecord };
}