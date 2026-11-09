"use client";

import * as React from "react";
import { Sprout, Save, Loader2, Camera } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoRow } from "@/components/ui/form-field";
import { CropForm, type CropValues } from "@/components/forms/crop-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import { submitFarmData } from "@/lib/services/submitFarmData";
import { cropService } from "@/lib/services/cropService";
import { BarChart } from "@/components/charts";

export default function CropsPage() {
  const { user, activeFarm } = useAuth();
  const { snapshot, refresh, loading } = useFarmData();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (values: CropValues) => {
    if (!user || !activeFarm) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await cropService.submitCrop(activeFarm.id, user.id, values);
      await submitFarmData(user.id, activeFarm.id, {
        crop: {
          ...values,
          id: `crp_${Date.now()}`,
          snapshotId: null,
          farmId: activeFarm.id,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        },
        changes: ["Crop details updated"],
        label: "Crop update",
        title: "Crop Updated",
      });
      await refresh();
      toast({ variant: "success", title: "Crop data saved", description: "Crop record created and added to farm history." });
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
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const crop = snapshot?.crop;
  const healthVariant =
    crop && (crop.cropHealth === "good" || crop.cropHealth === "excellent") ? "success" : "warning";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Intelligence"
        description="Crop records, growth stages and health monitoring"
        icon={<Sprout className="h-5 w-5" />}
      />

      {crop && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Current Crop</CardTitle>
                <CardDescription>Registered on {crop.sowingDate}</CardDescription>
              </div>
              <Badge variant={healthVariant}>{cap(crop.cropHealth)} health</Badge>
            </CardHeader>
            <CardContent className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Current crop" value={crop.currentCrop} />
              <InfoRow label="Previous crop" value={crop.previousCrop || "—"} />
              <InfoRow label="Variety" value={crop.cropVariety} />
              <InfoRow label="Crop age" value={`${crop.cropAgeWeeks} weeks`} />
              <InfoRow label="Sowing date" value={crop.sowingDate} />
              <InfoRow label="Expected harvest" value={crop.expectedHarvestDate} />
              <InfoRow label="Farm area" value={`${crop.farmArea} acres`} />
              <InfoRow label="Seed variety" value={crop.seedVariety || "—"} />
              <InfoRow label="Seed quantity" value={`${crop.seedQuantity} kg`} />
              <InfoRow label="Fertilizer" value={`${crop.fertilizerUsed || "—"} (${crop.fertilizerQuantity} kg)`} />
              <InfoRow label="Pesticides" value={crop.pesticidesUsed || "—"} />
              <InfoRow label="Previous disease" value={crop.previousCropDisease || "None"} />
              <InfoRow label="Previous yield" value={`${crop.previousYield} t`} />
              <InfoRow label="Expected yield" value={<span className="font-semibold text-agri">{crop.expectedYield} t</span>} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Growth Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { stage: "Sown", days: 20 },
                    { stage: "Vegetative", days: 45 },
                    { stage: "Flowering", days: 25 },
                  ]}
                  xKey="stage"
                  series={[{ key: "days", name: "Days", color: "#52b788" }]}
                  height={160}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Camera className="h-4 w-4 text-agri" /> Field Images
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <Thumb label="Crop" src={crop.cropImage} />
                <Thumb label="Leaf" src={crop.leafImage} />
                <Thumb label="Farm" src={crop.farmImage} />
                <p className="col-span-3 text-xs text-dark/45">
                  Images are stored as data URLs in the mock layer. Future: S3 + Sentinel-2 satellite
                  imagery for NDVI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Crop Details</CardTitle>
          <CardDescription>Submitting creates a new farm snapshot — history is never overwritten.</CardDescription>
        </CardHeader>
        <CardContent>
          <CropForm formId="crop-page-form" initial={crop ?? undefined} showSubmit={false} onSubmit={handleSave} />
          <div className="flex justify-end pt-4">
            <Button onClick={() => (document.getElementById("crop-page-form") as HTMLFormElement | null)?.requestSubmit()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="mr-1 h-4 w-4" /> Save Crop Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Thumb({ label, src }: { label: string; src?: string }) {
  return (
    <div className="flex h-20 flex-col items-center justify-center overflow-hidden rounded-lg border border-agri/10 bg-cream/60 text-center">
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="h-12 w-full object-cover" />
          <p className="w-full bg-white/80 py-0.5 text-[10px] font-medium text-dark/60">{label}</p>
        </>
      ) : (
        <>
          <Camera className="h-5 w-5 text-dark/30" />
          <p className="text-[10px] text-dark/40">{label}</p>
        </>
      )}
    </div>
  );
}

function cap(s: string) {
  return s[0]!.toUpperCase() + s.slice(1);
}