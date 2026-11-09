"use client";

import * as React from "react";
import { CloudSun, Thermometer, Droplets, CloudRain, Wind, Save, CloudDownload, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoRow } from "@/components/ui/form-field";
import { AreaChart, BarChart } from "@/components/charts";
import { WeatherForm, type WeatherValues } from "@/components/forms/weather-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import { submitFarmData } from "@/lib/services/submitFarmData";
import { weatherService } from "@/lib/services/weatherService";
import { DEMO_FORECAST } from "@/lib/data/demo";
import type { LucideIcon } from "lucide-react";

export default function WeatherPage() {
  const { user, activeFarm } = useAuth();
  const { snapshot, refresh, loading } = useFarmData();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [liveLoading, setLiveLoading] = React.useState(false);
  const [forecast, setForecast] = React.useState(DEMO_FORECAST);

  React.useEffect(() => {
    if (activeFarm) weatherService.getForecast().then(setForecast).catch(() => undefined);
  }, [activeFarm]);

  const handleSave = async (values: WeatherValues) => {
    if (!user || !activeFarm) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await weatherService.submitWeather(activeFarm.id, user.id, values);
      await submitFarmData(user.id, activeFarm.id, {
        weather: {
          ...values,
          id: `wth_${Date.now()}`,
          snapshotId: null,
          farmId: activeFarm.id,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        },
        changes: ["Weather updated"],
        label: "Weather update",
        title: "Weather Updated",
      });
      await refresh();
      toast({ variant: "success", title: "Weather saved", description: "Weather record created and added to farm history." });
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLive = async () => {
    if (!activeFarm) return;
    setLiveLoading(true);
    try {
      await weatherService.checkLiveWeather();
      toast({ variant: "success", title: "Live weather fetched", description: "Demo data from the Open-Meteo/IMD adapter." });
    } finally {
      setLiveLoading(false);
    }
  };

  if (loading) return <WeatherSkeleton />;

  const weather = snapshot?.weather;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weather Intelligence"
        description="Current and historical weather for your farm"
        icon={<CloudSun className="h-5 w-5" />}
        actions={
          <Button variant="soft" onClick={handleLive} disabled={liveLoading}>
            {liveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />}
            Use live weather data
          </Button>
        }
      />

      {weather && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <WeatherMetric icon={Thermometer} label="Temperature" value={`${weather.avgTemperatureC}°C`} sub={`H ${weather.maxTemperatureC}° · L ${weather.minTemperatureC}°`} />
          <WeatherMetric icon={Droplets} label="Humidity" value={`${weather.relativeHumidityPct}%`} />
          <WeatherMetric icon={CloudRain} label="Rainfall (annual)" value={`${weather.annualRainfallMm} mm`} sub={`Recent: ${weather.recentRainfallMm} mm`} />
          <WeatherMetric icon={Wind} label="Wind speed" value={`${weather.windSpeedKmh} km/h`} sub={`${weather.sunshineHours} hrs sunshine`} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">7-Day Forecast</CardTitle>
            <CardDescription>
              {activeFarm?.district}, {activeFarm?.state}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {forecast.map((d) => (
                <div key={d.date} className="flex flex-col items-center rounded-xl border border-agri/10 bg-cream/60 p-3 text-center">
                  <p className="text-xs font-semibold text-dark/70">{d.day}</p>
                  <CloudRain className="my-2 h-5 w-5 text-agri" />
                  <p className="text-sm font-bold text-dark">{d.tempHighC}°</p>
                  <p className="text-xs text-dark/50">{d.tempLowC}°</p>
                  <p className="mt-1 text-[11px] text-sky-700">{d.rainfallMm} mm</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-dark/70">Temperature trend (high / low)</p>
              <AreaChart
                data={forecast.map((d) => ({ day: d.day, High: d.tempHighC, Low: d.tempLowC }))}
                xKey="day"
                series={[
                  { key: "High", name: "High", color: "#8b5e3c" },
                  { key: "Low", name: "Low", color: "#52b788" },
                ]}
                height={200}
              />
            </div>
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-dark/70">Rainfall projection (mm)</p>
              <BarChart
                data={forecast.map((d) => ({ day: d.day, Rainfall: d.rainfallMm }))}
                xKey="day"
                series={[{ key: "Rainfall", name: "Rain", color: "#52b788" }]}
                height={160}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Growing Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            {weather && (
              <>
                <InfoRow label="Growing season" value={<Badge variant="soft">{weather.growingSeason}</Badge>} />
                <InfoRow label="Avg temperature" value={`${weather.avgTemperatureC}°C`} />
                <InfoRow label="Humidity" value={`${weather.relativeHumidityPct}%`} />
                <InfoRow label="Annual rainfall" value={`${weather.annualRainfallMm} mm`} />
                <InfoRow label="Sunshine" value={`${weather.sunshineHours} hrs/day`} />
                <InfoRow label="Irrigation available" value={weather.irrigationAvailable ? <Badge variant="success">Yes</Badge> : <Badge variant="destructive">No</Badge>} />
                <div className="mt-4 rounded-lg bg-sky-50 p-3 text-xs text-sky-800">
                  <p className="font-medium">Provider readiness</p>
                  <p className="mt-1">
                    This panel is wired for Open-Meteo / IMD live data. When the FastAPI weather agent
                    is connected, forecasts and recent rainfall auto-populate here.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Update Weather Details</CardTitle>
            <CardDescription>Submitting creates a new farm snapshot — history is never overwritten.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form">
            <TabsList>
              <TabsTrigger value="form">Enter manually</TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-1">
                <CloudDownload className="h-3.5 w-3.5" /> Live data
              </TabsTrigger>
            </TabsList>
<TabsContent value="form" className="mt-4">
          <WeatherForm
            formId="wpage-weather"
            initial={weather ?? undefined}
            showSubmit={false}
            onSubmit={handleSave}
          />
          <div className="flex justify-end pt-4">
            <Button onClick={() => (document.getElementById("wpage-weather") as HTMLFormElement | null)?.requestSubmit()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="mr-1 h-4 w-4" /> Save Weather
            </Button>
          </div>
        </TabsContent>
            <TabsContent value="live" className="mt-4">
              <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-agri/25 bg-lightgreen/10 px-6 py-10 text-center">
                <CloudDownload className="h-8 w-8 text-agri" />
                <p className="max-w-sm text-sm text-dark/60">
                  Fetches real-time conditions for your farm coordinates via the Open-Meteo / IMD
                  adapter (backend integration).
                </p>
                <Button variant="soft" onClick={handleLive} disabled={liveLoading}>
                  {liveLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Fetch live conditions
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function WeatherMetric({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-agri/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4.5 w-4.5 text-agri" />
        <p className="text-xs font-medium text-dark/50">{label}</p>
      </div>
      <p className="mt-2 text-xl font-bold text-dark">{value}</p>
      {sub && <p className="text-xs text-dark/45">{sub}</p>}
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-72" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}