"use client";

import * as React from "react";
import { CloudDownload, Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateWeather } from "@/lib/validators";
import { useAuth } from "@/components/providers/auth-provider";
import { weatherService } from "@/lib/services/weatherService";
import { useToast } from "@/components/ui/use-toast";
import type { GrowingSeason, WeatherRecord } from "@/lib/types";

export type WeatherValues = Omit<
  WeatherRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

type Props = {
  initial?: Partial<WeatherValues>;
  onSubmit?: (values: WeatherValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  formId?: string;
  footer?: React.ReactNode;
};

const GROWING_SEASONS: GrowingSeason[] = ["Kharif", "Rabi", "Zaid", "Year-round"];

export function WeatherForm({ initial, onSubmit, submitLabel = "Save Weather", showSubmit = true, formId, footer }: Props) {
  const { activeFarm } = useAuth();
  const { toast } = useToast();
  const [values, setValues] = React.useState<WeatherValues>({
    avgTemperatureC: initial?.avgTemperatureC ?? 27,
    maxTemperatureC: initial?.maxTemperatureC ?? 33,
    minTemperatureC: initial?.minTemperatureC ?? 21,
    relativeHumidityPct: initial?.relativeHumidityPct ?? 58,
    annualRainfallMm: initial?.annualRainfallMm ?? 750,
    recentRainfallMm: initial?.recentRainfallMm ?? 12,
    windSpeedKmh: initial?.windSpeedKmh ?? 14,
    sunshineHours: initial?.sunshineHours ?? 8,
    growingSeason: initial?.growingSeason ?? "Rabi",
    irrigationAvailable: initial?.irrigationAvailable ?? true,
    source: initial?.source ?? "manual",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [liveLoading, setLiveLoading] = React.useState(false);

  const set = <K extends keyof WeatherValues>(key: K, value: WeatherValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleLive = async () => {
    if (!activeFarm) {
      toast({ variant: "warning", title: "No farm selected", description: "Select a farm to fetch live weather." });
      return;
    }
    setLiveLoading(true);
    try {
      const live = await weatherService.checkLiveWeather();
      if (live) {
        setValues((v) => ({ ...v, ...live }));
        toast({ variant: "success", title: "Live weather loaded", description: "Sample data from the Open-Meteo/IMD adapter (demo)." });
      }
    } finally {
      setLiveLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateWeather(values);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.({ ...values, source: "manual" });
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between rounded-lg border border-agri/15 bg-lightgreen/15 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-forest">
          <CloudDownload className="h-4 w-4" />
          <span>Use live weather data for this location</span>
        </div>
        <Button type="button" variant="soft" size="sm" onClick={handleLive} disabled={liveLoading}>
          {liveLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {liveLoading ? "Fetching…" : "Use live data"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Avg temperature (°C)" required error={errors.avgTemperatureC}>
          <Input type="number" step="0.1" value={values.avgTemperatureC || ""} onChange={(e) => set("avgTemperatureC", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Max temperature (°C)" required error={errors.maxTemperatureC}>
          <Input type="number" step="0.1" value={values.maxTemperatureC || ""} onChange={(e) => set("maxTemperatureC", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Min temperature (°C)" required error={errors.minTemperatureC}>
          <Input type="number" step="0.1" value={values.minTemperatureC || ""} onChange={(e) => set("minTemperatureC", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Relative humidity (%)" required error={errors.relativeHumidityPct}>
          <Input type="number" value={values.relativeHumidityPct || ""} onChange={(e) => set("relativeHumidityPct", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Annual rainfall (mm)" required error={errors.annualRainfallMm}>
          <Input type="number" value={values.annualRainfallMm || ""} onChange={(e) => set("annualRainfallMm", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Recent rainfall (mm)">
          <Input type="number" value={values.recentRainfallMm || ""} onChange={(e) => set("recentRainfallMm", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Wind speed (km/h)" required error={errors.windSpeedKmh}>
          <Input type="number" step="0.1" value={values.windSpeedKmh || ""} onChange={(e) => set("windSpeedKmh", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Sunshine (hours/day)">
          <Input type="number" value={values.sunshineHours || ""} onChange={(e) => set("sunshineHours", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Growing season" required>
          <Select value={values.growingSeason} onValueChange={(v) => set("growingSeason", v as GrowingSeason)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GROWING_SEASONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-agri/10 bg-white p-4">
        <Switch
          checked={values.irrigationAvailable}
          onCheckedChange={(v) => set("irrigationAvailable", v)}
          aria-label="Irrigation availability"
        />
        <div>
          <p className="text-sm font-medium text-dark">Irrigation available</p>
          <p className="text-xs text-dark/55">Whether irrigation infrastructure is accessible for this farm.</p>
        </div>
      </div>

      {footer}
      {showSubmit && onSubmit && (
        <div className="flex justify-end">
          <button type="submit" className="inline-flex h-10 items-center rounded-lg gradient-brand px-5 text-sm font-medium text-white shadow-md hover:opacity-90">
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}