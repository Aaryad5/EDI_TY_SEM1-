"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Calendar,
  Clock,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  CloudSun,
  Wrench,
  Edit3,
  GitCompare,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  BarChart3,
  FlaskConical,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { snapshotService } from "@/lib/services/snapshotService";
import { useToast } from "@/components/ui/use-toast";
import { dateParts } from "@/lib/utils";
import type { FarmSnapshot, WeatherRecord, SoilRecord, CropRecord, IrrigationRecord, FarmManagement } from "@/lib/types";

export default function FarmDataPage() {
  const { user, farms, activeFarm, setActiveFarm } = useAuth();
  const { snapshot, refresh } = useFarmData();
  const router = useRouter();
  const { toast } = useToast();

  const [snapshots, setSnapshots] = React.useState<FarmSnapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = React.useState<string>("");
  const [loadingList, setLoadingList] = React.useState(true);

  // Modals state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isCompareOpen, setIsCompareOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [compareSnapshotId, setCompareSnapshotId] = React.useState<string>("");

  // Edit form state
  const [editForm, setEditForm] = React.useState({
    temp: "29.4",
    humidity: "62",
    soilPh: "7.2",
    soilMoisture: "28.5",
    nitrogen: "240",
    phosphorus: "18",
    potassium: "310",
    cropStage: "Vegetative / Tillering",
    waterApplied: "18.5",
    fertilizer: "Urea 45 kg + DAP 30 kg / acre",
    notes: "Crop health strong. Soil moisture optimum.",
  });

  const loadAllSnapshots = React.useCallback(async () => {
    if (!activeFarm) return;
    setLoadingList(true);
    try {
      const list = await snapshotService.listSnapshots(activeFarm.id);
      setSnapshots(list);
      if (list.length > 0) {
        setSelectedSnapshotId(list[0]?.id || "");
      }
    } finally {
      setLoadingList(false);
    }
  }, [activeFarm]);

  React.useEffect(() => {
    loadAllSnapshots();
  }, [loadAllSnapshots]);

  const currentSnapshot: FarmSnapshot | null =
    snapshots.find((s) => s.id === selectedSnapshotId) || snapshot || snapshots[0] || null;

  const compareSnapshot: FarmSnapshot | null =
    snapshots.find((s) => s.id === compareSnapshotId) || snapshots[1] || null;

  // Handler: Save Edited Data as a New Appended Snapshot (preserves history)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarm || !user) return;

    try {
      const d = dateParts();
      const weatherRecord: WeatherRecord = {
        id: `weather_${Date.now()}`,
        snapshotId: null,
        farmId: activeFarm.id,
        userId: user.userId || user.id,
        avgTemperatureC: parseFloat(editForm.temp) || 29.4,
        maxTemperatureC: (parseFloat(editForm.temp) || 29.4) + 4,
        minTemperatureC: (parseFloat(editForm.temp) || 29.4) - 8,
        relativeHumidityPct: parseFloat(editForm.humidity) || 62,
        annualRainfallMm: 900,
        recentRainfallMm: 0,
        windSpeedKmh: 14,
        sunshineHours: 8.5,
        growingSeason: "Rabi",
        irrigationAvailable: true,
        createdAt: d.iso,
        updatedAt: d.iso,
      };

      const soilRecord: SoilRecord = {
        id: `soil_${Date.now()}`,
        snapshotId: null,
        farmId: activeFarm.id,
        userId: user.userId || user.id,
        soilType: "Black Cotton",
        soilPh: parseFloat(editForm.soilPh) || 7.2,
        nitrogen: parseFloat(editForm.nitrogen) || 240,
        phosphorus: parseFloat(editForm.phosphorus) || 18,
        potassium: parseFloat(editForm.potassium) || 310,
        organicCarbonPct: 0.68,
        moisturePct: parseFloat(editForm.soilMoisture) || 28.5,
        electricalConductivityDsM: 0.42,
        clayPct: 48,
        sandPct: 22,
        siltPct: 30,
        soilDepthCm: 90,
        createdAt: d.iso,
        updatedAt: d.iso,
      };

      const cropRecord: CropRecord = {
        id: `crop_${Date.now()}`,
        snapshotId: null,
        farmId: activeFarm.id,
        userId: user.userId || user.id,
        currentCrop: "Wheat",
        cropVariety: "GW-322",
        previousCrop: "Soybean",
        cropAgeWeeks: 5,
        sowingDate: "2026-08-15",
        expectedHarvestDate: "2026-12-15",
        farmArea: activeFarm.areaValue,
        seedVariety: "GW-322 Sharbati Certified",
        seedQuantity: 100,
        fertilizerUsed: editForm.fertilizer,
        fertilizerQuantity: 75,
        pesticidesUsed: "Azadirachtin Organic",
        previousYield: 4.2,
        expectedYield: 4.8,
        previousCropDisease: "None",
        cropHealth: "good",
        createdAt: d.iso,
        updatedAt: d.iso,
      };

      const irrigationRecord: IrrigationRecord = {
        id: `irrig_${Date.now()}`,
        snapshotId: null,
        farmId: activeFarm.id,
        userId: user.userId || user.id,
        method: "drip",
        waterSource: "borewell",
        waterAvailability: "Adequate (92%)",
        frequencyDays: 3,
        averageWaterUsageLiters: parseFloat(editForm.waterApplied) * 2300 || 42500,
        pumpCapacityHP: 5,
        createdAt: d.iso,
        updatedAt: d.iso,
      };

      const managementRecord: FarmManagement = {
        farmSize: activeFarm.areaValue,
        workers: 3,
        farmingExperienceYears: 12,
        farmingMethod: "precision",
        equipment: ["45 HP Tractor", "Drip Venturi Injector", "Boom Sprayer"],
        tractorAvailable: true,
        iotSensorsAvailable: true,
        greenhouseAvailable: false,
        storageFacility: true,
        coldStorageAvailable: false,
      };

      const newSnapshot: FarmSnapshot = {
        id: `snap_${Date.now()}`,
        userId: user.userId || user.id,
        farmId: activeFarm.id,
        date: d.date,
        day: d.day,
        time: d.time,
        timezone: d.timezone,
        timestamp: d.iso,
        farm: activeFarm,
        weather: weatherRecord,
        soil: soilRecord,
        crop: cropRecord,
        irrigation: irrigationRecord,
        management: managementRecord,
        createdAt: d.iso,
        updatedAt: d.iso,
      };

      await snapshotService.saveSnapshot(newSnapshot);
      await loadAllSnapshots();
      await refresh();

      toast({
        variant: "success",
        title: "Farm Snapshot Created",
        description: `New version recorded at ${d.time}. Historical records preserved.`,
      });
      setIsEditOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to save record",
        description: err instanceof Error ? err.message : "Save error",
      });
    }
  };

  // Handler: Delete current snapshot
  const handleDeleteSnapshot = async () => {
    if (!currentSnapshot) return;
    try {
      await snapshotService.deleteSnapshot(currentSnapshot.id);
      toast({
        variant: "success",
        title: "Snapshot Deleted",
        description: "Removed snapshot record. Previous historical snapshots remain intact.",
      });
      setIsDeleteOpen(false);
      await loadAllSnapshots();
      await refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Error deleting",
      });
    }
  };

  const username = user?.username || (user?.email ? user.email.split("@")[0] : "Aarya");
  const farmName = activeFarm?.name || "Patil Green Valley Farm";
  const farmCode = activeFarm?.farmId || `FARM-MH-${activeFarm?.id?.slice(0, 7).toUpperCase() || "PUN-001"}`;
  const farmLocation = activeFarm ? `${activeFarm.village ? activeFarm.village + ", " : ""}${activeFarm.district}, ${activeFarm.state}` : "Baramati, Pune, Maharashtra";
  const farmArea = activeFarm ? `${activeFarm.areaValue} ${activeFarm.areaUnit}` : "2.3 acres";
  const currentCropName = currentSnapshot?.crop ? `${currentSnapshot.crop.currentCrop} (${currentSnapshot.crop.cropVariety || "GW-322"})` : "Wheat (GW-322)";

  // Timestamps for display
  const stampDate = currentSnapshot?.date || "2026-09-22";
  const stampDay = currentSnapshot?.day || "Tuesday";
  const stampTime = currentSnapshot?.time || "12:42:00 PM";
  const stampTz = currentSnapshot?.timezone || "Asia/Kolkata (IST)";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Farm Data Storage"
        description="Immutable agronomic telemetry store — Every measurement is stamped with Date, Day, Time, and Username"
        icon={<Database className="h-5 w-5 text-[#2d6a4f]" />}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs shadow-xs"
              onClick={() => setIsCompareOpen(true)}
              disabled={snapshots.length < 2}
            >
              <GitCompare className="mr-1.5 h-3.5 w-3.5 text-[#2d6a4f]" />
              Compare Versions ({snapshots.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs shadow-xs"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit3 className="mr-1.5 h-3.5 w-3.5 text-[#2d6a4f]" />
              Append New Record
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs shadow-xs"
              onClick={() => router.push(`/farms/${activeFarm?.id || "farm_001"}/analysis`)}
            >
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
              Analyze Data
            </Button>
          </div>
        }
      />

      {/* USER & ACTIVE FARM IDENTITY BANNER */}
      <Card className="border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/40 shadow-xs">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Identity Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Username</p>
                <p className="mt-0.5 font-bold text-slate-800 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  {username}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Farm Name</p>
                <p className="mt-0.5 font-semibold text-slate-800 truncate" title={farmName}>
                  {farmName}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Farm ID</p>
                <p className="mt-0.5 font-mono font-semibold text-[#2d6a4f]">
                  {farmCode}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</p>
                <p className="mt-0.5 font-medium text-slate-700 truncate" title={farmLocation}>
                  <MapPin className="inline h-3 w-3 text-emerald-600 mr-0.5 -mt-0.5" />
                  {farmLocation}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Area</p>
                <p className="mt-0.5 font-semibold text-slate-800">
                  {farmArea}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Crop</p>
                <p className="mt-0.5 font-bold text-emerald-700 flex items-center gap-1">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                  {currentCropName}
                </p>
              </div>
            </div>

            {/* Farm Switcher & Snapshot Selector */}
            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
              <Select
                value={activeFarm?.id || ""}
                onValueChange={(val) => {
                  setActiveFarm(val);
                }}
              >
                <SelectTrigger className="h-8 w-44 bg-white text-xs border-slate-200">
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((f) => (
                    <SelectItem key={f.id} value={f.id} className="text-xs">
                      {f.name} ({f.areaValue} ac)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {snapshots.length > 1 && (
                <Select
                  value={selectedSnapshotId}
                  onValueChange={setSelectedSnapshotId}
                >
                  <SelectTrigger className="h-8 w-44 bg-white text-xs border-slate-200">
                    <SelectValue placeholder="Version timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {snapshots.map((s, idx) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {idx === 0 ? "★ Latest: " : "v"} {s.date} {s.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

          </div>
        </CardContent>
      </Card>

      {/* SNAPSHOT TIMESTAMP STRIP & RECORD CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
            Active Snapshot Telemetry
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-[#2d6a4f]" />
            <strong>Date:</strong> {stampDate} ({stampDay})
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="h-3.5 w-3.5 text-[#2d6a4f]" />
            <strong>Time:</strong> {stampTime}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {stampTz}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-900"
            onClick={loadAllSnapshots}
            title="Refresh records"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:bg-rose-50"
            onClick={() => setIsDeleteOpen(true)}
            title="Delete this snapshot version"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Snapshot
          </Button>
        </div>
      </div>

      {/* 5 DATA SECTIONS WITH EXPLICIT DATE, DAY, TIME */}
      <div className="space-y-6">
        
        {/* 1. WEATHER DATA */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <CloudSun className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">1. WEATHER DATA</CardTitle>
                <CardDescription className="text-xs">
                  Atmospheric readings, solar irradiance, and 5-day predictive agro-climatic forecast
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200 text-xs">
              <Calendar className="mr-1 h-3 w-3" /> {stampDate} • {stampDay} • {stampTime}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Temperature</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.weather?.avgTemperatureC ?? 29.4} °C
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Optimal vegetative</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Humidity</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.weather?.relativeHumidityPct ?? 62} %
                </p>
                <p className="text-[11px] text-slate-500">Relative atmospheric</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rainfall</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.weather?.recentRainfallMm ?? 0} mm
                </p>
                <p className="text-[11px] text-amber-600 font-medium">0% pop today</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Wind Speed</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.weather?.windSpeedKmh ?? 14} km/h
                </p>
                <p className="text-[11px] text-slate-500">North-West direction</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Solar Radiation</p>
                <p className="mt-1 text-lg font-bold text-slate-800">19.8 MJ/m²</p>
                <p className="text-[11px] text-emerald-600 font-medium">High photosynthetic flux</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cloud Cover</p>
                <p className="mt-1 text-lg font-bold text-slate-800">24 %</p>
                <p className="text-[11px] text-slate-500">Partly sunny</p>
              </div>
            </div>

            {/* 5-Day Forecast Row */}
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs font-bold text-slate-700 mb-2">5-Day Agro-Meteorological Forecast</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { day: "Wed 23 Sep", high: 30, low: 21, rain: "5%", cond: "Sunny" },
                  { day: "Thu 24 Sep", high: 29, low: 20, rain: "10%", cond: "Clear" },
                  { day: "Fri 25 Sep", high: 31, low: 22, rain: "15%", cond: "Partly Cloudy" },
                  { day: "Sat 26 Sep", high: 28, low: 19, rain: "40%", cond: "Light Rain" },
                  { day: "Sun 27 Sep", high: 29, low: 20, rain: "20%", cond: "Scattered" },
                ].map((f) => (
                  <div key={f.day} className="rounded-lg bg-white p-2 text-center border border-slate-100 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-600">{f.day}</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{f.high}° / {f.low}°</p>
                    <p className="text-[10px] text-sky-600 font-medium">{f.rain} rain • {f.cond}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Timestamp Footer */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>Sensor: IMD Pune Doppler Radar Station + Field IoT Davis Vantage Pro</span>
              <span>Logged: {stampDate} • {stampDay} • {stampTime} ({stampTz})</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. SOIL DATA */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">2. SOIL DATA</CardTitle>
                <CardDescription className="text-xs">
                  NPK macro-nutrients, volumetric moisture, pH, organic carbon, and electrical conductivity
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
              <Calendar className="mr-1 h-3 w-3" /> {stampDate} • {stampDay} • {stampTime}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Soil Type</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {currentSnapshot?.soil?.soilType ?? "Black Cotton Soil"}
                </p>
                <p className="text-[11px] text-slate-500">High water retention clay</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Soil pH</p>
                <p className="mt-1 text-lg font-bold text-[#2d6a4f]">
                  {currentSnapshot?.soil?.soilPh ?? 7.2}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Neutral (Ideal)</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nitrogen (N)</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.soil?.nitrogen ?? 240} <span className="text-xs font-normal">kg/ha</span>
                </p>
                <p className="text-[11px] text-amber-600 font-medium">Medium level</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Phosphorus (P)</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.soil?.phosphorus ?? 18} <span className="text-xs font-normal">kg/ha</span>
                </p>
                <p className="text-[11px] text-amber-600 font-medium">Low (DAP needed)</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Potassium (K)</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.soil?.potassium ?? 310} <span className="text-xs font-normal">kg/ha</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">High / Adequate</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Soil Moisture</p>
                <p className="mt-1 text-lg font-bold text-[#2d6a4f]">
                  {currentSnapshot?.soil?.moisturePct ?? 28.5} %
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Good plant available</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">EC / Salinity</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {currentSnapshot?.soil?.electricalConductivityDsM ?? 0.42} <span className="text-xs font-normal">dS/m</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Non-saline</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>Lab source: Soil Health Card ID SHC-MH-PUN-8492 • Depth: 0-30 cm root zone</span>
              <span>Logged: {stampDate} • {stampDay} • {stampTime} ({stampTz})</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. CROP DATA */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#2d6a4f] border border-emerald-100">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">3. CROP DATA</CardTitle>
                <CardDescription className="text-xs">
                  Phenological growth stage, variety lineage, sowing/harvest dates, and crop vigor index
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-[#2d6a4f] border-emerald-200 text-xs">
              <Calendar className="mr-1 h-3 w-3" /> {stampDate} • {stampDay} • {stampTime}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Crop Type</p>
                <p className="mt-1 text-base font-bold text-slate-800">
                  {currentSnapshot?.crop?.currentCrop ?? "Wheat"}
                </p>
                <p className="text-[11px] text-slate-500">Rabi Season staple</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Variety</p>
                <p className="mt-1 text-base font-bold text-slate-800">
                  {currentSnapshot?.crop?.cropVariety ?? "GW-322 (Sharbati)"}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Rust-resistant certified</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Growth Stage</p>
                <p className="mt-1 text-base font-bold text-[#2d6a4f]">
                  Tillering / Vegetative (Week {currentSnapshot?.crop?.cropAgeWeeks ?? 5})
                </p>
                <p className="text-[11px] text-slate-500">Day 38 of 120 (32% cycle)</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sowing Date</p>
                <p className="mt-1 text-base font-bold text-slate-800">
                  {currentSnapshot?.crop?.sowingDate ?? "15 Aug 2026"}
                </p>
                <p className="text-[11px] text-slate-500">Seed drill line sowing</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Expected Harvest</p>
                <p className="mt-1 text-base font-bold text-slate-800">
                  {currentSnapshot?.crop?.expectedHarvestDate ?? "15 Dec 2026"}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">84 days remaining</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Crop Health Index</p>
                <p className="mt-1 text-base font-bold text-emerald-700 capitalize">
                  {currentSnapshot?.crop?.cropHealth ?? "good"} (92/100)
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">NDVI: 0.74 (Healthy)</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>Sentinel-2 Multispectral NDVI pass + On-field crop inspection validation</span>
              <span>Logged: {stampDate} • {stampDay} • {stampTime} ({stampTz})</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. IRRIGATION DATA */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">4. IRRIGATION DATA</CardTitle>
                <CardDescription className="text-xs">
                  Micro-irrigation configuration, water consumption, before/after soil moisture, and pump schedule
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs">
              <Calendar className="mr-1 h-3 w-3" /> {stampDate} • {stampDay} • {stampTime}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Irrigation Type</p>
                <p className="mt-1 text-sm font-bold text-slate-800 capitalize">
                  {currentSnapshot?.irrigation?.method ?? "Drip Irrigation"}
                </p>
                <p className="text-[11px] text-slate-500">Inline 2 LPH emitters</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Water Source</p>
                <p className="mt-1 text-sm font-bold text-slate-800 capitalize">
                  {currentSnapshot?.irrigation?.waterSource ?? "Borewell + Pond"}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">92% reservoir level</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Moisture Before/After</p>
                <p className="mt-1 text-sm font-bold text-blue-800">
                  19.2% → {currentSnapshot?.soil?.moisturePct ?? 28.5}%
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">+9.3% field capacity delta</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Water Applied</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  18.5 mm ({currentSnapshot?.irrigation?.averageWaterUsageLiters ?? 42550} L)
                </p>
                <p className="text-[11px] text-slate-500">2.5 hours runtime</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Next Scheduled</p>
                <p className="mt-1 text-sm font-bold text-[#2d6a4f]">
                  24 Sep 2026, 06:00 AM
                </p>
                <p className="text-[11px] text-slate-500">Automated cycle in 38 hrs</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Uniformity</p>
                <p className="mt-1 text-sm font-bold text-emerald-700">
                  88 % (DU)
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">High distribution precision</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>IoT Flow Meter: Ultrasonic DN50 • Pump telemetry: 5 HP solar connected</span>
              <span>Logged: {stampDate} • {stampDay} • {stampTime} ({stampTz})</span>
            </div>
          </CardContent>
        </Card>

        {/* 5. FARM MANAGEMENT DATA */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800">5. FARM MANAGEMENT DATA</CardTitle>
                <CardDescription className="text-xs">
                  Field operations, fertilizer applications, scouting observations, and equipment log
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 text-xs">
              <Calendar className="mr-1 h-3 w-3" /> {stampDate} • {stampDay} • {stampTime}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fertilizer Applied</p>
                <p className="mt-1 text-xs font-bold text-slate-800">
                  {currentSnapshot?.crop?.fertilizerUsed ?? "Urea 45 kg + DAP 30 kg / acre"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Split application at 21 & 35 DAS</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pest Observations</p>
                <p className="mt-1 text-xs font-bold text-emerald-700">
                  Aphids trace &lt; 2% ETL (Low Risk)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Beneficial ladybugs observed</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Weed Management</p>
                <p className="mt-1 text-xs font-bold text-slate-800">
                  Hand weeding (21 DAS) completed
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Clean inter-row spacing</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Equipment Used</p>
                <p className="mt-1 text-xs font-bold text-slate-800">
                  {currentSnapshot?.management?.equipment?.join(", ") ?? "45 HP Tractor, Venturi Injector"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Calibrated at 2.4 bar pressure</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Agronomist Notes</p>
                <p className="mt-1 text-xs text-slate-700 italic">
                  &ldquo;Tillers per plant: 5.2 avg. High root nodulation. Soil moisture optimum.&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>Auditor: Aarya Patil (Certified Lead Farmer) • Verification Method: Manual Field Walk</span>
              <span>Logged: {stampDate} • {stampDay} • {stampTime} ({stampTz})</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* QUICK NEXT STEPS IN APPLICATION FLOW */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-emerald-950">Next Step in Application Flow:</p>
            <p className="text-[11px] text-emerald-800">
              Run the Autonomous Multi-Agent Farm Intelligence or simulate What-If irrigation scenarios.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-emerald-200 text-emerald-900 text-xs shadow-xs"
              onClick={() => router.push(`/farms/${activeFarm?.id || "farm_001"}/simulation`)}
            >
              <FlaskConical className="mr-1 h-3.5 w-3.5 text-[#2d6a4f]" />
              Digital Twin Simulation
            </Button>
            <Button
              size="sm"
              className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs shadow-xs"
              onClick={() => router.push(`/farms/${activeFarm?.id || "farm_001"}/analysis`)}
            >
              <BarChart3 className="mr-1 h-3.5 w-3.5" />
              Farm Intelligence Dashboard →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EDIT MODAL: Appends new version to preserve history */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Record New Farm Telemetry</h3>
                <p className="text-xs text-slate-500">Creates an immutable new snapshot version</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Temperature (°C)</Label>
                  <Input
                    value={editForm.temp}
                    onChange={(e) => setEditForm({ ...editForm, temp: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Humidity (%)</Label>
                  <Input
                    value={editForm.humidity}
                    onChange={(e) => setEditForm({ ...editForm, humidity: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Soil pH</Label>
                  <Input
                    value={editForm.soilPh}
                    onChange={(e) => setEditForm({ ...editForm, soilPh: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Soil Moisture (%)</Label>
                  <Input
                    value={editForm.soilMoisture}
                    onChange={(e) => setEditForm({ ...editForm, soilMoisture: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[11px]">N (kg/ha)</Label>
                  <Input
                    value={editForm.nitrogen}
                    onChange={(e) => setEditForm({ ...editForm, nitrogen: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">P (kg/ha)</Label>
                  <Input
                    value={editForm.phosphorus}
                    onChange={(e) => setEditForm({ ...editForm, phosphorus: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">K (kg/ha)</Label>
                  <Input
                    value={editForm.potassium}
                    onChange={(e) => setEditForm({ ...editForm, potassium: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Crop Growth Stage</Label>
                <Input
                  value={editForm.cropStage}
                  onChange={(e) => setEditForm({ ...editForm, cropStage: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Fertilizer Application</Label>
                <Input
                  value={editForm.fertilizer}
                  onChange={(e) => setEditForm({ ...editForm, fertilizer: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Agronomist Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="text-xs mt-1 h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs"
                >
                  Save & Append Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPARE MODAL: Side-by-side versions diff */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Compare Farm Telemetry Versions</h3>
                <p className="text-xs text-slate-500">Side-by-side comparison across dates and times</p>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Left Column: Current Snapshot */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2 mb-3">
                  <Badge className="bg-[#2d6a4f] text-white text-[10px]">Version A (Current)</Badge>
                  <span className="text-xs text-slate-500">{currentSnapshot?.date} {currentSnapshot?.time}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p><strong>Temperature:</strong> {currentSnapshot?.weather?.avgTemperatureC ?? 29.4} °C</p>
                  <p><strong>Humidity:</strong> {currentSnapshot?.weather?.relativeHumidityPct ?? 62} %</p>
                  <p><strong>Soil pH:</strong> {currentSnapshot?.soil?.soilPh ?? 7.2}</p>
                  <p><strong>Soil Moisture:</strong> {currentSnapshot?.soil?.moisturePct ?? 28.5} %</p>
                  <p><strong>Nitrogen:</strong> {currentSnapshot?.soil?.nitrogen ?? 240} kg/ha</p>
                  <p><strong>Growth Stage:</strong> Tillering (Week {currentSnapshot?.crop?.cropAgeWeeks ?? 5})</p>
                  <p><strong>Health Score:</strong> {currentSnapshot?.crop?.cropHealth ?? "good"}</p>
                </div>
              </div>

              {/* Right Column: Comparative Snapshot */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <Badge variant="outline" className="text-[10px]">Version B (Historical)</Badge>
                  <Select
                    value={compareSnapshotId || (snapshots[1]?.id || "")}
                    onValueChange={setCompareSnapshotId}
                  >
                    <SelectTrigger className="h-6 w-36 text-[10px] bg-white">
                      <SelectValue placeholder="Pick version" />
                    </SelectTrigger>
                    <SelectContent>
                      {snapshots.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="text-[10px]">
                          {s.date} {s.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <p><strong>Temperature:</strong> {compareSnapshot?.weather?.avgTemperatureC ?? 27.5} °C</p>
                  <p><strong>Humidity:</strong> {compareSnapshot?.weather?.relativeHumidityPct ?? 68} %</p>
                  <p><strong>Soil pH:</strong> {compareSnapshot?.soil?.soilPh ?? 7.1}</p>
                  <p><strong>Soil Moisture:</strong> {compareSnapshot?.soil?.moisturePct ?? 24.0} %</p>
                  <p><strong>Nitrogen:</strong> {compareSnapshot?.soil?.nitrogen ?? 210} kg/ha</p>
                  <p><strong>Growth Stage:</strong> Crown Root (Week {compareSnapshot?.crop?.cropAgeWeeks ?? 3})</p>
                  <p><strong>Health Score:</strong> {compareSnapshot?.crop?.cropHealth ?? "good"}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareOpen(false)}
                className="text-xs"
              >
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Delete Current Snapshot?</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Are you sure you want to remove the snapshot recorded at {stampDate} {stampTime}?
                  Other historical snapshots will remain preserved in your audit trail.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSnapshot}
                className="text-xs"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}