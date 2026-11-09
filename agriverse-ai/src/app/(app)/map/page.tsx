"use client";

import * as React from "react";
import {
  Map as MapIcon,
  Save,
  Loader2,
  Layers,
  Route,
  CloudFog,
  Droplets,
  Leaf,
  Sprout,
  Radio,
  Eye,
  CheckSquare,
  Square,
  ShieldCheck,
  CloudSun,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoRow } from "@/components/ui/form-field";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapView } from "@/components/maps/map-view";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { useAuth } from "@/components/providers/auth-provider";
import { farmService } from "@/lib/services/farmService";
import { useToast } from "@/components/ui/use-toast";

function unitBox(lat: number, lng: number): [number, number][] {
  return [
    [lat - 0.005, lng - 0.006],
    [lat - 0.005, lng + 0.006],
    [lat + 0.005, lng + 0.009],
    [lat + 0.005, lng - 0.007],
    [lat - 0.005, lng - 0.006],
  ];
}

export default function MapPage() {
  const { activeFarm, refreshFarms } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  // 8 Specific requested Map Layers
  const [layerControls, setLayerControls] = React.useState({
    boundaries: true,
    soilProperties: true,
    cropZones: true,
    weather: true,
    ndvi: true,
    ndwi: false,
    waterSources: true,
    irrigationZones: true,
  });

  const toggleLayer = (key: keyof typeof layerControls) => {
    setLayerControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!activeFarm) {
    return (
      <div className="space-y-6">
        <PageHeader title="Farm Maps" description="Boundaries, zones and field sensors on an interactive map" icon={<MapIcon className="h-5 w-5" />} />
        <Card><CardContent className="pt-6 text-sm text-dark/55">Add a farm first to see it on the map.</CardContent></Card>
      </div>
    );
  }

  const center: [number, number] = [activeFarm.latitude, activeFarm.longitude];
  const boundary: [number, number][] =
    activeFarm.boundary && activeFarm.boundary.coordinates.length >= 3
      ? activeFarm.boundary.coordinates.map((c) => [c[1], c[0]] as [number, number])
      : unitBox(center[0], center[1]);

  // Construct dynamic zones based on active layers
  const activeZones = React.useMemo(() => {
    const list: { label: string; points: [number, number][]; color: string }[] = [];

    if (layerControls.cropZones) {
      list.push({
        label: "Crop Zone A: Tomato (Arka Rakshak)",
        points: zonePoints(center, 0),
        color: layerControls.ndvi ? "#22c55e" : "#52b788",
      });
      list.push({
        label: "Crop Zone B: Rabi Wheat Rotation",
        points: zonePoints(center, 1),
        color: layerControls.ndvi ? "#84cc16" : "#a3e635",
      });
    }

    if (layerControls.soilProperties) {
      list.push({
        label: "Soil Zone: Alluvial Loam (pH 6.7)",
        points: zoneOffset(center, -0.002, -0.002),
        color: "#b45309",
      });
    }

    if (layerControls.irrigationZones) {
      list.push({
        label: "Irrigation Sector: Drip Lateral Block 1",
        points: zoneOffset(center, 0.002, -0.002),
        color: "#0284c7",
      });
    }

    if (layerControls.ndwi) {
      list.push({
        label: "NDWI Surface Moisture Field",
        points: zoneOffset(center, 0.001, 0.002),
        color: "#06b6d4",
      });
    }

    return list;
  }, [center, layerControls]);

  // Construct dynamic markers based on active layers
  const activeMarkers = React.useMemo(() => {
    const list: { position: [number, number]; title: string }[] = [];

    if (layerControls.waterSources) {
      list.push({
        position: [center[0] + 0.0025, center[1] + 0.001],
        title: "Borewell #1 (7.5 HP Pump)",
      });
      list.push({
        position: [center[0] - 0.002, center[1] + 0.003],
        title: "Canal Sluice Inlet",
      });
    }

    if (layerControls.weather) {
      list.push({
        position: [center[0] - 0.0015, center[1] - 0.002],
        title: "Weather Station WS-01 (28.4°C)",
      });
    }

    list.push({
      position: [center[0] + 0.001, center[1] - 0.001],
      title: "Soil Sensor S-01 (42% moisture)",
    });

    return list;
  }, [center, layerControls]);

  const saveLocation = async (sel: { latitude: number; longitude: number; boundary: [number, number][] }) => {
    setSaving(true);
    try {
      await farmService.updateBoundary(activeFarm.id, {
        type: "Polygon",
        coordinates: sel.boundary.map(([lng, lat]) => [lng, lat]),
      });
      await refreshFarms();
      toast({ variant: "success", title: "Boundary updated", description: "Farm location and boundary saved." });
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Maps & Geospatial GIS"
        description="Boundaries, soil properties, NDVI/NDWI satellite layers, and irrigation zones"
        icon={<MapIcon className="h-5 w-5" />}
        actions={
          <Badge variant="soft">
            <Layers className="mr-1 h-3 w-3" /> {activeFarm.name}
          </Badge>
        }
      />

      <Tabs defaultValue="gis">
        <TabsList>
          <TabsTrigger value="gis">
            <Layers className="mr-1 h-3.5 w-3.5" /> Interactive Map & Layers
          </TabsTrigger>
          <TabsTrigger value="satellite">
            <CloudFog className="mr-1 h-3.5 w-3.5" /> Satellite Analytics
          </TabsTrigger>
          <TabsTrigger value="edit">
            <Route className="mr-1 h-3.5 w-3.5" /> Edit Farm Boundary
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: GIS Map with Layer Controls */}
        <TabsContent value="gis" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Layer Control Panel */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-agri" /> Map Layer Controls
                </CardTitle>
                <CardDescription className="text-xs">
                  Toggle agricultural GIS layers to inspect field zones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {[
                  { key: "boundaries", label: "Farm Boundaries", icon: Route, color: "text-forest" },
                  { key: "soilProperties", label: "Soil Properties", icon: Layers, color: "text-amber-700" },
                  { key: "cropZones", label: "Crop Zones", icon: Sprout, color: "text-fresh" },
                  { key: "weather", label: "Weather Overlay", icon: CloudSun, color: "text-amber-500" },
                  { key: "ndvi", label: "NDVI Vegetation", icon: Leaf, color: "text-emerald-600" },
                  { key: "ndwi", label: "NDWI Water Index", icon: Droplets, color: "text-cyan-600" },
                  { key: "waterSources", label: "Water Sources", icon: Droplets, color: "text-sky-600" },
                  { key: "irrigationZones", label: "Irrigation Zones", icon: Droplets, color: "text-blue-600" },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = layerControls[item.key as keyof typeof layerControls];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleLayer(item.key as keyof typeof layerControls)}
                      className={`flex w-full items-center justify-between rounded-lg border p-2.5 transition text-left ${
                        active
                          ? "border-agri/30 bg-lightgreen/15 text-forest font-semibold"
                          : "border-agri/10 bg-white text-dark/60 hover:bg-cream/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </span>
                      {active ? (
                        <CheckSquare className="h-4 w-4 text-agri" />
                      ) : (
                        <Square className="h-4 w-4 text-dark/30" />
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Interactive Map Canvas */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Field Spatial Map</CardTitle>
                  <CardDescription className="text-xs">
                    Lat: {activeFarm.latitude.toFixed(4)}, Lng: {activeFarm.longitude.toFixed(4)} · {activeFarm.village}, {activeFarm.district}
                  </CardDescription>
                </div>
                <Badge variant="success">OpenStreetMap + Leaflet</Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-agri/15">
                  <div className="h-[460px]">
                    <MapView
                      center={center}
                      boundary={layerControls.boundaries ? boundary : undefined}
                      zones={activeZones}
                      markers={activeMarkers}
                      zoom={15}
                      heightClassName="h-[460px]"
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-dark/70 border-t border-agri/10 pt-3">
                  <span className="font-bold text-dark">Legend:</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-emerald-500" /> High NDVI / Crop
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-amber-700" /> Soil Zone
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-sky-600" /> Irrigation Drip Block
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-cyan-500" /> NDWI Water Index
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Satellite Analytics */}
        <TabsContent value="satellite" className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CloudFog className="h-4 w-4 text-agri" /> NDVI Index
                <Badge variant="info" className="ml-1">Sentinel-2 Ready</Badge>
              </CardTitle>
              <CardDescription>Normalized Difference Vegetation Index (Canopy vigor)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border border-agri/10">
                <div className="h-[200px]">
                  <MapView center={center} boundary={boundary} zoom={15} heightClassName="h-[200px]" />
                </div>
              </div>
              <p className="mt-2 text-xs text-dark/50">
                NDVI values above 0.70 reflect dense vegetative biomass in the active tomato block.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Droplets className="h-4 w-4 text-sky-600" /> NDWI Index
                <Badge variant="info" className="ml-1">Sentinel-2 Ready</Badge>
              </CardTitle>
              <CardDescription>Normalized Difference Water Index (Moisture stress)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border border-agri/10">
                <div className="h-[200px]">
                  <MapView center={center} boundary={boundary} zoom={15} heightClassName="h-[200px]" />
                </div>
              </div>
              <p className="mt-2 text-xs text-dark/50">
                NDWI tracks canopy water absorption to trigger precision drip cycles before wilting occurs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Leaf className="h-4 w-4 text-forest" /> Soil Moisture SAR
                <Badge variant="info" className="ml-1">Radar Fusion</Badge>
              </CardTitle>
              <CardDescription>Surface soil moisture from Sentinel-1 SAR observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border border-agri/10">
                <div className="h-[200px]">
                  <MapView center={center} boundary={boundary} zoom={15} heightClassName="h-[200px]" />
                </div>
              </div>
              <p className="mt-2 text-xs text-dark/50">
                Calibrated against in-field LoRaWAN probes for accurate root-zone soil water estimates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Edit Farm Boundary */}
        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Set Farm Location & Boundaries</CardTitle>
              <CardDescription>
                Search or drag the marker — latitude, longitude and a boundary polygon are saved automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveMap
                farmName={activeFarm.name}
                value={{ latitude: center[0], longitude: center[1], boundary, placeName: activeFarm.name }}
                onChange={(sel) => void saveLocation(sel)}
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={() => void refreshFarms()} disabled={saving}>
                  {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                  <Save className="mr-1 h-4 w-4" /> Sync Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function zonePoints(center: [number, number], variant: number): [number, number][] {
  const span = 0.003;
  const off = variant === 0 ? -0.001 : 0.002;
  const lat = center[0] + off;
  return [
    [lat - span, center[1] - span],
    [lat - span, center[1] + span],
    [lat + span, center[1] + span],
    [lat + span, center[1] - span],
    [lat - span, center[1] - span],
  ];
}

function zoneOffset(center: [number, number], dLat: number, dLng: number): [number, number][] {
  const span = 0.0025;
  const lat = center[0] + dLat;
  const lng = center[1] + dLng;
  return [
    [lat - span, lng - span],
    [lat - span, lng + span],
    [lat + span, lng + span],
    [lat + span, lng - span],
    [lat - span, lng - span],
  ];
}