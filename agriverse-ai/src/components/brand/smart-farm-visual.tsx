"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Radio,
  CloudSun,
  Activity,
  Layers,
  Sprout,
  Droplets,
  Cpu,
  CheckCircle2,
  Signal,
  Wind,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SmartFarmVisual() {
  const [activeZone, setActiveZone] = React.useState<"crop" | "soil" | "weather" | "iot" | "satellite">("crop");

  return (
    <div className="relative mx-auto w-full max-w-xl select-none">
      {/* Glow background */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-fresh/20 via-agri/15 to-transparent blur-2xl" />

      {/* Main glass frame */}
      <div className="relative overflow-hidden rounded-3xl border border-agri/20 bg-white/90 p-5 shadow-2xl backdrop-blur-md">
        {/* Header telemetry strip */}
        <div className="flex items-center justify-between border-b border-agri/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fresh opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-agri" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-dark/70">
              Digital Twin · Live Telemetry
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-agri/20 bg-fresh/10 text-[11px] text-forest">
              <Signal className="mr-1 h-3 w-3 text-agri" /> 8 Sensors Online
            </Badge>
            <Badge variant="secondary" className="bg-forest text-[11px] text-white">
              Sentinel-2 Synced
            </Badge>
          </div>
        </div>

        {/* Visual Canvas Area */}
        <div className="relative mt-4 h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50/70 via-cream to-[#f1ede2] p-4">
          {/* Animated Sky / Satellite Layer */}
          <div className="absolute left-0 right-0 top-0 h-28 px-4">
            {/* Satellite */}
            <motion.div
              animate={{
                x: [0, 40, 0],
                y: [0, -4, 0],
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute left-8 top-3 flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-2.5 py-1 shadow-sm backdrop-blur"
            >
              <Radio className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
              <span className="text-[10px] font-semibold text-sky-900">Satellite Sentinel-2 (NDVI 0.74)</span>
            </motion.div>

            {/* Orbit beam line */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <line
                x1="120"
                y1="32"
                x2="280"
                y2="180"
                stroke="#52b788"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
              <line
                x1="120"
                y1="32"
                x2="150"
                y2="210"
                stroke="#52b788"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-30"
              />
            </svg>

            {/* Weather node */}
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute right-6 top-3 flex items-center gap-2 rounded-xl border border-sky-100 bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur"
            >
              <CloudSun className="h-4 w-4 text-amber-500" />
              <div className="text-[10px]">
                <p className="font-bold text-dark">28.4°C · 64% RH</p>
                <p className="text-dark/50">Rain in 48h (12mm)</p>
              </div>
            </motion.div>
          </div>

          {/* Central Farmland Isometric / Perspective Fields */}
          <div className="absolute inset-x-4 bottom-20 top-20 rounded-xl border border-agri/15 bg-gradient-to-br from-green-500/10 via-emerald-600/15 to-lime-600/10 p-3 shadow-inner">
            {/* Field Grid Rows */}
            <div className="grid h-full grid-cols-3 gap-2">
              {/* Zone A: Crop Plot */}
              <div
                onClick={() => setActiveZone("crop")}
                className={`relative flex flex-col justify-between rounded-lg border p-2.5 transition-all cursor-pointer ${
                  activeZone === "crop"
                    ? "border-agri bg-white/90 shadow-md ring-2 ring-agri/20"
                    : "border-agri/15 bg-white/60 hover:bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-forest">
                    <Sprout className="h-3.5 w-3.5 text-fresh" /> Zone A: Tomato
                  </span>
                  <span className="h-2 w-2 rounded-full bg-fresh" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-dark/70">
                    <span>Crop Health</span>
                    <span className="font-semibold text-forest">94% (Good)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-agri/10">
                    <motion.div
                      className="h-full bg-fresh"
                      initial={{ width: "0%" }}
                      animate={{ width: "94%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                {/* Crop row indicators */}
                <div className="flex justify-between px-1 text-[9px] text-dark/40">
                  <span>Age: 5 wks</span>
                  <span>Yield: 3.4 t/ha</span>
                </div>
              </div>

              {/* Zone B: AI Central Core & IoT Sensors */}
              <div
                onClick={() => setActiveZone("iot")}
                className={`relative flex flex-col justify-between rounded-lg border p-2.5 transition-all cursor-pointer ${
                  activeZone === "iot"
                    ? "border-agri bg-forest text-white shadow-md ring-2 ring-agri/20"
                    : "border-agri/15 bg-forest/90 text-white hover:bg-forest"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-lightgreen">
                    <Cpu className="h-3.5 w-3.5 text-lightgreen" /> AI Core
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lightgreen opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lightgreen" />
                  </span>
                </div>
                <div className="text-center py-1">
                  <p className="text-[10px] text-white/70">AgriVerse Decision Engine</p>
                  <p className="text-sm font-extrabold text-white">92% Match</p>
                </div>
                <div className="flex items-center justify-between rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/80">
                  <span>Recommendation</span>
                  <span className="font-semibold text-lightgreen">Optimal</span>
                </div>
              </div>

              {/* Zone C: Irrigation & Water Plot */}
              <div
                onClick={() => setActiveZone("soil")}
                className={`relative flex flex-col justify-between rounded-lg border p-2.5 transition-all cursor-pointer ${
                  activeZone === "soil"
                    ? "border-agri bg-white/90 shadow-md ring-2 ring-agri/20"
                    : "border-agri/15 bg-white/60 hover:bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-dark">
                    <Droplets className="h-3.5 w-3.5 text-sky-500" /> Drip Sector
                  </span>
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-dark/70">
                    <span>Soil Moisture</span>
                    <span className="font-semibold text-sky-700">42% (Adequate)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-sky-100">
                    <motion.div
                      className="h-full bg-sky-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "42%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between px-1 text-[9px] text-dark/40">
                  <span>Valve: Auto</span>
                  <span>Next: 2 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subterranean Soil Cross-Section Layer */}
          <div className="absolute inset-x-4 bottom-2 h-16 rounded-xl border border-earth/20 bg-gradient-to-r from-[#d9beaa]/80 via-[#c9a68f]/90 to-[#b58d71]/80 px-3 py-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold text-earth">
                <Layers className="h-3 w-3 text-earth" /> Subsurface Soil Layer (0–40 cm)
              </span>
              <span className="text-[10px] font-medium text-dark/60">pH 6.7 · Neutral</span>
            </div>
            <div className="mt-1.5 grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="rounded bg-white/50 px-1 py-0.5">
                <span className="text-dark/50">N: </span>
                <span className="font-bold text-dark">280 kg</span>
              </div>
              <div className="rounded bg-white/50 px-1 py-0.5">
                <span className="text-dark/50">P: </span>
                <span className="font-bold text-dark">45 kg</span>
              </div>
              <div className="rounded bg-white/50 px-1 py-0.5">
                <span className="text-dark/50">K: </span>
                <span className="font-bold text-dark">190 kg</span>
              </div>
              <div className="rounded bg-white/50 px-1 py-0.5">
                <span className="text-dark/50">OC: </span>
                <span className="font-bold text-dark">0.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live bottom metrics row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-agri/10 bg-cream/70 p-2.5 text-center">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-dark/45">Recommended Crop</p>
            <p className="mt-0.5 text-sm font-bold text-forest">Tomato (Arka Rakshak)</p>
          </div>
          <div className="rounded-xl border border-agri/10 bg-cream/70 p-2.5 text-center">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-dark/45">Suitability Fit</p>
            <p className="mt-0.5 text-sm font-bold text-fresh">92% Match</p>
          </div>
          <div className="rounded-xl border border-agri/10 bg-cream/70 p-2.5 text-center">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-dark/45">Digital Twin Status</p>
            <p className="mt-0.5 text-sm font-bold text-agri">Calibrated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
