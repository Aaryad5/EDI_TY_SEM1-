"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validatePreferences } from "@/lib/validators";
import { CROPS } from "@/lib/data/catalog";
import type { FarmerPreferences, FarmingGoal } from "@/lib/types";

export type PreferencesValues = FarmerPreferences;

type Props = {
  initial?: Partial<PreferencesValues>;
  onSubmit?: (values: PreferencesValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  formId?: string;
};

const GOALS: { value: FarmingGoal; label: string; desc: string }[] = [
  { value: "maximum_yield", label: "Maximum yield", desc: "Focus on maximizing harvest volume." },
  { value: "maximum_profit", label: "Maximum profit", desc: "Focus on high-value cash crops." },
  { value: "water_conservation", label: "Water conservation", desc: "Prioritize efficient water use." },
  { value: "sustainable_farming", label: "Sustainable farming", desc: "Long-term soil and ecosystem health." },
  { value: "organic_production", label: "Organic production", desc: "Organic-certified produce." },
];

export function FarmerPreferencesForm({
  initial,
  onSubmit,
  submitLabel = "Save Preferences",
  showSubmit = true,
  formId,
}: Props) {
  const [values, setValues] = React.useState<PreferencesValues>({
    mainGoal: initial?.mainGoal ?? "maximum_profit",
    preferredCrops: initial?.preferredCrops ?? [],
    budget: initial?.budget ?? 50000,
    riskTolerance: initial?.riskTolerance ?? "medium",
    preferredMarket: initial?.preferredMarket ?? "",
    targetSellingPeriod: initial?.targetSellingPeriod ?? "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = <K extends keyof PreferencesValues>(key: K, value: PreferencesValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const toggleCrop = (crop: string, checked: boolean) => {
    setValues((v) => ({
      ...v,
      preferredCrops: checked ? [...v.preferredCrops, crop] : v.preferredCrops.filter((c) => c !== crop),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePreferences(values);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.(values);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-dark/80">Main farming goal</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => set("mainGoal", goal.value)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                values.mainGoal === goal.value
                  ? "border-agri bg-agri text-white"
                  : "border-agri/15 bg-white hover:bg-lightgreen/15"
              }`}
            >
              <p className="text-sm font-semibold">{goal.label}</p>
              <p className={`mt-0.5 text-xs ${values.mainGoal === goal.value ? "text-white/80" : "text-dark/55"}`}>
                {goal.desc}
              </p>
            </button>
          ))}
        </div>
        {errors.mainGoal && <p className="mt-1 text-xs text-red-600">{errors.mainGoal}</p>}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-dark/80">Preferred crops</p>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CROPS.slice(0, 12).map((c) => (
            <label key={c.id} className="flex items-center gap-2 rounded-lg border border-agri/10 bg-white px-3 py-2 text-sm text-dark hover:bg-lightgreen/10">
              <Checkbox checked={values.preferredCrops.includes(c.name)} onCheckedChange={(chk) => toggleCrop(c.name, !!chk)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Budget (₹)" required error={errors.budget}>
          <Input type="number" value={values.budget || ""} onChange={(e) => set("budget", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Risk tolerance" required error={errors.riskTolerance}>
          <Select value={values.riskTolerance} onValueChange={(v) => set("riskTolerance", v as PreferencesValues["riskTolerance"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Preferred market" required error={errors.preferredMarket}>
          <Select value={values.preferredMarket || undefined} onValueChange={(v) => set("preferredMarket", v)}>
            <SelectTrigger><SelectValue placeholder="Select market" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="local_mandi">Local Mandi</SelectItem>
              <SelectItem value="apmc">APMC Yard</SelectItem>
              <SelectItem value="direct_retail">Direct to retailers</SelectItem>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="fpo">FPO collective</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Target selling period">
          <Select value={values.targetSellingPeriod || undefined} onValueChange={(v) => set("targetSellingPeriod", v)}>
            <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Harvest-time (immediate)</SelectItem>
              <SelectItem value="stored">Store & sell later</SelectItem>
              <SelectItem value="peak_demand">Sell at peak demand</SelectItem>
            </SelectContent>
          </Select>
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