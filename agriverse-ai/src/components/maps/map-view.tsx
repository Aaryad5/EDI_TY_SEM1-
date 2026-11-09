"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

// Leaflet touches `window` at module scope — must be client-only + SSR-off.
const LeafletMap = dynamic(() => import("@/components/maps/leaflet-map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[260px] w-full animate-pulse items-center justify-center rounded-xl bg-agri/8 text-dark/40">
      <MapPin className="mr-2 h-5 w-5" /> Loading map…
    </div>
  ),
});

type MapViewProps = {
  center: [number, number];
  boundary?: [number, number][];
  zones?: { label: string; points: [number, number][]; color: string }[];
  markers?: { position: [number, number]; title: string }[];
  zoom?: number;
  heightClassName?: string;
  interactive?: boolean;
};

export function MapView(props: MapViewProps) {
  return <LeafletMap {...props} />;
}