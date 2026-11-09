"use client";

import * as React from "react";
import { Droplets, Save, Loader2, Waves, Bug, Gauge as GaugeIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoRow } from "@/components/ui/form-field";
import { Progress } from "@/components/ui/progress";
import { IrrigationForm, type IrrigationValues } from "@/components/forms/irrigation-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import { submitFarmData } from "@/lib/services/submitFarmData";
import { irrigationService } from "@/lib/services/irrigationService";
import { RadialStatusChart } from "@/components/charts";

export default function IrrigationPage() {
  const { user, activeFarm } = useAuth();
  const { snapshot, refresh, loading } = useFarmData();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (values: IrrigationValues) => {
    if (!user || !activeFarm) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await irrigationService.submitIrrigation(activeFarm.id, user.id, values);
      await submitFarmData(user.id, activeFarm.id, {
        irrigation: {
          ...values,
          id: `irr_${Date.now()}`,
          snapshotId: null,
          farmId: activeFarm.id,
          userId: user.id,
          createdAt: now,
          updatedAt: now,
        },
        changes: ["Irrigation configuration updated"],
        label: "Irrigation update",
        title: "Irrigation Updated",
      });
      await refresh();
      toast({ variant: "success", title: "Irrigation saved", description: "Irrigation record added to farm history." });
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

  const irr = snapshot?.irrigation;
  const efficiencyPct = irr
    ? irr.method === "drip"
      ? 90
      : irr.method === "sprinkler"
        ? 75
        : irr.method === "flood"
          ? 50
          : 65
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Irrigation"
        description="Water management insights and configuration"
        icon={<Droplets className="h-5 w-5" />}
      />

      {irr && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Irrigation Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Method" value={<Badge variant="soft">{cap(irr.method)}</Badge>} />
              <InfoRow label="Water source" value={<Badge variant="soft">{cap(irr.waterSource)}</Badge>} />
              <InfoRow label="Water availability" value={irr.waterAvailability} />
              <InfoRow label="Frequency" value={`every ${irr.frequencyDays} days`} />
              <InfoRow label="Water per cycle" value={`${(irr.averageWaterUsageLiters / 1000).toFixed(1)} KL`} />
              <InfoRow label="Pump capacity" value={`${irr.pumpCapacityHP} HP`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Water Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="grid place-items-center">
              <RadialStatusChart target="Efficiency" sections={[efficiencyPct, 100]} height={170} />
              <div className="w-full">
                <div className="mb-1 flex justify-between text-xs text-dark/55">
                  <span>Application efficiency</span>
                  <span className="font-semibold text-agri">{efficiencyPct}%</span>
                </div>
                <Progress value={efficiencyPct} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Waves className="h-4 w-4 text-agri" /> Water Advisory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <AdvisoryOk text="Water source stable. Rain expected in 2 days — consider delaying next cycle by a day." />
            <AdvisoryOk text="Drip irrigation reduces evaporation losses vs flood methods." />
            <p className="text-xs text-dark/45">
              Advisory engine will be replaced by the Irrigation Agent (FastAPI + MQTT/ESP32) in production.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GaugeIcon className="h-4 w-4 text-agri" /> Pump & Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Pump capacity" value={irr ? `${irr.pumpCapacityHP} HP` : "—"} />
            <InfoRow label="Pump motor type" value="Submersible" />
            <InfoRow label="Pipes" value="PVC 63mm" />
            <InfoRow label="Storage" value="Open well + tank" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bug className="h-4 w-4 text-agri" /> Moisture Sensors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Sensor 1 (Zone A)" value="42% moisture" />
            <InfoRow label="Sensor 2 (Zone B)" value="36% moisture" />
            <p className="text-xs text-dark/45">
              IoT-ready: connect ESP32 + MQTT to stream live sensor readings.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Irrigation</CardTitle>
          <CardDescription>Submitting creates a new farm snapshot — history is never overwritten.</CardDescription>
        </CardHeader>
        <CardContent>
          <IrrigationForm formId="irrigation-page-form" initial={irr ?? undefined} showSubmit={false} onSubmit={handleSave} />
          <div className="flex justify-end pt-4">
            <Button onClick={() => (document.getElementById("irrigation-page-form") as HTMLFormElement | null)?.requestSubmit()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="mr-1 h-4 w-4" /> Save Irrigation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdvisoryOk({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-fresh/30 bg-fresh/10 p-3 text-xs text-forest">
      ✓ {text}
    </div>
  );
}

function cap(s: string) {
  return s[0]!.toUpperCase() + s.slice(1);
}