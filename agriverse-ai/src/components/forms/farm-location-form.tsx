"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InteractiveMap, type MapSelection } from "@/components/maps/interactive-map";
import { validateFarm } from "@/lib/validators";
import type { Farm, AreaUnit } from "@/lib/types";

export type FarmLocationValues = {
  name: string;
  country: string;
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  areaValue: number;
  areaUnit: AreaUnit;
  boundary?: [number, number][];
};

type Props = {
  initial?: Partial<FarmLocationValues>;
  onSubmit?: (values: FarmLocationValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  footer?: React.ReactNode;
  formId?: string;
};

export function FarmLocationForm({ initial, onSubmit, submitLabel = "Save Farm", showSubmit = true, footer, formId }: Props) {
  const [values, setValues] = React.useState<FarmLocationValues>({
    name: initial?.name ?? "",
    country: initial?.country ?? "India",
    state: initial?.state ?? "",
    district: initial?.district ?? "",
    village: initial?.village ?? "",
    latitude: initial?.latitude ?? 18.5204,
    longitude: initial?.longitude ?? 73.8567,
    areaValue: initial?.areaValue ?? 5,
    areaUnit: initial?.areaUnit ?? "acres",
    boundary: initial?.boundary,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = <K extends keyof FarmLocationValues>(key: K, value: FarmLocationValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleMapChange = React.useCallback((sel: MapSelection) => {
    setValues((v) => ({
      ...v,
      latitude: sel.latitude,
      longitude: sel.longitude,
      boundary: sel.boundary,
      name: v.name || sel.placeName,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFarm(values as Farm);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.(values);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Farm name" required error={errors.name}>
          <Input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g., Greenfield Farm"
          />
        </FormField>
        <FormField label="Country" required error={errors.country}>
          <Input value={values.country} onChange={(e) => set("country", e.target.value)} placeholder="India" />
        </FormField>
        <FormField label="State" required error={errors.state}>
          <Input value={values.state} onChange={(e) => set("state", e.target.value)} placeholder="Maharashtra" />
        </FormField>
        <FormField label="District" required error={errors.district}>
          <Input value={values.district} onChange={(e) => set("district", e.target.value)} placeholder="Pune" />
        </FormField>
        <FormField label="Village / City">
          <Input value={values.village} onChange={(e) => set("village", e.target.value)} placeholder="Khed Shivapur" />
        </FormField>
        <FormField label="Area unit" required>
          <Select value={values.areaUnit} onValueChange={(v) => set("areaUnit", v as AreaUnit)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acres">Acres</SelectItem>
              <SelectItem value="hectares">Hectares</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Farm area" required error={errors.areaValue} hint="Numerical area in the selected unit.">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={values.areaValue || ""}
            onChange={(e) => set("areaValue", parseFloat(e.target.value) || 0)}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Latitude" required error={errors.latitude} hint="Auto-filled by the map below.">
          <Input
            type="number"
            step="0.0001"
            value={values.latitude}
            onChange={(e) => set("latitude", parseFloat(e.target.value) || 0)}
          />
        </FormField>
        <FormField label="Longitude" required error={errors.longitude} hint="Auto-filled by the map below.">
          <Input
            type="number"
            step="0.0001"
            value={values.longitude}
            onChange={(e) => set("longitude", parseFloat(e.target.value) || 0)}
          />
        </FormField>
      </div>

      <div>
        <Label className="mb-2 block">Your farm location</Label>
        <InteractiveMap
          value={{
            latitude: values.latitude,
            longitude: values.longitude,
            boundary: values.boundary ?? [],
            placeName: values.name || "My Farm",
          }}
          onChange={handleMapChange}
          farmName={values.name}
        />
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