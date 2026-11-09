"use client";

import * as React from "react";
import { Boxes, Play, Loader2, RefreshCw, TrendingUp, TrendingDown, Waves, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoRow } from "@/components/ui/form-field";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import { SIMULATION_SCENARIOS, runSimulation } from "@/lib/services/digitalTwinService";
import { DigitalFarmCanvas } from "@/components/digital-twin/farm-canvas";
import { BarChart, AreaChart } from "@/components/charts";
import { formatPercent } from "@/lib/utils";
import type { DigitalTwinSimulation, SimulationScenario } from "@/lib/types";

export default function DigitalTwinPage() {
  const { activeFarm } = useAuth();
  const { snapshot } = useFarmData();
  const { toast } = useToast();
  const [scenario, setScenario] = React.useState<SimulationScenario>(SIMULATION_SCENARIOS[0]!);
  const [result, setResult] = React.useState<DigitalTwinSimulation | null>(null);
  const [busy, setBusy] = React.useState(false);

  const run = async () => {
    if (!activeFarm) return;
    setBusy(true);
    try {
      const baselineYield = snapshot?.crop?.expectedYield ?? 3.4;
      const baselineWater = snapshot?.irrigation?.averageWaterUsageLiters ?? 24000;
      const crop = snapshot?.crop?.currentCrop ?? activeFarm.name;
      const res = await runSimulation(scenario, baselineYield, baselineWater, crop);
      setResult(res);
    } catch (err) {
      toast({ variant: "destructive", title: "Simulation failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  // Run automatically on first render once farm is ready
  React.useEffect(() => {
    if (activeFarm && !result) {
      void run();
    }
  }, [activeFarm]);

  if (!activeFarm) {
    return (
      <div className="space-y-6">
        <PageHeader title="Digital Twin" description="What-if simulations on a virtual copy of your farm" icon={<Boxes className="h-5 w-5" />} />
        <Card><CardContent className="pt-6 text-sm text-dark/55">Add a farm first to build its digital twin.</CardContent></Card>
      </div>
    );
  }

  const yieldDelta =
    result && result.baselineYieldTonsPerHa > 0
      ? ((result.simulatedYieldTonsPerHa - result.baselineYieldTonsPerHa) / result.baselineYieldTonsPerHa) * 100
      : 0;
  const waterDelta =
    result && result.baselineWaterUsageLiters > 0
      ? ((result.simulatedWaterUsageLiters - result.baselineWaterUsageLiters) / result.baselineWaterUsageLiters) * 100
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Twin"
        description="A virtual replica of your farm — simulate scenarios before acting"
        icon={<Boxes className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="soft">2D Farm Model Active</Badge>
            <Badge variant="info">FastAPI/ML Simulation Ready</Badge>
          </div>
        }
      />

      {/* 2D Interactive Digital Farm Canvas */}
      <DigitalFarmCanvas
        farmName={activeFarm.name}
        area={`${activeFarm.areaValue} ${activeFarm.areaUnit}`}
        currentCrop={snapshot?.crop?.currentCrop ?? "Tomato"}
      />

      {/* "What-If" Simulation Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-agri" /> "What-If?" Simulation Scenarios
            </CardTitle>
            <CardDescription>
              Test climate & irrigation variations to forecast yield impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {SIMULATION_SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setScenario(s);
                  setResult(null);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  scenario.id === s.id
                    ? "border-agri bg-lightgreen/15 shadow-sm"
                    : "border-agri/10 bg-white hover:bg-cream/60"
                }`}
              >
                <p className="flex items-center justify-between text-sm font-semibold text-dark">
                  {s.label}
                  {scenario.id === s.id && <Badge variant="soft">Selected</Badge>}
                </p>
                <p className="mt-0.5 text-xs text-dark/50">{s.description}</p>
              </button>
            ))}
            <Button className="mt-3 w-full" variant="primary" onClick={run} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Scenario Simulation
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {!result && (
            <Card>
              <CardContent className="grid place-items-center py-14 text-center">
                <RefreshCw className="h-10 w-10 text-agri animate-spin" />
                <p className="mt-3 text-sm text-dark/55">
                  Calculating simulation model for {activeFarm.name}…
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Simulation Result — {scenario.label}</CardTitle>
                    <CardDescription>Comparison against baseline conditions</CardDescription>
                  </div>
                  <Badge variant="outline">{scenario.label}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-agri/10 bg-cream/60 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-dark/50">Projected yield</p>
                        {yieldDelta >= 0 ? <TrendingUp className="h-4 w-4 text-fresh" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
                      </div>
                      <p className="mt-1 text-2xl font-bold text-dark">
                        {result.simulatedYieldTonsPerHa} <span className="text-sm font-medium text-dark/50">t/ha</span>
                      </p>
                      <p className="mt-1 text-xs text-dark/55">
                        Baseline {result.baselineYieldTonsPerHa} t/ha ·{" "}
                        <span className={yieldDelta >= 0 ? "font-semibold text-fresh" : "font-semibold text-red-500"}>
                          {formatPercent(Math.abs(yieldDelta) / 100)}
                        </span>{" "}
                        {yieldDelta >= 0 ? "gain" : "loss"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-agri/10 bg-cream/60 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-dark/50">Water usage</p>
                        <Waves className="h-4 w-4 text-sky-500" />
                      </div>
                      <p className="mt-1 text-2xl font-bold text-dark">
                        {(result.simulatedWaterUsageLiters / 1000).toFixed(1)} <span className="text-sm font-medium text-dark/50">KL</span>
                      </p>
                      <p className="mt-1 text-xs text-dark/55">
                        Baseline {(result.baselineWaterUsageLiters / 1000).toFixed(1)} KL ·{" "}
                        <span className={waterDelta <= 0 ? "font-semibold text-fresh" : "font-semibold text-amber-500"}>
                          {formatPercent(Math.abs(waterDelta) / 100)}
                        </span>{" "}
                        {waterDelta <= 0 ? "saving" : "increase"}
                      </p>
                    </div>
                  </div>

                  {/* Comparative Visual Chart */}
                  <div className="mt-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dark/50">
                      Baseline vs Simulated Forecast
                    </p>
                    <BarChart
                      data={[
                        { metric: "Yield (t/ha)", Baseline: result.baselineYieldTonsPerHa, Simulated: result.simulatedYieldTonsPerHa },
                        { metric: "Water (KL/cycle)", Baseline: Math.round(result.baselineWaterUsageLiters / 1000), Simulated: Math.round(result.simulatedWaterUsageLiters / 1000) },
                      ]}
                      xKey="metric"
                      series={[
                        { key: "Baseline", name: "Baseline", color: "#8b5e3c" },
                        { key: "Simulated", name: "Simulated", color: "#52b788" },
                      ]}
                      height={180}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <InfoRow label="Water stress index" value={<Badge variant={result.waterStressIndex >= 40 ? "destructive" : result.waterStressIndex >= 15 ? "warning" : "success"}>{result.waterStressIndex}</Badge>} />
                    <InfoRow label="Crop health impact" value={`${result.cropHealthImpact >= 0 ? "+" : ""}${result.cropHealthImpact} pts`} />
                    <InfoRow label="QA per area" value={<Activity className="h-4 w-4 text-agri" />} />
                  </div>

                  <div className="mt-5 rounded-lg bg-cream p-4">
                    <p className="mb-2 text-xs font-semibold text-dark/70">Simulation notes</p>
                    <ul className="space-y-1.5">
                      {result.notes.map((n) => (
                        <li key={n} className="flex items-start gap-2 text-xs text-dark/60">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agri" /> {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}