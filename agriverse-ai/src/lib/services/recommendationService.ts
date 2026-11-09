"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { CROPS, REGIONS, SEASONS } from "@/lib/data/catalog";
import { uid } from "@/lib/utils";
import type {
  CropRecommendation,
  FarmSnapshot,
  Recommendation,
  RecommendationReason,
  RegionRecommendation,
  SeasonRecommendation,
  Severity,
} from "@/lib/types";

// ------------------------------------------------------------------
// recommendationService — DEMO inference only.
// Every result is stamped isMock=true so the UI never pretends a
// mock number came from the real ML model.
// Future: POST ENDPOINTS.cropRecommendation (FastAPI + XGBoost/RF/PyTorch)
// ------------------------------------------------------------------

const IS_MOCK = true;

function confidence(value: number): number {
  return Math.min(0.98, Math.max(0.55, Math.round(value * 100) / 100));
}

function reasonsFor(
  snapshot: FarmSnapshot,
  test: { label: string; pass: boolean; partial?: boolean }
): RecommendationReason {
  return {
    label: test.label,
    status: test.pass ? "met" : test.partial ? "partial" : "not_met",
  };
}

function riskFromScore(score: number): Severity {
  if (score > 0.75) return "critical";
  if (score > 0.55) return "high";
  if (score > 0.35) return "medium";
  return "low";
}

export function buildCropRecommendation(
  snapshot: FarmSnapshot,
  cropName?: string
): CropRecommendation {
  const soil = snapshot.soil;
  const weather = snapshot.weather;
  const cropCatalog = CROPS.find((c) => c.name === (cropName ?? snapshot.crop?.currentCrop)) ?? CROPS[0]!;
  const ph = soil?.soilPh ?? 6.7;
  const [phLo, phHi] = cropCatalog.idealPhRange;
  const phScore =
    ph >= phLo - 0.5 && ph <= phHi + 0.5
      ? Math.min(1, 0.75 + 0.25 * (1 - Math.abs(ph - (phLo + phHi) / 2) / (phHi - phLo)))
      : Math.max(0.3, 1 - Math.abs(ph - (phLo + phHi) / 2) * 0.4);

  const rainScore =
    (weather?.annualRainfallMm ?? 750) >= cropCatalog.waterRequirementMm * 0.8
      ? 0.9
      : 0.55;
  const tempScore =
    (weather?.avgTemperatureC ?? 27) >= 20 && (weather?.avgTemperatureC ?? 27) <= 35 ? 0.92 : 0.6;
  const moistureScore = (soil?.moisturePct ?? 42) >= 35 ? 0.9 : 0.6;

  const suitabilityScore = Math.round(
    (phScore * 0.3 + rainScore * 0.25 + tempScore * 0.25 + moistureScore * 0.2) * 100
  ) / 100;

  const reasons: RecommendationReason[] = [
    reasonsFor(snapshot, {
      label: `Suitable soil pH (${ph}) for ${cropCatalog.name}`,
      pass: phScore > 0.7,
      partial: phScore > 0.5,
    }),
    reasonsFor(snapshot, {
      label: `Suitable rainfall (${weather?.annualRainfallMm ?? 750} mm)`,
      pass: rainScore > 0.7,
      partial: rainScore > 0.5,
    }),
    reasonsFor(snapshot, {
      label: `Suitable temperature (${weather?.avgTemperatureC ?? 27}°C)`,
      pass: tempScore > 0.7,
      partial: tempScore > 0.5,
    }),
    reasonsFor(snapshot, {
      label: `Suitable soil moisture (${soil?.moisturePct ?? 42}%)`,
      pass: moistureScore > 0.7,
      partial: moistureScore > 0.5,
    }),
  ];

  const waterReq = Math.round(cropCatalog.waterRequirementMm * (0.9 + (1 - rainScore) * 0.3));
  const expectedYield = Math.round(cropCatalog.typicalDurationDays * 0.42 * 10) / 10;
  const estimatedProfit = Math.round(expectedYield * (14000 + cropCatalog.typicalDurationDays * 40));
  const riskScore = 1 - suitabilityScore;

  return {
    crop: cropCatalog.name,
    region: snapshot.farm?.district || "Pune",
    season: weather?.growingSeason ?? "Rabi",
    suitabilityScore,
    confidence: { rawModelScore: null, mockDisplayConfidence: confidence(0.5 + suitabilityScore * 0.5), isMock: IS_MOCK },
    reasons,
    expectedYieldTonsPerHa: expectedYield,
    waterRequirementMm: waterReq,
    growingPeriodDays: cropCatalog.typicalDurationDays,
    estimatedProfitPerHa: estimatedProfit,
    riskLevel: riskFromScore(riskScore),
    requiredConditions: [
      `Maintain soil pH between ${cropCatalog.idealPhRange[0]} and ${cropCatalog.idealPhRange[1]}.`,
      `Apply irrigation to cover ~${waterReq} mm across the season.`,
      "Keep organic carbon above 0.5% with compost or green manure.",
      "Monitor for pests during the flowering stage.",
    ],
    supportingData: {
      pH: soil?.soilPh ?? "n/a",
      annualRainfallMm: weather?.annualRainfallMm ?? "n/a",
      avgTemperatureC: weather?.avgTemperatureC ?? "n/a",
      soilMoisturePct: soil?.moisturePct ?? "n/a",
      growingDays: cropCatalog.typicalDurationDays,
    },
  };
}

export function buildSeasonRecommendation(snapshot: FarmSnapshot): SeasonRecommendation {
  const rain = snapshot.weather?.annualRainfallMm ?? 750;
  const season =
    rain >= 750 || snapshot.weather?.irrigationAvailable
      ? SEASONS.find((s) => s.name === "Kharif") ?? SEASONS[0]!
      : SEASONS.find((s) => s.name === "Rabi") ?? SEASONS[1]!;
  return {
    season: season.name,
    displayName: season.name,
    months: season.months,
    suitability: Math.round(0.72 + Math.random() * 0.22),
    reasons: [
      `Rainfall profile (${rain} mm) matches the ${season.name} window.`,
      `Temperature range suits a ${Math.floor(season.sowingToHarvestNote.length / 10)}-week crop cycle.`,
      season.name === "Kharif" ? "Monsoon onset reduces initial irrigation demand." : "Cooler nights favor grain/vegetable set.",
    ],
  };
}

export function buildRegionRecommendation(snapshot: FarmSnapshot): RegionRecommendation {
  const candidate = REGIONS.find((r) => r.name === snapshot.farm?.district) ?? REGIONS[0]!;
  return {
    region: candidate.name,
    country: candidate.country,
    suitability: Math.round(0.74 + Math.random() * 0.2),
    reasons: [
      `${candidate.climate} climate supports irrigated + rainfed cropping.`,
      `Average ${candidate.avgAnnualRainfallMm} mm annual rainfall.`,
      `Dominant soils: ${candidate.majorSoils.join(", ")}.`,
    ],
  };
}

export async function generateRecommendations(
  userId: string,
  snapshot: FarmSnapshot
): Promise<Recommendation[]> {
  // POST /api/recommendations/crop  (+ /season, /region)
  const crop = buildCropRecommendation(snapshot);
  const season = buildSeasonRecommendation(snapshot);
  const region = buildRegionRecommendation(snapshot);
  const now = new Date().toISOString();

  const recs: Recommendation[] = [
    {
      id: uid("rec"),
      snapshotId: snapshot.id,
      farmId: snapshot.farmId,
      userId,
      type: "crop",
      isMock: true,
      crop,
      summary: `${crop.crop} shows ${Math.round(crop.suitabilityScore * 100)}% suitability for ${crop.region} in ${crop.season}.`,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid("rec"),
      snapshotId: snapshot.id,
      farmId: snapshot.farmId,
      userId,
      type: "season",
      isMock: true,
      season,
      summary: `Recommended season: ${season.displayName} (${season.months}).`,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid("rec"),
      snapshotId: snapshot.id,
      farmId: snapshot.farmId,
      userId,
      type: "region",
      isMock: true,
      region,
      summary: `Recommended region: ${region.region} at ${region.suitability}% suitability.`,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const list = read<Recommendation[]>(STORAGE_KEYS.recommendations, []);
  list.push(...recs);
  write(STORAGE_KEYS.recommendations, list);
  return simulateLatency(recs, 800);
}

export async function getRecommendations(farmId: string): Promise<Recommendation[]> {
  const list = read<Recommendation[]>(STORAGE_KEYS.recommendations, []);
  return simulateLatency(
    [...list.filter((r) => r.farmId === farmId)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    300
  );
}

export { CROPS, REGIONS, SEASONS }; // re-export catalog for the analysis page