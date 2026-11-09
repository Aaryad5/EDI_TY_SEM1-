"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  CloudSun,
  Droplets,
  Sprout,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  Search,
  Eye,
  Microscope,
  FileCheck,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

const FEATURES_DATA = [
  {
    id: "crop-rec",
    title: "AI Crop Recommendation",
    subtitle: "Agronomic precision matching your exact field terroir",
    icon: Sparkles,
    category: "AI & Intelligence",
    tag: "Core Engine",
    description:
      "Our multi-factor recommendation engine evaluates soil chemical attributes (pH, N-P-K, organic carbon), 10-year historical precipitation patterns, hyper-local temperature curves, and regional agricultural market demand to rank optimal crops.",
    capabilities: [
      "Calculates Soil & Climate Compatibility percentages with explainable reasons",
      "Identifies optimal sowing window and harvest timeline",
      "Estimates water requirement (mm) and projected revenue (₹/ha)",
      "Highlights key risk factors and mitigations before planting",
    ],
    demoUrl: "/recommendations",
  },
  {
    id: "soil-intel",
    title: "Soil Intelligence",
    subtitle: "Complete rhizosphere diagnostics and nutrient balancing",
    icon: Layers,
    category: "Soil Science",
    tag: "Diagnostics",
    description:
      "Deep diagnostics for pH, Nitrogen, Phosphorus, Potassium, electrical conductivity, and moisture levels. Supports automated GIS retrieval via SoilGrids or manual lab soil-health card inputs.",
    capabilities: [
      "Visual soil nutrient gauges with deficient/optimal/excess indicators",
      "Custom NPK fertilizer dosage calculators and organic amendment tips",
      "Soil moisture retention mapping and organic carbon trends",
      "Versioned soil testing history to track long-term soil regeneration",
    ],
    demoUrl: "/soil",
  },
  {
    id: "weather-intel",
    title: "Weather Intelligence",
    subtitle: "Hyper-local forecasts, precipitation charts & agronomic alerts",
    icon: CloudSun,
    category: "Atmospheric",
    tag: "Forecasts",
    description:
      "7-day hyper-local agricultural weather forecasts powered by high-resolution meteorological models. Tracks vapor pressure deficit (VPD), rainfall probabilities, evapotranspiration rates, and impending frost or heat stress.",
    capabilities: [
      "Daily and hourly temperature, humidity, and rainfall bar charts",
      "Agronomic spray window advisor (wind speed, rain probability)",
      "Automated heatwave, drought, and heavy-precipitation alerts",
      "Historical weather analysis for comparison across consecutive seasons",
    ],
    demoUrl: "/weather",
  },
  {
    id: "smart-irrigation",
    title: "Smart Irrigation",
    subtitle: "Moisture-driven scheduling and water efficiency optimization",
    icon: Droplets,
    category: "Water Resource",
    tag: "Automation",
    description:
      "Prevent over-watering and root rot while conserving critical water supplies. Calculates daily water deficit based on crop evapotranspiration (ETc) and triggers automated drip valve schedules.",
    capabilities: [
      "Live soil water balance computation and depletion thresholds",
      "Automated irrigation duration schedules for drip and sprinkler systems",
      "Water conservation analytics and electrical pump runtime logs",
      "Borewell and canal water source volume tracking",
    ],
    demoUrl: "/irrigation",
  },
  {
    id: "crop-health",
    title: "Crop Health Monitoring",
    subtitle: "Vegetative vigor tracking from emergence to peak harvest",
    icon: Sprout,
    category: "Field Operations",
    tag: "Growth Tracking",
    description:
      "Track growth milestones across BBCH agronomic scales. Integrate Sentinel-2 satellite NDVI and NDWI metrics with in-field observations to monitor canopy density and spot anomalies early.",
    capabilities: [
      "Stage-by-stage growth progress bars and target development days",
      "Canopy cover and chlorophyll density tracking indices",
      "Yield estimation models based on biomass accumulation",
      "Photo journal of crop progress across the production cycle",
    ],
    demoUrl: "/crop-analysis",
  },
  {
    id: "pest-disease",
    title: "Pest & Disease Detection",
    subtitle: "Computer vision diagnosis and early containment protocols",
    icon: ShieldCheck,
    category: "Crop Protection",
    tag: "Computer Vision",
    description:
      "Take or upload photos of leaves, stems, or fruits exhibiting symptoms. Our trained deep learning models identify common pathogens, rusts, blights, and insect infestations in seconds.",
    capabilities: [
      "Instant image classification with confidence percentage scoring",
      "Organic bio-control and targeted chemical intervention plans",
      "Regional pest incidence heatmap and early outbreak warnings",
      "Dosage and safety precautions for crop protection products",
    ],
    demoUrl: "/crop-analysis",
  },
  {
    id: "market-intel",
    title: "Market Intelligence",
    subtitle: "Live APMC mandi price trends, demand indices & profit forecasts",
    icon: TrendingUp,
    category: "Economics",
    tag: "Economics",
    description:
      "Connect your harvest timing with peak market demand. View daily APMC wholesale mandi rates, regional price spreads, seasonal price seasonality curves, and optimal selling windows.",
    capabilities: [
      "Live mandi price tracking across nearby agricultural markets",
      "Price trend forecasting using historical seasonal arrivals",
      "Cost of cultivation vs net return calculators",
      "Direct buyer demand indices and storage feasibility tips",
    ],
    demoUrl: "/crops",
  },
  {
    id: "digital-twin",
    title: "Digital Twin Farm Simulation",
    subtitle: "Interactive 2D virtual replica with 'What-If' scenario testing",
    icon: BrainCircuit,
    category: "AI & Simulation",
    tag: "Simulation",
    description:
      "A living virtual model of your physical farm. Test hypothetical climate and water scenarios: adjust rainfall, temperature, or irrigation rates to observe projected yield impacts before investing resources.",
    capabilities: [
      "2D visual interactive farm grid showing crop zones, soil layers & IoT nodes",
      "One-click 'What happens if rainfall decreases by 20%?' simulations",
      "Interactive sliders for custom temperature, rain, and water scenarios",
      "Baseline vs simulated yield, water consumption, and stress comparisons",
    ],
    demoUrl: "/digital-twin",
  },
];

export default function FeaturesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = ["All", "AI & Intelligence", "Soil Science", "Atmospheric", "Water Resource", "Crop Protection"];

  const filteredFeatures =
    selectedCategory === "All"
      ? FEATURES_DATA
      : FEATURES_DATA.filter((f) => f.category === selectedCategory || f.tag.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-agri/10 bg-gradient-to-b from-fresh/10 via-cream to-cream py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-agri/20 bg-white/80 px-3.5 py-1 text-xs font-semibold text-agri backdrop-blur mb-4">
              <Sparkles className="h-3.5 w-3.5 text-agri" />
              Complete Agronomic Toolsuite
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark sm:text-5xl md:text-6xl">
              Precision Features Built for <span className="text-agri">Every Farm</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-dark/70 sm:text-lg">
              Explore our eight core intelligent farming modules designed to maximize your yield,
              conserve water, diagnose soil deficiencies, and eliminate guesswork.
            </p>

            {/* Category filter pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-agri text-white shadow-sm"
                      : "bg-white text-dark/70 border border-agri/15 hover:border-agri/40 hover:text-dark"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {filteredFeatures.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full border border-agri/15 bg-white shadow-sm hover:border-agri/35 hover:shadow-md transition-all flex flex-col justify-between">
                    <CardContent className="p-6 md:p-8 space-y-5">
                      {/* Top icon and badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-fresh/20 p-3.5 text-forest">
                            <Icon className="h-6 w-6 text-agri" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-agri">
                              {f.category}
                            </span>
                            <h2 className="text-xl font-bold text-dark">{f.title}</h2>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-agri/20 bg-cream text-forest text-xs">
                          {f.tag}
                        </Badge>
                      </div>

                      <p className="text-sm font-medium text-dark/80 italic">{f.subtitle}</p>
                      <p className="text-sm text-dark/70 leading-relaxed">{f.description}</p>

                      {/* Capabilities checklist */}
                      <div className="rounded-xl border border-agri/10 bg-cream/30 p-4 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-dark/60 block mb-2">
                          Key Capabilities
                        </span>
                        {f.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-dark/80">
                            <CheckCircle2 className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action button */}
                      <div className="pt-2">
                        <Button
                          asChild
                          variant="secondary"
                          className="w-full justify-between hover:bg-agri hover:text-white transition-colors"
                        >
                          <Link href={user ? f.demoUrl : "/signup"}>
                            <span>{user ? `Launch ${f.title}` : `Try ${f.title} with Demo Farm`}</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="mt-16 rounded-3xl border border-agri/20 bg-gradient-to-r from-forest via-agri to-forest p-8 text-center text-white shadow-xl md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Put These Features to Work?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
              Create a free account, draw your farm boundary, and get your first AI-powered recommendations in less than 3 minutes.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-forest hover:bg-cream">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
