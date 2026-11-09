"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Sliders,
  Droplets,
  CloudSun,
  Layers,
  Sprout,
  ShieldAlert,
  TrendingUp,
  Save,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  Signal,
  Radio,
  Gauge,
  Thermometer,
  Wind,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { farmService } from "@/lib/services/farmService";
import { historyService } from "@/lib/services/historyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { dateParts, uid } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Farm, HistoryRecord } from "@/lib/types";

// Comparison dataset for Recharts
const COMPARISON_DATA = [
  { metric: "Yield (t)", noIrrigation: 4.0, partialIrrigation: 4.5, fullIrrigation: 4.6 },
  { metric: "Profit (₹k)", noIrrigation: 45, partialIrrigation: 52, fullIrrigation: 50 },
  { metric: "Water (kL)", noIrrigation: 0, partialIrrigation: 1.2, fullIrrigation: 2.0 },
  { metric: "Risk (0-10)", noIrrigation: 8.5, partialIrrigation: 3.5, fullIrrigation: 2.0 },
  { metric: "Sustain (0-10)", noIrrigation: 7.0, partialIrrigation: 9.5, fullIrrigation: 6.5 },
];

export default function DigitalTwinSimulationPage() {
  const params = useParams();
  const farmId = (params?.farmId as string) || "farm_001";
  const { toast } = useToast();
  const { activeFarm, farms, user } = useAuth();
  const { snapshot, refresh } = useFarmData();

  const [farm, setFarm] = React.useState<Farm | null>(null);

  // Active simulated scenario
  const [activeScenario, setActiveScenario] = React.useState<"none" | "partial" | "full" | "custom">("partial");

  // Custom What-If Sliders
  const [rainfallDelta, setRainfallDelta] = React.useState<number>(-20);
  const [tempDelta, setTempDelta] = React.useState<number>(2);
  const [irrigationDelta, setIrrigationDelta] = React.useState<number>(15);
  const [soilMoistureDelta, setSoilMoistureDelta] = React.useState<number>(0);
  const [fertilizerLevel, setFertilizerLevel] = React.useState<string>("Optimal");
  const [cropStage, setCropStage] = React.useState<string>("Vegetative");

  // Running simulation loading state
  const [simulating, setSimulating] = React.useState<boolean>(false);
  const [savingHistory, setSavingHistory] = React.useState<boolean>(false);

  // Load farm
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const f = await farmService.getFarm(farmId);
      if (mounted) {
        setFarm(f || activeFarm || (farms && farms[0]) || null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [farmId, activeFarm, farms]);

  // Derived Simulation Results
  const simulationResults = React.useMemo(() => {
    if (activeScenario === "none") {
      return {
        name: "No Irrigation (Rainfed Only)",
        expectedYield: 4.0,
        waterUsage: 0,
        risk: "High" as const,
        estimatedProfit: 45000,
        sustainability: "Fair (7.0/10)",
        recommendation: "Not recommended. Prolonged moisture deficit will stunt vegetative elongation.",
      };
    }
    if (activeScenario === "full") {
      return {
        name: "Full Irrigation (Saturation)",
        expectedYield: 4.6,
        waterUsage: 2000,
        risk: "Low" as const,
        estimatedProfit: 50000,
        sustainability: "Moderate (6.5/10 - Water depletion)",
        recommendation: "Acceptable for maximum yield, but excess runoff reduces net margin by ₹2,000.",
      };
    }
    if (activeScenario === "custom") {
      // Dynamic computation
      const baseYield = 4.5 + (rainfallDelta * 0.01) - (tempDelta * 0.05) + (irrigationDelta * 0.012);
      const yieldRounded = Math.max(2.8, Math.min(5.2, Number(baseYield.toFixed(2))));
      const waterUsed = Math.max(0, Math.round(1200 * (1 + irrigationDelta / 100)));
      const profit = Math.round(yieldRounded * 11500 - (waterUsed * 0.8));
      const risk = (rainfallDelta < -25 && irrigationDelta < 0) || tempDelta > 3 ? "High" : tempDelta > 1 ? "Medium" : "Low";

      return {
        name: `Custom What-If (Rain: ${rainfallDelta}%, Temp: +${tempDelta}°C, Irrig: +${irrigationDelta}%)`,
        expectedYield: yieldRounded,
        waterUsage: waterUsed,
        risk: risk as any,
        estimatedProfit: profit,
        sustainability: "Calculated (8.4/10)",
        recommendation: `Custom scenario evaluated: ${risk === "High" ? "Elevated stress detected." : "Balanced physiological response."} Adjusted irrigation compensates for temperature variance.`,
      };
    }

    // Default: Partial
    return {
      name: "Partial Irrigation (Optimal Drip)",
      expectedYield: 4.5,
      waterUsage: 1200,
      risk: "Medium" as const,
      estimatedProfit: 52000,
      sustainability: "Optimal (9.5/10 - Max WUE)",
      recommendation: "Highest return on investment. Maximizes Water-Use Efficiency (WUE) and safeguards root aeration.",
    };
  }, [activeScenario, rainfallDelta, tempDelta, irrigationDelta]);

  const handleRunCustomSimulation = async () => {
    setSimulating(true);
    await new Promise((r) => setTimeout(r, 600));
    setActiveScenario("custom");
    setSimulating(false);
    toast({
      variant: "success",
      title: "Digital Twin Updated",
      description: "Custom parameters applied to 2D farm simulation model.",
    });
  };

  const handleSaveToHistory = async () => {
    setSavingHistory(true);
    const now = dateParts();
    const historyRecord: HistoryRecord = {
      id: `sim_snap_${uid()}`,
      userId: user?.id || "user_001",
      farmId,
      date: now.date,
      day: now.day,
      time: now.time,
      timestamp: now.iso,
      timezone: now.timezone,
      createdAt: now.iso,
      updatedAt: now.iso,
      type: "snapshot_created",
      title: `Simulation Audit: ${simulationResults.name}`,
      label: `Simulated Yield: ${simulationResults.expectedYield}t`,
      changes: [
        `Scenario: ${simulationResults.name}`,
        `Expected Yield: ${simulationResults.expectedYield} tons`,
        `Water Usage: ${simulationResults.waterUsage} L`,
        `Estimated Profit: ₹${simulationResults.estimatedProfit.toLocaleString("en-IN")}`,
        `Risk: ${simulationResults.risk}`,
      ],
      farm: farm || undefined,
      crop: snapshot?.crop || undefined,
      weather: snapshot?.weather || undefined,
      soil: snapshot?.soil || undefined,
      irrigation: snapshot?.irrigation || undefined,
    };

    try {
      await historyService.addHistory(historyRecord);
      await refresh();
      toast({
        variant: "success",
        title: "Simulation Saved to History",
        description: "Permanent audit record created. Viewable in Analysis History.",
      });
    } catch {
      toast({ variant: "destructive", title: "Failed to save simulation record" });
    } finally {
      setSavingHistory(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* SCREEN 5 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-agri/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri">
            <BrainCircuit className="h-4 w-4" />
            2D Digital Twin Engine · {farm?.name || "Farm 01"}
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">
            Digital Twin Simulation
          </h1>
          <p className="text-sm text-dark/60">
            Explore different scenarios and their impact on your crop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveToHistory}
            disabled={savingHistory}
            className="border-agri/30 text-forest hover:bg-cream"
          >
            {savingHistory ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin text-agri" />
                Saving Snapshot...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4 text-agri" />
                Save Simulation to History
              </>
            )}
          </Button>

          <Button asChild variant="primary">
            <Link href={`/farms/${farmId}/analysis`}>Back to Farm Analysis</Link>
          </Button>
        </div>
      </div>

      {/* VISUAL REPRESENTATION OF THE FARM (Inspired by Reference Image 1) */}
      <section className="relative overflow-hidden rounded-3xl border border-agri/20 bg-gradient-to-b from-white via-cream/40 to-[#ece8dc] p-6 shadow-xl space-y-5">
        {/* Telemetry Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fresh opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-agri" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-dark/70">
              DIGITAL TWIN · LIVE TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-agri/25 bg-white text-forest text-xs">
              <Signal className="mr-1 h-3.5 w-3.5 text-agri" /> 8 Sensors Online
            </Badge>
            <Badge className="bg-forest text-white text-xs">
              Sentinel-2 Synced
            </Badge>
          </div>
        </div>

        {/* Orbit Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-3.5 py-1 text-xs font-bold text-sky-900 shadow-sm backdrop-blur">
            <Radio className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
            <span>Satellite Sentinel-2 (NDVI 0.76)</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-agri/15 bg-white/90 px-3.5 py-1 text-xs font-bold text-dark shadow-sm">
            <CloudSun className="h-3.5 w-3.5 text-amber-500" />
            <span>28.4°C · 64% RH (Rain in 48h · 12mm)</span>
          </div>
        </div>

        {/* 3 Core Interactive Twin Sectors */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Sector 1: Zone A Crop */}
          <div className="rounded-2xl border border-agri/20 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-forest font-bold text-sm">
                <Sprout className="h-4.5 w-4.5 text-agri" />
                <span>Zone A: {farm?.currentCrop || "Wheat"}</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-dark/60">Crop Health</span>
                <span className="text-emerald-700">94% (Good)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-cream">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: "94%" }} />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-agri/10 pt-2 text-[11px] text-dark/60">
              <span>Age: 5 wks</span>
              <span>Target Yield: {simulationResults.expectedYield} t/ha</span>
            </div>
          </div>

          {/* Sector 2: AI Decision Core */}
          <div className="rounded-2xl border border-agri/30 bg-gradient-to-br from-forest to-dark p-5 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lightgreen font-bold text-sm">
                <BrainCircuit className="h-4.5 w-4.5" />
                <span>AI Decision Core</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-lightgreen animate-pulse" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-white/70 block">
                AgriVerse Decision Engine
              </span>
              <p className="text-2xl font-black text-white mt-0.5">
                92% Match
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
              <span className="text-white/70">Recommendation:</span>
              <span className="font-bold text-lightgreen">{simulationResults.risk === "High" ? "Stress Alert" : "Optimal"}</span>
            </div>
          </div>

          {/* Sector 3: Irrigation Sector */}
          <div className="rounded-2xl border border-agri/20 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Droplets className="h-4.5 w-4.5 text-sky-600" />
                <span>Drip Sector</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-sky-500" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-dark/60">Soil Moisture</span>
                <span className="text-sky-700 font-bold">
                  {activeScenario === "none" ? "14% (Critical)" : activeScenario === "full" ? "48% (Saturated)" : "42% (Adequate)"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-cream">
                <div
                  className="h-2 rounded-full bg-sky-500"
                  style={{
                    width: activeScenario === "none" ? "20%" : activeScenario === "full" ? "85%" : "55%",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-agri/10 pt-2 text-[11px] text-dark/60">
              <span>Valve: Auto</span>
              <span>Next Run: {activeScenario === "none" ? "Disabled" : "2 Days"}</span>
            </div>
          </div>
        </div>

        {/* Subsurface Soil Layer (0-40 cm) */}
        <div className="rounded-2xl border border-amber-900/20 bg-[#d5bfa7]/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-950">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-amber-800" />
              Subsurface Soil Layer (0–40 cm)
            </span>
            <span>pH 6.7 · Neutral</span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs font-medium text-amber-950">
            <div className="rounded-lg bg-white/80 p-2 text-center">N: 280 kg/ha</div>
            <div className="rounded-lg bg-white/80 p-2 text-center">P: 45 kg/ha</div>
            <div className="rounded-lg bg-white/80 p-2 text-center">K: 190 kg/ha</div>
            <div className="rounded-lg bg-white/80 p-2 text-center">OC: 0.85%</div>
          </div>
        </div>

        {/* Bottom Calibration Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
          <div className="rounded-xl border border-agri/15 bg-white p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark/50 block">RECOMMENDED CROP</span>
            <span className="text-sm font-bold text-dark mt-0.5 block">{farm?.currentCrop || "Wheat"}</span>
          </div>
          <div className="rounded-xl border border-agri/15 bg-white p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark/50 block">SUITABILITY FIT</span>
            <span className="text-sm font-bold text-forest mt-0.5 block">92% Match</span>
          </div>
          <div className="rounded-xl border border-agri/15 bg-white p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark/50 block">DIGITAL TWIN STATUS</span>
            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">Calibrated</span>
          </div>
        </div>
      </section>

      {/* SIMULATION OPTIONS (Three Scenario Cards) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-dark/70 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-agri" />
              SIMULATION SCENARIO OPTIONS
            </h2>
            <p className="text-xs text-dark/60">
              Select one of the three standard scenarios or use the custom slider panel below.
            </p>
          </div>
          <span className="text-xs text-dark/50 italic">Simulated data for decision support</span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: NO IRRIGATION */}
          <Card
            className={`border transition-all ${
              activeScenario === "none"
                ? "border-2 border-amber-600 bg-amber-50/20 shadow-md ring-1 ring-amber-600"
                : "border-agri/15 bg-white shadow-sm hover:border-agri/35"
            }`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-agri/10 pb-2">
                <h3 className="text-base font-black text-dark">NO IRRIGATION</h3>
                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                  Rainfed Only
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-dark/60">Expected Yield:</span>
                  <span className="font-bold text-dark">4.0 tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Water Usage:</span>
                  <span className="font-bold text-dark">0 L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Risk Level:</span>
                  <span className="font-bold text-red-600">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Estimated Profit:</span>
                  <span className="font-bold text-dark">₹45,000</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setActiveScenario("none")}
                variant={activeScenario === "none" ? "primary" : "outline"}
                className="w-full font-bold text-xs"
              >
                {activeScenario === "none" ? "Active Simulation" : "Simulate"}
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: PARTIAL IRRIGATION */}
          <Card
            className={`border transition-all ${
              activeScenario === "partial"
                ? "border-2 border-agri bg-fresh/15 shadow-md ring-1 ring-agri"
                : "border-agri/15 bg-white shadow-sm hover:border-agri/35"
            }`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-agri/10 pb-2">
                <h3 className="text-base font-black text-forest">PARTIAL IRRIGATION</h3>
                <Badge className="bg-forest text-white text-xs">
                  Recommended
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-dark/60">Expected Yield:</span>
                  <span className="font-bold text-forest">4.5 tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Water Usage:</span>
                  <span className="font-bold text-dark">1,200 L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Risk Level:</span>
                  <span className="font-bold text-amber-600">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Estimated Profit:</span>
                  <span className="font-bold text-forest text-sm">₹52,000</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setActiveScenario("partial")}
                variant={activeScenario === "partial" ? "primary" : "outline"}
                className="w-full font-bold text-xs"
              >
                {activeScenario === "partial" ? "Active Simulation" : "Simulate"}
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: FULL IRRIGATION */}
          <Card
            className={`border transition-all ${
              activeScenario === "full"
                ? "border-2 border-sky-600 bg-sky-50/20 shadow-md ring-1 ring-sky-600"
                : "border-agri/15 bg-white shadow-sm hover:border-agri/35"
            }`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-agri/10 pb-2">
                <h3 className="text-base font-black text-dark">FULL IRRIGATION</h3>
                <Badge variant="secondary" className="bg-sky-100 text-sky-800 text-xs">
                  Saturation
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-dark/60">Expected Yield:</span>
                  <span className="font-bold text-dark">4.6 tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Water Usage:</span>
                  <span className="font-bold text-dark">2,000 L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Risk Level:</span>
                  <span className="font-bold text-emerald-600">Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Estimated Profit:</span>
                  <span className="font-bold text-dark">₹50,000</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setActiveScenario("full")}
                variant={activeScenario === "full" ? "primary" : "outline"}
                className="w-full font-bold text-xs"
              >
                {activeScenario === "full" ? "Active Simulation" : "Simulate"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CUSTOM WHAT-IF SIMULATION PANEL */}
      <section className="rounded-3xl border border-agri/15 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agri/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-dark flex items-center gap-2">
              <Sliders className="h-5 w-5 text-agri" />
              CUSTOM WHAT-IF SIMULATOR
            </h2>
            <p className="text-xs text-dark/60">
              Adjust environmental stress variables to simulate yield variations and water footprint.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleRunCustomSimulation}
            disabled={simulating}
            variant="primary"
            className="shadow-md font-bold text-xs"
          >
            {simulating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Computing What-If...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-white" />
                Run Simulation
              </>
            )}
          </Button>
        </div>

        {/* Sliders Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Rainfall Delta */}
          <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4 space-y-3">
            <div className="flex justify-between text-xs font-bold text-dark">
              <span>Rainfall Delta</span>
              <span className={rainfallDelta < 0 ? "text-amber-700" : "text-emerald-700"}>
                {rainfallDelta > 0 ? `+${rainfallDelta}%` : `${rainfallDelta}%`}
              </span>
            </div>
            <Slider
              value={[rainfallDelta]}
              min={-50}
              max={50}
              step={5}
              onValueChange={(val) => setRainfallDelta(val[0] ?? 0)}
            />
            <span className="text-[10px] text-dark/50 block">Range: -50% to +50%</span>
          </div>

          {/* Temperature Delta */}
          <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4 space-y-3">
            <div className="flex justify-between text-xs font-bold text-dark">
              <span>Temperature Delta</span>
              <span className={tempDelta > 0 ? "text-red-600" : "text-emerald-700"}>
                {tempDelta > 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
              </span>
            </div>
            <Slider
              value={[tempDelta]}
              min={-5}
              max={5}
              step={1}
              onValueChange={(val) => setTempDelta(val[0] ?? 0)}
            />
            <span className="text-[10px] text-dark/50 block">Range: -5°C to +5°C</span>
          </div>

          {/* Irrigation Delta */}
          <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4 space-y-3">
            <div className="flex justify-between text-xs font-bold text-dark">
              <span>Irrigation Delta</span>
              <span className="text-sky-700">
                {irrigationDelta > 0 ? `+${irrigationDelta}%` : `${irrigationDelta}%`}
              </span>
            </div>
            <Slider
              value={[irrigationDelta]}
              min={-30}
              max={50}
              step={5}
              onValueChange={(val) => setIrrigationDelta(val[0] ?? 0)}
            />
            <span className="text-[10px] text-dark/50 block">Range: -30% to +50%</span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="rounded-2xl border-2 border-agri/30 bg-fresh/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-agri/15 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-dark">
              Simulation Results: {simulationResults.name}
            </h3>
            <Badge
              variant="secondary"
              className={`text-xs font-bold ${
                simulationResults.risk === "High"
                  ? "bg-red-100 text-red-800"
                  : simulationResults.risk === "Medium"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              Risk: {simulationResults.risk}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 text-xs">
            <div className="rounded-xl bg-white p-3">
              <span className="text-dark/50 block">Expected Yield</span>
              <span className="text-xl font-black text-dark mt-0.5 block">
                {simulationResults.expectedYield} tons
              </span>
            </div>
            <div className="rounded-xl bg-white p-3">
              <span className="text-dark/50 block">Water Usage</span>
              <span className="text-xl font-black text-dark mt-0.5 block">
                {simulationResults.waterUsage.toLocaleString()} L
              </span>
            </div>
            <div className="rounded-xl bg-white p-3">
              <span className="text-dark/50 block">Crop Risk</span>
              <span className="text-xl font-black text-dark mt-0.5 block">
                {simulationResults.risk}
              </span>
            </div>
            <div className="rounded-xl bg-white p-3">
              <span className="text-dark/50 block">Estimated Profit</span>
              <span className="text-xl font-black text-forest mt-0.5 block">
                ₹{simulationResults.estimatedProfit.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="rounded-xl bg-white p-3">
              <span className="text-dark/50 block">Sustainability</span>
              <span className="text-xs font-bold text-emerald-700 mt-1 block">
                {simulationResults.sustainability}
              </span>
            </div>
          </div>

          <p className="text-xs text-dark/70 italic leading-relaxed pt-1">
            <strong>Recommendation:</strong> {simulationResults.recommendation}
          </p>
        </div>
      </section>

      {/* MULTI-OBJECTIVE COMPARISON CHART (Recharts) */}
      <section className="rounded-3xl border border-agri/15 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-agri/10 pb-3">
          <div>
            <h2 className="text-base font-bold text-dark flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-agri" />
              MULTI-OBJECTIVE COMPARISON
            </h2>
            <p className="text-xs text-dark/60">
              Comparative benchmark across No Irrigation, Partial Irrigation, and Full Irrigation
            </p>
          </div>
          <Badge variant="outline" className="border-agri/20 text-forest text-xs bg-cream">
            Multi-Variable Matrix
          </Badge>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPARISON_DATA} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="metric" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="noIrrigation" name="No Irrigation" fill="#d97706" radius={[4, 4, 0, 0]} />
              <Bar dataKey="partialIrrigation" name="Partial Irrigation (Optimal)" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fullIrrigation" name="Full Irrigation" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
