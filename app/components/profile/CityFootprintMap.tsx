"use client";

import { useMemo, useRef } from "react";
import Map, { Source, Layer, Marker, type MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { footprint, profile } from "@/lib/profileData";
import { getMood, MOOD_COLOR_EXPRESSION } from "@/lib/moodPalette";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const ISTANBUL_CENTER = { lng: 29.005, lat: 41.01 } as const;

export default function CityFootprintMap({
  onSelectDistrict,
}: {
  onSelectDistrict?: (id: string) => void;
}) {
  const mapRef = useRef<MapRef | null>(null);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: footprint.map((f) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [f.lng, f.lat] },
        properties: { mood: f.mood, count: f.count, id: f.districtId },
      })),
    }),
    []
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="h-px w-12 bg-white/10" />
        <p className="mx-4 text-[10.5px] uppercase tracking-[0.35em] text-white/40">
          şehrin hatırladığı yerler
        </p>
        <div className="h-px w-12 bg-white/10" />
      </div>

      <div
        className="relative rounded-2xl overflow-hidden backdrop-blur-xl"
        style={{
          background: "rgba(10,7,20,0.45)",
          border: "1px solid rgba(255,255,255,0.05)",
          height: 320,
        }}
      >
        {!TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center text-white/45 text-[12.5px]">
            Mapbox token gerekli
          </div>
        )}

        {TOKEN && (
          <Map
            ref={mapRef}
            mapboxAccessToken={TOKEN}
            initialViewState={{
              longitude: ISTANBUL_CENTER.lng,
              latitude: ISTANBUL_CENTER.lat,
              zoom: 10.4,
              pitch: 32,
              bearing: -16,
            }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
            dragRotate={false}
            doubleClickZoom={false}
            touchZoomRotate={false}
            scrollZoom={false}
            interactiveLayerIds={[]}
            onLoad={() => {
              const map = mapRef.current?.getMap() as any;
              if (!map) return;
              try {
                map.setFog({
                  color: "#0a0420",
                  "high-color": "#1a0d33",
                  "horizon-blend": 0.32,
                  "space-color": "#06030F",
                  "star-intensity": 0.35,
                });
              } catch {
                /* ignore */
              }
            }}
          >
            <Source id="footprint-zones" type="geojson" data={geojson as any}>
              <Layer
                id="footprint-outer"
                type="circle"
                paint={{
                  "circle-radius": [
                    "interpolate", ["linear"], ["zoom"],
                    10, ["+", 18, ["*", 3, ["get", "count"]]],
                    14, ["+", 50, ["*", 8, ["get", "count"]]],
                  ] as any,
                  "circle-color": MOOD_COLOR_EXPRESSION,
                  "circle-opacity": 0.18,
                  "circle-blur": 1.5,
                }}
              />
              <Layer
                id="footprint-inner"
                type="circle"
                paint={{
                  "circle-radius": [
                    "interpolate", ["linear"], ["zoom"],
                    10, ["+", 8, ["*", 1.2, ["get", "count"]]],
                    14, ["+", 20, ["*", 3.5, ["get", "count"]]],
                  ] as any,
                  "circle-color": MOOD_COLOR_EXPRESSION,
                  "circle-opacity": 0.28,
                  "circle-blur": 1.0,
                }}
              />
            </Source>

            {footprint.slice(0, 8).map((f) => {
              const mood = getMood(f.mood);
              const isHome = f.districtId === profile.homeDistrictId;
              return (
                <Marker
                  key={f.districtId}
                  longitude={f.lng}
                  latitude={f.lat}
                  anchor="center"
                >
                  <button
                    onClick={() => onSelectDistrict?.(f.districtId)}
                    className="group relative"
                  >
                    <span
                      className="block whitespace-nowrap rounded-full backdrop-blur-md px-2 py-0.5 transition group-hover:scale-105"
                      style={{
                        background: "rgba(14,10,26,0.55)",
                        border: `1px solid ${mood.glow}`,
                        color: "rgba(245,240,255,0.88)",
                        boxShadow: `0 0 8px ${mood.glow}`,
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span
                        className="inline-block w-1 h-1 rounded-full mr-1.5 align-middle"
                        style={{ background: mood.color, boxShadow: `0 0 5px ${mood.color}` }}
                      />
                      {f.district}
                    </span>
                    {isHome && (
                      <span
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full pulse-ring"
                        style={{ background: mood.color, boxShadow: `0 0 8px ${mood.color}` }}
                      />
                    )}
                  </button>
                </Marker>
              );
            })}
          </Map>
        )}

        {/* Atmospheric overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(6,3,15,0.55) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 90px rgba(6,3,15,0.7)" }}
        />
      </div>

      <p className="mt-4 text-center text-[11px] text-white/40 tracking-wide">
        {footprint.length} mahalle · {profile.homeDistrict} en parlak
      </p>
    </div>
  );
}
