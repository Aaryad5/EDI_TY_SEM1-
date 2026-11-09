"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Layers,
  CloudSun,
  Droplets,
  Wrench,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Compass,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { farmService } from "@/lib/services/farmService";
import { snapshotService } from "@/lib/services/snapshotService";
import { historyService } from "@/lib/services/historyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { dateParts, uid } from "@/lib/utils";
import type { Farm, FarmSnapshot, HistoryRecord } from "@/lib/types";

const CROP_OPTIONS = [
  "Wheat",
  "Rice",
  "Tomato",
  "Cotton",
  "Soybean",
  "Maize",
  "Sugarcane",
  "Potato",
  "Onion",
  "Other",
];

const GROWTH_STAGES = [
  "Germination",
  "Seedling",
  "Vegetative",
  "Flowering",
  "Fruiting",
  "Maturity",
  "Harvest",
];

export default function FarmInformationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setActiveFarm } = useAuth();
  const { refresh } = useFarmData();

  // Retrieve location draft if exists
  const [draftLocation, setDraftLocation] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("agriverse_farm_draft");
      if (saved) {
        setDraftLocation(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Form State
  const [farmName, setFarmName] = React.useState("Greenfield Plot #1");

  // SECTION 1: Crop
  const [cropType, setCropType] = React.useState("Wheat");
  const [variety, setVariety] = React.useState("Lokwan (Sharbati)");
  const [sowingDate, setSowingDate] = React.useState("2026-08-15");
  const [farmArea, setFarmArea] = React.useState<number>(2.3);
  const [growthStage, setGrowthStage] = React.useState("Vegetative");

  // Sync area from draft
  React.useEffect(() => {
    if (draftLocation?.area) {
      setFarmArea(draftLocation.area);
    }
  }, [draftLocation]);

  // SECTION 2: Field Condition
  const [fieldCondition, setFieldCondition] = React.useState<"Good" | "Water Stress" | "Pest/Disease Visible">("Good");

  // SECTION 3: Soil Information
  const [soilType, setSoilType] = React.useState<string>("Black Cotton");
  const [soilPh, setSoilPh] = React.useState<number>(6.8);
  const [nitrogen, setNitrogen] = React.useState<number>(280);
  const [phosphorus, setPhosphorus] = React.useState<number>(45);
  const [potassium, setPotassium] = React.useState<number>(190);
  const [organicCarbon, setOrganicCarbon] = React.useState<number>(0.85);
  const [soilMoisture, setSoilMoisture] = React.useState<number>(18);
  const [clayPct, setClayPct] = React.useState<number>(38);
  const [sandPct, setSandPct] = React.useState<number>(25);
  const [siltPct, setSiltPct] = React.useState<number>(37);

  // SECTION 4: Weather Information
  const [temperature, setTemperature] = React.useState<number>(28);
  const [humidity, setHumidity] = React.useState<number>(72);
  const [rainfall, setRainfall] = React.useState<number>(0.4);
  const [windSpeed, setWindSpeed] = React.useState<number>(8);
  const [growingSeason, setGrowingSeason] = React.useState<string>("Rabi");
  const [irrigationAvailable, setIrrigationAvailable] = React.useState<boolean>(true);

  // SECTION 5: Irrigation
  const [irrigationMethod, setIrrigationMethod] = React.useState<string>("Drip");
  const [waterSource, setWaterSource] = React.useState<string>("Borewell");
  const [waterAvailability, setWaterAvailability] = React.useState<string>("Adequate");
  const [irrigationFrequency, setIrrigationFrequency] = React.useState<string>("Every 3 days");

  // SECTION 6: Farm Management
  const [farmingMethod, setFarmingMethod] = React.useState<string>("Precision Agriculture");
  const [previousCrop, setPreviousCrop] = React.useState<string>("Soybean");
  const [previousYield, setPreviousYield] = React.useState<string>("2.1 tons");
  const [expectedYield, setExpectedYield] = React.useState<string>("4.5 tons");
  const [fertilizerUsed, setFertilizerUsed] = React.useState<string>("NPK 19:19:19 + Compost");
  const [pesticideUsed, setPesticideUsed] = React.useState<string>("Neem bio-spray");

  // SECTION 7: Image Upload
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
  );

  // Loading state
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [fetchingAuto, setFetchingAuto] = React.useState<boolean>(false);

  // Automatic Data Ingestion Simulation
  const handleFetchAutomatically = async () => {
    setFetchingAuto(true);
    await new Promise((r) => setTimeout(r, 900));
    setSoilType("Black Cotton (Vertisol)");
    setSoilPh(6.8);
    setSoilMoisture(18);
    setNitrogen(280);
    setPhosphorus(45);
    setPotassium(190);
    setOrganicCarbon(0.85);
    setTemperature(28);
    setHumidity(72);
    setRainfall(0.4);
    setWindSpeed(8);
    setFetchingAuto(false);
    toast({
      variant: "success",
      title: "Automated Data Ingested",
      description: "Successfully fetched environmental parameters from SoilGrids & Open-Meteo.",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const now = dateParts();
    const userId = user?.id || "user_001";
    const farmId = uid("farm");

    const newFarm: Farm = {
      id: farmId,
      farmId: farmId,
      userId: userId,
      name: farmName,
      country: draftLocation?.country || "India",
      state: draftLocation?.state || "Maharashtra",
      district: draftLocation?.district || "Pune",
      village: draftLocation?.village || "Khed Shivapur",
      latitude: draftLocation?.latitude || 18.5204,
      longitude: draftLocation?.longitude || 73.8567,
      areaValue: farmArea,
      areaUnit: "acres",
      currentCrop: cropType,
      cropHealth: fieldCondition === "Good" ? "Healthy" : "Attention",
      lastAnalyzed: "Just now",
      riskLevel: fieldCondition === "Good" ? "Low" : "Medium",
      address: draftLocation?.address || "Pune, Maharashtra, India",
      boundary: draftLocation?.boundary || {
        type: "Polygon",
        coordinates: [
          [73.8567, 18.5204],
          [73.8667, 18.5214],
          [73.8677, 18.5154],
          [73.8597, 18.5144],
          [73.8567, 18.5204],
        ],
      },
      imageUrl: imagePreview || undefined,
      isActive: true,
      createdAt: now.iso,
      updatedAt: now.iso,
    };

    // Construct immutable timestamped FarmSnapshot
    const snapshotId = `snapshot_${uid()}`;
    const newSnapshot: FarmSnapshot = {
      id: snapshotId,
      userId: userId,
      farmId: farmId,
      date: now.date,
      day: now.day,
      time: now.time,
      timestamp: now.iso,
      timezone: now.timezone,
      createdAt: now.iso,
      updatedAt: now.iso,
      label: "Field registration snapshot",
      changesMade: [
        "Farm location registered",
        "Soil metrics ingested",
        "Weather telemetry initialized",
        "Crop & irrigation profile saved",
      ],
      farm: newFarm,
      weather: {
        id: uid("wth"),
        snapshotId,
        farmId,
        userId,
        avgTemperatureC: temperature,
        maxTemperatureC: temperature + 5,
        minTemperatureC: temperature - 7,
        relativeHumidityPct: humidity,
        annualRainfallMm: 720,
        recentRainfallMm: rainfall,
        windSpeedKmh: windSpeed,
        sunshineHours: 8.5,
        growingSeason: growingSeason as any,
        irrigationAvailable,
        source: "live",
        createdAt: now.iso,
        updatedAt: now.iso,
      },
      soil: {
        id: uid("sld"),
        snapshotId,
        farmId,
        userId,
        soilType: soilType as any,
        soilPh,
        nitrogen,
        phosphorus,
        potassium,
        organicCarbonPct: organicCarbon,
        moisturePct: soilMoisture,
        electricalConductivityDsM: 0.8,
        clayPct,
        sandPct,
        siltPct,
        soilDepthCm: 90,
        source: "auto",
        createdAt: now.iso,
        updatedAt: now.iso,
      },
      crop: {
        id: uid("crp"),
        snapshotId,
        farmId,
        userId,
        currentCrop: cropType,
        previousCrop,
        cropVariety: variety,
        cropAgeWeeks: 5,
        sowingDate,
        expectedHarvestDate: "2026-11-20",
        farmArea,
        seedVariety: variety,
        seedQuantity: 30,
        fertilizerUsed,
        fertilizerQuantity: 150,
        pesticidesUsed: pesticideUsed,
        previousYield: parseFloat(previousYield) || 2.1,
        expectedYield: parseFloat(expectedYield) || 4.5,
        previousCropDisease: "None",
        cropHealth: fieldCondition === "Good" ? "good" : "fair",
        cropImage: imagePreview || undefined,
        createdAt: now.iso,
        updatedAt: now.iso,
      },
      irrigation: {
        id: uid("irr"),
        snapshotId,
        farmId,
        userId,
        method: irrigationMethod.toLowerCase() as any,
        waterSource: waterSource.toLowerCase() as any,
        waterAvailability,
        frequencyDays: 3,
        averageWaterUsageLiters: 1200,
        pumpCapacityHP: 5,
        createdAt: now.iso,
        updatedAt: now.iso,
      },
    };

    // Save farm, snapshot, history
    try {
      await farmService.createFarm(userId, newFarm);
      await snapshotService.saveSnapshot(newSnapshot);

      const historyRecord: HistoryRecord = {
        ...newSnapshot,
        type: "snapshot_created",
        title: `Field registered: ${farmName} (${cropType})`,
        changes: ["Initial registration", "AI Agents dispatched"],
      };
      await historyService.addHistory(historyRecord);

      await setActiveFarm(farmId);
      await refresh();

      toast({
        variant: "success",
        title: "Farm Profile Created",
        description: `Farm "${farmName}" successfully registered and analyzed.`,
      });

      // Navigate to Farm Intelligence Dashboard
      router.push(`/farms/${farmId}/analysis`);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message || "Failed to save farm details.",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-agri/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri">
            <Sprout className="h-4 w-4" />
            Step 2 of 2 · Comprehensive Profile
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Farm Details</h1>
          <p className="text-sm text-dark/60">
            Tell us about your crop and field conditions.
          </p>
        </div>

        {/* Automatic Fetch Button */}
        <Button
          type="button"
          onClick={handleFetchAutomatically}
          disabled={fetchingAuto}
          variant="outline"
          className="border-agri/30 text-forest bg-fresh/15 hover:bg-fresh/25 font-bold shadow-sm"
        >
          {fetchingAuto ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-agri" />
              Ingesting SoilGrids & Weather...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 text-agri" />
              Fetch Soil & Weather Automatically
            </>
          )}
        </Button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Farm Name Banner */}
        <div className="rounded-2xl border border-agri/15 bg-white p-5 shadow-sm space-y-2">
          <Label htmlFor="farmName" className="text-xs font-bold uppercase text-dark/70">
            Farm Identification Name
          </Label>
          <Input
            id="farmName"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            required
            placeholder="e.g. Farm 01, Greenfield Plot"
            className="text-base font-semibold bg-cream/40"
          />
        </div>

        {/* SECTION 1 — CROP */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-agri/10 pb-3">
              <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                <Sprout className="h-5 w-5 text-agri" />
              </div>
              <div>
                <h2 className="text-base font-bold text-dark">SECTION 1 — CROP</h2>
                <p className="text-xs text-dark/60">Crop type, variety, and growth calendar</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Crop Type</Label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  {CROP_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Variety</Label>
                <Input
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Lokwan, Desi, HYB-441"
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Sowing Date</Label>
                <Input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Farm Area (acres)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={farmArea}
                  onChange={(e) => setFarmArea(parseFloat(e.target.value) || 0)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-dark">Current Growth Stage</Label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  {GROWTH_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2 — FIELD CONDITION */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-agri/10 pb-3">
              <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                <AlertCircle className="h-5 w-5 text-agri" />
              </div>
              <div>
                <h2 className="text-base font-bold text-dark">SECTION 2 — FIELD CONDITION</h2>
                <p className="text-xs text-dark/60">Current visible health status</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(["Good", "Water Stress", "Pest/Disease Visible"] as const).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFieldCondition(cond)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left font-bold text-sm transition-all ${
                    fieldCondition === cond
                      ? "border-agri bg-fresh/20 text-forest shadow-sm"
                      : "border-agri/15 bg-white hover:bg-cream text-dark/70"
                  }`}
                >
                  <span>{cond}</span>
                  {fieldCondition === cond && <CheckCircle2 className="h-4 w-4 text-agri" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3 — SOIL INFORMATION */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-agri/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                  <Layers className="h-5 w-5 text-agri" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-dark">SECTION 3 — SOIL INFORMATION</h2>
                  <p className="text-xs text-dark/60">Nutrient profile and texture composition</p>
                </div>
              </div>
              <Badge variant="outline" className="border-agri/20 text-forest text-xs">
                SoilGrids Synced
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Soil Type</Label>
                <Input
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Soil pH</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(parseFloat(e.target.value) || 0)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Soil Moisture (%)</Label>
                <Input
                  type="number"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(parseInt(e.target.value) || 0)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Organic Carbon (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(parseFloat(e.target.value) || 0)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Nitrogen (kg/ha)</Label>
                <Input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(parseInt(e.target.value) || 0)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Phosphorus (kg/ha)</Label>
                <Input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(parseInt(e.target.value) || 0)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Potassium (kg/ha)</Label>
                <Input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(parseInt(e.target.value) || 0)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Clay / Sand / Silt %</Label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Clay"
                    value={clayPct}
                    onChange={(e) => setClayPct(parseInt(e.target.value) || 0)}
                    className="bg-cream/40 text-xs px-2"
                  />
                  <Input
                    placeholder="Sand"
                    value={sandPct}
                    onChange={(e) => setSandPct(parseInt(e.target.value) || 0)}
                    className="bg-cream/40 text-xs px-2"
                  />
                  <Input
                    placeholder="Silt"
                    value={siltPct}
                    onChange={(e) => setSiltPct(parseInt(e.target.value) || 0)}
                    className="bg-cream/40 text-xs px-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4 — WEATHER INFORMATION */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-agri/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                  <CloudSun className="h-5 w-5 text-agri" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-dark">SECTION 4 — WEATHER INFORMATION</h2>
                  <p className="text-xs text-dark/60">Atmospheric observations from Open-Meteo & IMD</p>
                </div>
              </div>
              <Badge variant="outline" className="border-agri/20 text-forest text-xs">
                Live Sensor Feed
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Temperature (°C)</Label>
                <Input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value) || 0)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Humidity (%)</Label>
                <Input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(parseInt(e.target.value) || 0)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Rainfall (mm Today)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={rainfall}
                  onChange={(e) => setRainfall(parseFloat(e.target.value) || 0)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Wind Speed (km/h)</Label>
                <Input
                  type="number"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseInt(e.target.value) || 0)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Growing Season</Label>
                <select
                  value={growingSeason}
                  onChange={(e) => setGrowingSeason(e.target.value)}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                  <option value="Year-round">Year-round</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Irrigation Ready</Label>
                <select
                  value={irrigationAvailable ? "Yes" : "No"}
                  onChange={(e) => setIrrigationAvailable(e.target.value === "Yes")}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  <option value="Yes">Yes · Available</option>
                  <option value="No">No · Rainfed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5 — IRRIGATION */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-agri/10 pb-3">
              <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                <Droplets className="h-5 w-5 text-agri" />
              </div>
              <div>
                <h2 className="text-base font-bold text-dark">SECTION 5 — IRRIGATION</h2>
                <p className="text-xs text-dark/60">Water supply sources and delivery methods</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Irrigation Method</Label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  <option value="Drip">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Flood">Flood</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Water Source</Label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  <option value="Borewell">Borewell</option>
                  <option value="Canal">Canal</option>
                  <option value="River">River</option>
                  <option value="Reservoir">Reservoir</option>
                  <option value="Rainwater">Rainwater</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Water Availability</Label>
                <Input
                  value={waterAvailability}
                  onChange={(e) => setWaterAvailability(e.target.value)}
                  placeholder="e.g. Adequate, Limited, Seasonal"
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Irrigation Frequency</Label>
                <Input
                  value={irrigationFrequency}
                  onChange={(e) => setIrrigationFrequency(e.target.value)}
                  placeholder="e.g. Every 3 days, Daily"
                  className="bg-cream/40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 6 — FARM MANAGEMENT */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-agri/10 pb-3">
              <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                <Wrench className="h-5 w-5 text-agri" />
              </div>
              <div>
                <h2 className="text-base font-bold text-dark">SECTION 6 — FARM MANAGEMENT</h2>
                <p className="text-xs text-dark/60">Agronomic practices and yield targets</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Farming Method</Label>
                <select
                  value={farmingMethod}
                  onChange={(e) => setFarmingMethod(e.target.value)}
                  className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
                >
                  <option value="Conventional">Conventional</option>
                  <option value="Organic">Organic</option>
                  <option value="Precision Agriculture">Precision Agriculture</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Previous Crop</Label>
                <Input
                  value={previousCrop}
                  onChange={(e) => setPreviousCrop(e.target.value)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Previous Yield</Label>
                <Input
                  value={previousYield}
                  onChange={(e) => setPreviousYield(e.target.value)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Expected Yield</Label>
                <Input
                  value={expectedYield}
                  onChange={(e) => setExpectedYield(e.target.value)}
                  className="bg-cream/40 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Fertilizer Used</Label>
                <Input
                  value={fertilizerUsed}
                  onChange={(e) => setFertilizerUsed(e.target.value)}
                  className="bg-cream/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-dark">Pesticide Used</Label>
                <Input
                  value={pesticideUsed}
                  onChange={(e) => setPesticideUsed(e.target.value)}
                  className="bg-cream/40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 7 — IMAGE UPLOAD */}
        <Card className="border border-agri/15 bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-agri/10 pb-3">
              <div className="rounded-xl bg-fresh/20 p-2 text-forest">
                <ImageIcon className="h-5 w-5 text-agri" />
              </div>
              <div>
                <h2 className="text-base font-bold text-dark">SECTION 7 — CROP IMAGE</h2>
                <p className="text-xs text-dark/60">Upload field photograph for computer vision verification (JPG, PNG, WEBP)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview Box */}
              <div className="relative h-36 w-48 overflow-hidden rounded-2xl border-2 border-dashed border-agri/30 bg-cream/30 flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Field preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-dark/40">
                    <Upload className="mx-auto h-6 w-6 mb-1 text-agri" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>

              {/* Upload Input */}
              <div className="space-y-2 flex-1">
                <Label htmlFor="cropImg" className="text-xs font-semibold text-dark">
                  Choose Photo from Device
                </Label>
                <Input
                  id="cropImg"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  className="bg-cream/40 text-xs"
                />
                <p className="text-[11px] text-dark/50">
                  Maximum file size: 10MB. Images are automatically compressed and geo-tagged to your parcel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-agri/10">
          <Button asChild variant="outline" size="lg" className="border-agri/20 text-forest hover:bg-cream">
            <Link href="/farms/add/location" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Location
            </Link>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="shadow-lg font-bold min-w-[200px]"
          >
            {submitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating Snapshot...
              </>
            ) : (
              <>
                Submit Farm Data <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
