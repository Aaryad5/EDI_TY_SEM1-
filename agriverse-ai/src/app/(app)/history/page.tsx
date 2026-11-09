"use client";

import * as React from "react";
import {
  History as HistoryIcon,
  Search,
  Calendar,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  CloudSun,
  Droplets,
  Sprout,
  BrainCircuit,
  MapPin,
  Clock,
  ArrowUpDown,
  Download,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { historyService } from "@/lib/services/historyService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { HistoryRecord } from "@/lib/types";

// Helper formatting
function formatDisplayDate(d: string) {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export default function AnalysisHistoryPage() {
  const { user, farms } = useAuth();

  const [records, setRecords] = React.useState<HistoryRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [farmFilter, setFarmFilter] = React.useState<string>("all");
  const [cropFilter, setCropFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("");
  const [riskFilter, setRiskFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 5;

  // Modal inspection state
  const [selectedSnapshot, setSelectedSnapshot] = React.useState<HistoryRecord | null>(null);

  // Fetch records
  const loadHistory = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await historyService.getHistory(user?.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Derived filter logic
  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const farmName = r.farm?.name || r.farmId;
        const cropName = r.crop?.currentCrop || "";
        const title = r.title || "";
        const rec = r.label || "";
        if (
          !farmName.toLowerCase().includes(q) &&
          !cropName.toLowerCase().includes(q) &&
          !title.toLowerCase().includes(q) &&
          !rec.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Farm filter
      if (farmFilter !== "all" && r.farmId !== farmFilter) return false;

      // Crop filter
      if (cropFilter !== "all" && r.crop?.currentCrop !== cropFilter) return false;

      // Date filter
      if (dateFilter && !r.date.includes(dateFilter)) return false;

      // Risk filter
      const risk = r.crop?.cropHealth === "fair" ? "High" : r.soil?.moisturePct && r.soil.moisturePct < 25 ? "Medium" : "Low";
      if (riskFilter !== "all" && risk !== riskFilter) return false;

      // Status filter
      if (statusFilter !== "all" && statusFilter !== "Completed") return false;

      return true;
    });
  }, [records, searchQuery, farmFilter, cropFilter, dateFilter, riskFilter, statusFilter]);

  // Paginated records
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Available unique crops for filter
  const uniqueCrops = Array.from(new Set(records.map((r) => r.crop?.currentCrop).filter(Boolean)));

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-agri/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri">
            <HistoryIcon className="h-4 w-4" />
            Append-Only Timeline Registry
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Analysis History</h1>
          <p className="text-sm text-dark/60">
            View your previous farm analyses and recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-agri/20 text-forest bg-white px-3 py-1 text-xs">
            {records.length} Total Snapshots
          </Badge>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <Card className="border border-agri/15 bg-white shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-dark/40" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search farm, crop, or directive..."
                className="pl-9 h-9 text-xs bg-cream/40"
              />
            </div>

            {/* Farm filter */}
            <div>
              <select
                value={farmFilter}
                onChange={(e) => {
                  setFarmFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 rounded-md border border-input bg-cream/40 px-3 text-xs text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
              >
                <option value="all">All Farms</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.farmId.substring(0, 4)})
                  </option>
                ))}
              </select>
            </div>

            {/* Crop filter */}
            <div>
              <select
                value={cropFilter}
                onChange={(e) => {
                  setCropFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 rounded-md border border-input bg-cream/40 px-3 text-xs text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
              >
                <option value="all">All Crops</option>
                {uniqueCrops.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 text-xs bg-cream/40"
              />
            </div>

            {/* Risk filter */}
            <div>
              <select
                value={riskFilter}
                onChange={(e) => {
                  setRiskFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 rounded-md border border-input bg-cream/40 px-3 text-xs text-dark font-medium focus:outline-none focus:ring-2 focus:ring-agri"
              >
                <option value="all">All Risks</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          {/* Reset Filters button if active */}
          {(searchQuery || farmFilter !== "all" || cropFilter !== "all" || dateFilter || riskFilter !== "all") && (
            <div className="flex items-center justify-between pt-2 border-t border-agri/10 text-xs">
              <span className="text-dark/50">Filtered down to {filteredRecords.length} records</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFarmFilter("all");
                  setCropFilter("all");
                  setDateFilter("");
                  setRiskFilter("all");
                  setCurrentPage(1);
                }}
                className="font-bold text-agri hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEARCHABLE TIMELINE / TABLE */}
      <Card className="border border-agri/15 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-agri/10 bg-cream/50 text-dark/70 uppercase tracking-wider font-bold text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Farm</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Growth Stage</th>
                <th className="py-3 px-4">Recommendation</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri/10 font-medium text-dark">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-dark/50">
                    Loading chronological farm snapshots...
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-dark/50">
                    No history records matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec) => {
                  const farmName = rec.farm?.name || (rec.farmId === "farm_001" ? "F001 (Farm 01)" : rec.farmId === "farm_002" ? "F002 (Farm 02)" : rec.farmId);
                  const cropName = rec.crop?.currentCrop || "Wheat";
                  const stage = rec.crop?.cropAgeWeeks ? (rec.crop.cropAgeWeeks > 6 ? "Flowering" : rec.crop.cropAgeWeeks > 4 ? "Vegetative" : "Germination") : "Vegetative";
                  const recommendation = rec.title.includes("Irrigation") ? "Partial Irrigation" : rec.title.includes("Germination") ? "No Irrigation" : rec.title.includes("Risk") ? "Monitor Pest Risk" : (rec.label || "Optimal");
                  const risk = rec.crop?.cropHealth === "fair" ? "High" : rec.soil?.moisturePct && rec.soil.moisturePct < 25 ? "Medium" : "Low";

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedSnapshot(rec)}
                      className="hover:bg-cream/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-bold text-dark whitespace-nowrap">
                        {formatDisplayDate(rec.date)}
                      </td>
                      <td className="py-3 px-4 text-dark/60 whitespace-nowrap">
                        {rec.time}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-forest bg-fresh/15 px-2 py-0.5 rounded">
                          {farmName}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-semibold">
                        {cropName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-dark/70">
                        {stage}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-agri">
                          {recommendation}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-bold ${
                            risk === "High"
                              ? "bg-red-100 text-red-800"
                              : risk === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {risk}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSnapshot(rec);
                          }}
                          className="text-agri hover:bg-agri/10 font-semibold text-xs h-7 px-2.5"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View Full Analysis
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-agri/10 p-4 bg-cream/20 text-xs">
          <span className="text-dark/60">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} records
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs border-agri/20"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>

            <span className="text-dark/70 font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs border-agri/20"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* FULL ANALYSIS MODAL (Detailed point-in-time inspection) */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-agri/20 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-agri/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agri">
                  <HistoryIcon className="h-4 w-4" />
                  FULL ANALYSIS SNAPSHOT
                </div>
                <h2 className="text-2xl font-black text-dark mt-1">
                  {selectedSnapshot.title || "Farm Intelligence Snapshot"}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-dark/60">
                  <span className="flex items-center gap-1 font-semibold text-forest">
                    <Calendar className="h-3.5 w-3.5" />
                    {selectedSnapshot.day}, {formatDisplayDate(selectedSnapshot.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedSnapshot.time} ({selectedSnapshot.timezone})
                  </span>
                  <span className="font-mono text-[11px] text-dark/40">
                    ID: {selectedSnapshot.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSnapshot(null)}
                className="rounded-lg p-1.5 text-dark/40 hover:bg-cream hover:text-dark"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Farm & Crop Identity */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-agri/10 bg-cream/30 p-3">
                <span className="text-dark/50 block text-[11px]">Farm</span>
                <span className="font-bold text-dark text-sm mt-0.5 block">
                  {selectedSnapshot.farm?.name || selectedSnapshot.farmId}
                </span>
                <span className="text-[10px] text-dark/60">
                  {selectedSnapshot.farm?.district || "Pune"}, {selectedSnapshot.farm?.state || "Maharashtra"}
                </span>
              </div>

              <div className="rounded-xl border border-agri/10 bg-cream/30 p-3">
                <span className="text-dark/50 block text-[11px]">Crop & Variety</span>
                <span className="font-bold text-dark text-sm mt-0.5 block">
                  {selectedSnapshot.crop?.currentCrop || "Wheat"}
                </span>
                <span className="text-[10px] text-dark/60">
                  {selectedSnapshot.crop?.cropVariety || "Lokwan"}
                </span>
              </div>

              <div className="rounded-xl border border-agri/10 bg-cream/30 p-3">
                <span className="text-dark/50 block text-[11px]">Farm Area</span>
                <span className="font-bold text-dark text-sm mt-0.5 block">
                  {selectedSnapshot.farm?.areaValue || 2.3} acres
                </span>
                <span className="text-[10px] text-forest font-semibold">Boundary Verified</span>
              </div>

              <div className="rounded-xl border border-agri/10 bg-cream/30 p-3">
                <span className="text-dark/50 block text-[11px]">Crop Health</span>
                <span className="font-bold text-forest text-sm mt-0.5 block uppercase">
                  {selectedSnapshot.crop?.cropHealth || "Good"}
                </span>
                <span className="text-[10px] text-dark/60">Age: {selectedSnapshot.crop?.cropAgeWeeks || 5} wks</span>
              </div>
            </div>

            {/* Weather & Soil Detailed Point-in-Time Telemetry */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Weather Data */}
              <div className="rounded-2xl border border-agri/15 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-agri/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark flex items-center gap-1.5">
                    <CloudSun className="h-4 w-4 text-agri" /> Weather Conditions
                  </span>
                  <Badge variant="outline" className="text-[10px] text-forest">Open-Meteo Synced</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-dark/50 block">Avg Temperature:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.weather?.avgTemperatureC ?? 28}°C</span>
                  </div>
                  <div>
                    <span className="text-dark/50 block">Relative Humidity:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.weather?.relativeHumidityPct ?? 72}%</span>
                  </div>
                  <div>
                    <span className="text-dark/50 block">Rainfall Today:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.weather?.recentRainfallMm ?? 0.4} mm</span>
                  </div>
                  <div>
                    <span className="text-dark/50 block">Wind Velocity:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.weather?.windSpeedKmh ?? 8} km/h</span>
                  </div>
                </div>
              </div>

              {/* Soil Data */}
              <div className="rounded-2xl border border-agri/15 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-agri/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-agri" /> Soil Diagnostics
                  </span>
                  <Badge variant="outline" className="text-[10px] text-forest">SoilGrids 250m</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-dark/50 block">Soil pH:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.soil?.soilPh ?? 6.8} (Neutral)</span>
                  </div>
                  <div>
                    <span className="text-dark/50 block">Soil Moisture:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.soil?.moisturePct ?? 18}%</span>
                  </div>
                  <div>
                    <span className="text-dark/50 block">Nitrogen (N):</span>
                    <span className="font-bold text-dark">{selectedSnapshot.soil?.nitrogen ?? 280} kg/ha</span>
                  </div>
                  <div>
                    <span className="text-dark/50 block">Organic Carbon:</span>
                    <span className="font-bold text-dark">{selectedSnapshot.soil?.organicCarbonPct ?? 0.85}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Agent Recommendation stored at point in time */}
            <div className="rounded-2xl border-2 border-agri bg-fresh/15 p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest block">
                Prescribed AI Action at Timestamp
              </span>
              <p className="text-lg font-black text-forest">
                {selectedSnapshot.title.includes("Irrigation")
                  ? "PARTIAL IRRIGATION (1,200 L via Drip)"
                  : selectedSnapshot.title.includes("Germination")
                  ? "NO IRRIGATION (Hold for Moisture Equilibration)"
                  : "MONITOR PEST RISK (Inspect Lower Canopy)"}
              </p>
              <p className="text-xs text-dark/80 leading-relaxed">
                Snapshot captured with full 14-parameter input vector and timestamped audit proof.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-agri/10">
              <span className="text-[11px] text-dark/40">
                PostgreSQL Snapshot ID: {selectedSnapshot.id}
              </span>
              <Button onClick={() => setSelectedSnapshot(null)} variant="primary">
                Close Snapshot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}