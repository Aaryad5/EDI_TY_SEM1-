"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sprout,
  Droplets,
  Radio,
  Eye,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LayerState = {
  boundary: boolean;
  cropZones: boolean;
  soilZones: boolean;
  irrigation: boolean;
  waterSources: boolean;
  sensors: boolean;
  cropHealth: boolean;
};

type SelectedElement = {
  type: "crop" | "soil" | "irrigation" | "sensor" | "water";
  title: string;
  subtitle: string;
  metrics: Record<string, string>;
  status: "optimal" | "warning" | "active";
} | null;

export function DigitalFarmCanvas({
  farmName = "Green Valley Farm",
  area = "5.0 acres",
  currentCrop = "Tomato",
}: {
  farmName?: string;
  area?: string;
  currentCrop?: string;
}) {
  const [layers, setLayers] = React.useState<LayerState>({
    boundary: true,
    cropZones: true,
    soilZones: true,
    irrigation: true,
    waterSources: true,
    sensors: true,
    cropHealth: true,
  });

  const [selected, setSelected] = React.useState<SelectedElement>({
    type: "crop",
    title: `Zone A · ${currentCrop}`,
    subtitle: "High density plot with drip lines",
    metrics: { "NDVI Index": "0.78 (Healthy)", "Canopy Age": "5.5 Weeks", "Yield Forecast": "3.4 t/ha" },
    status: "optimal",
  });

  const toggleLayer = (key: keyof LayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-agri/20 bg-white shadow-lg">
      {/* Canvas Toolbar & Layer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri/10 bg-cream/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-agri" />
          <span className="text-xs font-bold uppercase tracking-wider text-dark">
            2D Digital Farm Model · {farmName} ({area})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant={layers.cropZones ? "primary" : "outline"}
            className="h-7 text-xs px-2.5"
            onClick={() => toggleLayer("cropZones")}
          >
            <Sprout className="mr-1 h-3 w-3" /> Crop Zones
          </Button>
          <Button
            size="sm"
            variant={layers.soilZones ? "primary" : "outline"}
            className="h-7 text-xs px-2.5"
            onClick={() => toggleLayer("soilZones")}
          >
            <Layers className="mr-1 h-3 w-3" /> Soil
          </Button>
          <Button
            size="sm"
            variant={layers.irrigation ? "primary" : "outline"}
            className="h-7 text-xs px-2.5"
            onClick={() => toggleLayer("irrigation")}
          >
            <Droplets className="mr-1 h-3 w-3" /> Irrigation
          </Button>
          <Button
            size="sm"
            variant={layers.sensors ? "primary" : "outline"}
            className="h-7 text-xs px-2.5"
            onClick={() => toggleLayer("sensors")}
          >
            <Radio className="mr-1 h-3 w-3" /> IoT Nodes
          </Button>
          <Button
            size="sm"
            variant={layers.cropHealth ? "secondary" : "outline"}
            className="h-7 text-xs px-2.5"
            onClick={() => toggleLayer("cropHealth")}
          >
            <Eye className="mr-1 h-3 w-3" /> NDVI Health
          </Button>
        </div>
      </div>

      {/* 2D Interactive Graphical Canvas */}
      <div className="relative h-[380px] w-full select-none overflow-hidden bg-[#edf4ee]">
        {/* Grid pattern background */}
        <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
          <defs>
            <pattern id="farm-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2d6a4f" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#farm-grid)" />
        </svg>

        {/* Outer Farm Boundary Polygon */}
        {layers.boundary && (
          <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden>
            <polygon
              points="40,40 540,30 570,330 30,340"
              fill="rgba(82, 183, 136, 0.05)"
              stroke="#2d6a4f"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Coordinate Markers */}
            <circle cx="40" cy="40" r="4" fill="#1b4332" />
            <circle cx="540" cy="30" r="4" fill="#1b4332" />
            <circle cx="570" cy="330" r="4" fill="#1b4332" />
            <circle cx="30" cy="340" r="4" fill="#1b4332" />
          </svg>
        )}

        {/* Soil Zones Layer */}
        {layers.soilZones && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Sector 1: Alluvial */}
            <div className="absolute left-14 top-14 h-64 w-60 rounded-xl bg-amber-900/10 border border-amber-900/20 p-2">
              <span className="text-[10px] font-semibold text-amber-900/70 uppercase">
                Soil Zone 1: Alluvial Loam (pH 6.7)
              </span>
            </div>
            {/* Sector 2: Sandy Loam */}
            <div className="absolute right-14 top-12 h-64 w-60 rounded-xl bg-amber-700/10 border border-amber-700/20 p-2">
              <span className="text-[10px] font-semibold text-amber-900/70 uppercase">
                Soil Zone 2: Clay Loam (pH 6.9)
              </span>
            </div>
          </div>
        )}

        {/* Crop Zones Layer */}
        {layers.cropZones && (
          <div className="absolute inset-0">
            {/* Plot A - Tomato */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                setSelected({
                  type: "crop",
                  title: `Zone A · ${currentCrop}`,
                  subtitle: "High density plot with drip lines",
                  metrics: { "NDVI Index": "0.78 (Healthy)", "Canopy Age": "5.5 Weeks", "Yield Forecast": "3.4 t/ha" },
                  status: "optimal",
                })
              }
              className={`absolute left-16 top-16 h-32 w-56 rounded-lg border-2 p-2.5 transition-all cursor-pointer shadow-sm ${
                layers.cropHealth ? "bg-emerald-600/30 border-emerald-700" : "bg-emerald-500/20 border-agri"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-forest">
                  <Sprout className="h-3.5 w-3.5 text-forest" /> Zone A ({currentCrop})
                </span>
                <Badge variant="success" className="text-[9px] px-1 py-0">
                  {layers.cropHealth ? "NDVI 0.78" : "Active"}
                </Badge>
              </div>
              {/* Crop Rows representation */}
              <div className="mt-2 space-y-1 opacity-70">
                <div className="h-1 w-full rounded bg-forest/40" />
                <div className="h-1 w-full rounded bg-forest/40" />
                <div className="h-1 w-full rounded bg-forest/40" />
                <div className="h-1 w-full rounded bg-forest/40" />
              </div>
              <p className="mt-2 text-[10px] text-dark/70">Area: 2.5 acres · Sown 38d ago</p>
            </motion.div>

            {/* Plot B - Wheat / Intercrop */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                setSelected({
                  type: "crop",
                  title: "Zone B · Rabi Crop Trial",
                  subtitle: "Rotation sector (Legume / Wheat)",
                  metrics: { "NDVI Index": "0.68 (Normal)", "Soil Moisture": "38%", "Expected Yield": "2.8 t/ha" },
                  status: "optimal",
                })
              }
              className={`absolute left-16 top-52 h-24 w-56 rounded-lg border-2 p-2.5 transition-all cursor-pointer shadow-sm ${
                layers.cropHealth ? "bg-lime-500/30 border-lime-700" : "bg-lime-400/20 border-agri"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-forest">
                  <Sprout className="h-3.5 w-3.5 text-forest" /> Zone B (Trial/Wheat)
                </span>
                <Badge variant="secondary" className="text-[9px] px-1 py-0">
                  {layers.cropHealth ? "NDVI 0.68" : "Rotation"}
                </Badge>
              </div>
              <div className="mt-2 space-y-1 opacity-70">
                <div className="h-1 w-full rounded bg-lime-800/40" />
                <div className="h-1 w-full rounded bg-lime-800/40" />
              </div>
              <p className="mt-1 text-[10px] text-dark/70">Area: 1.5 acres · Low tillage</p>
            </motion.div>

            {/* Plot C - Fallow / Nursery */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                setSelected({
                  type: "crop",
                  title: "Zone C · Nursery & Storage",
                  subtitle: "Greenhouse seed starter & buffer",
                  metrics: { "Seedlings": "12,000 units", "Germination": "96%", "Irrigation": "Misting" },
                  status: "optimal",
                })
              }
              className="absolute right-16 top-16 h-60 w-56 rounded-lg border-2 border-dashed border-agri/40 bg-white/60 p-2.5 cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-dark">Zone C (Nursery)</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  Polyhouse
                </Badge>
              </div>
              <p className="mt-2 text-[10px] text-dark/60">Protected nursery seedlings & greenhouse</p>
            </motion.div>
          </div>
        )}

        {/* Irrigation Pipes & Sprinklers Layer */}
        {layers.irrigation && (
          <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden>
            {/* Main supply pipe line */}
            <line x1="285" y1="20" x2="285" y2="320" stroke="#0284c7" strokeWidth="3" strokeDasharray="3 3" />
            {/* Drip lateral branches */}
            <line x1="120" y1="80" x2="285" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="120" y1="120" x2="285" y2="120" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="120" y1="230" x2="285" y2="230" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="285" y1="90" x2="440" y2="90" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="285" y1="180" x2="440" y2="180" stroke="#38bdf8" strokeWidth="1.5" />
          </svg>
        )}

        {/* Water Sources (Borewell / Canal) Layer */}
        {layers.waterSources && (
          <div className="absolute inset-0 pointer-events-auto">
            {/* Borewell Pump #1 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() =>
                setSelected({
                  type: "water",
                  title: "Borewell #1 & Solar Pump",
                  subtitle: "7.5 HP Submersible · 450 ft depth",
                  metrics: { "Discharge Rate": "180 LPM", "Static Level": "62 ft", "Power Source": "Solar Hybrid" },
                  status: "optimal",
                })
              }
              className="absolute left-[272px] top-6 flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white shadow-md cursor-pointer ring-4 ring-sky-200"
              title="Borewell #1"
            >
              <Droplets className="h-4 w-4" />
            </motion.div>

            {/* Farm Pond / Rainwater Reservoir */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                setSelected({
                  type: "water",
                  title: "Rainwater Harvesting Reservoir",
                  subtitle: "Capacity: 120,000 Litres",
                  metrics: { "Current Storage": "82%", "Turbidity": "Low", "Replenishment": "Roof runoff" },
                  status: "optimal",
                })
              }
              className="absolute right-4 bottom-8 flex items-center gap-1.5 rounded-lg border border-sky-300 bg-sky-100/90 px-2 py-1 shadow cursor-pointer"
            >
              <Droplets className="h-3.5 w-3.5 text-sky-700" />
              <span className="text-[10px] font-bold text-sky-900">Reservoir (82%)</span>
            </motion.div>
          </div>
        )}

        {/* IoT Sensor Nodes Layer */}
        {layers.sensors && (
          <div className="absolute inset-0 pointer-events-auto">
            {/* Sensor 1 (Soil probe) */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              onClick={() =>
                setSelected({
                  type: "sensor",
                  title: "IoT Node S-01 (Soil Probe)",
                  subtitle: "Zone A · Depth: 15cm & 30cm",
                  metrics: { "Moisture": "42.1%", "Soil Temp": "24.6°C", "Battery": "94%" },
                  status: "optimal",
                })
              }
              className="absolute left-32 top-28 flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-white shadow-md cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-fresh animate-ping" />
              <span className="text-[9px] font-semibold">S-01 (42%)</span>
            </motion.div>

            {/* Sensor 2 (Weather station) */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              onClick={() =>
                setSelected({
                  type: "sensor",
                  title: "Micro-Weather Station WS-01",
                  subtitle: "Farm Central Mast (3m elevation)",
                  metrics: { "Temperature": "28.4°C", "Humidity": "64%", "Wind Speed": "12 km/h" },
                  status: "optimal",
                })
              }
              className="absolute left-[310px] top-40 flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-white shadow-md cursor-pointer"
            >
              <Radio className="h-2.5 w-2.5 text-lightgreen" />
              <span className="text-[9px] font-semibold">WS-01 (28°C)</span>
            </motion.div>

            {/* Sensor 3 (Smart Valve) */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              onClick={() =>
                setSelected({
                  type: "sensor",
                  title: "Smart Valve V-01 (Drip Line A)",
                  subtitle: "Solenoid actuated · LoRaWAN",
                  metrics: { "State": "Closed", "Schedule": "Tomorrow 06:00 AM", "Line Pressure": "1.8 bar" },
                  status: "optimal",
                })
              }
              className="absolute left-[260px] top-24 flex items-center gap-1 rounded-full bg-sky-700 px-2 py-0.5 text-white shadow-md cursor-pointer"
            >
              <Cpu className="h-2.5 w-2.5 text-sky-200" />
              <span className="text-[9px] font-semibold">Valve A (Auto)</span>
            </motion.div>
          </div>
        )}

        {/* Overhead Weather / Satellite Telemetry Banner */}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-white/40 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
          <CloudSun className="h-4 w-4 text-amber-500" />
          <div className="text-[10px]">
            <p className="font-bold text-dark">28.4°C · 64% Humidity</p>
            <p className="text-dark/50">Wind 12 km/h ESE · IMD Forecast</p>
          </div>
        </div>
      </div>

      {/* Selected Element Telemetry Detail Panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="border-t border-agri/15 bg-cream/50 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-dark text-sm">{selected.title}</span>
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Online & Calibrated
                  </Badge>
                </div>
                <p className="text-xs text-dark/55">{selected.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selected.metrics).map(([key, val]) => (
                  <div key={key} className="rounded-lg border border-agri/10 bg-white px-3 py-1.5 shadow-sm">
                    <p className="text-[10px] text-dark/50">{key}</p>
                    <p className="text-xs font-bold text-forest">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
