"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radio,
  Signal,
  Cpu,
  Layers,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Sprout,
  ArrowRight,
  Activity,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Gauge,
  Wifi,
  Database,
  SlidersHorizontal,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { SmartFarmVisual } from "@/components/brand/smart-farm-visual";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

interface TelemetryMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: "Optimal" | "Good" | "Attention";
  zone: string;
  change: string;
  icon: React.ElementType;
}

const LIVE_SENSORS: TelemetryMetric[] = [
  {
    id: "sm-01",
    name: "Soil Moisture (Zone A)",
    value: "42",
    unit: "%",
    status: "Optimal",
    zone: "Zone A · Silt Loam",
    change: "+1.2% in last 10m",
    icon: Droplets,
  },
  {
    id: "temp-01",
    name: "Canopy Temperature",
    value: "28.4",
    unit: "°C",
    status: "Optimal",
    zone: "Field North",
    change: "-0.3°C vs avg",
    icon: Thermometer,
  },
  {
    id: "ndvi-01",
    name: "Sentinel-2 NDVI",
    value: "0.76",
    unit: "index",
    status: "Good",
    zone: "Full Acreage",
    change: "Healthy vegetative vigor",
    icon: Sprout,
  },
  {
    id: "solar-01",
    name: "Solar Radiation (PAR)",
    value: "840",
    unit: "W/m²",
    status: "Optimal",
    zone: "Weather Mast #1",
    change: "Peak photosynthetic rate",
    icon: Sun,
  },
  {
    id: "wind-01",
    name: "Wind Velocity",
    value: "11.2",
    unit: "km/h",
    status: "Good",
    zone: "Anemometer Node",
    change: "Calm · safe for spraying",
    icon: Wind,
  },
  {
    id: "ph-01",
    name: "Rhizosphere pH",
    value: "6.8",
    unit: "pH",
    status: "Optimal",
    zone: "Zone B · Subsurface",
    change: "Neutral nutrient buffer",
    icon: Layers,
  },
];

const TELEMETRY_NODES = [
  { id: "NODE-A1", label: "LoRaWAN Soil Probe", battery: "94%", signal: "-68 dBm", status: "Active" },
  { id: "NODE-A2", label: "Micro-Weather Station", battery: "88%", signal: "-72 dBm", status: "Active" },
  { id: "NODE-B1", label: "Automated Drip Solenoid", battery: "100%", signal: "-64 dBm", status: "Active" },
  { id: "SAT-S2", label: "Sentinel-2 MSI Orbit", battery: "100%", signal: "Optical 10m", status: "Synced" },
];

export default function LiveTelemetryPage() {
  const { user } = useAuth();
  const [streamRate, setStreamRate] = React.useState<number>(1);
  const [pulse, setPulse] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => (p + 1) % 1000);
    }, 2000 / streamRate);
    return () => clearInterval(timer);
  }, [streamRate]);

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="relative overflow-hidden border-b border-agri/10 bg-gradient-to-b from-fresh/10 via-cream to-cream py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-agri/20 bg-white/80 px-3 py-1 text-xs font-semibold text-agri backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fresh opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-agri" />
                  </span>
                  Real-Time IoT & Satellite Ingestion
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl md:text-5xl">
                  Digital Twin <span className="text-agri">· Live Telemetry</span>
                </h1>
                <p className="text-base text-dark/70 sm:text-lg">
                  Direct telemetry stream bridging in-field LoRaWAN sensors, subsurface soil probes,
                  micro-weather stations, and Sentinel-2 satellite passes into an unified 2D virtual twin.
                </p>
              </div>

              {/* Quick Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg border border-agri/15 bg-white p-1 text-xs font-medium text-dark/70 shadow-sm">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-agri ml-1.5" />
                  <span className="mr-1">Sample Rate:</span>
                  {[1, 5, 10].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setStreamRate(rate)}
                      className={`rounded px-2 py-0.5 transition-colors ${
                        streamRate === rate
                          ? "bg-agri text-white font-semibold"
                          : "hover:bg-agri/10 text-dark/80"
                      }`}
                    >
                      {rate}s
                    </button>
                  ))}
                </div>

                {user ? (
                  <Button asChild variant="primary">
                    <Link href="/digital-twin" className="flex items-center gap-2">
                      Open Farm Digital Twin <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="primary">
                    <Link href="/signup" className="flex items-center gap-2">
                      Connect Your Farm <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Visual & Live Telemetry Stream */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Visual Twin Hero Widget */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                    <Activity className="h-4 w-4 text-agri" />
                    Interactive Farm Twin Visualization
                  </h2>
                  <p className="text-xs text-dark/60">
                    Click any node or layer inside the frame below to highlight active telemetric vectors.
                  </p>
                </div>
                <Badge variant="outline" className="border-agri/30 text-forest bg-white">
                  <Wifi className="h-3 w-3 text-agri mr-1" /> Stream Online
                </Badge>
              </div>

              {/* The Dedicated SmartFarmVisual component */}
              <SmartFarmVisual />

              {/* Live Nodes Table */}
              <div className="mt-6 rounded-2xl border border-agri/15 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-agri/10 pb-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/70 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-agri" /> Field Telemetry Hubs
                  </span>
                  <span className="text-[11px] text-dark/50">4 Active Sources</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TELEMETRY_NODES.map((node) => (
                    <div key={node.id} className="rounded-xl border border-agri/10 bg-cream/40 p-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-dark">{node.id}</span>
                        <span className="text-forest font-medium">{node.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-dark/70 font-medium truncate">{node.label}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-dark/50">
                        <span>Pwr: {node.battery}</span>
                        <span>{node.signal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-agri" />
                  Live Agronomic Gauges
                </h2>
                <span className="text-xs text-dark/50 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin text-agri" /> Auto-refreshing
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {LIVE_SENSORS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Card
                      key={s.id}
                      className="border border-agri/15 bg-white shadow-sm transition-all hover:border-agri/40 hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="rounded-xl bg-fresh/15 p-2.5 text-forest">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-dark/60">{s.name}</p>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-bold tracking-tight text-dark">
                                  {s.value}
                                </span>
                                <span className="text-xs font-medium text-dark/50">{s.unit}</span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-fresh/20 text-forest text-[11px] font-semibold"
                          >
                            {s.status}
                          </Badge>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-agri/10 pt-2 text-[11px]">
                          <span className="text-dark/50">{s.zone}</span>
                          <span className="font-medium text-forest">{s.change}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Data Ingestion Architecture Card */}
              <div className="rounded-2xl border border-agri/20 bg-gradient-to-br from-forest to-dark p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 text-fresh">
                  <Database className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">End-to-End Pipeline</span>
                </div>
                <h3 className="mt-2 text-base font-bold">
                  Zero Latency Edge-to-Cloud Synchronization
                </h3>
                <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                  Telemetry packets transmitted via LoRaWAN 868/915 MHz are decrypted, validated against
                  physiochemical agronomic boundaries, and buffered into our event stream for real-time
                  digital twin rendering.
                </p>
                <div className="mt-4 flex items-center gap-3 pt-2 border-t border-white/10 text-xs">
                  <span className="flex items-center gap-1 text-white/90">
                    <CheckCircle2 className="h-3.5 w-3.5 text-fresh" /> E2E Encrypted
                  </span>
                  <span className="flex items-center gap-1 text-white/90">
                    <CheckCircle2 className="h-3.5 w-3.5 text-fresh" /> 100% Data Ownership
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Telemetry Features Section */}
        <section className="border-t border-agri/10 bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="border-agri/30 text-agri bg-fresh/10 mb-2">
                Capabilities
              </Badge>
              <h2 className="text-2xl font-bold text-dark sm:text-3xl">
                What Powers the AgriVerse Live Telemetry Stream
              </h2>
              <p className="mt-2 text-sm text-dark/70">
                A multi-layered sensor matrix providing sub-second resolution for modern precision agriculture.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-agri/15 bg-cream/30 p-6">
                <div className="rounded-xl bg-agri/10 p-3 text-agri w-fit mb-4">
                  <Signal className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-dark">Sub-surface Soil Matrix</h3>
                <p className="mt-2 text-sm text-dark/70 leading-relaxed">
                  Dual-depth TDR capacitance probes measuring volumetric water content (VWC), electrical
                  conductivity (EC), and soil temperatures at 15cm and 45cm root horizons.
                </p>
              </div>

              <div className="rounded-2xl border border-agri/15 bg-cream/30 p-6">
                <div className="rounded-xl bg-agri/10 p-3 text-agri w-fit mb-4">
                  <Sun className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-dark">Micro-climate Observation</h3>
                <p className="mt-2 text-sm text-dark/70 leading-relaxed">
                  Hyper-local sonic anemometers, vapor pressure deficit (VPD) hygrometers, and pyranometers
                  predicting heat-stress and evaporation rates 48 hours in advance.
                </p>
              </div>

              <div className="rounded-2xl border border-agri/15 bg-cream/30 p-6">
                <div className="rounded-xl bg-agri/10 p-3 text-agri w-fit mb-4">
                  <Radio className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-dark">ESA Sentinel-2 Alignment</h3>
                <p className="mt-2 text-sm text-dark/70 leading-relaxed">
                  5-day revisit multispectral MSI imagery capturing Band 4 (Red) and Band 8 (NIR) at 10m
                  ground sample distance for calibrated NDVI and canopy chlorophyll monitoring.
                </p>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="primary">
                <Link href="/signup" className="flex items-center gap-2">
                  Launch Your Farm's Live Stream Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
