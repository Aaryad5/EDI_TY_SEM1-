"use client";

import * as React from "react";
import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FarmSwitcher({ className }: { className?: string }) {
  const { farms, activeFarm, setActiveFarm } = useAuth();

  if (farms.length === 0) {
    return <p className="text-sm text-dark/50">No farms yet.</p>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MapPin className="h-4 w-4 shrink-0 text-agri" />
      <Select
        value={activeFarm?.id ?? farms[0]?.id}
        onValueChange={(v) => void setActiveFarm(v)}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select farm" />
        </SelectTrigger>
        <SelectContent>
          {farms.map((farm) => (
            <SelectItem key={farm.id} value={farm.id}>
              <span className="flex items-center gap-2">
                {farm.name}
                {farm.id === activeFarm?.id && <Check className="h-3.5 w-3.5 text-fresh" />}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}