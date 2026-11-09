"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  PlusCircle,
  Loader2,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle2,
  Circle,
  LayoutGrid,
  Eye,
  Warehouse,
  Layers,
  Sprout,
  Droplets,
  Sparkles,
  BarChart3,
  FlaskConical,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";
import { farmService, type FarmInput } from "@/lib/services/farmService";
import type { Farm } from "@/lib/types";

const FARM_IMAGES: Record<string, string> = {
  Wheat: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80",
  Tomato: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
  Rice: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80",
  Default: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
};

const EMPTY: FarmInput = {
  name: "",
  country: "India",
  state: "",
  district: "",
  village: "",
  latitude: 0,
  longitude: 0,
  areaValue: 1,
  areaUnit: "acres",
};

export default function FarmsPage() {
  const router = useRouter();
  const { user, farms, activeFarm, refreshFarms, setActiveFarm } = useAuth();
  const { snapshot } = useFarmData();
  const { toast } = useToast();

  const [busy, setBusy] = React.useState(false);
  const [editing, setEditing] = React.useState<Farm | null>(null);
  const [deleting, setDeleting] = React.useState<Farm | null>(null);
  const [viewing, setViewing] = React.useState<Farm | null>(null);
  const [form, setForm] = React.useState<FarmInput>(EMPTY);

  const openEdit = (f: Farm) => {
    setForm({
      name: f.name,
      country: f.country,
      state: f.state,
      district: f.district,
      village: f.village,
      latitude: f.latitude,
      longitude: f.longitude,
      areaValue: f.areaValue,
      areaUnit: f.areaUnit,
    });
    setEditing(f);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await farmService.updateFarm(editing.id, form);
      await refreshFarms();
      toast({ variant: "success", title: "Farm updated", description: `${form.name} saved successfully.` });
      setEditing(null);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to update", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await farmService.deleteFarm(deleting.id);
      await refreshFarms();
      toast({ variant: "success", title: "Farm deleted", description: `${deleting.name} removed.` });
      setDeleting(null);
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  const handleAnalyze = async (farm: Farm) => {
    await setActiveFarm(farm.id);
    router.push(`/farms/${farm.id}/analysis`);
  };

  const handleSimulate = async (farm: Farm) => {
    await setActiveFarm(farm.id);
    router.push(`/farms/${farm.id}/simulation`);
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="My Farms"
        description="Add, inspect, analyze and simulate across all your farm plots"
        icon={<LayoutGrid className="h-5 w-5" />}
        actions={
          <Button asChild variant="primary">
            <Link href="/farms/add/location">
              <PlusCircle className="mr-1.5 h-4 w-4" /> + Add New Farm
            </Link>
          </Button>
        }
      />

      {farms.length === 0 ? (
        <EmptyState
          title="No farms registered yet"
          description="Add your first farm boundary on the map to begin autonomous analysis."
          action={
            <Button asChild variant="primary">
              <Link href="/farms/add/location">
                <PlusCircle className="mr-1.5 h-4 w-4" /> + Add New Farm
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((f, idx) => {
            const crop = f.currentCrop || "Wheat";
            const img = f.imageUrl || FARM_IMAGES[crop] || FARM_IMAGES.Default;
            const health = f.cropHealth || (idx === 1 ? "Attention" : "Healthy");
            const risk = f.riskLevel || (health === "Healthy" ? "Low" : "Medium");

            return (
              <Card
                key={f.id}
                className="overflow-hidden border border-agri/15 bg-white shadow-sm hover:border-agri/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Farm Image Banner */}
                  <div className="relative h-44 w-full bg-cream overflow-hidden">
                    <img src={img} alt={f.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge className="bg-white/95 text-dark font-bold text-xs backdrop-blur">
                        {f.name}
                      </Badge>
                      {activeFarm?.id === f.id && (
                        <Badge className="bg-agri text-white font-semibold text-[10px]">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-bold ${
                          health === "Healthy"
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {health}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 font-medium drop-shadow">
                        <MapPin className="h-3.5 w-3.5 text-lightgreen" />
                        {f.district}, {f.state}
                      </span>
                      <span className="font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                        {f.areaValue} {f.areaUnit}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs rounded-xl bg-cream/30 p-3">
                      <div>
                        <span className="text-dark/50 block text-[11px]">Crop</span>
                        <span className="font-bold text-dark flex items-center gap-1 mt-0.5">
                          <Sprout className="h-3.5 w-3.5 text-agri" />
                          {crop}
                        </span>
                      </div>
                      <div>
                        <span className="text-dark/50 block text-[11px]">Risk Level</span>
                        <span
                          className={`font-bold mt-0.5 block ${
                            risk === "Low" ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {risk}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-dark/60">
                      <span>Last analyzed: {f.lastAnalyzed || "Today at 12:42 PM"}</span>
                      <span className="text-forest font-semibold">IoT: Synced</span>
                    </div>

                    {/* All 5 Actions: View, Analyze, Simulate, Edit, Delete */}
                    <div className="pt-2 border-t border-agri/10 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAnalyze(f)}
                          className="w-full text-xs font-bold"
                        >
                          <BarChart3 className="h-3.5 w-3.5 mr-1" /> Analyze
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSimulate(f)}
                          className="w-full text-xs font-bold"
                        >
                          <FlaskConical className="h-3.5 w-3.5 mr-1" /> Simulate
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewing(f)}
                          className="h-8 text-xs text-dark/70 hover:text-agri"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                        </Button>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(f)}
                            className="h-8 px-2 text-dark/70 hover:text-dark"
                            title="Edit Farm"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleting(f)}
                            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Farm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* VIEW FARM MODAL */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold text-dark flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-agri" /> {viewing.name}
                  </DialogTitle>
                  <Badge className="bg-forest text-white">
                    {viewing.areaValue} {viewing.areaUnit}
                  </Badge>
                </div>
                <DialogDescription>
                  Detailed parcel metadata and location coordinates
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div className="rounded-xl border border-agri/15 bg-cream/40 p-4 space-y-2">
                  <span className="font-bold text-dark block">Location Information:</span>
                  <div className="grid grid-cols-2 gap-2 text-dark/70">
                    <div>Village: <span className="font-semibold text-dark">{viewing.village || "Khed Shivapur"}</span></div>
                    <div>District: <span className="font-semibold text-dark">{viewing.district}</span></div>
                    <div>State: <span className="font-semibold text-dark">{viewing.state}</span></div>
                    <div>Country: <span className="font-semibold text-dark">{viewing.country}</span></div>
                    <div>Latitude: <span className="font-mono font-semibold text-dark">{viewing.latitude.toFixed(4)}</span></div>
                    <div>Longitude: <span className="font-mono font-semibold text-dark">{viewing.longitude.toFixed(4)}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-agri/10 bg-white p-3">
                    <span className="text-dark/50 block">Current Crop</span>
                    <span className="font-bold text-dark text-sm mt-0.5 block">{viewing.currentCrop || "Wheat"}</span>
                  </div>
                  <div className="rounded-xl border border-agri/10 bg-white p-3">
                    <span className="text-dark/50 block">Health Classification</span>
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{viewing.cropHealth || "Healthy"}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const target = viewing;
                    setViewing(null);
                    handleAnalyze(target);
                  }}
                >
                  Open Farm Analysis
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT FARM MODAL */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-dark">Edit Farm Details</DialogTitle>
              <DialogDescription>Modify farm plot identification and boundaries</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-dark">Farm Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-cream/40 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-dark">District</label>
                  <Input
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    required
                    className="bg-cream/40 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-dark">Area (Acres)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.areaValue}
                    onChange={(e) => setForm({ ...form, areaValue: parseFloat(e.target.value) || 1 })}
                    required
                    className="bg-cream/40 text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION ALERT DIALOG */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-dark">Delete Farm Plot?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-bold">{deleting?.name}</span>? This will archive all associated sensor history and past snapshots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete Farm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}