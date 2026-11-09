"use client";

import * as React from "react";
import { Layers, Save, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Gauge } from "@/components/ui/gauge";
import { InfoRow } from "@/components/ui/form-field";
import { SoilForm, type SoilValues } from "@/components/forms/soil-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import { submitFarmData } from "@/lib/services/submitFarmData";
import { soilService } from "@/lib/services/soilService";

function healthScore(s: number) {
  return Math.min(100, Math.max(20, Math.round(s)));
}

export default function SoilPage() {
  const { user, activeFarm } = useAuth();
  const { snapshot, refresh, loading } = useFarmData();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (values: SoilValues) => {
    if (!user || !activeFarm) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await soilService.submitSoil(activeFarm.id, user.id, values);
      await submitFarmData(user.id, activeFarm.id, {
        soil: {
          ...values,
          id: `sld_${Date.now()}`,
          snapshotId: null,
          farmId: activeFarm.id,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        },
        changes: ["Soil profile updated"],
        label: "Soil update",
        title: "Soil Updated",
      });
      await refresh();
      toast({ variant: "success", title: "Soil data saved", description: "New soil snapshot added to farm history." });
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const soil = snapshot?.soil;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Soil Intelligence"
        description="Soil health indicators for your farm"
        icon={<Layers className="h-5 w-5" />}
      />

      {soil && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Soil Health</CardTitle>
              <CardDescription>
                {soil.soilType} soil · {soil.source === "auto" ? "auto-sampled (SoilGrids/GIS ready)" : "manual entry"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              <Gauge value={healthScore(pHScore(soil.soilPh))} label={`pH ${soil.soilPh}`} />
              <Gauge value={healthScore((soil.nitrogen / 280) * 100)} label={`N ${soil.nitrogen}`} />
              <Gauge value={healthScore((soil.phosphorus / 80) * 100)} label={`P ${soil.phosphorus}`} />
              <Gauge value={healthScore((soil.potassium / 240) * 100)} label={`K ${soil.potassium}`} />
              <Gauge value={soil.moisturePct} label={`Moisture ${soil.moisturePct}%`} />
              <Gauge value={healthScore((soil.organicCarbonPct / 1.5) * 100)} label={`OC ${soil.organicCarbonPct}%`} />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Soil Profile Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Soil type" value={<Badge variant="soft">{soil.soilType}</Badge>} />
                <InfoRow label="Soil pH" value={`${soil.soilPh} (${phLabel(soil.soilPh)})`} />
                <InfoRow label="Nitrogen" value={`${soil.nitrogen} kg/ha`} />
                <InfoRow label="Phosphorus" value={`${soil.phosphorus} kg/ha`} />
                <InfoRow label="Potassium" value={`${soil.potassium} kg/ha`} />
                <InfoRow label="Organic carbon" value={`${soil.organicCarbonPct}%`} />
                <InfoRow label="Electrical conductivity" value={`${soil.electricalConductivityDsM} dS/m`} />
                <InfoRow label="Soil depth" value={`${soil.soilDepthCm} cm`} />
                <InfoRow label="Texture" value={`${soil.sandPct}% sand · ${soil.siltPct}% silt · ${soil.clayPct}% clay`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Soil Advisories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Advice
                  ok={soil.soilPh >= 6 && soil.soilPh <= 7.5}
                  okText="pH in ideal range (6.0–7.5)."
                  badText={`pH ${soil.soilPh} out of ideal range. Lime/sulfur amendment advised.`}
                />
                <Advice
                  ok={soil.organicCarbonPct >= 0.8}
                  okText="Organic carbon healthy. Keep adding compost."
                  badText={`Organic carbon low (${soil.organicCarbonPct}%). Add farmyard manure or green mulch.`}
                />
                <Advice
                  ok={soil.moisturePct >= 35}
                  okText="Soil moisture adequate for current crop."
                  badText={`Moisture low (${soil.moisturePct}%). Schedule irrigation soon.`}
                />
                <div className="mt-2 rounded-lg bg-lightgreen/15 p-3">
                  <p className="flex items-center gap-1 font-medium text-forest">
                    <Sparkles className="h-4 w-4" /> SoilGrids ready
                  </p>
                  <p className="mt-1 text-xs text-dark/55">
                    The automated option is built to call SoilGrids/GIS via the FastAPI soil agent for
                    your farm coordinates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Soil Data</CardTitle>
          <CardDescription>Submitting creates a new farm snapshot — history is never overwritten.</CardDescription>
        </CardHeader>
        <CardContent>
          <SoilForm formId="soil-page-form" initial={soil ?? undefined} showSubmit={false} onSubmit={handleSave} />
          <div className="flex justify-end pt-4">
            <Button onClick={() => (document.getElementById("soil-page-form") as HTMLFormElement | null)?.requestSubmit()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="mr-1 h-4 w-4" /> Save Soil Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Advice({ ok, okText, badText }: { ok: boolean; okText: string; badText: string }) {
  return (
    <div className={`rounded-lg border p-3 text-xs ${ok ? "border-fresh/30 bg-fresh/10 text-forest" : "border-amber-300 bg-amber-50 text-amber-800"}`}>
      <p className="flex items-center gap-1.5 font-medium">
        <span>{ok ? "✓" : "⚠"}</span> {ok ? okText : badText}
      </p>
    </div>
  );
}

function pHScore(pH: number) {
  if (pH >= 6 && pH <= 7.5) return 90;
  if ((pH >= 5.5 && pH < 6) || (pH > 7.5 && pH <= 8)) return 65;
  return 40;
}

function phLabel(pH: number) {
  if (pH < 5.5) return "acidic";
  if (pH > 7.5) return "alkaline";
  return "neutral";
}