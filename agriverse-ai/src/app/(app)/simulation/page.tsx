"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default function SimulationIndexPage() {
  const router = useRouter();
  const { activeFarm, farms, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    const farmId = activeFarm?.id || (farms && farms[0]?.id) || "farm_001";
    router.replace(`/farms/${farmId}/simulation`);
  }, [activeFarm, farms, loading, router]);

  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-dark/60 font-medium">
        <Loader2 className="h-5 w-5 animate-spin text-agri" />
        Launching Digital Twin Simulator...
      </div>
    </div>
  );
}
