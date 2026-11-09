"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateIrrigation } from "@/lib/validators";
import type { IrrigationMethod, IrrigationRecord, WaterSource } from "@/lib/types";

export type IrrigationValues = Omit<
  IrrigationRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

type Props = {
  initial?: Partial<IrrigationValues>;
  onSubmit?: (values: IrrigationValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  formId?: string;
};

const METHODS: IrrigationMethod[] = ["drip", "sprinkler", "flood", "rainfed", "other"];
const SOURCES: WaterSource[] = ["borewell", "river", "canal", "reservoir", "rainwater", "other"];

export function IrrigationForm({
  initial,
  onSubmit,
  submitLabel = "Save Irrigation Data",
  showSubmit = true,
  formId,
}: Props) {
  const [values, setValues] = React.useState<IrrigationValues>({
    method: initial?.method ?? "drip",
    waterSource: initial?.waterSource ?? "borewell",
    waterAvailability: initial?.waterAvailability ?? "",
    frequencyDays: initial?.frequencyDays ?? 3,
    averageWaterUsageLiters: initial?.averageWaterUsageLiters ?? 35000,
    pumpCapacityHP: initial?.pumpCapacityHP ?? 7.5,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = <K extends keyof IrrigationValues>(key: K, value: IrrigationValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateIrrigation(values);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.(values);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Irrigation method" required error={errors.method}>
          <Select value={values.method} onValueChange={(v) => set("method", v as IrrigationMethod)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>{m[0]!.toUpperCase() + m.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Water source" required error={errors.waterSource}>
          <Select value={values.waterSource} onValueChange={(v) => set("waterSource", v as WaterSource)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOURCES.map((s) => (
                <SelectItem key={s} value={s}>{s[0]!.toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Water availability" required error={errors.waterAvailability}>
          <Input value={values.waterAvailability} onChange={(e) => set("waterAvailability", e.target.value)} placeholder="Adequate / Seasonal / Scarce" />
        </FormField>
        <FormField label="Irrigation frequency (days)">
          <Input type="number" value={values.frequencyDays || ""} onChange={(e) => set("frequencyDays", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Average water usage (litres/cycle)">
          <Input type="number" value={values.averageWaterUsageLiters || ""} onChange={(e) => set("averageWaterUsageLiters", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Pump capacity (HP)">
          <Input type="number" step="0.1" value={values.pumpCapacityHP || ""} onChange={(e) => set("pumpCapacityHP", parseFloat(e.target.value) || 0)} />
        </FormField>
      </div>

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