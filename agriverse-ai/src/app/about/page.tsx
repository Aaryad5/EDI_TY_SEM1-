"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sprout,
  BrainCircuit,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Cpu,
  Database,
  Globe2,
  ArrowRight,
  HeartHandshake,
  Award,
  Sparkles,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

const PRINCIPLES = [
  {
    icon: HeartHandshake,
    title: "Farmer-First Simplicity",
    desc: "Technology is only valuable if it is usable. AgriVerse AI is designed specifically for rural connectivity, mid-range mobile devices, and intuitive workflows that require zero technical training.",
  },
  {
    icon: BrainCircuit,
    title: "Explainable, Transparent AI",
    desc: "We reject opaque 'black-box' recommendations. Every suggestion displays the precise soil pH, rainfall variance, temperature threshold, and market price dynamics that informed the conclusion.",
  },
  {
    icon: Database,
    title: "Uncompromising Data Ownership",
    desc: "Your farm measurements belong strictly to you. AgriVerse AI implements versioned, append-only history snapshots—your historical data is never modified, deleted, or sold to third parties.",
  },
  {
    icon: Sprout,
    title: "Ecological Regeneration",
    desc: "We prioritize long-term soil microbiome health, water table preservation, and biological pest management alongside yield maximization. Farming for this season and the next generation.",
  },
];

const ARCH_STACK = [
  {
    layer: "Frontend & Visuals",
    tech: "Next.js 16 + React 19 + Tailwind CSS",
    desc: "Lightning-fast server components, responsive mobile drawers, dynamic Leaflet GIS maps, and fluid Framer Motion digital twins.",
  },
  {
    layer: "Intelligence & ML Layer",
    tech: "Python FastAPI + XGBoost + PyTorch",
    desc: "Multi-agent recommendation engines, ResNet-50 computer vision disease diagnostics, and Open-Meteo ensemble forecast aggregations.",
  },
  {
    layer: "Geospatial & Storage",
    tech: "PostgreSQL + PostGIS + S3 Object Storage",
    desc: "Spatially indexed polygon parcels, append-only history snapshots, and high-resolution Sentinel-2 multispectral NDVI bands.",
  },
];

const STATS = [
  { value: "4.8 / 5.0", label: "Farmer Satisfaction Rating" },
  { value: "18+", label: "Regional Indigenous Crops Modeled" },
  { value: "100%", label: "Data Ownership Retained by Farmers" },
  { value: "< 2s", label: "Real-time AI Inference Speed" },
];

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-agri/10 bg-gradient-to-b from-fresh/10 via-cream to-cream py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-agri/20 bg-white/80 px-3.5 py-1 text-xs font-semibold text-agri backdrop-blur mb-4">
              <Compass className="h-3.5 w-3.5 text-agri" />
              Our Mission & Agronomic Philosophy
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark sm:text-5xl md:text-6xl">
              Bridging Soil Science with <span className="text-agri">Actionable AI</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-dark/70 sm:text-lg">
              AgriVerse AI was conceived to democratize high-resolution precision agriculture. We combine
              satellite telemetry, IoT sensors, and machine learning to give every farmer the insights
              previously reserved for industrial mega-plantations.
            </p>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-b border-agri/10 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-forest sm:text-3xl md:text-4xl">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-dark/60 sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="border-agri/30 text-forest bg-fresh/10 mb-2">
              Foundational Values
            </Badge>
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">
              Principles Guiding Our Architecture
            </h2>
            <p className="mt-2 text-sm text-dark/70">
              Designed from the field up to respect farmer autonomy, data privacy, and soil ecology.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PRINCIPLES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Card key={idx} className="border border-agri/15 bg-white shadow-sm hover:border-agri/30 transition-all">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-fresh/20 p-3.5 text-forest shrink-0">
                        <Icon className="h-6 w-6 text-agri" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-dark">{p.title}</h3>
                        <p className="mt-2 text-sm text-dark/70 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Technology Architecture Section */}
        <section className="border-t border-agri/10 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="border-agri/30 text-agri bg-fresh/10 mb-2">
                Tech Stack
              </Badge>
              <h2 className="text-2xl font-bold text-dark sm:text-3xl">
                Modern, Scalable & Open Architecture
              </h2>
              <p className="mt-2 text-sm text-dark/70">
                A decoupled multi-tier stack built for enterprise reliability and rural fault tolerance.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {ARCH_STACK.map((item, i) => (
                <div key={i} className="rounded-2xl border border-agri/15 bg-cream/30 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-agri">
                      Tier 0{i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-dark mt-1">{item.layer}</h3>
                    <Badge variant="secondary" className="mt-2 bg-white text-forest text-xs font-semibold">
                      {item.tech}
                    </Badge>
                    <p className="mt-3 text-sm text-dark/70 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-agri/10 flex items-center gap-1.5 text-xs text-forest font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-agri" /> Production Certified
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-14 rounded-3xl border border-agri/20 bg-cream p-8 text-center sm:p-12">
              <h3 className="text-2xl font-bold text-dark">Have Questions or Want to Collaborate?</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-dark/70">
                We work closely with agricultural universities, Krishi Vigyan Kendras, and farmer-producer organizations (FPOs).
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Button asChild variant="primary" size="lg">
                  <Link href="/contact" className="flex items-center gap-2">
                    Contact Our Agronomy Team <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-agri/30 text-forest hover:bg-white">
                  <Link href="/research">Explore Research Datasets</Link>
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
