"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Warehouse,
  ArrowRight,
  Sprout,
  Droplets,
  CloudSun,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_FARMS } from "@/lib/data/demo";
import type { Farm } from "@/lib/types";

// Visual thumbnails for farm cards
const FARM_IMAGES: Record<string, string> = {
  Wheat: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80",
  Tomato: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
  Rice: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80",
  Default: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, farms, activeFarm, setActiveFarm } = useAuth();
  const { snapshot, alerts } = useFarmData();

  const displayFarms: Farm[] = farms && farms.length > 0 ? farms : DEMO_FARMS;

  const handleSelectFarm = async (farm: Farm) => {
    await setActiveFarm(farm.id);
    router.push(`/farms/${farm.id}/analysis`);
  };

  return (
    <div className="space-y-10">
      {/* SCREEN 1 HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-agri/20 shadow-xl">
        {/* Large Agricultural Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />

        {/* Ambient Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-forest/85 to-dark/70 backdrop-blur-[2px]" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-16 sm:px-10 md:py-24 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-lightgreen backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lightgreen opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lightgreen" />
            </span>
            AgriVerse Platform · v2.4 Active
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              AgriVerse
            </h1>
            <p className="text-lg font-bold text-lightgreen sm:text-2xl">
              AI-Powered Digital Twin for Smart Agriculture
            </p>
            <p className="text-sm italic text-white/80 sm:text-base">
              "From Your Field to a Smarter Future"
            </p>
          </div>

          <p className="text-sm text-white/75 sm:text-base leading-relaxed max-w-xl">
            Welcome back, {user?.fullName || "Ramesh Patil"}. Explore your fields, configure IoT
            telemetry, analyze soil and weather diagnostics, and run "What-If" Digital Twin simulations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-lightgreen text-dark font-bold hover:bg-lightgreen/90 shadow-lg"
            >
              <Link href="/farms/add/location" className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-dark" />
                + Add New Farm
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href="#my-farms" className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                View My Farms
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SCREEN 1 — MY FARMS SECTION */}
      <section id="my-farms" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri">
              <Sprout className="h-4 w-4" />
              Parcel Directory
            </div>
            <h2 className="text-2xl font-black text-dark sm:text-3xl">MY FARMS</h2>
            <p className="text-xs sm:text-sm text-dark/60">
              Click any farm card below to open its Farm Intelligence Dashboard & Digital Twin.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="border-agri/20 text-forest hover:bg-cream">
            <Link href="/farms" className="flex items-center gap-1.5">
              Manage All Farms <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Farm Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayFarms.map((farm, idx) => {
            const cropType = farm.currentCrop || "Wheat";
            const imageUrl =
              farm.imageUrl ||
              FARM_IMAGES[cropType] ||
              FARM_IMAGES.Default;
            const health = farm.cropHealth || (idx === 1 ? "Attention" : "Healthy");

            return (
              <motion.div
                key={farm.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectFarm(farm)}
                className="group cursor-pointer rounded-2xl border border-agri/15 bg-white shadow-sm hover:border-agri/40 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Farm Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-cream">
                    <img
                      src={imageUrl}
                      alt={farm.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />

                    {/* Top Status Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-dark font-bold backdrop-blur text-xs"
                      >
                        {farm.name}
                      </Badge>
                      {activeFarm?.id === farm.id && (
                        <Badge className="bg-agri text-white font-semibold text-[10px]">
                          Active Farm
                        </Badge>
                      )}
                    </div>

                    {/* Health Status Badge */}
                    <div className="absolute top-3 right-3">
                      {health === "Healthy" ? (
                        <Badge className="bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow">
                          <CheckCircle2 className="h-3 w-3" /> Healthy
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow">
                          <AlertTriangle className="h-3 w-3" /> Attention
                        </Badge>
                      )}
                    </div>

                    {/* Bottom overlay inside image: Location */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 font-medium drop-shadow">
                        <MapPin className="h-3.5 w-3.5 text-lightgreen" />
                        {farm.district || "Pune"}, {farm.state || "Maharashtra"}
                      </span>
                      <span className="font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                        {farm.areaValue} {farm.areaUnit}
                      </span>
                    </div>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-agri/10 bg-cream/30 p-3 text-xs">
                      <div>
                        <span className="text-dark/50 block text-[11px]">Current Crop</span>
                        <span className="text-sm font-bold text-dark flex items-center gap-1 mt-0.5">
                          <Sprout className="h-4 w-4 text-agri" />
                          {cropType}
                        </span>
                      </div>
                      <div>
                        <span className="text-dark/50 block text-[11px]">Farm Health</span>
                        <span
                          className={`text-sm font-bold mt-0.5 block ${
                            health === "Healthy" ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {health}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-dark/60">
                      <span>Last analyzed: {farm.lastAnalyzed || "Today at 12:42 PM"}</span>
                      <span className="text-forest font-semibold">Sensor Grid: Active</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-agri/10 bg-cream/20 px-5 py-3 flex items-center justify-between text-xs font-bold text-agri group-hover:bg-agri group-hover:text-white transition-colors">
                  <span>Open Farm Analysis</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Agronomic Overview of Active Farm */}
      {snapshot && (
        <section className="rounded-3xl border border-agri/15 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agri/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-agri">
                Current Active Telemetry
              </span>
              <h3 className="text-xl font-bold text-dark">
                {activeFarm?.name || "Farm 01"} · Live Sensor Health
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href={`/farms/${activeFarm?.id || "farm_001"}/simulation`}>
                  Run What-If Simulation →
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4">
              <div className="flex items-center gap-2 text-dark/50 text-xs font-semibold mb-1">
                <CloudSun className="h-4 w-4 text-agri" /> Temperature
              </div>
              <p className="text-2xl font-black text-dark">
                {snapshot.weather?.avgTemperatureC ?? 28}°C
              </p>
              <p className="text-[11px] text-forest font-medium mt-1">Normal daily variance</p>
            </div>

            <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4">
              <div className="flex items-center gap-2 text-dark/50 text-xs font-semibold mb-1">
                <Droplets className="h-4 w-4 text-agri" /> Soil Moisture
              </div>
              <p className="text-2xl font-black text-dark">
                {snapshot.soil?.moisturePct ?? 18}%
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-1">Drip schedule needed</p>
            </div>

            <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4">
              <div className="flex items-center gap-2 text-dark/50 text-xs font-semibold mb-1">
                <Layers className="h-4 w-4 text-agri" /> Soil pH
              </div>
              <p className="text-2xl font-black text-dark">
                {snapshot.soil?.soilPh ?? 6.8}
              </p>
              <p className="text-[11px] text-forest font-medium mt-1">Optimal nutrient buffer</p>
            </div>

            <div className="rounded-2xl border border-agri/10 bg-cream/30 p-4">
              <div className="flex items-center gap-2 text-dark/50 text-xs font-semibold mb-1">
                <ShieldCheck className="h-4 w-4 text-agri" /> Overall Risk
              </div>
              <p className="text-2xl font-black text-forest">Low</p>
              <p className="text-[11px] text-forest font-medium mt-1">Stable growing conditions</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}