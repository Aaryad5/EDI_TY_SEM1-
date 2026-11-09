"use client";

import { simulateLatency } from "./storage";
import type { DigitalTwinSimulation, SimulationScenario } from "@/lib/types";

// ------------------------------------------------------------------
// digitalTwinService — mock "What if?" simulations.
// Future: FastAPI/ML backend computes these from a farm digital twin.
// ------------------------------------------------------------------

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "rainfall_down_20",
    label: "Rainfall decreases by 20%",
    description: "Simulates a drier season for the chosen crop.",
    parameters: { rainfallDeltaPct: -20, temperatureDeltaC: 0, irrigationDeltaPct: 0 },
  },
  {
    id: "irrigation_up_15",
    label: "Irrigation increases by 15%",
    description: "Simulates higher irrigation capacity.",
    parameters: { irrigationDeltaPct: 15, rainfallDeltaPct: 0, temperatureDeltaC: 0 },
  },
  {
    id: "temp_up_3",
    label: "Temperature increases by 3°C",
    description: "Simulates hotter growing conditions.",
    parameters: { temperatureDeltaC: 3, rainfallDeltaPct: 0, irrigationDeltaPct: 0 },
  },
  {
    id: "balanced",
    label: "Balanced (irrigation +10%, 1°C warmer)",
    description: "Combined mild scenario.",
    parameters: { irrigationDeltaPct: 10, temperatureDeltaC: 1, rainfallDeltaPct: 0 },
  },
];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export async function runSimulation(
  scenario: SimulationScenario,
  baselineYield: number,
  baselineWaterUsage: number,
  crop: string
): Promise<DigitalTwinSimulation> {
  // POST /api/farms/:id/digital-twin/simulate  (future ML backend)
  const { rainfallDeltaPct = 0, temperatureDeltaC = 0, irrigationDeltaPct = 0 } =
    scenario.parameters;

  const rainFactor = 1 + rainfallDeltaPct / 100;
  const tempFactor = 1 + temperatureDeltaC * 0.035;
  const irrFactor = 1 + irrigationDeltaPct / 100;

  const yieldDelta = (irrFactor - 1) * 0.7 - (1 - rainFactor) * 0.6 - (tempFactor - 1) * 1.1;
  const simulatedYield = clamp(baselineYield * (1 + yieldDelta), baselineYield * 0.55, baselineYield * 1.3);

  const waterStress = clamp((1 - rainFactor) * 100 - irrigationDeltaPct * 0.5, -40, 80);
  const simulatedWater = clamp(
    baselineWaterUsage * irrFactor * (1 - rainFactor * 0.15),
    baselineWaterUsage * 0.4,
    baselineWaterUsage * 1.4
  );

  const cropHealthImpact = clamp(yieldDelta * 1.6, -0.9, 0.9);

  return simulateLatency(
    {
      baselineYieldTonsPerHa: baselineYield,
      simulatedYieldTonsPerHa: Math.round(simulatedYield * 100) / 100,
      baselineWaterUsageLiters: baselineWaterUsage,
      simulatedWaterUsageLiters: Math.round(simulatedWater),
      waterStressIndex: Math.round(waterStress),
      cropHealthImpact: Math.round(cropHealthImpact * 100) / 100,
      qaPerArea: {
        yieldDeltaPct: Math.round(yieldDelta * 100),
        temperatureDeltaC,
        rainfallDeltaPct,
        irrigationDeltaPct,
      },
      notes: [
        `Warning: water stress index is ${waterStress >= 40 ? "high" : waterStress >= 15 ? "elevated" : "stable"} at ${Math.round(waterStress)}.`,
        `${crop} yield is projected to ${yieldDelta >= 0 ? "increase" : "decline"} by ${Math.abs(Math.round(yieldDelta * 100))}% under this scenario.`,
        "Model is mock/demo — connect the AgriVerse Decision Engine for calibrated results.",
      ],
    },
    1100
  );
}