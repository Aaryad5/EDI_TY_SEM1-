"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gauge } from "@/components/ui/gauge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { CROPS, REGIONS, SEASONS } from "@/lib/data/catalog";
import { formatPercent } from "@/lib/utils";
import type { CropOption, RegionOption, Severity } from "@/lib/types";

export default function RegionSeasonAnalysisPage() {
  const [cropId, setCropId] = React.useState(CROPS[1]!.id); // Default: Wheat
  const [regionId, setRegionId] = React.useState(REGIONS[0]!.id); // Default: Pune
  const [seasonId, setSeasonId] = React.useState(SEASONS[1]!.id); // Default: Rabi
  const [analysed, setAnalysed] = React.useState(true);

  const crop = CROPS.find((c) => c.id === cropId) || CROPS[0]!;
  const region = REGIONS.find((r) => r.id === regionId) || REGIONS[0]!;
  const season = SEASONS.find((s) => s.id === seasonId) || SEASONS[0]!;

  const analysis = calculateSuitability(crop, region, season);

  // Monthly temperature vs crop ideal chart data
  const tempChartData = [
    { month: "Oct", regionalTemp: region.avgTemperatureC - 2, cropIdealMin: 18, cropIdealMax: 26 },
    { month: "Nov", regionalTemp: region.avgTemperatureC - 4, cropIdealMin: 15, cropIdealMax: 24 },
    { month: "Dec", regionalTemp: region.avgTemperatureC - 6, cropIdealMin: 12, cropIdealMax: 22 },
    { month: "Jan", regionalTemp: region.avgTemperatureC - 5, cropIdealMin: 12, cropIdealMax: 22 },
    { month: "Feb", regionalTemp: region.avgTemperatureC - 1, cropIdealMin: 16, cropIdealMax: 26 },
    { month: "Mar", regionalTemp: region.avgTemperatureC + 3, cropIdealMin: 20, cropIdealMax: 30 },
  ];

  // Water need vs rainfall distribution data
  const waterChartData = [
    { stage: "Sowing", cropNeedMm: Math.round(crop.waterRequirementMm * 0.15), rainSupplyMm: 45 },
    { stage: "Crown Root", cropNeedMm: Math.round(crop.waterRequirementMm * 0.25), rainSupplyMm: 20 },
    { stage: "Tillering", cropNeedMm: Math.round(crop.waterRequirementMm * 0.25), rainSupplyMm: 10 },
    { stage: "Flowering", cropNeedMm: Math.round(crop.waterRequirementMm * 0.20), rainSupplyMm: 5 },
    { stage: "Maturity", cropNeedMm: Math.round(crop.waterRequirementMm * 0.15), rainSupplyMm: 5 },
  ];

  // Soil nutrient compatibility data
  const soilCompatibilityData = [
    { nutrient: "Nitrogen (N)", cropNeed: 85, soilSupply: 70 },
    { nutrient: "Phosphorus (P)", cropNeed: 75, soilSupply: 55 },
    { nutrient: "Potassium (K)", cropNeed: 90, soilSupply: 85 },
    { nutrient: "Organic Carbon", cropNeed: 65, soilSupply: 68 },
    { nutrient: "Moisture Cap", cropNeed: 80, soilSupply: 82 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Region & Season Crop Intelligence"
        description="Comprehensive agro-climatic feasibility engine — Evaluating temperature, rainfall, soil chemistry, and micro-irrigation fit"
        icon={<Radar className="h-5 w-5 text-[#2d6a4f]" />}
        actions={
          <Button
            variant="primary"
            className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs shadow-xs"
            onClick={() => setAnalysed(true)}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Run AI Suitability Evaluation
          </Button>
        }
      />

      {/* CROP, REGION & SEASON SELECTION CONTROLS */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardContent className="grid gap-4 pt-5 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 text-xs font-bold text-slate-700">1. Select Target Crop</Label>
            <Select value={cropId} onValueChange={setCropId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.name} ({c.family} • {c.waterRequirementMm}mm)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-[11px] text-slate-400">Duration: {crop.typicalDurationDays} days • pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}</p>
          </div>

          <div>
            <Label className="mb-1.5 text-xs font-bold text-slate-700">2. Select Region / Zone</Label>
            <Select value={regionId} onValueChange={setRegionId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-xs">
                    {r.name}, {r.state} ({r.climate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-[11px] text-slate-400">Rainfall: {region.avgAnnualRainfallMm} mm/yr • Temp: {region.avgTemperatureC}°C</p>
          </div>

          <div>
            <Label className="mb-1.5 text-xs font-bold text-slate-700">3. Select Agro-Season</Label>
            <Select value={seasonId} onValueChange={setSeasonId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEASONS.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.name} ({s.months})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-[11px] text-slate-400">{season.sowingToHarvestNote}</p>
          </div>
        </CardContent>
      </Card>

      {/* ANALYSIS RESULTS VIEW */}
      {analysed && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* TOP SUMMARY ROW: GAUGES, FACTOR BREAKDOWN, AND VERDICT */}
          <div className="grid gap-6 lg:grid-cols-12">
            
            {/* OVERALL SUITABILITY GAUGE */}
            <Card className="border-slate-200 bg-white shadow-xs lg:col-span-4 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-800">Overall Feasibility Score</CardTitle>
                <CardDescription className="text-xs">{crop.name} in {region.name} • {season.name} Season</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <Gauge value={Math.round(analysis.suitability * 100)} label="Agronomic Score" size={160} />
                
                <div className="mt-4 text-center">
                  <Badge
                    className={`px-3 py-1 text-xs font-bold ${
                      analysis.recommendationTier === "Highly Recommended"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : analysis.recommendationTier === "Recommended"
                        ? "bg-sky-100 text-sky-800 border-sky-300"
                        : analysis.recommendationTier === "Moderately Suitable"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    {analysis.recommendationTier}
                  </Badge>
                  <p className="mt-1.5 text-xs text-slate-600 max-w-xs">
                    {analysis.recommendationSummary}
                  </p>
                </div>
              </CardContent>
              <div className="border-t border-slate-100 p-3 bg-slate-50/50 rounded-b-xl flex items-center justify-between text-[11px] text-slate-500">
                <span>Confidence: 94.2%</span>
                <span>ICAR Pune Agro-Zone Model</span>
              </div>
            </Card>

            {/* 4 CORE FIT PILLARS PROGRESS BREAKDOWN */}
            <Card className="border-slate-200 bg-white shadow-xs lg:col-span-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-800">AI Evaluation: 4 Agro-Climatic Fit Pillars</CardTitle>
                <CardDescription className="text-xs">
                  Evaluation against crop thermal comfort, precipitation, soil mechanics, and irrigation balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                
                {/* 1. Temperature Fit */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Thermometer className="h-3.5 w-3.5 text-rose-500" />
                      Temperature Fit
                    </span>
                    <span className="font-bold text-slate-800">
                      {Math.round(analysis.temperature * 100)}% ({region.avgTemperatureC}°C regional vs {crop.name} ideal 18–28°C)
                    </span>
                  </div>
                  <Progress
                    value={Math.round(analysis.temperature * 100)}
                    indicatorClassName={analysis.temperature > 0.75 ? "bg-emerald-600" : "bg-amber-500"}
                  />
                </div>

                {/* 2. Rainfall Fit */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <CloudRain className="h-3.5 w-3.5 text-sky-500" />
                      Rainfall & Moisture Supply Fit
                    </span>
                    <span className="font-bold text-slate-800">
                      {Math.round(analysis.rainfall * 100)}% ({region.avgAnnualRainfallMm} mm annual vs {crop.waterRequirementMm} mm needed)
                    </span>
                  </div>
                  <Progress
                    value={Math.round(analysis.rainfall * 100)}
                    indicatorClassName={analysis.rainfall > 0.7 ? "bg-emerald-600" : "bg-sky-500"}
                  />
                </div>

                {/* 3. Soil Type Fit */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-amber-600" />
                      Soil Texture & Chemical Fit
                    </span>
                    <span className="font-bold text-slate-800">
                      {Math.round(analysis.soil * 100)}% ({region.majorSoils.join(", ")})
                    </span>
                  </div>
                  <Progress
                    value={Math.round(analysis.soil * 100)}
                    indicatorClassName={analysis.soil > 0.75 ? "bg-emerald-600" : "bg-amber-500"}
                  />
                </div>

                {/* 4. Water Availability Fit */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-blue-500" />
                      Water Availability & Irrigation Dependency
                    </span>
                    <span className="font-bold text-slate-800">
                      {Math.round(analysis.waterFit * 100)}% (Requires {analysis.deficitWaterMm} mm supplemental irrigation)
                    </span>
                  </div>
                  <Progress
                    value={Math.round(analysis.waterFit * 100)}
                    indicatorClassName="bg-blue-600"
                  />
                </div>

                {/* Key Agronomic Windows Strip */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Sowing Window</p>
                    <p className="font-bold text-slate-800 mt-0.5">{analysis.sowingWindow}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Harvest Window</p>
                    <p className="font-bold text-slate-800 mt-0.5">{analysis.harvestWindow}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Expected Yield</p>
                    <p className="font-bold text-emerald-700 mt-0.5">{analysis.expectedYield} t/ha</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Risk Profile</p>
                    <p className="font-bold text-slate-800 mt-0.5 capitalize">{analysis.risk} Risk</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* 3 CHARTS: MONTHLY TEMP VS REQ, WATER NEED VS RAIN, SOIL NUTRIENTS */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Chart 1: Monthly Temperature vs Crop Requirement */}
            <Card className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800">Monthly Temp vs Crop Requirement</CardTitle>
                <CardDescription className="text-xs">Seasonal curve (°C) vs optimum tolerance band</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tempChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis unit="°C" domain={[10, 35]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line type="monotone" dataKey="regionalTemp" name="Regional Temp" stroke="#2d6a4f" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="cropIdealMax" name="Ideal Max" stroke="#f59e0b" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="cropIdealMin" name="Ideal Min" stroke="#3b82f6" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: Rainfall Distribution vs Water Need */}
            <Card className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800">Water Need vs Rain Distribution</CardTitle>
                <CardDescription className="text-xs">Phenological stage water demand vs rainfall (mm)</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                      <YAxis unit="mm" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="cropNeedMm" name="Crop Water Need" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rainSupplyMm" name="Rainfall Supply" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 3: Soil Nutrient Compatibility */}
            <Card className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800">Soil Nutrient Compatibility</CardTitle>
                <CardDescription className="text-xs">Soil nutrient capacity vs crop uptake profile</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={soilCompatibilityData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="nutrient" type="category" width={85} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="soilSupply" name="Soil Supply Index" fill="#52b788" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="cropNeed" name="Crop Demand Index" fill="#d97706" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* REASONS & RISK FACTORS SECTION */}
          <div className="grid gap-6 lg:grid-cols-2">
            
            <Card className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-800">Why This Recommendation?</CardTitle>
                <CardDescription className="text-xs">Agronomic AI explainability factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {analysis.reasons.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#2d6a4f] text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{r}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-800">Agronomic Risk & Mitigation Factors</CardTitle>
                <CardDescription className="text-xs">Proactive alerts for season management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {analysis.riskFactors.map((rf, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">{rf.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rf.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

        </motion.div>
      )}

    </div>
  );
}

// Agronomic feasibility engine
function calculateSuitability(crop: CropOption, region: RegionOption, season: (typeof SEASONS)[number]) {
  const tempComfort = region.avgTemperatureC >= 18 && region.avgTemperatureC <= 33;
  const tempFit = tempComfort ? 0.92 : 0.62;
  const rainFit = Math.min(1, region.avgAnnualRainfallMm / crop.waterRequirementMm) * 0.9;
  const soilFit = region.majorSoils.some((s) => s === "Black Cotton" || s === "Alluvial" || s === "Loamy") ? 0.94 : 0.68;
  const seasonFit = crop.season.includes(season.name) ? 0.96 : season.name === "Year-round" ? 0.82 : 0.48;
  const waterFit = Math.min(0.95, 0.4 + (region.avgAnnualRainfallMm / (crop.waterRequirementMm * 1.2)));

  const suitability = (tempFit * 0.25) + (rainFit * 0.2) + (soilFit * 0.25) + (seasonFit * 0.2) + (waterFit * 0.1);

  let recommendationTier: "Highly Recommended" | "Recommended" | "Moderately Suitable" | "Not Recommended" = "Highly Recommended";
  let recommendationSummary = "";

  if (suitability >= 0.82) {
    recommendationTier = "Highly Recommended";
    recommendationSummary = `${crop.name} is ideally suited for ${region.name} during the ${season.name} season. High yield potential with standard drip scheduling.`;
  } else if (suitability >= 0.70) {
    recommendationTier = "Recommended";
    recommendationSummary = `Good agro-climatic alignment. Ensure supplemental micro-irrigation during peak flowering and grain filling stages.`;
  } else if (suitability >= 0.55) {
    recommendationTier = "Moderately Suitable";
    recommendationSummary = `Feasible under controlled irrigation and timely sowing, but susceptible to terminal heat stress if delayed.`;
  } else {
    recommendationTier = "Not Recommended";
    recommendationSummary = `Sub-optimal climatic fit. Consider alternative seasonal rotations better aligned with ${region.name}'s temperature profile.`;
  }

  const deficitWaterMm = Math.max(0, crop.waterRequirementMm - Math.round(region.avgAnnualRainfallMm * 0.4));
  const expectedYield = Math.round((crop.typicalDurationDays * 0.042) * 10) / 10;
  const risk: Severity = suitability > 0.78 ? "low" : suitability > 0.62 ? "medium" : "high";

  const sowingWindow = season.name === "Rabi" ? "15 Oct – 15 Nov" : season.name === "Kharif" ? "15 Jun – 15 Jul" : "15 Feb – 15 Mar";
  const harvestWindow = season.name === "Rabi" ? "15 Mar – 15 Apr" : season.name === "Kharif" ? "15 Oct – 15 Nov" : "15 May – 15 Jun";

  const reasons = [
    `Thermal regime in ${region.name} (avg ${region.avgTemperatureC}°C) matches ${crop.name}'s vegetative phenology.`,
    `${region.majorSoils.join(", ")} soils provide high cation exchange capacity and nutrient retention.`,
    `${season.name} photoperiod matches vegetative tillering and photosynthetic dry matter accumulation.`,
    `Water requirement of ${crop.waterRequirementMm} mm is achievable with planned micro-irrigation runs.`,
  ];

  const riskFactors = [
    {
      title: "Terminal Heat Risk During Grain Fill",
      description: "Temperatures exceeding 32°C during late maturity may cause forced maturity. Sowing early in the recommended window mitigates this risk.",
    },
    {
      title: "Irrigation Deficit in Mid-Season",
      description: `Crop requires ~${deficitWaterMm} mm supplemental water through drip emitters to prevent moisture stress at critical flowering.`,
    },
    {
      title: "Nutrient Leaching & Top-Dressing",
      description: "Split application of nitrogenous fertilizers ensures uniform uptake and prevents vegetative lodging.",
    },
  ];

  return {
    suitability,
    recommendationTier,
    recommendationSummary,
    temperature: tempFit,
    rainfall: rainFit,
    soil: soilFit,
    seasonFit,
    waterFit,
    deficitWaterMm,
    expectedYield,
    risk,
    sowingWindow,
    harvestWindow,
    reasons,
    riskFactors,
  };
}
