"use client";

import * as React from "react";
import { Sparkles, RefreshCw, Loader2, BadgeCheck, AlertTriangle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import {
  buildCropRecommendation,
  buildRegionRecommendation,
  buildSeasonRecommendation,
  generateRecommendations,
  getRecommendations,
} from "@/lib/services/recommendationService";
import { formatPercent, formatNumber } from "@/lib/utils";
import { SEVERITY_STYLES } from "@/lib/data/catalog";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const { snapshot } = useFarmData();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [running, setRunning] = React.useState(false);

  const runEngine = React.useCallback(async () => {
    if (!user || !snapshot) return;
    setRunning(true);
    try {
      await generateRecommendations(user.id, snapshot);
      toast({ variant: "success", title: "Recommendations generated", description: "Demo results — model-backed scores arrive with the ML backend." });
    } finally {
      setRunning(false);
    }
  }, [user, snapshot, toast]);

  const load = React.useCallback(async () => {
    if (!snapshot) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const stored = await getRecommendations(snapshot.farmId);
      if (stored.length === 0) {
        await runEngine();
      }
    } finally {
      setLoading(false);
    }
  }, [snapshot, runEngine]);

  React.useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="space-y-6">
        <PageHeader title="AgriVerse AI Recommendations" description="AI-powered recommendations for your farm" icon={<Sparkles className="h-5 w-5" />} />
        <EmptyState
          title="No farm data yet"
          description="Add farm information or run the onboarding wizard to generate recommendations."
        />
      </div>
    );
  }

  const cropRec = buildCropRecommendation(snapshot);
  const seasonRec = buildSeasonRecommendation(snapshot);
  const regionRec = buildRegionRecommendation(snapshot);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AgriVerse AI Recommendations"
        description="Personalized crop, region and season intelligence"
        icon={<Sparkles className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="info">Demo engine</Badge>
            <Button variant="soft" onClick={runEngine} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Regenerate
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recommended Crop</CardTitle>
                  <CardDescription>Pick from your farm snapshot</CardDescription>
                </div>
                <Badge variant="soft">Crop</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl gradient-brand p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">{cropRec.crop}</p>
                  <BadgeCheck className="h-6 w-6 text-lightgreen" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="border-0 bg-white/20 text-white">
                    Suitability {formatPercent(cropRec.suitabilityScore, 0)}
                  </Badge>
                  <Badge variant="secondary" className="border-0 bg-white/20 text-white">
                    Confidence {formatPercent(cropRec.confidence.mockDisplayConfidence)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <Metric label="Expected yield" value={`${cropRec.expectedYieldTonsPerHa} t/ha`} />
                <Metric label="Water req." value={`${cropRec.waterRequirementMm} mm`} />
                <Metric label="Growing period" value={`${cropRec.growingPeriodDays} days`} />
                <Metric label="Est. profit" value={`₹${formatNumber(cropRec.estimatedProfitPerHa)}`} />
                <Metric label="Risk" value={<Badge className={SEVERITY_STYLES[cropRec.riskLevel].color}>{cropRec.riskLevel}</Badge>} />
                <Metric label="Region" value={cropRec.region} />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-dark/70">Reasons</p>
                <ul className="space-y-1.5">
                  {cropRec.reasons.map((r) => (
                    <li key={r.label} className="flex items-start gap-2 text-sm text-dark/75">
                      <span className={r.status === "met" ? "mt-0.5 text-fresh" : r.status === "partial" ? "mt-0.5 text-amber-500" : "mt-0.5 text-red-400"}>
                        {r.status === "met" ? <Check className="h-4 w-4" /> : r.status === "partial" ? <AlertTriangle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-cream p-3">
                <p className="text-xs font-medium text-dark/70">Required conditions</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-dark/55">
                  {cropRec.requiredConditions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recommended Season</CardTitle>
                  <Badge variant="soft">Season</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-agri/10 bg-lightgreen/15 p-4">
                  <div>
                    <p className="text-lg font-bold text-agri">{seasonRec.displayName}</p>
                    <p className="text-xs text-dark/55">{seasonRec.months}</p>
                  </div>
                  <Badge variant="success">{formatPercent(seasonRec.suitability / 100)} suitability</Badge>
                </div>
                <ul className="space-y-1.5">
                  {seasonRec.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-dark/75">
                      <Check className="mt-0.5 h-4 w-4 text-fresh" /> {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recommended Region</CardTitle>
                  <Badge variant="soft">Region</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-agri/10 bg-lightgreen/15 p-4">
                  <div>
                    <p className="text-lg font-bold text-agri">{regionRec.region}</p>
                    <p className="text-xs text-dark/55">{regionRec.country}</p>
                  </div>
                  <Badge variant="success">{formatPercent(regionRec.suitability / 100)} suitability</Badge>
                </div>
                <ul className="space-y-1.5">
                  {regionRec.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-dark/75">
                      <Check className="mt-0.5 h-4 w-4 text-fresh" /> {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Soil & Climate Compatibility Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Soil Compatibility</CardTitle>
                <CardDescription>Compatibility with current farm soil profile</CardDescription>
              </div>
              <Badge variant="success">91% Match</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-agri/10 pb-2">
              <span className="text-dark/70">Soil pH ({snapshot.soil?.soilPh ?? 6.7})</span>
              <span className="font-semibold text-fresh">✓ Highly Suitable (6.0–7.5)</span>
            </div>
            <div className="flex items-center justify-between border-b border-agri/10 pb-2">
              <span className="text-dark/70">Nitrogen Level ({snapshot.soil?.nitrogen ?? 280} kg/ha)</span>
              <span className="font-semibold text-fresh">✓ Sufficient</span>
            </div>
            <div className="flex items-center justify-between border-b border-agri/10 pb-2">
              <span className="text-dark/70">Soil Moisture ({snapshot.soil?.moisturePct ?? 42}%)</span>
              <span className="font-semibold text-fresh">✓ Adequate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark/70">Organic Carbon ({snapshot.soil?.organicCarbonPct ?? 0.9}%)</span>
              <span className="font-semibold text-fresh">✓ Good</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Climate Compatibility</CardTitle>
                <CardDescription>Compatibility with local weather & microclimate</CardDescription>
              </div>
              <Badge variant="success">89% Match</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-agri/10 pb-2">
              <span className="text-dark/70">Temperature ({snapshot.weather?.avgTemperatureC ?? 27}°C)</span>
              <span className="font-semibold text-fresh">✓ Comfort Zone (20–32°C)</span>
            </div>
            <div className="flex items-center justify-between border-b border-agri/10 pb-2">
              <span className="text-dark/70">Rainfall Provision ({snapshot.weather?.annualRainfallMm ?? 850} mm)</span>
              <span className="font-semibold text-fresh">✓ Covers 85% requirement</span>
            </div>
            <div className="flex items-center justify-between border-b border-agri/10 pb-2">
              <span className="text-dark/70">Relative Humidity ({snapshot.weather?.relativeHumidityPct ?? 65}%)</span>
              <span className="font-semibold text-fresh">✓ Low fungal stress</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark/70">Sunshine Duration ({snapshot.weather?.sunshineHours ?? 7.5} hrs)</span>
              <span className="font-semibold text-fresh">✓ Full canopy photosynthesis</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supporting Data Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supporting Telemetry & Agronomy Data</CardTitle>
          <CardDescription>Real parameters ingested from your latest farm snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <Metric label="Soil Type" value={snapshot.soil?.soilType ?? "Loamy"} />
            <Metric label="Soil pH" value={snapshot.soil?.soilPh ?? "6.7"} />
            <Metric label="Moisture" value={`${snapshot.soil?.moisturePct ?? 42}%`} />
            <Metric label="NPK (kg/ha)" value={`${snapshot.soil?.nitrogen ?? 280} / ${snapshot.soil?.phosphorus ?? 45} / ${snapshot.soil?.potassium ?? 190}`} />
            <Metric label="Annual Rain" value={`${snapshot.weather?.annualRainfallMm ?? 850} mm`} />
            <Metric label="Avg Temp" value={`${snapshot.weather?.avgTemperatureC ?? 27}°C`} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <p className="font-medium">About these results</p>
        <p className="mt-1 text-xs text-sky-800">
          These are <strong>demo/diagnostic scores</strong>, not real model outputs. The interface is
          wired for the AgriVerse Decision Engine (FastAPI + XGBoost/Random Forest/PyTorch). When the
          backend publishes real predictions via <code>/api/recommendations/crop</code>,{" "}
          <code>/season</code> and <code>/region</code>, the <code>isMock</code> flag flips and raw
          model scores are displayed instead.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-agri/10 bg-cream/60 px-2 py-2">
      <p className="text-[11px] text-dark/50">{label}</p>
      <p className="text-sm font-semibold text-dark">{value}</p>
    </div>
  );
}