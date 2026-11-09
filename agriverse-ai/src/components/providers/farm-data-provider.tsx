"use client";

import * as React from "react";
import { snapshotService } from "@/lib/services/snapshotService";
import { alertService } from "@/lib/services/alertService";
import { historyService } from "@/lib/services/historyService";
import type { FarmAlert, FarmSnapshot, HistoryRecord } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";

type FarmDataValue = {
  snapshot: FarmSnapshot | null;
  history: HistoryRecord[];
  alerts: FarmAlert[];
  unreadAlerts: number;
  loading: boolean;
  refresh: () => Promise<void>;
};

const FarmDataContext = React.createContext<FarmDataValue | null>(null);

export function FarmDataProvider({ children }: { children: React.ReactNode }) {
  const { user, activeFarm, loading: authLoading } = useAuth();
  const [snapshot, setSnapshot] = React.useState<FarmSnapshot | null>(null);
  const [history, setHistory] = React.useState<HistoryRecord[]>([]);
  const [alerts, setAlerts] = React.useState<FarmAlert[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    if (!activeFarm) {
      setSnapshot(null);
      setHistory([]);
      setAlerts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [snap, histo, alts] = await Promise.all([
        snapshotService.getLatestSnapshot(activeFarm.id),
        historyService.getHistory(user?.id, activeFarm.id),
        alertService.getAlerts(user?.id, activeFarm.id),
      ]);
      setSnapshot(snap);
      setHistory(histo);
      setAlerts(alts);
    } finally {
      setLoading(false);
    }
  }, [activeFarm, user?.id]);

  React.useEffect(() => {
    if (authLoading) return;
    const t = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(t);
  }, [authLoading, refresh]);

  const value = React.useMemo<FarmDataValue>(
    () => ({
      snapshot,
      history,
      alerts,
      unreadAlerts: alerts.filter((a) => !a.read).length,
      loading,
      refresh,
    }),
    [snapshot, history, alerts, loading, refresh]
  );

  return <FarmDataContext.Provider value={value}>{children}</FarmDataContext.Provider>;
}

export function useFarmData() {
  const ctx = React.useContext(FarmDataContext);
  if (!ctx) throw new Error("useFarmData must be used within FarmDataProvider");
  return ctx;
}