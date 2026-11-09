"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MARKER_ICON = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface ParcelPickerMapProps {
  center: [number, number];
  zoom: number;
  isSatellite: boolean;
  points: [number, number][];
  onPointAdd: (lat: number, lng: number) => void;
  onCenterChange?: (lat: number, lng: number) => void;
}

function MapClickHandler({
  onPointAdd,
}: {
  onPointAdd: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPointAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function ParcelPickerMap({
  center,
  zoom,
  isSatellite,
  points,
  onPointAdd,
}: ParcelPickerMapProps) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-2xl"
      >
        <MapUpdater center={center} zoom={zoom} />
        <MapClickHandler onPointAdd={onPointAdd} />

        {isSatellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* Vertex Markers */}
        {points.map((pt, idx) => (
          <Marker key={idx} position={pt} icon={MARKER_ICON} />
        ))}

        {/* Drawn Polygon */}
        {points.length >= 3 && (
          <Polygon
            positions={points}
            pathOptions={{
              color: "#52b788",
              weight: 3,
              fillColor: "#2d6a4f",
              fillOpacity: 0.35,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
