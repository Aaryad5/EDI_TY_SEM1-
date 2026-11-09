import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function FieldMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  const [fieldData, setFieldData] = useState(null);

  useEffect(() => {
    if (map.current) return;

    // Create Mapbox map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      center: [73.8567, 18.5204],
      zoom: 14,
    });

    // Zoom controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    // Drawing tool
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.current.addControl(draw.current, "top-right");

    // When polygon is created
    map.current.on("draw.create", updateField);

    // When polygon is edited
    map.current.on("draw.update", updateField);

    // When polygon is deleted
    map.current.on("draw.delete", clearField);

    return () => {
      map.current.remove();
      map.current = null;
    };
  }, []);

  // --------------------------------
  // FIELD DATA
  // --------------------------------

  function updateField() {
    const data = draw.current.getAll();

    if (!data.features.length) {
      setFieldData(null);
      return;
    }

    const polygon = data.features[0];

    // Calculate area
    const areaSquareMeters = turf.area(polygon);

    const areaAcres = areaSquareMeters * 0.000247105;

    // Calculate center
    const centerPoint = turf.centerOfMass(polygon);

    const [longitude, latitude] =
      centerPoint.geometry.coordinates;

    const result = {
      field_id: "FIELD_001",

      latitude: Number(latitude.toFixed(6)),

      longitude: Number(longitude.toFixed(6)),

      area_acres: Number(areaAcres.toFixed(2)),

      area_square_meters: Number(
        areaSquareMeters.toFixed(2)
      ),

      boundary: polygon.geometry.coordinates[0],
    };

    console.log("FIELD DATA:", result);

    setFieldData(result);
  }

  // --------------------------------
  // CLEAR
  // --------------------------------

  function clearField() {
    setFieldData(null);
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

    alert(
      `Field ${fieldData.field_id} confirmed!\n\n` +
      `Latitude: ${fieldData.latitude}\n` +
      `Longitude: ${fieldData.longitude}\n` +
      `Area: ${fieldData.area_acres} acres`
    );
  }

  // --------------------------------
  // START DRAWING
  // --------------------------------

  function startDrawing() {
    draw.current.changeMode("draw_polygon");
  }

  // --------------------------------
  // CLEAR DRAWING
  // --------------------------------

  function clearDrawing() {
    draw.current.deleteAll();
    setFieldData(null);
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>

      {/* MAP */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* SEARCH BAR */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search your village / farm"
          style={{
            width: "320px",
            padding: "14px 18px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 3px 15px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      {/* DRAW / CLEAR BUTTONS */}
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
          onClick={startDrawing}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#2f6b3b",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ✏️ Draw Field
        </button>

        <button
          onClick={clearDrawing}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "white",
            color: "#333",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🗑 Clear
        </button>
      </div>

      {/* FIELD INFORMATION */}
      <div
        style={{
          position: "absolute",
          right: "20px",
          bottom: "20px",
          width: "300px",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          zIndex: 10,
          boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Selected Field
        </h3>

        {!fieldData && (
          <p style={{ color: "#777" }}>
            Draw your farm boundary on the map.
          </p>
        )}

        {fieldData && (
          <>
            <p>
              <b>Latitude:</b>{" "}
              {fieldData.latitude}
            </p>

            <p>
              <b>Longitude:</b>{" "}
              {fieldData.longitude}
            </p>

            <p>
              <b>Area:</b>{" "}
              {fieldData.area_acres} acres
            </p>

            <p>
              <b>Field ID:</b>{" "}
              {fieldData.field_id}
            </p>

            <button
              onClick={confirmField}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                border: "none",
                borderRadius: "8px",
                background: "#2f6b3b",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              CONFIRM FIELD
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default FieldMap;