"use client";

import * as React from "react";
import { Settings as SettingsIcon, Bell, Shield, Database, Download, Trash2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [notify, setNotify] = React.useState({
    weather: true,
    pest: true,
    market: false,
    weekly: true,
  });
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  const toggle = (k: keyof typeof notify) => setNotify((p) => ({ ...p, [k]: !p[k] }));

  const exportData = () => {
    setExporting(true);
    try {
      const payload: Record<string, unknown> = {};
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith("agriverse:")) {
            payload[key] = JSON.parse(window.localStorage.getItem(key) ?? "null");
          }
        }
      } catch {
        /* json parse best effort */
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agriverse-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast({ variant: "success", title: "Export ready", description: "Your farm data was downloaded as JSON." });
    } finally {
      setExporting(false);
    }
  };

  const resetDemo = () => {
    setResetting(true);
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith("agriverse:"))
        .forEach((k) => window.localStorage.removeItem(k));
      toast({ variant: "success", title: "Demo data cleared", description: "Reload to reseed demo data." });
      setTimeout(() => window.location.reload(), 700);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Notifications, data controls and preferences" icon={<SettingsIcon className="h-5 w-5" />} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-agri" /> Notifications</CardTitle>
          <CardDescription>Which agent alerts should push to your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Weather alerts" desc="Heat waves, heavy rain and frost warnings" checked={notify.weather} onChange={() => toggle("weather")} />
          <ToggleRow label="Pest & disease alerts" desc="Crop health risks from image analysis" checked={notify.pest} onChange={() => toggle("pest")} />
          <ToggleRow label="Market updates" desc="Price trend nudges for your crops" checked={notify.market} onChange={() => toggle("market")} />
          <ToggleRow label="Weekly AI digest" desc="Summary of recommendations each week" checked={notify.weekly} onChange={() => toggle("weekly")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Database className="h-4 w-4 text-agri" /> Data & Privacy</CardTitle>
          <CardDescription>Export or reset the demo data stored in this browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-dark">Export all data</p>
              <p className="text-xs text-dark/55">Downloads a JSON bundle of your snapshots, history, alerts and farms.</p>
            </div>
            <Button variant="soft" onClick={exportData} disabled={exporting}>
              {exporting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-dark">Reset demo data</p>
              <p className="text-xs text-dark/55">Clears all local storage keys prefixed with “agriverse:”.</p>
            </div>
            <Button variant="destructive" onClick={() => setConfirmReset(true)} disabled={resetting}>
              <Trash2 className="mr-1 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4 text-agri" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-dark/70">
          <div className="flex items-center justify-between">
            <span>Storage mode</span>
            <Badge variant="soft">Local (mock)</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Auth provider</span>
            <Badge variant="soft">Mock JWT</Badge>
          </div>
          <p className="rounded-lg bg-cream p-3 text-xs text-dark/50">
            In production: Supabase/Keycloak JWT auth, bcrypt hashing, HTTPS-only cookies and per-tenant
            PostgreSQL rows. Never store credentials in localStorage.
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={confirmReset} onOpenChange={(v) => !v && setConfirmReset(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes every farm, snapshot, alert and history record stored in this browser. Demo
              data will reseed on the next reload.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetDemo} disabled={resetting} className="bg-red-600 hover:bg-red-700">
              {resetting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-agri/10 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-dark">{label}</p>
        <p className="text-xs text-dark/55">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}