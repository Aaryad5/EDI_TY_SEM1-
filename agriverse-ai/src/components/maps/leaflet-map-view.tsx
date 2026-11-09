"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Zone = { label: string; points: [number, number][]; color: string };
type MarkerData = { position: [number, number]; title: string };

const DEFAULT_ICON = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Props = {
  center: [number, number];
  boundary?: [number, number][];
  zones?: Zone[];
  markers?: MarkerData[];
  zoom?: number;
  heightClassName?: string;
};

export default function LeafletMapView({
  center,
  boundary,
  zones,
  markers,
  zoom = 14,
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {boundary && boundary.length >= 3 && (
        <Polygon
          positions={boundary as [number, number][]}
          pathOptions={{ color: "#2d6a4f", weight: 3, fillColor: "#52b788", fillOpacity: 0.25 }}
        />
      )}
      {zones?.map((zone, i) => (
        <Polygon
          key={`${zone.label}_${i}`}
          positions={zone.points as [number, number][]}
          pathOptions={{
            color: zone.color,
            weight: 2,
            fillColor: zone.color,
            fillOpacity: 0.15,
            dashArray: "5 4",
          }}
        >
          <Popup>{zone.label}</Popup>
        </Polygon>
      ))}
      {markers?.map((m, i) => (
        <Marker key={`${m.title}_${i}`} position={m.position} icon={DEFAULT_ICON}>
          <Popup>{m.title}</Popup>
        </Marker>
      ))}
      <CircleMarker
        center={center}
        radius={7}
        pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#2d6a4f", fillOpacity: 1 }}
      />
    </MapContainer>
  );
}