"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Sparkles,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Info,
  Compass,
  CornerDownRight,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { dateParts } from "@/lib/utils";
import type { FieldData } from "@/components/map/FieldMap";

// Dynamic client import for existing Mapbox FieldMap with SSR disabled
const FieldMap = dynamic(() => import("@/components/map/FieldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] w-full flex-col items-center justify-center rounded-2xl bg-slate-900 text-white/80 shadow-md">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      <p className="mt-3 text-sm font-semibold">Initializing Mapbox Satellite Field Map...</p>
      <p className="text-xs text-white/50">Loading standard satellite imagery & parcel drawing tools</p>
    </div>
  ),
});

// Preset Agricultural Locations
const PRESET_LOCATIONS = [
  { name: "Pune, Maharashtra, India", lat: 18.5204, lng: 73.8567, village: "Khed Shivapur", district: "Pune" },
  { name: "Baramati, Maharashtra, India", lat: 18.1517, lng: 74.5772, village: "Malegaon", district: "Pune" },
  { name: "Nashik, Maharashtra, India", lat: 19.9975, lng: 73.7898, village: "Dindori", district: "Nashik" },
  { name: "Satara, Maharashtra, India", lat: 17.6805, lng: 74.0183, village: "Karad", district: "Satara" },
  { name: "Shirur, Maharashtra, India", lat: 18.8271, lng: 74.3739, village: "Nhavare", district: "Pune" },
];

export default function SelectFarmLocationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [fieldData, setFieldData] = React.useState<FieldData | null>({
    field_id: "FIELD_001",
    latitude: 18.5204,
    longitude: 73.8567,
    area_acres: 2.3,
    area_square_meters: 9307.78,
    boundary: [
      [73.8567, 18.5204],
      [73.8597, 18.5224],
      [73.8617, 18.5194],
      [73.8587, 18.5174],
      [73.8567, 18.5204],
    ],
    address: "Pune, Maharashtra, India",
  });

  const [selectedAddress, setSelectedAddress] = React.useState<string>("Pune, Maharashtra, India");
  const [initialCenter, setInitialCenter] = React.useState<[number, number]>([73.8567, 18.5204]);

  const handleFieldSelect = (data: FieldData | null) => {
    if (data) {
      setFieldData(data);
      if (data.address) {
        setSelectedAddress(data.address);
      }
    }
  };

  const handleConfirmLocation = (confirmed?: FieldData) => {
    const dataToSave = confirmed || fieldData;
    if (!dataToSave) {
      toast({
        variant: "destructive",
        title: "No field boundary selected",
        description: "Please draw your farm boundary on the map before proceeding.",
      });
      return;
    }

    const stamp = dateParts();
    const username = user?.username || (user?.email ? user.email.split("@")[0] : "Aarya");
    const userId = user?.userId || user?.id || "user_001";
    const farmId = `FARM-MH-${Date.now().toString().slice(-4)}`;

    const draft = {
      farmId,
      userId,
      username,
      latitude: dataToSave.latitude,
      longitude: dataToSave.longitude,
      boundary: {
        type: "Polygon",
        coordinates: dataToSave.boundary,
      },
      area: dataToSave.area_acres,
      areaUnit: "acres",
      address: dataToSave.address || selectedAddress || "Pune, Maharashtra, India",
      state: "Maharashtra",
      country: "India",
      date: stamp.date,
      day: stamp.day,
      time: stamp.time,
      timestamp: stamp.iso,
      timezone: stamp.timezone,
    };

    // Save to localStorage draft for the next step in flow: Farm Information
    try {
      localStorage.setItem("agriverse_farm_draft", JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save draft:", e);
    }

    toast({
      variant: "success",
      title: "Farm Location Confirmed",
      description: `Saved ${dataToSave.area_acres} acres parcel (${dataToSave.latitude}, ${dataToSave.longitude}). Proceeding to Farm Information.`,
    });

    router.push("/farms/add/information");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
            <Compass className="h-4 w-4" />
            Step 1 of 2 · Satellite GIS Parcel Mapping
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight sm:text-3xl">
            Select Your Farm Location
          </h1>
          <p className="text-sm text-slate-500">
            Use the integrated Mapbox satellite map to search your village, trace your field boundary, and compute acreage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-[#2d6a4f] border-emerald-200 text-xs px-3 py-1">
            <Globe2 className="h-3.5 w-3.5 mr-1" /> Standard Satellite View
          </Badge>
        </div>
      </div>

      {/* Main Map & Side Details Layout */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Map Column (8 cols): Embedding Existing FieldMap */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-lg">
            <FieldMap
              initialCenter={initialCenter}
              initialZoom={14}
              onFieldSelect={handleFieldSelect}
              onConfirm={handleConfirmLocation}
              height="100%"
              showConfirmButton={true}
            />
          </div>

          {/* Quick instructions strip under map */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[#2d6a4f] font-bold text-[11px]">
                i
              </span>
              <span>
                Use <strong>✏️ Draw Field</strong> in the bottom-left to outline parcel vertices. Double-click or press Enter to close the polygon.
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Mapbox GL JS + Turf.js</span>
          </div>
        </div>

        {/* Right-Side Panel: LOCATION DETAILS (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-[#2d6a4f]" />
                  LOCATION DETAILS
                </h2>
                <Badge variant="outline" className="border-emerald-200 text-[#2d6a4f] text-xs bg-emerald-50/60">
                  GPS Centroid
                </Badge>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">Latitude</span>
                  <span className="text-lg font-bold text-slate-800 font-mono mt-0.5 block">
                    {fieldData ? fieldData.latitude.toFixed(4) : "18.5204"}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">Longitude</span>
                  <span className="text-lg font-bold text-slate-800 font-mono mt-0.5 block">
                    {fieldData ? fieldData.longitude.toFixed(4) : "73.8567"}
                  </span>
                </div>
              </div>

              {/* Calculated Area Card */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
                    Calculated Parcel Area
                  </span>
                  <Badge className="bg-[#2d6a4f] text-white text-[10px]">Turf.js Geodesy</Badge>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#1b4332]">
                    {fieldData ? fieldData.area_acres : "2.3"}
                  </span>
                  <span className="text-sm font-bold text-[#2d6a4f]">acres</span>
                  <span className="text-xs text-slate-500">
                    ({fieldData ? fieldData.area_square_meters : "9,308"} m²)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Calculated automatically from your field polygon boundary.
                </p>
              </div>

              {/* Address Preview */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-700 block">Selected Address / Region:</span>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 font-medium leading-relaxed">
                  {selectedAddress}
                </div>
              </div>

              {/* Date & Time metadata */}
              <div className="border-t border-slate-100 pt-3 space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="font-medium text-slate-700">{dateParts().date} {dateParts().time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span className="font-medium text-slate-700">{dateParts().timezone}</span>
                </div>
              </div>

              {/* Primary Confirmation Button */}
              <Button
                type="button"
                onClick={() => handleConfirmLocation()}
                className="w-full justify-center bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-md font-bold text-xs h-11 rounded-xl"
              >
                Confirm Farm Location <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Presets Drawer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Quick Select Agricultural Hubs:
            </span>
            <div className="space-y-1.5">
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    setInitialCenter([loc.lng, loc.lat]);
                    setSelectedAddress(loc.name);
                    setFieldData((prev) =>
                      prev
                        ? {
                            ...prev,
                            latitude: loc.lat,
                            longitude: loc.lng,
                            address: loc.name,
                          }
                        : null
                    );
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-2 text-left text-xs transition-colors hover:bg-emerald-50/50 hover:border-emerald-200"
                >
                  <span className="font-medium text-slate-700">{loc.name}</span>
                  <CornerDownRight className="h-3.5 w-3.5 text-[#2d6a4f] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
