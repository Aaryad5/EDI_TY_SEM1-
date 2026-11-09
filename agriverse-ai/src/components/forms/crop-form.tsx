"use client";

import * as React from "react";
import { ImagePlus, X } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { validateCrop } from "@/lib/validators";
import type { CropHealth, CropRecord } from "@/lib/types";
import { CROPS } from "@/lib/data/catalog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CropValues = Omit<
  CropRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

type Props = {
  initial?: Partial<CropValues>;
  onSubmit?: (values: CropValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  formId?: string;
};

const HEALTHS: CropHealth[] = ["excellent", "good", "fair", "poor", "critical"];

function ImageUploader({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  id: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-dark/80">{label}</p>
      {value ? (
        <div className="relative h-32 w-full overflow-hidden rounded-xl border border-agri/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-forest/70 p-1 text-white hover:bg-forest"
            onClick={() => onChange(undefined)}
            aria-label={`Remove ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-agri/25 bg-cream/60 text-dark/50 transition-colors hover:bg-lightgreen/15 hover:text-agri"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="mt-1 text-xs font-medium">{label}</span>
        </button>
      )}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

export function CropForm({ initial, onSubmit, submitLabel = "Save Crop Data", showSubmit = true, formId }: Props) {
  const [values, setValues] = React.useState<CropValues>({
    currentCrop: initial?.currentCrop ?? "",
    previousCrop: initial?.previousCrop ?? "",
    cropVariety: initial?.cropVariety ?? "",
    cropAgeWeeks: initial?.cropAgeWeeks ?? 0,
    sowingDate: initial?.sowingDate ?? "",
    expectedHarvestDate: initial?.expectedHarvestDate ?? "",
    farmArea: initial?.farmArea ?? 5,
    seedVariety: initial?.seedVariety ?? "",
    seedQuantity: initial?.seedQuantity ?? 0,
    fertilizerUsed: initial?.fertilizerUsed ?? "",
    fertilizerQuantity: initial?.fertilizerQuantity ?? 0,
    pesticidesUsed: initial?.pesticidesUsed ?? "",
    previousYield: initial?.previousYield ?? 0,
    expectedYield: initial?.expectedYield ?? 0,
    previousCropDisease: initial?.previousCropDisease ?? "",
    cropHealth: initial?.cropHealth ?? "good",
    cropImage: initial?.cropImage,
    leafImage: initial?.leafImage,
    farmImage: initial?.farmImage,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = <K extends keyof CropValues>(key: K, value: CropValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCrop(values);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.(values);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Current crop" required error={errors.currentCrop}>
          <Select value={values.currentCrop} onValueChange={(v) => set("currentCrop", v)}>
            <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Previous crop" error={errors.previousCrop}>
          <Select value={values.previousCrop || undefined} onValueChange={(v) => set("previousCrop", v)}>
            <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Crop variety" required error={errors.cropVariety}>
          <Input value={values.cropVariety} onChange={(e) => set("cropVariety", e.target.value)} placeholder="Arka Rakshak" />
        </FormField>
        <FormField label="Crop age (weeks)">
          <Input type="number" value={values.cropAgeWeeks || ""} onChange={(e) => set("cropAgeWeeks", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Sowing date" required error={errors.sowingDate}>
          <Input type="date" value={values.sowingDate} onChange={(e) => set("sowingDate", e.target.value)} />
        </FormField>
        <FormField label="Expected harvest date" required error={errors.expectedHarvestDate}>
          <Input type="date" value={values.expectedHarvestDate} onChange={(e) => set("expectedHarvestDate", e.target.value)} />
        </FormField>
        <FormField label="Farm area (acres)">
          <Input type="number" step="0.1" value={values.farmArea || ""} onChange={(e) => set("farmArea", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Seed variety">
          <Input value={values.seedVariety} onChange={(e) => set("seedVariety", e.target.value)} placeholder="HYB-441" />
        </FormField>
        <FormField label="Seed quantity (kg)">
          <Input type="number" step="0.05" value={values.seedQuantity || ""} onChange={(e) => set("seedQuantity", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Fertilizer used">
          <Input value={values.fertilizerUsed} onChange={(e) => set("fertilizerUsed", e.target.value)} placeholder="NPK 19:19:19" />
        </FormField>
        <FormField label="Fertilizer quantity (kg)">
          <Input type="number" value={values.fertilizerQuantity || ""} onChange={(e) => set("fertilizerQuantity", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Pesticides used">
          <Input value={values.pesticidesUsed} onChange={(e) => set("pesticidesUsed", e.target.value)} placeholder="Neem-based" />
        </FormField>
        <FormField label="Previous yield (tons)">
          <Input type="number" step="0.1" value={values.previousYield || ""} onChange={(e) => set("previousYield", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Expected yield (tons)" required error={errors.expectedYield}>
          <Input type="number" step="0.1" value={values.expectedYield || ""} onChange={(e) => set("expectedYield", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Previous crop disease" error={errors.previousCropDisease}>
          <Input value={values.previousCropDisease} onChange={(e) => set("previousCropDisease", e.target.value)} placeholder="None" />
        </FormField>
        <FormField label="Current crop health">
          <Select value={values.cropHealth} onValueChange={(v) => set("cropHealth", v as CropHealth)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {HEALTHS.map((h) => (
                <SelectItem key={h} value={h}>{h[0]!.toUpperCase() + h.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ImageUploader label="Crop image" id="crop-image" value={values.cropImage} onChange={(v) => set("cropImage", v)} />
        <ImageUploader label="Leaf image" id="leaf-image" value={values.leafImage} onChange={(v) => set("leafImage", v)} />
        <ImageUploader label="Farm image" id="farm-image" value={values.farmImage} onChange={(v) => set("farmImage", v)} />
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