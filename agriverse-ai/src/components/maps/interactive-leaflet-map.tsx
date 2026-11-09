"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MARKER = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickCatcher({ onPlace }: { onPlace: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Props = {
  center: [number, number];
  boundary?: [number, number][];
  onMarkerPlaced: (lat: number, lng: number) => void;
};

export default function InteractiveLeafletMap({ center, boundary, onMarkerPlaced }: Props) {
  const [pos, setPos] = useState(center);
  const [draggable] = useState(true);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 360, width: "100%" }}
      className="z-0 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCatcher onPlace={(lat, lng) => onMarkerPlaced(lat, lng)} />
      <Marker
        draggable={draggable}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target as L.Marker;
            const p = marker.getLatLng();
            setPos([p.lat, p.lng]);
            onMarkerPlaced(p.lat, p.lng);
          },
        }}
        position={pos}
        icon={MARKER}
      />
      {boundary && boundary.length >= 3 && (
        <Polygon
          positions={boundary}
          pathOptions={{ color: "#2d6a4f", weight: 3, fillColor: "#52b788", fillOpacity: 0.25 }}
        />
      )}
    </MapContainer>
  );
}