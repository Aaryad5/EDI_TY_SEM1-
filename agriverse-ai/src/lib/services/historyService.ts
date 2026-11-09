"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_SNAPSHOT, DEMO_FARMS } from "@/lib/data/demo";
import { dateParts, uid } from "@/lib/utils";
import type { HistoryFilter, HistoryRecord } from "@/lib/types";

// Seed records strictly matching prompt examples:
const SEED_HISTORY_ITEMS: HistoryRecord[] = [
  {
    id: "hist_001",
    userId: "user_001",
    farmId: "farm_001",
    date: "2026-09-22",
    day: "Tuesday",
    time: "12:42:15",
    timestamp: "2026-09-22T12:42:15+05:30",
    timezone: "Asia/Kolkata",
    createdAt: "2026-09-22T12:42:15+05:30",
    updatedAt: "2026-09-22T12:42:15+05:30",
    type: "snapshot_created",
    title: "Partial Irrigation Analysis",
    label: "Vegetative Stage Telemetry",
    changesMade: ["Rhizosphere depletion detected", "Partial irrigation advised"],
    farm: DEMO_FARMS[0],
    crop: {
      id: "crp_001",
      snapshotId: "hist_001",
      farmId: "farm_001",
      userId: "user_001",
      currentCrop: "Wheat",
      cropVariety: "Lokwan",
      sowingDate: "2026-08-15",
      expectedHarvestDate: "2026-11-20",
      farmArea: 2.3,
      cropHealth: "good",
      cropAgeWeeks: 5,
      previousCrop: "Soybean",
      seedVariety: "Lokwan",
      seedQuantity: 30,
      fertilizerUsed: "NPK 19:19:19",
      fertilizerQuantity: 150,
      pesticidesUsed: "None",
      previousYield: 2.1,
      expectedYield: 4.5,
      previousCropDisease: "None",
      createdAt: "2026-09-22T12:42:15+05:30",
      updatedAt: "2026-09-22T12:42:15+05:30",
    },
    weather: {
      id: "wth_001",
      snapshotId: "hist_001",
      farmId: "farm_001",
      userId: "user_001",
      avgTemperatureC: 28,
      maxTemperatureC: 33,
      minTemperatureC: 21,
      relativeHumidityPct: 72,
      annualRainfallMm: 720,
      recentRainfallMm: 0.4,
      windSpeedKmh: 8,
      sunshineHours: 8.5,
      growingSeason: "Rabi",
      irrigationAvailable: true,
      createdAt: "2026-09-22T12:42:15+05:30",
      updatedAt: "2026-09-22T12:42:15+05:30",
    },
    soil: {
      id: "sld_001",
      snapshotId: "hist_001",
      farmId: "farm_001",
      userId: "user_001",
      soilType: "Black Cotton",
      soilPh: 6.8,
      nitrogen: 280,
      phosphorus: 45,
      potassium: 190,
      organicCarbonPct: 0.85,
      moisturePct: 18,
      electricalConductivityDsM: 0.8,
      clayPct: 38,
      sandPct: 25,
      siltPct: 37,
      soilDepthCm: 90,
      createdAt: "2026-09-22T12:42:15+05:30",
      updatedAt: "2026-09-22T12:42:15+05:30",
    },
    irrigation: {
      id: "irr_001",
      snapshotId: "hist_001",
      farmId: "farm_001",
      userId: "user_001",
      method: "drip",
      waterSource: "borewell",
      waterAvailability: "Adequate",
      frequencyDays: 3,
      averageWaterUsageLiters: 1200,
      pumpCapacityHP: 5,
      createdAt: "2026-09-22T12:42:15+05:30",
      updatedAt: "2026-09-22T12:42:15+05:30",
    },
  },
  {
    id: "hist_002",
    userId: "user_001",
    farmId: "farm_001",
    date: "2026-09-15",
    day: "Tuesday",
    time: "02:20:00",
    timestamp: "2026-09-15T14:20:00+05:30",
    timezone: "Asia/Kolkata",
    createdAt: "2026-09-15T14:20:00+05:30",
    updatedAt: "2026-09-15T14:20:00+05:30",
    type: "snapshot_created",
    title: "Germination Emergence Check",
    label: "Emergence Verified",
    changesMade: ["Soil moisture optimal at 35%", "Hold irrigation"],
    farm: DEMO_FARMS[0],
    crop: {
      id: "crp_002",
      snapshotId: "hist_002",
      farmId: "farm_001",
      userId: "user_001",
      currentCrop: "Wheat",
      cropVariety: "Lokwan",
      sowingDate: "2026-08-15",
      expectedHarvestDate: "2026-11-20",
      farmArea: 2.3,
      cropHealth: "excellent",
      cropAgeWeeks: 4,
      previousCrop: "Soybean",
      seedVariety: "Lokwan",
      seedQuantity: 30,
      fertilizerUsed: "DAP basal",
      fertilizerQuantity: 100,
      pesticidesUsed: "None",
      previousYield: 2.1,
      expectedYield: 4.5,
      previousCropDisease: "None",
      createdAt: "2026-09-15T14:20:00+05:30",
      updatedAt: "2026-09-15T14:20:00+05:30",
    },
    weather: {
      id: "wth_002",
      snapshotId: "hist_002",
      farmId: "farm_001",
      userId: "user_001",
      avgTemperatureC: 27,
      maxTemperatureC: 31,
      minTemperatureC: 21,
      relativeHumidityPct: 65,
      annualRainfallMm: 720,
      recentRainfallMm: 14,
      windSpeedKmh: 10,
      sunshineHours: 7.5,
      growingSeason: "Rabi",
      irrigationAvailable: true,
      createdAt: "2026-09-15T14:20:00+05:30",
      updatedAt: "2026-09-15T14:20:00+05:30",
    },
    soil: {
      id: "sld_002",
      snapshotId: "hist_002",
      farmId: "farm_001",
      userId: "user_001",
      soilType: "Black Cotton",
      soilPh: 6.8,
      nitrogen: 285,
      phosphorus: 48,
      potassium: 195,
      organicCarbonPct: 0.85,
      moisturePct: 35,
      electricalConductivityDsM: 0.8,
      clayPct: 38,
      sandPct: 25,
      siltPct: 37,
      soilDepthCm: 90,
      createdAt: "2026-09-15T14:20:00+05:30",
      updatedAt: "2026-09-15T14:20:00+05:30",
    },
    irrigation: {
      id: "irr_002",
      snapshotId: "hist_002",
      farmId: "farm_001",
      userId: "user_001",
      method: "rainfed",
      waterSource: "borewell",
      waterAvailability: "Adequate",
      frequencyDays: 7,
      averageWaterUsageLiters: 0,
      pumpCapacityHP: 5,
      createdAt: "2026-09-15T14:20:00+05:30",
      updatedAt: "2026-09-15T14:20:00+05:30",
    },
  },
  {
    id: "hist_003",
    userId: "user_001",
    farmId: "farm_002",
    date: "2026-08-10",
    day: "Monday",
    time: "09:15:00",
    timestamp: "2026-08-10T09:15:00+05:30",
    timezone: "Asia/Kolkata",
    createdAt: "2026-08-10T09:15:00+05:30",
    updatedAt: "2026-08-10T09:15:00+05:30",
    type: "snapshot_created",
    title: "Flowering Stage Risk Assessment",
    label: "Pest Vulnerability Raised",
    changesMade: ["Early blight risk flagged", "Neem oil application recommended"],
    farm: DEMO_FARMS[1],
    crop: {
      id: "crp_003",
      snapshotId: "hist_003",
      farmId: "farm_002",
      userId: "user_001",
      currentCrop: "Tomato",
      cropVariety: "Arka Rakshak",
      sowingDate: "2026-06-20",
      expectedHarvestDate: "2026-09-30",
      farmArea: 1.5,
      cropHealth: "fair",
      cropAgeWeeks: 7,
      previousCrop: "Potato",
      seedVariety: "HYB-441",
      seedQuantity: 0.2,
      fertilizerUsed: "NPK 19:19:19",
      fertilizerQuantity: 120,
      pesticidesUsed: "Neem oil spray",
      previousYield: 3.2,
      expectedYield: 4.8,
      previousCropDisease: "Mild Blight",
      createdAt: "2026-08-10T09:15:00+05:30",
      updatedAt: "2026-08-10T09:15:00+05:30",
    },
    weather: {
      id: "wth_003",
      snapshotId: "hist_003",
      farmId: "farm_002",
      userId: "user_001",
      avgTemperatureC: 29,
      maxTemperatureC: 34,
      minTemperatureC: 22,
      relativeHumidityPct: 78,
      annualRainfallMm: 680,
      recentRainfallMm: 2,
      windSpeedKmh: 12,
      sunshineHours: 7,
      growingSeason: "Kharif",
      irrigationAvailable: true,
      createdAt: "2026-08-10T09:15:00+05:30",
      updatedAt: "2026-08-10T09:15:00+05:30",
    },
    soil: {
      id: "sld_003",
      snapshotId: "hist_003",
      farmId: "farm_002",
      userId: "user_001",
      soilType: "Loamy",
      soilPh: 6.5,
      nitrogen: 240,
      phosphorus: 38,
      potassium: 175,
      organicCarbonPct: 0.75,
      moisturePct: 28,
      electricalConductivityDsM: 0.7,
      clayPct: 24,
      sandPct: 42,
      siltPct: 34,
      soilDepthCm: 75,
      createdAt: "2026-08-10T09:15:00+05:30",
      updatedAt: "2026-08-10T09:15:00+05:30",
    },
    irrigation: {
      id: "irr_003",
      snapshotId: "hist_003",
      farmId: "farm_002",
      userId: "user_001",
      method: "drip",
      waterSource: "canal",
      waterAvailability: "Adequate",
      frequencyDays: 2,
      averageWaterUsageLiters: 1500,
      pumpCapacityHP: 7.5,
      createdAt: "2026-08-10T09:15:00+05:30",
      updatedAt: "2026-08-10T09:15:00+05:30",
    },
  },
];

export const historyService = {
  async getHistory(
    userId?: string,
    farmId?: string,
    filter: HistoryFilter = {}
  ): Promise<HistoryRecord[]> {
    ensureSeedHistory();
    let records = read<HistoryRecord[]>(STORAGE_KEYS.history, []);

    if (userId) records = records.filter((r) => r.userId === userId);
    if (farmId) records = records.filter((r) => r.farmId === farmId);
    if (filter.type) records = records.filter((r) => r.type === filter.type);
    if (filter.crop)
      records = records.filter((r) => r.crop?.currentCrop.toLowerCase().includes(filter.crop!.toLowerCase()));
    if (filter.dateFrom) records = records.filter((r) => r.date >= filter.dateFrom!);
    if (filter.dateTo) records = records.filter((r) => r.date <= filter.dateTo!);
    if (filter.query) {
      const q = filter.query.toLowerCase();
      records = records.filter(
        (r) =>
          r.label?.toLowerCase().includes(q) ||
          r.title?.toLowerCase().includes(q) ||
          r.crop?.currentCrop.toLowerCase().includes(q) ||
          r.changesMade?.some((c) => c.toLowerCase().includes(q))
      );
    }

    return simulateLatency(
      [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      200
    );
  },

  async addHistory(record: HistoryRecord): Promise<HistoryRecord> {
    ensureSeedHistory();
    const records = read<HistoryRecord[]>(STORAGE_KEYS.history, []);
    records.unshift(record);
    write(STORAGE_KEYS.history, records);
    return simulateLatency(record, 200);
  },

  async addRecord(
    record: Omit<HistoryRecord, "id" | "createdAt" | "updatedAt" | "day" | "date" | "time" | "timezone">
  ): Promise<HistoryRecord> {
    const records = read<HistoryRecord[]>(STORAGE_KEYS.history, []);
    const d = dateParts();
    const full: HistoryRecord = {
      ...record,
      id: uid("hst"),
      date: d.date,
      day: d.day,
      time: d.time,
      timezone: d.timezone,
      createdAt: d.iso,
      updatedAt: d.iso,
    };
    records.unshift(full);
    write(STORAGE_KEYS.history, records);
    return simulateLatency(full, 200);
  },
};

export function ensureSeedHistory() {
  const records = read<HistoryRecord[]>(STORAGE_KEYS.history, []);
  if (records.length === 0) {
    write<HistoryRecord[]>(STORAGE_KEYS.history, SEED_HISTORY_ITEMS);
  }
}