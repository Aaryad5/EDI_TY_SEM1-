"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CloudSun,
  Droplets,
  Layers,
  Sprout,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  Sliders,
  Wind,
  Thermometer,
  CloudRain,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Binary,
  Cpu,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { farmService } from "@/lib/services/farmService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Farm, AgentResult } from "@/lib/types";

// Forecast data for Recharts
const FORECAST_5_DAYS = [
  { day: "Tue", date: "22 Sep", temp: 28, maxTemp: 33, minTemp: 21, rain: 0.4, humidity: 72, icon: CloudSun },
  { day: "Wed", date: "23 Sep", temp: 29, maxTemp: 34, minTemp: 22, rain: 0.0, humidity: 68, icon: CloudSun },
  { day: "Thu", date: "24 Sep", temp: 27, maxTemp: 31, minTemp: 20, rain: 12.5, humidity: 82, icon: CloudRain },
  { day: "Fri", date: "25 Sep", temp: 26, maxTemp: 30, minTemp: 20, rain: 6.2, humidity: 79, icon: CloudRain },
  { day: "Sat", date: "26 Sep", temp: 28, maxTemp: 32, minTemp: 21, rain: 1.0, humidity: 70, icon: CloudSun },
];

export default function FarmIntelligenceAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const farmId = (params?.farmId as string) || "farm_001";

  const { activeFarm, farms } = useAuth();
  const { snapshot } = useFarmData();

  const [farm, setFarm] = React.useState<Farm | null>(null);
  const [dateRange, setDateRange] = React.useState<"5d" | "7d" | "30d" | "custom">("5d");
  const [activeAgentModal, setActiveAgentModal] = React.useState<AgentResult | null>(null);

  // Load farm by ID
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

  const currentCrop = farm?.currentCrop || snapshot?.crop?.currentCrop || "Wheat";
  const locationText = farm ? `${farm.district || "Pune"}, ${farm.state || "Maharashtra"}` : "Pune, Maharashtra";

  // Six AI Agents definition
  const AI_AGENTS: AgentResult[] = [
    {
      id: "agent-weather",
      name: "Weather Agent",
      category: "weather",
      status: "optimal",
      risk: "Low",
      finding: "Temperature normal · 28°C",
      recommendation: "No weather intervention required. Light rain (12mm) anticipated on Thursday.",
      confidence: 94,
      details: {
        "Vapor Pressure Deficit": "1.2 kPa (Optimal)",
        "Consecutive Dry Days": "4 days",
        "Forecast Confidence": "96% (Open-Meteo IMD Blend)",
      },
    },
    {
      id: "agent-crop",
      name: "Crop Agent",
      category: "crop",
      status: "good",
      stage: "Vegetative",
      growth: "Normal",
      risk: "Medium",
      finding: "Vegetative vigor healthy; canopy leaf area index (LAI) expanding at target rate.",
      recommendation: "Maintain vegetative nitrogen supply. Monitor border rows.",
      confidence: 89,
      details: {
        "Canopy NDVI": "0.76 (Sentinel-2 MSI)",
        "Crop Age": "5 Weeks",
        "Biomass Rate": "+4.2% week-over-week",
      },
    },
    {
      id: "agent-soil",
      name: "Soil Agent",
      category: "soil",
      status: "attention",
      risk: "Medium",
      finding: "Soil Moisture: 18% (Low in Rootzone) · Nutrients: Adequate (N: 280 kg, P: 45 kg)",
      recommendation: "Monitor moisture. Subsurface root depletion detected in Zone B.",
      confidence: 92,
      details: {
        "Field Capacity": "38% Volumetric",
        "Permanent Wilting Point": "14%",
        "Salinity EC": "0.8 dS/m (Safe)",
      },
    },
    {
      id: "agent-irrigation",
      name: "Irrigation Agent",
      category: "irrigation",
      status: "attention",
      risk: "Medium",
      finding: "Low soil moisture (18%) and active vegetative stage require partial irrigation.",
      recommendation: "Partial Irrigation recommended: 1,200 Liters via drip line over 45 minutes.",
      confidence: 95,
      details: {
        "Daily Evapotranspiration (ETc)": "4.1 mm/day",
        "Drip Line Pressure": "1.8 bar",
        "Water Savings vs Flood": "+42%",
      },
    },
    {
      id: "agent-pest",
      name: "Pest/Disease Agent",
      category: "pest",
      status: "optimal",
      risk: "Low",
      finding: "Aphid incidence minimal (< 2%). No active fungal or blight sporulation detected.",
      recommendation: "Monitor crop closely. Maintain neem bio-spray perimeter.",
      confidence: 88,
      details: {
        "Computer Vision Confidence": "91.8%",
        "Pathogen Risk Score": "0.14 / 1.0",
        "Leaf Chlorophyll Index": "Healthy",
      },
    },
    {
      id: "agent-market",
      name: "Market Agent",
      category: "market",
      status: "good",
      currentPrice: "₹2,120/q",
      trend: "Stable",
      risk: "Low",
      finding: `Current Price: ₹2,120/q · Trend: Stable · High local mandi arrivals expected next month.`,
      recommendation: "Hold harvested inventory for November selling window (+6% anticipated).",
      confidence: 85,
      details: {
        "Pune APMC Benchmark": "₹2,120/q",
        "Historical 5-Yr Average": "₹1,980/q",
        "Buyer Demand Index": "7.8 / 10",
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* SCREEN 4 TITLE & TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-agri/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri">
            <BrainCircuit className="h-4 w-4" />
            AI Intelligence Hub · {farm?.name || "Farm 01"}
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Farm Analysis</h1>
          <p className="text-sm text-dark/60">
            Real-time data and AI insights for your farm.
          </p>
        </div>

        {/* Top-Right: Location & Date Range Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-agri/20 bg-white px-3.5 py-1.5 text-xs font-bold text-dark shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-agri" />
            <span>Location: {locationText}</span>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center rounded-lg border border-agri/15 bg-white p-1 text-xs font-medium shadow-sm">
            {(
              [
                { key: "5d", label: "Last 5 Days" },
                { key: "7d", label: "Last 7 Days" },
                { key: "30d", label: "Last 30 Days" },
                { key: "custom", label: "Custom" },
              ] as const
            ).map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setDateRange(r.key)}
                className={`rounded px-2.5 py-1 transition-colors ${
                  dateRange === r.key
                    ? "bg-agri text-white font-bold"
                    : "text-dark/70 hover:bg-agri/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WEATHER SUMMARY (4 Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-dark/70 flex items-center gap-1.5">
            <CloudSun className="h-4 w-4 text-agri" />
            WEATHER SUMMARY
          </h2>
          <span className="text-xs text-dark/50">Updated 10m ago · Open-Meteo IMD Synced</span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Temperature */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-dark/50">Temperature</p>
                  <p className="text-3xl font-black text-dark mt-1">28°C</p>
                  <p className="text-[11px] text-forest font-medium mt-1">High 33°C · Low 21°C</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                  <Thermometer className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Humidity */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-dark/50">Humidity</p>
                  <p className="text-3xl font-black text-dark mt-1">72%</p>
                  <p className="text-[11px] text-forest font-medium mt-1">Comfortable relative index</p>
                </div>
                <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
                  <Droplets className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rainfall */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-dark/50">Rainfall</p>
                  <p className="text-3xl font-black text-dark mt-1">0.4 mm</p>
                  <p className="text-[11px] text-forest font-medium mt-1">Today · 12mm rain on Thu</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <CloudRain className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wind Speed */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-dark/50">Wind Speed</p>
                  <p className="text-3xl font-black text-dark mt-1">8 km/h</p>
                  <p className="text-[11px] text-forest font-medium mt-1">Light breeze · Safe spray window</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <Wind className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WEATHER FORECAST: 5 Days Cards + Recharts */}
        <div className="rounded-3xl border border-agri/15 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-agri/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-dark">WEATHER FORECAST (Next 5 Days)</h3>
              <p className="text-xs text-dark/60">Hyper-local temperature curves and precipitation volume</p>
            </div>
            <Badge variant="outline" className="border-agri/20 text-forest text-xs bg-cream">
              IMD 10-Day Ensemble
            </Badge>
          </div>

          {/* 5-Day Mini Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {FORECAST_5_DAYS.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.day}
                  className="rounded-2xl border border-agri/10 bg-cream/30 p-3.5 text-center space-y-2 hover:bg-cream/60 transition-colors"
                >
                  <span className="text-xs font-bold text-dark/70 block">{f.day} · {f.date}</span>
                  <Icon className="mx-auto h-7 w-7 text-agri" />
                  <p className="text-lg font-black text-dark">{f.temp}°C</p>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-dark/50">
                    <CloudRain className="h-3 w-3 text-blue-500" />
                    <span>{f.rain} mm</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Forecast Charts (Recharts) */}
          <div className="grid gap-6 lg:grid-cols-2 pt-2">
            {/* Temperature Graph */}
            <div className="rounded-2xl border border-agri/10 bg-cream/20 p-4">
              <span className="text-xs font-bold text-dark/70 block mb-2">
                Temperature Trend (°C)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FORECAST_5_DAYS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis domain={[18, 36]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="temp" stroke="#2d6a4f" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rainfall Graph */}
            <div className="rounded-2xl border border-agri/10 bg-cream/20 p-4">
              <span className="text-xs font-bold text-dark/70 block mb-2">
                Projected Rainfall (mm)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FORECAST_5_DAYS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 16]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOIL INFORMATION (Visual Gauges) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-dark/70 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-agri" />
            SOIL INFORMATION
          </h2>
          <span className="text-xs text-dark/50">Subsurface Depth 0-40cm</span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Moisture */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e4dc"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeDasharray="18, 100"
                  />
                </svg>
                <span className="absolute text-xl font-black text-dark">18%</span>
              </div>
              <h3 className="mt-2 text-xs font-bold text-dark">Soil Moisture</h3>
              <Badge variant="secondary" className="mt-1 bg-amber-100 text-amber-800 text-[10px]">
                Low · Irrigation Due
              </Badge>
            </CardContent>
          </Card>

          {/* pH */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e4dc"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2d6a4f"
                    strokeWidth="3.5"
                    strokeDasharray="68, 100"
                  />
                </svg>
                <span className="absolute text-xl font-black text-dark">6.8</span>
              </div>
              <h3 className="mt-2 text-xs font-bold text-dark">Soil pH</h3>
              <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-800 text-[10px]">
                Optimal Buffer
              </Badge>
            </CardContent>
          </Card>

          {/* Nitrogen */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e4dc"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#52b788"
                    strokeWidth="3.5"
                    strokeDasharray="75, 100"
                  />
                </svg>
                <span className="absolute text-lg font-black text-dark">280</span>
              </div>
              <h3 className="mt-2 text-xs font-bold text-dark">Nitrogen (kg/ha)</h3>
              <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-800 text-[10px]">
                Adequate
              </Badge>
            </CardContent>
          </Card>

          {/* Organic Carbon */}
          <Card className="border border-agri/15 bg-white shadow-sm">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e4dc"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2d6a4f"
                    strokeWidth="3.5"
                    strokeDasharray="85, 100"
                  />
                </svg>
                <span className="absolute text-xl font-black text-dark">0.85%</span>
              </div>
              <h3 className="mt-2 text-xs font-bold text-dark">Organic Carbon</h3>
              <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-800 text-[10px]">
                Good
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI AGENTS (Six Cards) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-dark/70 flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-agri" />
              AI AGENTS (Autonomous Field Intelligence)
            </h2>
            <p className="text-xs text-dark/60">
              Six specialized agronomic AI agents continuously analyzing multi-spectral and telemetry feeds.
            </p>
          </div>
          <Badge className="bg-forest text-white text-xs w-fit">
            6 Agents Online
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_AGENTS.map((agent) => (
            <Card
              key={agent.id}
              className="border border-agri/15 bg-white shadow-sm hover:border-agri/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-agri">
                      {agent.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold ${
                          agent.risk === "Low"
                            ? "bg-emerald-100 text-emerald-800"
                            : agent.risk === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        Risk: {agent.risk}
                      </Badge>
                      <span className="text-[11px] text-dark/50">
                        {agent.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fresh opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-agri" />
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-dark/50 block">Current Finding:</span>
                    <p className="text-dark font-medium mt-0.5 leading-relaxed">{agent.finding}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-dark/50 block">Recommendation:</span>
                    <p className="text-forest font-semibold mt-0.5 leading-relaxed">{agent.recommendation}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-agri/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveAgentModal(agent)}
                    className="w-full justify-between text-xs hover:bg-cream"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-3.5 w-3.5 text-agri" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AGRIverse DECISION ORCHESTRATOR VISUAL ARCHITECTURE */}
      <section className="rounded-3xl border border-agri/20 bg-gradient-to-br from-forest to-dark p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-lightgreen text-xs font-bold uppercase tracking-wider">
              <Cpu className="h-4 w-4" />
              Multi-Agent Synthesis
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              AgriVerse Decision Orchestrator
            </h3>
          </div>
          <Badge variant="outline" className="border-white/30 text-lightgreen bg-white/10">
            Real-Time Inference Loop
          </Badge>
        </div>

        {/* Orchestrator Diagram */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 text-center text-xs">
          {["Weather Agent 🌦", "Soil Agent 🌍", "Crop Agent 🌱", "Irrigation Agent 💧", "Pest Agent 🐛", "Market Agent 💰"].map((name, i) => (
            <div key={i} className="rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur">
              <span className="font-semibold text-white/90">{name}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-xs font-mono text-lightgreen">
          ↓ Telemetry & Weight Vectors ↓
        </div>

        <div className="rounded-2xl border border-lightgreen/40 bg-white/10 p-4 text-center backdrop-blur shadow-inner">
          <span className="text-xs font-black uppercase tracking-widest text-lightgreen block">
            AGRIverse DECISION ORCHESTRATOR (Core ML Synthesis)
          </span>
          <p className="mt-1 text-xs text-white/80 max-w-xl mx-auto">
            Aggregates physical rhizosphere thresholds, meteorological risk probabilities, and APMC economic indicators to construct optimal daily farming directives.
          </p>
        </div>

        <div className="text-center text-xs font-mono text-lightgreen">
          ↓ Final Harmonized Directive ↓
        </div>
      </section>

      {/* HIGHLIGHTED AI RECOMMENDATION CARD */}
      <section className="rounded-3xl border-2 border-agri bg-fresh/15 p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-xs font-bold text-white shadow-sm">
              <Sprout className="h-3.5 w-3.5 text-lightgreen" />
              🌱 AI RECOMMENDATION
            </div>
            <h2 className="text-3xl font-black text-forest">
              PARTIAL IRRIGATION
            </h2>
            <p className="text-base text-dark/80 max-w-2xl leading-relaxed">
              "Based on current weather, soil moisture and crop growth stage, partial irrigation is recommended."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setActiveAgentModal(AI_AGENTS[3]!)}
              className="border-agri/30 text-forest bg-white hover:bg-cream"
            >
              View Details
            </Button>
            <Button
              asChild
              variant="primary"
              size="lg"
              className="shadow-md font-bold"
            >
              <Link href={`/farms/${farmId}/simulation`} className="flex items-center gap-2">
                Run What-If Simulation <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Supporting metrics bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-agri/20 pt-4 text-xs">
          <div>
            <span className="text-dark/50 block">Target Water Volume:</span>
            <span className="text-base font-bold text-dark">1,200 Liters (Drip)</span>
          </div>
          <div>
            <span className="text-dark/50 block">Projected Yield Impact:</span>
            <span className="text-base font-bold text-forest">+0.5 tons/acre</span>
          </div>
          <div>
            <span className="text-dark/50 block">Action Window:</span>
            <span className="text-base font-bold text-dark">Next 24 Hours</span>
          </div>
          <div>
            <span className="text-dark/50 block">Model Confidence:</span>
            <span className="text-base font-bold text-agri">95% (High)</span>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="rounded-xl border border-agri/20 bg-white/70 p-3 text-[11px] text-dark/60 flex items-start gap-2">
          <Info className="h-4 w-4 text-agri shrink-0 mt-0.5" />
          <span>
            <strong>Demonstration Prototype Note:</strong> These recommendations are synthesized from mock sensor telemetry and agricultural rule-bases. Always cross-reference with local Krishi Vigyan Kendra advisories prior to field chemical or irrigation execution.
          </span>
        </div>
      </section>

      {/* Agent Details Dialog */}
      {activeAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-agri/20 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-agri/10 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-agri">
                  Agent Telemetry Inspection
                </span>
                <h3 className="text-xl font-bold text-dark mt-0.5">{activeAgentModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveAgentModal(null)}
                className="rounded-lg p-1 text-dark/40 hover:bg-cream hover:text-dark"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-agri/10 bg-cream/30 p-3">
                <span className="font-bold text-dark/50 block">Direct Finding:</span>
                <p className="text-sm font-semibold text-dark mt-1">{activeAgentModal.finding}</p>
              </div>

              <div className="rounded-xl border border-agri/10 bg-fresh/15 p-3">
                <span className="font-bold text-forest block">Prescribed Action:</span>
                <p className="text-sm font-semibold text-forest mt-1">{activeAgentModal.recommendation}</p>
              </div>

              {activeAgentModal.details && (
                <div className="space-y-1.5 pt-2">
                  <span className="font-bold text-dark/60 uppercase tracking-wider text-[11px] block">
                    Telemetry Input Parameters:
                  </span>
                  <div className="rounded-xl border border-agri/10 bg-white p-3 space-y-2">
                    {Object.entries(activeAgentModal.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-agri/5 pb-1">
                        <span className="text-dark/60">{key}</span>
                        <span className="font-bold text-dark">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setActiveAgentModal(null)} variant="primary">
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
