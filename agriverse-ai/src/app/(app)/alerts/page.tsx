"use client";

import * as React from "react";
import { BellRing, BellOff, CheckCheck, Filter, AlertCircle, Warehouse, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { alertService } from "@/lib/services/alertService";
import { SEVERITY_STYLES } from "@/lib/data/catalog";
import type { AlertCategory, FarmAlert, Severity } from "@/lib/types";

const CATEGORIES: { id: AlertCategory; label: string; emoji: string }[] = [
  { id: "weather", label: "Weather Alert", emoji: "🌧" },
  { id: "crop", label: "Crop Alert", emoji: "🌱" },
  { id: "pest", label: "Pest Alert", emoji: "🐛" },
  { id: "irrigation", label: "Irrigation Alert", emoji: "💧" },
  { id: "temperature", label: "Temperature Alert", emoji: "🌡" },
  { id: "soil", label: "Soil Alert", emoji: "🌾" },
  { id: "market", label: "Market Alert", emoji: "💰" },
];

export default function AlertsPage() {
  const { user, farms, activeFarm } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = React.useState<FarmAlert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [severityFilter, setSeverityFilter] = React.useState<"all" | Severity>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | AlertCategory>("all");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await alertService.getAlerts(user?.id, activeFarm?.id);
      setAlerts(list);
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeFarm?.id]);

  React.useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const markOne = async (id: string) => {
    await alertService.markRead(id);
    await load();
  };

  const clearAll = async () => {
    await alertService.clearAlerts(activeFarm?.id);
    await load();
    toast({ variant: "success", title: "Alerts cleared", description: "All alerts marked as read." });
  };

  const visible = alerts.filter((a) => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AgriVerse Alerts & Early Warnings"
        description="Autonomous agronomic alerts categorized across weather, pests, soil, crops and market events"
        icon={<BellRing className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as typeof severityFilter)}>
              <SelectTrigger className="w-36">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="soft" onClick={clearAll}>
              <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
            </Button>
          </div>
        }
      />

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={categoryFilter === "all" ? "primary" : "outline"}
          onClick={() => setCategoryFilter("all")}
          className="h-8 text-xs"
        >
          All Categories ({alerts.length})
        </Button>
        {CATEGORIES.map((cat) => {
          const count = alerts.filter((a) => a.category === cat.id).length;
          return (
            <Button
              key={cat.id}
              size="sm"
              variant={categoryFilter === cat.id ? "primary" : "outline"}
              onClick={() => setCategoryFilter(cat.id)}
              className="h-8 text-xs gap-1.5"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {count > 0 && <span className="opacity-75 font-normal">({count})</span>}
            </Button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No alerts in this category"
          description="All clear! No pending warnings for your farm right now."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((a) => {
            const cat = CATEGORIES.find((c) => c.id === a.category);
            const farm = farms.find((f) => f.id === a.farmId) ?? activeFarm;

            return (
              <Card key={a.id} className={a.read ? "opacity-75" : "border-l-4 border-l-agri"}>
                <CardContent className="flex flex-col gap-3 pt-5 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{cat?.emoji ?? "⚠️"}</span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="soft">{cat?.label ?? a.category}</Badge>
                        <Badge className={SEVERITY_STYLES[a.severity].color}>
                          {SEVERITY_STYLES[a.severity].label}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Warehouse className="h-3 w-3 text-agri" />
                          {farm?.name ?? "Main Farm"}
                        </Badge>
                        {!a.read && (
                          <Badge variant="destructive" className="bg-red-600 text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-dark">{a.message}</p>

                      <div className="rounded-lg bg-cream/80 p-2 text-xs text-dark/70">
                        <span className="font-semibold text-forest">Recommended Action: </span>
                        <span>{a.recommendedAction}</span>
                      </div>

                      <p className="text-[11px] text-dark/45 pt-0.5">
                        {a.date} · {a.day}, {a.time} ({a.timezone})
                      </p>
                    </div>
                  </div>

                  {!a.read && (
                    <Button size="sm" variant="outline" onClick={() => markOne(a.id)} className="shrink-0 self-start">
                      <CheckCheck className="mr-1 h-3.5 w-3.5" /> Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}