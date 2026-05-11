"use client";

import { memo } from "react";
import { Marker } from "react-map-gl";
import { districts, getDistrictStats } from "@/lib/mockData";
import { getMood } from "@/lib/moodPalette";

type Props = {
  zoom: number;
  onSelect: (id: string) => void;
};

/**
 * District markers — adaptive per zoom:
 *  - far (zoom < 12.5): just a small pill with district name
 *  - mid (12.5 .. 14):  pill with name + memory count, slightly larger
 *  - close (zoom > 14): pill becomes minimal, lets capsules take focus
 */
function DistrictMarkersInner({ zoom, onSelect }: Props) {
  const tier: "far" | "mid" | "close" =
    zoom < 12.5 ? "far" : zoom < 14 ? "mid" : "close";

  return (
    <>
      {districts.map((d) => {
        const mood = getMood(d.primaryMood);
        const stats = getDistrictStats(d.id);
        return (
          <Marker
            key={d.id}
            longitude={d.lng}
            latitude={d.lat}
            anchor="center"
          >
            <button
              onClick={() => onSelect(d.id)}
              className="group relative"
              aria-label={d.name}
            >
              <span
                className="block whitespace-nowrap rounded-full backdrop-blur-md transition group-hover:scale-[1.04]"
                style={{
                  padding: tier === "close" ? "3px 8px" : "5px 11px",
                  background:
                    tier === "close" ? "rgba(14,10,26,0.45)" : "rgba(14,10,26,0.65)",
                  border: `1px solid ${mood.glow}`,
                  color: "rgba(245,240,255,0.92)",
                  boxShadow: tier === "far" ? "none" : `0 0 14px ${mood.glow}`,
                  fontSize: tier === "close" ? 9 : tier === "mid" ? 10 : 10.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                  style={{
                    background: mood.color,
                    boxShadow: `0 0 8px ${mood.color}`,
                  }}
                />
                {d.name}
                {tier !== "close" && stats.count > 0 && (
                  <span
                    className="ml-2 align-middle"
                    style={{
                      color: "rgba(245,240,255,0.55)",
                      fontSize: tier === "mid" ? 9 : 9.5,
                    }}
                  >
                    · {stats.count}
                  </span>
                )}
              </span>
            </button>
          </Marker>
        );
      })}
    </>
  );
}

export default memo(DistrictMarkersInner);
