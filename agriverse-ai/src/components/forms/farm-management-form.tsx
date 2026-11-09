"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { validateManagement } from "@/lib/validators";
import type { FarmManagement, FarmingMethod } from "@/lib/types";

export type ManagementValues = FarmManagement;

type Props = {
  initial?: Partial<ManagementValues>;
  onSubmit?: (values: ManagementValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  formId?: string;
};

const METHODS: { value: FarmingMethod; label: string }[] = [
  { value: "conventional", label: "Conventional" },
  { value: "organic", label: "Organic" },
  { value: "precision", label: "Precision farming" },
  { value: "mixed", label: "Mixed" },
];

export function FarmManagementForm({
  initial,
  onSubmit,
  submitLabel = "Save Farm Management",
  showSubmit = true,
  formId,
}: Props) {
  const [values, setValues] = React.useState<ManagementValues>({
    farmSize: initial?.farmSize ?? 5,
    workers: initial?.workers ?? 3,
    farmingExperienceYears: initial?.farmingExperienceYears ?? 8,
    farmingMethod: initial?.farmingMethod ?? "conventional",
    equipment: initial?.equipment ?? [],
    tractorAvailable: initial?.tractorAvailable ?? false,
    iotSensorsAvailable: initial?.iotSensorsAvailable ?? false,
    greenhouseAvailable: initial?.greenhouseAvailable ?? false,
    storageFacility: initial?.storageFacility ?? false,
    coldStorageAvailable: initial?.coldStorageAvailable ?? false,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = <K extends keyof ManagementValues>(key: K, value: ManagementValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const toggleEquipment = (tool: string, checked: boolean) => {
    setValues((v) => ({
      ...v,
      equipment: checked ? [...v.equipment, tool] : v.equipment.filter((t) => t !== tool),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateManagement(values);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.(values);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Farm size (acres)" required error={errors.farmSize}>
          <Input type="number" step="0.1" value={values.farmSize || ""} onChange={(e) => set("farmSize", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Number of workers" required error={errors.workers}>
          <Input type="number" value={values.workers || ""} onChange={(e) => set("workers", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Farming experience (years)" required error={errors.farmingExperienceYears}>
          <Input type="number" value={values.farmingExperienceYears || ""} onChange={(e) => set("farmingExperienceYears", parseFloat(e.target.value) || 0)} />
        </FormField>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-dark/80">Farming method</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => set("farmingMethod", m.value)}
              className={`rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                values.farmingMethod === m.value
                  ? "border-agri bg-agri text-white"
                  : "border-agri/15 bg-white text-dark hover:bg-lightgreen/15"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {errors.farmingMethod && <p className="mt-1 text-xs text-red-600">{errors.farmingMethod}</p>}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-dark/80">Equipment available</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {["Tractor", "Plough", "Harvester", "Seeder", "Sprayer", "Water pump", "Mulcher", "Thresher"].map((tool) => (
            <label key={tool} className="flex items-center gap-2 rounded-lg border border-agri/10 bg-white px-3 py-2 text-sm text-dark hover:bg-lightgreen/10">
              <Checkbox
                checked={values.equipment.includes(tool)}
                onCheckedChange={(c) => toggleEquipment(tool, !!c)}
              />
              {tool}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {([
          ["tractorAvailable", "Tractor available"],
          ["iotSensorsAvailable", "IoT sensors available"],
          ["greenhouseAvailable", "Greenhouse available"],
          ["storageFacility", "Storage facility"],
          ["coldStorageAvailable", "Cold storage available"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-lg border border-agri/10 bg-white px-4 py-3 text-sm text-dark hover:bg-lightgreen/10">
            <Checkbox
              checked={values[key]}
              onCheckedChange={(c) => set(key, !!c)}
            />
            {label}
          </label>
        ))}
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