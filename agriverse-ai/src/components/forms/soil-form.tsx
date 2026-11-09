"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateSoil } from "@/lib/validators";
import { SOIL_TYPES } from "@/lib/data/catalog";
import { soilService } from "@/lib/services/soilService";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import type { SoilRecord, SoilType } from "@/lib/types";

export type SoilValues = Omit<
  SoilRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

type Props = {
  initial?: Partial<SoilValues>;
  onSubmit?: (values: SoilValues) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  formId?: string;
  footer?: React.ReactNode;
};

export function SoilForm({ initial, onSubmit, submitLabel = "Save Soil Data", showSubmit = true, formId, footer }: Props) {
  const { activeFarm } = useAuth();
  const { toast } = useToast();
  const [values, setValues] = React.useState<SoilValues>({
    soilType: initial?.soilType ?? "Loamy",
    soilPh: initial?.soilPh ?? 6.7,
    nitrogen: initial?.nitrogen ?? 280,
    phosphorus: initial?.phosphorus ?? 45,
    potassium: initial?.potassium ?? 190,
    organicCarbonPct: initial?.organicCarbonPct ?? 0.9,
    moisturePct: initial?.moisturePct ?? 42,
    electricalConductivityDsM: initial?.electricalConductivityDsM ?? 0.8,
    clayPct: initial?.clayPct ?? 22,
    sandPct: initial?.sandPct ?? 40,
    siltPct: initial?.siltPct ?? 38,
    soilDepthCm: initial?.soilDepthCm ?? 90,
    source: initial?.source ?? "manual",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [autoLoading, setAutoLoading] = React.useState(false);

  const set = <K extends keyof SoilValues>(key: K, value: SoilValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleAuto = async () => {
    if (!activeFarm) {
      toast({ variant: "warning", title: "No farm selected", description: "Select a farm first." });
      return;
    }
    setAutoLoading(true);
    try {
      const auto = await soilService.autoFetchSoil();
      if (auto) {
        setValues((v) => ({ ...v, ...auto }));
        toast({ variant: "success", title: "Automated soil data loaded", description: "Sample from the SoilGrids/GIS adapter (demo)." });
      }
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSoil(values);
    setErrors(validation as Record<string, string>);
    if (Object.keys(validation).length === 0) onSubmit?.({ ...values, source: "manual" });
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <Tabs defaultValue="manual">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="manual"> Enter manually</TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Get automatically
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Soil type" required error={errors.soilType}>
              <Select value={values.soilType} onValueChange={(v) => set("soilType", v as SoilType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Soil pH" required error={errors.soilPh}>
              <Input type="number" step="0.1" value={values.soilPh || ""} onChange={(e) => set("soilPh", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Soil moisture (%)">
              <Input type="number" value={values.moisturePct || ""} onChange={(e) => set("moisturePct", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Nitrogen (kg/ha)" required error={errors.nitrogen}>
              <Input type="number" value={values.nitrogen || ""} onChange={(e) => set("nitrogen", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Phosphorus (kg/ha)" required error={errors.phosphorus}>
              <Input type="number" value={values.phosphorus || ""} onChange={(e) => set("phosphorus", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Potassium (kg/ha)" required error={errors.potassium}>
              <Input type="number" value={values.potassium || ""} onChange={(e) => set("potassium", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Organic carbon (%)">
              <Input type="number" step="0.1" value={values.organicCarbonPct || ""} onChange={(e) => set("organicCarbonPct", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Electrical conductivity (dS/m)">
              <Input type="number" step="0.1" value={values.electricalConductivityDsM || ""} onChange={(e) => set("electricalConductivityDsM", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Soil depth (cm)">
              <Input type="number" value={values.soilDepthCm || ""} onChange={(e) => set("soilDepthCm", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Clay (%)">
              <Input type="number" value={values.clayPct || ""} onChange={(e) => set("clayPct", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Sand (%)">
              <Input type="number" value={values.sandPct || ""} onChange={(e) => set("sandPct", parseFloat(e.target.value) || 0)} />
            </FormField>
            <FormField label="Silt (%)">
              <Input type="number" value={values.siltPct || ""} onChange={(e) => set("siltPct", parseFloat(e.target.value) || 0)} />
            </FormField>
          </div>
        </TabsContent>
        <TabsContent value="auto">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-agri/25 bg-lightgreen/10 px-6 py-10 text-center">
            <Sparkles className="h-8 w-8 text-agri" />
            <div>
              <p className="text-sm font-medium text-dark">Automated soil sampling</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-dark/55">
                Designed for SoilGrids / GIS integration. Pass your farm coordinates to the backend
                adapter to pull pH, nutrients and texture automatically.
              </p>
            </div>
            <Button type="button" variant="soft" onClick={handleAuto} disabled={autoLoading}>
              {autoLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Fetch soil data automatically
            </Button>
          </div>
        </TabsContent>
      </Tabs>

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