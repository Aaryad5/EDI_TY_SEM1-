"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  ClipboardList,
  BrainCircuit,
  Sliders,
  ArrowRight,
  CheckCircle2,
  Layers,
  CloudSun,
  Sprout,
  Droplets,
  ShieldAlert,
  History,
  Sparkles,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

const STEPS = [
  {
    step: "01",
    title: "Draw or Search Your Farm Boundary",
    tagline: "GIS Spatial Ground Truth",
    desc: "Use our interactive satellite map to locate your village and draw the exact boundary of your plot. AgriVerse AI automatically calculates area in acres or hectares and pins your geographic coordinates.",
    icon: MapPin,
    details: [
      "Satellite polygon drawing tool with snapping points",
      "Automatic latitude/longitude centroid calculation",
      "Pre-loaded Indian district administrative boundaries",
      "Automatic SoilGrids & elevation contour linkage",
    ],
    badge: "1 Minute",
  },
  {
    step: "02",
    title: "Record or Stream Farm Data",
    tagline: "Soil, Weather, Crops & Irrigation",
    desc: "Enter your soil test values (pH, NPK, organic carbon) or use automated regional averages. AgriVerse pulls hyper-local weather directly from Open-Meteo & IMD, and lets you track current sowing and irrigation methods.",
    icon: ClipboardList,
    details: [
      "Manual entry or automated GIS soil profile fetching",
      "Real-time 7-day weather forecast ingestion",
      "Crop photo upload for computer-vision disease diagnosis",
      "Supports optional wireless LoRaWAN soil moisture probes",
    ],
    badge: "2 Minutes",
  },
  {
    step: "03",
    title: "Autonomous Multi-Agent AI Analysis",
    tagline: "Explainable Machine Learning Insights",
    desc: "Our ensemble of specialized AI models evaluates your farm conditions simultaneously. They compute crop suitability scores, water requirements, disease vulnerabilities, and market timing.",
    icon: BrainCircuit,
    details: [
      "Soil Compatibility gauge with chemical factor breakdown",
      "Climate & precipitation curve alignment scoring",
      "Water deficit & drip irrigation runtime recommendations",
      "Direct profit potential estimation vs regional mandi trends",
    ],
    badge: "Instant",
  },
  {
    step: "04",
    title: "Simulate 'What-If' Scenarios & Track",
    tagline: "Living Digital Twin & Audit Timeline",
    desc: "Put decisions to the test in the Digital Twin. Simulate what happens if rainfall decreases by 20% or temperatures spike. Every update saves an immutable history snapshot for season-over-season comparison.",
    icon: Sliders,
    details: [
      "Interactive 2D digital twin visual representation",
      "Hypothetical weather and irrigation stress testing",
      "Append-only timeline tracking with side-by-side comparison",
      "Exportable farm audit reports in PDF format",
    ],
    badge: "Continuous",
  },
];

export default function HowItWorksPage() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = React.useState<number>(0);

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-agri/10 bg-gradient-to-b from-fresh/10 via-cream to-cream py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-agri/20 bg-white/80 px-3.5 py-1 text-xs font-semibold text-agri backdrop-blur mb-4">
              <Sparkles className="h-3.5 w-3.5 text-agri" />
              Simple 4-Step Methodology
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark sm:text-5xl md:text-6xl">
              From Raw Soil to <span className="text-agri">Actionable AI</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-dark/70 sm:text-lg">
              AgriVerse AI connects satellite imagery, sensor telemetry, and agronomic science into a frictionless workflow that works on any smartphone.
            </p>
          </div>
        </section>

        {/* Step-by-Step Flow */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="space-y-12">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={s.step}
                  className={`grid gap-8 items-center md:grid-cols-12 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Left Column (or Right on even) */}
                  <div className={`md:col-span-6 ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-base font-bold text-white shadow-sm">
                        {s.step}
                      </span>
                      <Badge variant="outline" className="border-agri/20 bg-white text-forest text-xs font-semibold">
                        {s.tagline}
                      </Badge>
                      <Badge variant="secondary" className="bg-fresh/20 text-forest text-xs">
                        {s.badge}
                      </Badge>
                    </div>

                    <h2 className="text-2xl font-bold text-dark sm:text-3xl">{s.title}</h2>
                    <p className="mt-3 text-base text-dark/70 leading-relaxed">{s.desc}</p>

                    <div className="mt-6 space-y-2.5 rounded-2xl border border-agri/15 bg-white p-5 shadow-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-dark/50 block">
                        Included in this step:
                      </span>
                      {s.details.map((d, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-dark/80">
                          <CheckCircle2 className="h-4 w-4 text-agri shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Card Visual Preview */}
                  <div className={`md:col-span-6 ${isEven ? "md:order-1" : "md:order-2"}`}>
                    <div className="relative overflow-hidden rounded-3xl border border-agri/20 bg-gradient-to-tr from-white via-cream to-white p-8 shadow-lg">
                      <div className="flex items-center justify-between border-b border-agri/10 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-fresh/20 p-3 text-forest">
                            <Icon className="h-6 w-6 text-agri" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-dark/50">AGRIVERSE WORKFLOW</span>
                            <h3 className="text-lg font-bold text-dark">Step {s.step} in Action</h3>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-agri/30 text-forest">
                          Interactive
                        </Badge>
                      </div>

                      {/* Mini Simulation based on step */}
                      {idx === 0 && (
                        <div className="space-y-3 rounded-2xl border border-dashed border-agri/30 bg-fresh/10 p-5 text-center">
                          <MapPin className="mx-auto h-8 w-8 text-agri animate-bounce" />
                          <p className="text-sm font-bold text-dark">Boundary Picked: 4.8 Acres</p>
                          <p className="text-xs text-dark/60">Latitude: 18.5204° N · Longitude: 73.8567° E</p>
                          <Badge variant="secondary" className="bg-white text-forest text-xs">
                            Soil Type: Vertisol (Black Cotton Soil)
                          </Badge>
                        </div>
                      )}

                      {idx === 1 && (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="rounded-xl border border-agri/10 bg-white p-3">
                            <span className="text-dark/50 block">Soil pH</span>
                            <span className="text-lg font-bold text-dark">6.8</span>
                            <span className="text-forest block text-[10px]">Optimal Buffer</span>
                          </div>
                          <div className="rounded-xl border border-agri/10 bg-white p-3">
                            <span className="text-dark/50 block">Moisture</span>
                            <span className="text-lg font-bold text-dark">38%</span>
                            <span className="text-forest block text-[10px]">Adequate field cap</span>
                          </div>
                          <div className="rounded-xl border border-agri/10 bg-white p-3">
                            <span className="text-dark/50 block">Temp (7d Avg)</span>
                            <span className="text-lg font-bold text-dark">29°C</span>
                            <span className="text-forest block text-[10px]">Normal range</span>
                          </div>
                          <div className="rounded-xl border border-agri/10 bg-white p-3">
                            <span className="text-dark/50 block">Forecast</span>
                            <span className="text-lg font-bold text-dark">18mm</span>
                            <span className="text-forest block text-[10px]">Rain on Thu</span>
                          </div>
                        </div>
                      )}

                      {idx === 2 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-xl border border-agri/15 bg-white p-3">
                            <div className="flex items-center gap-2">
                              <Sprout className="h-4 w-4 text-agri" />
                              <span className="text-sm font-bold text-dark">Soybean (JS-335)</span>
                            </div>
                            <span className="rounded-full bg-fresh/30 px-2.5 py-0.5 text-xs font-bold text-forest">
                              94% Match
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl border border-agri/15 bg-white p-3">
                            <div className="flex items-center gap-2">
                              <Sprout className="h-4 w-4 text-agri" />
                              <span className="text-sm font-bold text-dark">Chickpea (Desi)</span>
                            </div>
                            <span className="rounded-full bg-fresh/20 px-2.5 py-0.5 text-xs font-bold text-forest">
                              89% Match
                            </span>
                          </div>
                          <p className="text-center text-xs text-dark/60">
                            Confidence computed across 14 agronomic & market variables
                          </p>
                        </div>
                      )}

                      {idx === 3 && (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-agri/15 bg-white p-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-dark">Rainfall -20% Scenario</span>
                              <span className="text-amber-700 font-bold">-4% Yield Shift</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-cream">
                              <div className="h-2 rounded-full bg-agri" style={{ width: "88%" }} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-dark/60 pt-1">
                            <span className="flex items-center gap-1">
                              <History className="h-3.5 w-3.5 text-agri" /> Snapshot auto-saved
                            </span>
                            <span className="font-semibold text-forest">Audit Trail Ready</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTA Bar */}
          <div className="mt-20 text-center">
            <div className="mx-auto max-w-xl space-y-4">
              <h2 className="text-2xl font-bold text-dark sm:text-3xl">
                Ready to Experience This on Your Farm?
              </h2>
              <p className="text-sm text-dark/70">
                Join hundreds of farmers making smarter, data-driven decisions with AgriVerse AI today.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button asChild size="lg" variant="primary">
                  <Link href={user ? "/dashboard" : "/signup"} className="flex items-center gap-2">
                    {user ? "Open Your Dashboard" : "Start Free Assessment"} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-agri/30 text-forest hover:bg-cream">
                  <Link href="/live-telemetry">View Live Telemetry</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
