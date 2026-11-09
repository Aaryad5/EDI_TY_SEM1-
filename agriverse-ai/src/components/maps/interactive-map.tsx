"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InteractiveLeaflet = dynamic(() => import("@/components/maps/interactive-leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] w-full animate-pulse items-center justify-center rounded-xl bg-agri/8 text-dark/40">
      <Search className="mr-2 h-5 w-5" /> Initializing map…
    </div>
  ),
});

export type MapSelection = {
  latitude: number;
  longitude: number;
  boundary: [number, number][];
  placeName: string;
};

type InteractiveMapProps = {
  value?: MapSelection;
  onChange: (sel: MapSelection) => void;
  farmName?: string;
};

const SAMPLE_PLACES = [
  { label: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
  { label: "Nashik, Maharashtra", lat: 19.9975, lng: 73.7898 },
  { label: "Nagpur, Maharashtra", lat: 21.1458, lng: 79.0882 },
  { label: "Amritsar, Punjab", lat: 31.634, lng: 74.8723 },
  { label: "Kanpur, Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  { label: "Coimbatore, Tamil Nadu", lat: 11.0168, lng: 76.9558 },
];

export function InteractiveMap({ value, onChange, farmName }: InteractiveMapProps) {
  const [query, setQuery] = React.useState("");
  const [bounds, setBounds] = React.useState<[number, number][] | null>(null);
  const [searched, setSearched] = React.useState<MapSelection | null>(null);

  const handleMarkerPlaced = React.useCallback(
    (lat: number, lng: number) => {
      const box: [number, number][] = [
        [lng - 0.005, lat - 0.004],
        [lng + 0.005, lat - 0.004],
        [lng + 0.008, lat + 0.004],
        [lng - 0.006, lat + 0.004],
        [lng - 0.005, lat - 0.004],
      ];
      setBounds(box);
      onChange({ latitude: lat, longitude: lng, boundary: box, placeName: searched?.placeName ?? farmName ?? "My Farm" });
    },
    [onChange, searched, farmName]
  );

  const handleSearch = (placeLabel: string) => {
    const p = SAMPLE_PLACES.find((x) => x.label === placeLabel) ?? SAMPLE_PLACES[0]!;
    setSearched({ latitude: p.lat, longitude: p.lng, boundary: [], placeName: p.label });
    handleMarkerPlaced(p.lat, p.lng);
    setQuery("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location (e.g., Pune, Maharashtra)"
          list="farm-places"
        />
        <datalist id="farm-places">
          {SAMPLE_PLACES.map((p) => (
            <option key={p.label} value={p.label} />
          ))}
        </datalist>
        <Button type="button" onClick={() => handleSearch(query.trim())}>
          <Search className="mr-1 h-4 w-4" /> Search
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PLACES.map((p) => (
          <Badge
            key={p.label}
            variant="soft"
            className="cursor-pointer hover:bg-agri hover:text-white"
            onClick={() => handleSearch(p.label)}
          >
            {p.label}
          </Badge>
        ))}
      </div>
      <InteractiveLeaflet
        center={value ? [value.latitude, value.longitude] : [18.5204, 73.8567]}
        boundary={value?.boundary ?? bounds ?? undefined}
        onMarkerPlaced={handleMarkerPlaced}
      />
      <p className="text-xs text-dark/50">
        Drag the marker to set your farm location — latitude and longitude are captured
        automatically.
      </p>
    </div>
  );
}