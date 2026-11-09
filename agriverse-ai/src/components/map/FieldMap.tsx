"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

mapboxgl.accessToken = MAPBOX_TOKEN;

export interface FieldData {
  field_id: string;
  latitude: number;
  longitude: number;
  area_acres: number;
  area_square_meters: number;
  boundary: number[][]; // [lng, lat][]
  address?: string;
}

export interface FieldMapProps {
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  initialBoundary?: number[][];
  onFieldSelect?: (data: FieldData | null) => void;
  onConfirm?: (data: FieldData) => void;
  height?: string | number;
  className?: string;
  showConfirmButton?: boolean;
}

export default function FieldMap({
  initialCenter = [73.8567, 18.5204],
  initialZoom = 14,
  initialBoundary,
  onFieldSelect,
  onConfirm,
  height = "100%",
  className = "",
  showConfirmButton = true,
}: FieldMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<any>(null);

  const [fieldData, setFieldData] = useState<FieldData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("Pune, Maharashtra, India");

  // Keep latest callbacks in ref to avoid stale closures in Mapbox event listeners
  const onFieldSelectRef = useRef(onFieldSelect);
  useEffect(() => {
    onFieldSelectRef.current = onFieldSelect;
  }, [onFieldSelect]);

  const onConfirmRef = useRef(onConfirm);
  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Create Mapbox map with satellite tiles exactly as in FieldMap.jsx
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      center: initialCenter,
      zoom: initialZoom,
    });

    // Zoom and rotation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Drawing tool with polygon and trash
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
    });

    map.current.addControl(draw.current, "top-right");

    // When polygon is created
    map.current.on("draw.create", updateField);

    // When polygon is edited
    map.current.on("draw.update", updateField);

    // When polygon is deleted
    map.current.on("draw.delete", clearField);

    // If an initial boundary is provided, draw it after map load
    map.current.on("load", () => {
      if (initialBoundary && initialBoundary.length >= 3 && draw.current) {
        try {
          const featureId = draw.current.add({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [initialBoundary],
            },
            properties: {},
          });
          if (featureId && featureId.length) {
            updateField();
          }
        } catch {
          /* ignore */
        }
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // --------------------------------
  // FIELD DATA CALCULATION (from Turf.js)
  // --------------------------------
  function updateField() {
    if (!draw.current) return;
    const data = draw.current.getAll();

    if (!data.features.length) {
      setFieldData(null);
      if (onFieldSelectRef.current) {
        onFieldSelectRef.current(null);
      }
      return;
    }

    const polygon = data.features[0] as GeoJSON.Feature<GeoJSON.Polygon>;
    if (!polygon || !polygon.geometry || !polygon.geometry.coordinates) {
      return;
    }

    // Calculate area via Turf
    const areaSquareMeters = turf.area(polygon);
    const areaAcres = areaSquareMeters * 0.000247105;

    // Calculate center of mass via Turf
    const centerPoint = turf.centerOfMass(polygon);
    const [longitude, latitude] = centerPoint.geometry.coordinates as [number, number];

    const result: FieldData = {
      field_id: "FIELD_001",
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      area_acres: Number(areaAcres.toFixed(2)),
      area_square_meters: Number(areaSquareMeters.toFixed(2)),
      boundary: polygon.geometry.coordinates[0] as number[][],
      address: currentAddress,
    };

    console.log("FIELD DATA:", result);
    setFieldData(result);

    if (onFieldSelectRef.current) {
      onFieldSelectRef.current(result);
    }
  }

  // --------------------------------
  // CLEAR
  // --------------------------------
  function clearField() {
    setFieldData(null);
    if (onFieldSelectRef.current) {
      onFieldSelectRef.current(null);
    }
  }

  // --------------------------------
  // CONFIRM
  // --------------------------------
  function confirmField() {
    if (!fieldData) {
      alert("Please draw your farm boundary first.");
      return;
    }

    console.log("CONFIRMED FIELD:", fieldData);

    if (onConfirmRef.current) {
      onConfirmRef.current(fieldData);
    } else {
      alert(
        `Field ${fieldData.field_id} confirmed!\n\n` +
          `Latitude: ${fieldData.latitude}\n` +
          `Longitude: ${fieldData.longitude}\n` +
          `Area: ${fieldData.area_acres} acres`
      );
    }
  }

  // --------------------------------
  // START DRAWING
  // --------------------------------
  function startDrawing() {
    if (draw.current) {
      draw.current.changeMode("draw_polygon");
    }
  }

  // --------------------------------
  // CLEAR DRAWING
  // --------------------------------
  function clearDrawing() {
    if (draw.current) {
      draw.current.deleteAll();
      setFieldData(null);
      if (onFieldSelectRef.current) {
        onFieldSelectRef.current(null);
      }
    }
  }

  // --------------------------------
  // SEARCH GEOLOCATION (Live Mapbox Geocoder)
  // --------------------------------
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim() || !map.current) return;

    setSearching(true);
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchQuery.trim()
      )}.json?access_token=${MAPBOX_TOKEN}&country=IN&limit=1`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const placeName = data.features[0].place_name;

        map.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          essential: true,
        });

        setCurrentAddress(placeName);

        // Update active field data address if boundary is already drawn
        if (fieldData) {
          const updated = { ...fieldData, address: placeName };
          setFieldData(updated);
          if (onFieldSelectRef.current) {
            onFieldSelectRef.current(updated);
          }
        }
      } else {
        alert("Location not found. Try searching for a nearby town or village.");
      }
    } catch (err) {
      console.error("Mapbox search failed:", err);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: "520px",
      }}
    >
      {/* MAP CANVAS */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* SEARCH BAR (Top-Left) */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
        }}
      >
        <form onSubmit={handleSearch} className="flex items-center gap-1.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search your village / farm"
            style={{
              width: "320px",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.4)",
              outline: "none",
              fontSize: "14px",
              color: "#1b4332",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
          />
          <button
            type="submit"
            disabled={searching}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#2d6a4f",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {searching ? "..." : "Go"}
          </button>
        </form>
      </div>

      {/* DRAW / CLEAR BUTTONS (Bottom-Left) */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "20px",
          zIndex: 10,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={startDrawing}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#2f6b3b",
            color: "white",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ✏️ Draw Field
        </button>

        <button
          type="button"
          onClick={clearDrawing}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "white",
            color: "#333",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          🗑 Clear
        </button>
      </div>

      {/* SELECTED FIELD INFORMATION CARD (Bottom-Right) */}
      <div
        style={{
          position: "absolute",
          right: "20px",
          bottom: "20px",
          width: "300px",
          background: "rgba(255, 255, 255, 0.98)",
          padding: "18px",
          borderRadius: "12px",
          zIndex: 10,
          boxShadow: "0 5px 25px rgba(0,0,0,0.3)",
          border: "1px solid rgba(45, 106, 79, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1b4332" }}>
            Selected Field
          </h3>
          {fieldData && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#2d6a4f",
                background: "#e8f5e9",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              Auto-Calculated
            </span>
          )}
        </div>

        {!fieldData && (
          <p style={{ color: "#777", fontSize: "12px", margin: "6px 0 0" }}>
            Click &ldquo;✏️ Draw Field&rdquo; to trace your boundary on the satellite map.
          </p>
        )}

        {fieldData && (
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#333" }}>
            <p style={{ margin: "4px 0" }}>
              <b>Latitude:</b> <span style={{ fontFamily: "monospace", color: "#2d6a4f" }}>{fieldData.latitude}</span>
            </p>

            <p style={{ margin: "4px 0" }}>
              <b>Longitude:</b> <span style={{ fontFamily: "monospace", color: "#2d6a4f" }}>{fieldData.longitude}</span>
            </p>

            <p style={{ margin: "4px 0" }}>
              <b>Area:</b>{" "}
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#1b4332" }}>
                {fieldData.area_acres}
              </span>{" "}
              acres{" "}
              <span style={{ color: "#666", fontSize: "11px" }}>
                ({fieldData.area_square_meters} m²)
              </span>
            </p>

            <p style={{ margin: "4px 0" }}>
              <b>Field ID:</b> <span style={{ fontFamily: "monospace" }}>{fieldData.field_id}</span>
            </p>

            {showConfirmButton && (
              <button
                type="button"
                onClick={confirmField}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2f6b3b",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(47, 107, 59, 0.4)",
                  transition: "all 0.15s ease",
                }}
              >
                CONFIRM FIELD →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
