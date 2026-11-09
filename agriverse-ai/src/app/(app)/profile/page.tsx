"use client";

import * as React from "react";
import {
  UserCircle2,
  Save,
  Loader2,
  Warehouse,
  HeartHandshake,
  Wrench,
  Radio,
  Bookmark,
  History,
  Settings,
  Pencil,
  CheckCircle2,
  MapPin,
  Sprout,
  ShieldAlert,
  Battery,
  Download,
  Activity,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { useToast } from "@/components/ui/use-toast";

const SAMPLE_DEVICES = [
  { id: "dev_01", name: "Soil Moisture Probe S-01", type: "Soil Sensor", status: "online", battery: 94, lastReading: "2 mins ago" },
  { id: "dev_02", name: "Farm Weather Station WS-01", type: "Weather Station", status: "online", battery: 88, lastReading: "5 mins ago" },
  { id: "dev_03", name: "Smart Irrigation Valve V-01", type: "Automated Valve", status: "online", battery: 100, lastReading: "10 mins ago" },
  { id: "dev_04", name: "Canopy Drone Cam DC-01", type: "Multispectral Drone", status: "offline", battery: 65, lastReading: "Yesterday" },
];

export default function ProfilePage() {
  const { user, farms, activeFarm, updateUser } = useAuth();
  const { snapshot } = useFarmData();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const [form, setForm] = React.useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    country: user?.country ?? "India",
    state: user?.state ?? "",
    district: user?.district ?? "",
    preferredLanguage: user?.preferredLanguage ?? "English",
  });

  const [prefs, setPrefs] = React.useState({
    mainGoal: snapshot?.preferences?.mainGoal ?? "maximum_profit",
    budget: snapshot?.preferences?.budget ?? 150000,
    riskTolerance: snapshot?.preferences?.riskTolerance ?? "medium",
    preferredMarket: snapshot?.preferences?.preferredMarket ?? "APMC Market Yard",
    targetSellingPeriod: snapshot?.preferences?.targetSellingPeriod ?? "Harvest peak window (Week 14)",
  });

  const [mgmt, setMgmt] = React.useState({
    experienceYears: snapshot?.management?.farmingExperienceYears ?? 8,
    farmingMethod: snapshot?.management?.farmingMethod ?? "precision",
    tractor: snapshot?.management?.tractorAvailable ?? true,
    greenhouse: snapshot?.management?.greenhouseAvailable ?? true,
    coldStorage: snapshot?.management?.coldStorageAvailable ?? false,
    workers: snapshot?.management?.workers ?? 4,
  });

  if (!user) {
    return <Skeleton className="h-40" />;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUser(form);
      setIsEditing(false);
      toast({ variant: "success", title: "Profile updated", description: "Your details were saved successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile & Farm Settings"
        description="Comprehensive farmer information, multi-farm records, preferences and IoT telemetry"
        icon={<UserCircle2 className="h-5 w-5" />}
        actions={
          <Button
            variant={isEditing ? "primary" : "outline"}
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <Save className="mr-1 h-4 w-4" />
            ) : (
              <Pencil className="mr-1 h-4 w-4" />
            )}
            {isEditing ? "Save Profile" : "Edit Profile"}
          </Button>
        }
      />

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 ring-4 ring-agri/15">
                {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.fullName} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-agri to-fresh text-2xl text-white font-bold">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-dark">{user.fullName}</h2>
                  <Badge variant="soft" className="capitalize">{user.role}</Badge>
                </div>
                <p className="text-sm text-dark/60">{user.email}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-dark/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-agri" /> {user.district}, {user.state}, {user.country}
                  </span>
                  <span>·</span>
                  <span>{user.phone || "+91 98765 43210"}</span>
                  <span>·</span>
                  <span>Lang: {user.preferredLanguage}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="rounded-xl border border-agri/15 bg-cream/70 px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase font-semibold text-dark/50">Farms Owned</p>
                <p className="text-lg font-extrabold text-forest">{farms.length}</p>
              </div>
              <div className="rounded-xl border border-agri/15 bg-cream/70 px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase font-semibold text-dark/50">Total Acreage</p>
                <p className="text-lg font-extrabold text-forest">
                  {farms.reduce((sum, f) => sum + f.areaValue, 0)} ac
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8-Section Tab Navigation */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1 gap-1">
          <TabsTrigger value="personal" className="text-xs py-2">Personal Info</TabsTrigger>
          <TabsTrigger value="farms" className="text-xs py-2">Farm Info</TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs py-2">Preferences</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs py-2">Experience</TabsTrigger>
          <TabsTrigger value="devices" className="text-xs py-2">Devices</TabsTrigger>
          <TabsTrigger value="saved" className="text-xs py-2">Saved Farms</TabsTrigger>
          <TabsTrigger value="history" className="text-xs py-2">Data History</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs py-2">Settings</TabsTrigger>
        </TabsList>

        {/* 1. Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Primary profile contact and demographic details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    disabled={!isEditing}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input value={form.email} disabled />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phone}
                    disabled={!isEditing}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Preferred Language</Label>
                  <Select
                    disabled={!isEditing}
                    value={form.preferredLanguage}
                    onValueChange={(v) => setForm({ ...form, preferredLanguage: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["English", "Hindi", "Marathi", "Tamil", "Telugu", "Punjabi", "Gujarati"].map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={form.country}
                    disabled={!isEditing}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={form.state}
                    disabled={!isEditing}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label>District / Taluka</Label>
                  <Input
                    value={form.district}
                    disabled={!isEditing}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Farm Information (Farm Cards) */}
        <TabsContent value="farms">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-dark">Your Farm Cards</h3>
              <p className="text-xs text-dark/50">Each farm's location, acreage, current crop, and health state</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {farms.map((f) => (
                <Card key={f.id} className="border border-agri/15">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{f.name}</CardTitle>
                        <CardDescription className="text-xs">{f.village}, {f.district}, {f.state}</CardDescription>
                      </div>
                      <Badge variant="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Healthy
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs text-dark/70">
                    <div className="flex justify-between border-b border-agri/10 pb-1.5">
                      <span>Area</span>
                      <span className="font-semibold text-dark">{f.areaValue} {f.areaUnit}</span>
                    </div>
                    <div className="flex justify-between border-b border-agri/10 pb-1.5">
                      <span>Current Crop</span>
                      <span className="font-semibold text-forest">
                        {snapshot?.crop?.currentCrop ?? "Tomato (Arka Rakshak)"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-agri/10 pb-1.5">
                      <span>Coordinates</span>
                      <span className="font-medium text-dark">{f.latitude.toFixed(4)}, {f.longitude.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Farm Health</span>
                      <span className="font-semibold text-fresh">94% (Optimal)</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 3. Farmer Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Farmer Preferences & Goals</CardTitle>
              <CardDescription>AI optimization goals for yield, profit, and resource management</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Primary Farming Goal</Label>
                <Select value={prefs.mainGoal} onValueChange={(v) => setPrefs({ ...prefs, mainGoal: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maximum_yield">Maximum Yield</SelectItem>
                    <SelectItem value="maximum_profit">Maximum Profit</SelectItem>
                    <SelectItem value="water_conservation">Water Conservation</SelectItem>
                    <SelectItem value="sustainable_farming">Sustainable Farming</SelectItem>
                    <SelectItem value="organic_production">Organic Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Risk Tolerance</Label>
                <Select value={prefs.riskTolerance} onValueChange={(v) => setPrefs({ ...prefs, riskTolerance: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Risk-Averse)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (High-Reward)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Operating Budget (₹)</Label>
                <Input
                  type="number"
                  value={prefs.budget}
                  onChange={(e) => setPrefs({ ...prefs, budget: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Target Selling Period</Label>
                <Input
                  value={prefs.targetSellingPeriod}
                  onChange={(e) => setPrefs({ ...prefs, targetSellingPeriod: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Farming Experience */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Farming Experience & Infrastructure</CardTitle>
              <CardDescription>Machinery, expertise level, and precision tools</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-agri/15 p-4 bg-cream/50">
                <p className="text-xs text-dark/50">Experience</p>
                <p className="text-xl font-bold text-forest mt-1">{mgmt.experienceYears} Years</p>
                <p className="text-xs text-dark/45 mt-1">Generational farming background</p>
              </div>
              <div className="rounded-xl border border-agri/15 p-4 bg-cream/50">
                <p className="text-xs text-dark/50">Farming Method</p>
                <p className="text-xl font-bold text-forest mt-1 capitalize">{mgmt.farmingMethod}</p>
                <p className="text-xs text-dark/45 mt-1">Drip-irrigated precision rows</p>
              </div>
              <div className="rounded-xl border border-agri/15 p-4 bg-cream/50">
                <p className="text-xs text-dark/50">Workers / Labor</p>
                <p className="text-xl font-bold text-forest mt-1">{mgmt.workers} Workers</p>
                <p className="text-xs text-dark/45 mt-1">Full-time and seasonal crew</p>
              </div>
              <div className="sm:col-span-3 rounded-xl border border-agri/15 p-4 bg-white">
                <p className="font-semibold text-sm text-dark mb-2">Equipment & Storage Available</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={mgmt.tractor ? "success" : "outline"}>Tractor Available</Badge>
                  <Badge variant={mgmt.greenhouse ? "success" : "outline"}>Greenhouse / Polyhouse</Badge>
                  <Badge variant={mgmt.coldStorage ? "success" : "outline"}>Cold Storage Facility</Badge>
                  <Badge variant="success">IoT Soil Sensors Installed</Badge>
                  <Badge variant="success">Automated Drip Manifold</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Connected Devices */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connected IoT Devices & Gateways</CardTitle>
              <CardDescription>Live sensor status, LoRaWAN battery levels, and telemetry rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SAMPLE_DEVICES.map((d) => (
                <div key={d.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-agri/15 p-3.5 bg-cream/40 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-white">
                      <Radio className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-dark">{d.name}</p>
                      <p className="text-xs text-dark/50">{d.type} · ID: {d.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-dark/60">
                      <Battery className="h-3.5 w-3.5 text-forest" /> {d.battery}%
                    </div>
                    <Badge variant={d.status === "online" ? "success" : "destructive"} className="capitalize">
                      {d.status}
                    </Badge>
                    <span className="text-dark/45">{d.lastReading}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Saved Farms */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saved Farms & Multi-Plot Registry</CardTitle>
              <CardDescription>Manage multiple land holdings and active switches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {farms.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-xl border border-agri/15 p-3.5 bg-white">
                  <div>
                    <p className="font-bold text-sm text-dark">{f.name}</p>
                    <p className="text-xs text-dark/50">{f.village}, {f.district} · {f.areaValue} {f.areaUnit}</p>
                  </div>
                  {activeFarm?.id === f.id ? (
                    <Badge variant="success">Current Active Farm</Badge>
                  ) : (
                    <Badge variant="outline">Saved Farm</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. Data History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data History & Snapshot Registry</CardTitle>
              <CardDescription>Append-only audit trail and data export controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-xl border border-agri/10 bg-cream/70 p-3">
                  <p className="text-xs text-dark/50">Total Snapshots</p>
                  <p className="text-xl font-bold text-forest">14</p>
                </div>
                <div className="rounded-xl border border-agri/10 bg-cream/70 p-3">
                  <p className="text-xs text-dark/50">Last Update</p>
                  <p className="text-sm font-bold text-dark mt-1">Today</p>
                </div>
                <div className="rounded-xl border border-agri/10 bg-cream/70 p-3">
                  <p className="text-xs text-dark/50">History Mode</p>
                  <p className="text-sm font-bold text-fresh mt-1">Append-Only</p>
                </div>
                <div className="rounded-xl border border-agri/10 bg-cream/70 p-3">
                  <p className="text-xs text-dark/50">Auditability</p>
                  <p className="text-sm font-bold text-forest mt-1">100% Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. Account Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Settings & Security</CardTitle>
              <CardDescription>Password updates, privacy configurations and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-dark/70">
              <div className="flex items-center justify-between border-b border-agri/10 pb-3">
                <div>
                  <p className="font-semibold text-dark">Password</p>
                  <p className="text-xs text-dark/50">Last changed 2 months ago</p>
                </div>
                <Button size="sm" variant="outline">Change Password</Button>
              </div>
              <div className="flex items-center justify-between border-b border-agri/10 pb-3">
                <div>
                  <p className="font-semibold text-dark">Two-Factor Authentication</p>
                  <p className="text-xs text-dark/50">SMS OTP on registered mobile number</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark">Backend Connection</p>
                  <p className="text-xs text-dark/50">FastAPI + PostgreSQL + PostGIS ready</p>
                </div>
                <Badge variant="soft">Demo Mode</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}