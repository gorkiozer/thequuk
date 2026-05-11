"use client";

import { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import { districts } from "@/lib/istanbulData";
import { MOOD_COLOR_EXPRESSION } from "@/lib/moodPalette";

export default function MoodLayer() {
  // Two GeoJSON features per district — primary mood at full intensity, optional
  // secondary mood at half — so adjacent zones bleed into each other.
  const data = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: districts.flatMap((d) => {
        const features = [
          {
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [d.lng, d.lat] },
            properties: {
              mood: d.primaryMood,
              intensity: d.intensity,
              id: d.id,
            },
          },
        ];
        if (d.secondaryMood) {
          features.push({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [d.lng + 0.004, d.lat + 0.002],
            },
            properties: {
              mood: d.secondaryMood,
              intensity: d.intensity * 0.55,
              id: `${d.id}-secondary`,
            },
          });
        }
        return features;
      }),
    }),
    []
  );

  return (
    <Source id="mood-zones" type="geojson" data={data as any}>
      <Layer
        id="mood-zones-outer"
        type="circle"
        paint={{
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            10, ["*", 24, ["get", "intensity"]],
            13, ["*", 60, ["get", "intensity"]],
            15, ["*", 130, ["get", "intensity"]],
            17, ["*", 260, ["get", "intensity"]],
          ] as any,
          "circle-color": MOOD_COLOR_EXPRESSION,
          "circle-opacity": [
            "interpolate", ["linear"], ["zoom"],
            10, 0.16,
            14, 0.22,
            17, 0.10,
          ] as any,
          "circle-blur": 1.6,
        }}
      />
      <Layer
        id="mood-zones-inner"
        type="circle"
        paint={{
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            10, ["*", 10, ["get", "intensity"]],
            13, ["*", 28, ["get", "intensity"]],
            15, ["*", 65, ["get", "intensity"]],
            17, ["*", 140, ["get", "intensity"]],
          ] as any,
          "circle-color": MOOD_COLOR_EXPRESSION,
          "circle-opacity": [
            "interpolate", ["linear"], ["zoom"],
            10, 0.22,
            14, 0.28,
            17, 0.12,
          ] as any,
          "circle-blur": 1.1,
        }}
      />
    </Source>
  );
}
