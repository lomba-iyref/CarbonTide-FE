// components/map-draw.tsx
"use client";

import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

interface MapDrawProps {
  value: GeoJSONPolygon | null;
  onChange: (geojson: GeoJSONPolygon | null) => void;
}

function ClickCapture({
  drawing,
  onPoint,
}: {
  drawing: boolean;
  onPoint: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (drawing) onPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapDraw({ value, onChange }: MapDrawProps) {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]); // [lat, lng]

  const handlePoint = useCallback((lat: number, lng: number) => {
    setPoints((prev) => [...prev, [lat, lng]]);
  }, []);

  function startDrawing() {
    setPoints([]);
    onChange(null);
    setDrawing(true);
  }

  function undoLast() {
    setPoints((prev) => prev.slice(0, -1));
  }

  function finishDrawing() {
    if (points.length < 3) return;
    const ring = [...points, points[0]]; // tutup polygon (titik akhir = titik awal)
    const geojson: GeoJSONPolygon = {
      type: "Polygon",
      // GeoJSON pakai urutan [longitude, latitude], kebalikan dari Leaflet
      coordinates: [ring.map(([lat, lng]) => [lng, lat])],
    };
    onChange(geojson);
    setDrawing(false);
  }

  function resetAll() {
    setPoints([]);
    onChange(null);
    setDrawing(false);
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
        {!drawing ? (
          <button
            type="button"
            onClick={startDrawing}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            {value ? "Gambar Ulang Area" : "Mulai Gambar Area"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={finishDrawing}
              disabled={points.length < 3}
              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Selesai ({points.length} titik)
            </button>
            <button
              type="button"
              onClick={undoLast}
              disabled={points.length === 0}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-text-secondary disabled:opacity-50"
            >
              Hapus Titik Terakhir
            </button>
          </>
        )}
        {value && !drawing && (
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600"
          >
            Hapus Area
          </button>
        )}
        <p className="text-xs text-text-secondary ml-auto">
          {drawing
            ? "Klik di peta buat nambah titik batas area (min. 3 titik)"
            : value
            ? "✓ Area sudah digambar"
            : "Belum ada area proyek"}
        </p>
      </div>

      <div style={{ height: 400 }}>
        <MapContainer
          center={[-2.5, 118]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture drawing={drawing} onPoint={handlePoint} />
          {points.length > 0 && (
            <Polygon positions={points} pathOptions={{ color: "#2563EB" }} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}