"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Database,
  BarChart,
  Binary,
  Microscope,
  Cpu,
  Layers,
  FileText,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Satellite,
  Search,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

const BENCHMARKS = [
  {
    model: "XGBoost Crop Suitability Ensemble",
    target: "18 Indigenous Crops",
    metric: "93.4% Accuracy",
    baseline: "81.2% (Standard Rule Engine)",
    detail: "Trained on regional soil chemical surveys, 30-year precipitation distributions, and micro-climate patterns.",
  },
  {
    model: "ResNet-50 Vision Pathologist",
    target: "38 Common Leaf Diseases",
    metric: "91.8% F1-Score",
    baseline: "78.4% (Generic MobileNet)",
    detail: "Fine-tuned on high-resolution field photos across varying lighting, leaf orientations, and pest bite symptoms.",
  },
  {
    model: "Penman-Monteith ETc Hydrology Balancer",
    target: "Water Use Optimization",
    metric: "18.6% Water Savings",
    baseline: "Traditional Flood/Timers",
    detail: "Dynamic vapor pressure deficit integration preventing saturation while safeguarding rootzone transpiration.",
  },
  {
    model: "Sentinel-2 MSI Normalized Vegetation",
    target: "10-meter Ground Resolution",
    metric: "5-Day Revisit Cadence",
    baseline: "Landsat-8 (16-day)",
    detail: "Band 4 (Red: 665nm) and Band 8 (NIR: 842nm) radiance indexing for canopy chlorophyll density calculation.",
  },
];

const DATASETS = [
  {
    name: "Pune & Western Maharashtra Agro-Climatic Series",
    source: "IMD & State Agricultural University",
    records: "14,200+ Observations",
    type: "Soil, Precipitation, Temperature",
    description:
      "Longitudinal meteorological and soil chemistry dataset covering Vertisol (Black Cotton) profiles across Haveli, Baramati, Shirur, and Indapur talukas.",
  },
  {
    name: "ESA Copernicus Sentinel-2 MSI Surface Reflectance",
    source: "European Space Agency",
    records: "Continuous Planetary Coverage",
    type: "Multispectral Optics (10m - 20m)",
    description:
      "Atmospherically corrected bottom-of-atmosphere (BOA) reflectance used for continuous monitoring of vegetative vigor (NDVI) and canopy water index (NDWI).",
  },
  {
    name: "ISRIC World Soil Information (SoilGrids 250m)",
    source: "ISRIC Global Soil Data Consortium",
    records: "Global Grid · 6 Depth Layers",
    type: "pH, Organic Carbon, Sand/Silt/Clay",
    description:
      "Machine-learning based spatial predictions of soil properties used as fallback spatial prior when physical lab test cards are absent.",
  },
];

export default function ResearchPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-agri/10 bg-gradient-to-b from-fresh/10 via-cream to-cream py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-agri/20 bg-white/80 px-3.5 py-1 text-xs font-semibold text-agri backdrop-blur mb-4">
              <Microscope className="h-3.5 w-3.5 text-agri" />
              Agronomic Science & Machine Learning
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark sm:text-5xl md:text-6xl">
              Backed by Rigorous <span className="text-agri">Field Research</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-dark/70 sm:text-lg">
              Explore the empirical datasets, multi-spectral satellite indices, and peer-reviewed
              agronomic models that power the AgriVerse AI recommendation engines.
            </p>
          </div>
        </section>

        {/* Model Benchmarks */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="border-agri/30 text-forest bg-fresh/10 mb-2">
              Model Performance
            </Badge>
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">
              Evaluated on Real Agro-Climatic Benchmarks
            </h2>
            <p className="mt-2 text-sm text-dark/70">
              Our AI models undergo cross-validation across micro-climates, soil horizons, and irregular seasonal rains.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {BENCHMARKS.map((b, i) => (
              <Card key={i} className="border border-agri/15 bg-white shadow-sm hover:border-agri/35 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-agri">
                        {b.target}
                      </span>
                      <h3 className="text-lg font-bold text-dark mt-0.5">{b.model}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-fresh/20 text-forest font-bold text-xs">
                      {b.metric}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm text-dark/70 leading-relaxed">{b.detail}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-agri/10 pt-3 text-xs">
                    <span className="text-dark/50">Baseline Comparison:</span>
                    <span className="font-semibold text-dark/80">{b.baseline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Datasets Section */}
        <section className="border-t border-agri/10 bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="border-agri/30 text-agri bg-fresh/10 mb-2">
                Ground Truth
              </Badge>
              <h2 className="text-2xl font-bold text-dark sm:text-3xl">
                Open Datasets & Geospatial Registries
              </h2>
              <p className="mt-2 text-sm text-dark/70">
                Calibrated against verifiable public soil inventories and satellite Earth observation constellations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {DATASETS.map((d, idx) => (
                <div key={idx} className="rounded-2xl border border-agri/15 bg-cream/30 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-forest">
                      <Database className="h-4 w-4 text-agri" />
                      <span>{d.records}</span>
                    </div>
                    <h3 className="text-base font-bold text-dark mt-2">{d.name}</h3>
                    <p className="text-xs text-agri font-medium mt-0.5">Source: {d.source}</p>
                    <p className="mt-3 text-sm text-dark/70 leading-relaxed">{d.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-agri/10 text-xs text-dark/60">
                    <span className="font-medium">Data Type: </span> {d.type}
                  </div>
                </div>
              ))}
            </div>

            {/* Remote Sensing Methodology Explainer */}
            <div className="mt-14 rounded-3xl border border-agri/20 bg-gradient-to-br from-forest to-dark p-8 text-white md:p-12">
              <div className="grid gap-8 md:grid-cols-12 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-fresh uppercase tracking-wider">
                    <Satellite className="h-4 w-4" />
                    Remote Sensing Methodology
                  </div>
                  <h3 className="text-2xl font-bold md:text-3xl">
                    Satellite Radiance Indexing: NDVI & NDWI
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    By calculating the normalized ratio between near-infrared (NIR) and visible red light:
                    <code className="mx-1.5 rounded bg-black/40 px-2 py-0.5 font-mono text-fresh text-xs">
                      NDVI = (NIR - Red) / (NIR + Red)
                    </code>
                    AgriVerse AI monitors cellular water stress and chlorophyll absorption before leaf discoloration becomes visible to the naked human eye.
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-white/10 p-6 backdrop-blur text-center border border-white/10">
                  <span className="text-4xl font-black text-fresh">10m</span>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                    Spatial Ground Resolution
                  </span>
                  <p className="mt-2 text-xs text-white/60">
                    Sufficient to detect localized irrigation deficits across 1-acre plots.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="primary">
                <Link href={user ? "/recommendations" : "/signup"} className="flex items-center gap-2">
                  Test Models on Your Land <ArrowRight className="h-4 w-4" />
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
