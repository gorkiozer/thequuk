"use client";

import { useMemo } from "react";
import { Source, Layer, Marker } from "react-map-gl";
import { useUserPresence } from "@/lib/useUserPresence";
import { getMood } from "@/lib/moodPalette";
import { profile } from "@/lib/profileData";

export function useMapUserPresence() {
  return useUserPresence();
}

type Presence = ReturnType<typeof useUserPresence>;

export function UserLightPool({ presence }: { presence: Presence }) {
  const data = useMemo(
    () =>
      presence.position
        ? {
            type: "FeatureCollection" as const,
            features: [
              {
                type: "Feature" as const,
                geometry: {
                  type: "Point" as const,
                  coordinates: presence.position,
                },
                properties: {},
              },
            ],
          }
        : ({ type: "FeatureCollection", features: [] as any[] } as any),
    [presence.position]
  );

  return (
    <Source id="user-light-pool" type="geojson" data={data as any}>
      <Layer
        id="user-light-pool"
        type="circle"
        paint={{
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            13, 22,
            15, 80,
            17, 200,
          ] as any,
          "circle-color": "#FFE4C8",
          "circle-opacity": 0.06,
          "circle-blur": 1.9,
        }}
      />
    </Source>
  );
}

export function UserTrail({ presence }: { presence: Presence }) {
  const now = typeof performance !== "undefined" ? performance.now() : 0;
  const data = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: presence.trail.map((d) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [d.lng, d.lat] },
        properties: { age: Math.min(1, (now - d.born) / 1800) },
      })),
    }),
    [presence.trail]
  );

  return (
    <Source id="user-trail" type="geojson" data={data as any}>
      <Layer
        id="user-trail"
        type="circle"
        paint={{
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            13, ["*", 1.6, ["-", 1, ["get", "age"]]],
            16, ["*", 4.5, ["-", 1, ["get", "age"]]],
          ] as any,
          "circle-color": "#E5D9FF",
          "circle-opacity": ["*", 0.45, ["-", 1, ["get", "age"]]] as any,
          "circle-blur": 1.3,
        }}
      />
    </Source>
  );
}

export function UserPresenceMarker({
  presence,
  zoom,
}: {
  presence: Presence;
  zoom: number;
}) {
  if (!presence.position) return null;

  return (
    <Marker
      longitude={presence.position[0]}
      latitude={presence.position[1]}
      anchor="bottom"
    >
      <UserSilhouette
        heading={presence.heading}
        speed={presence.speed}
        zoom={zoom}
      />
    </Marker>
  );
}

/**
 * The user's "emotional echo" inside the city — a soft human silhouette,
 * faceless, mood-glowing. NOT an orb. Per TheQuuk philosophy:
 * "the city's interpretation of someone."
 *
 * Scales gracefully across zoom tiers; at far zoom it's a small vertical
 * presence, at close zoom a recognisable cloaked figure.
 */
function UserSilhouette({
  heading,
  speed,
  zoom,
}: {
  heading: number;
  speed: number;
  zoom: number;
}) {
  const mood = getMood(profile.dominantMood);

  const tier: "far" | "mid" | "close" =
    zoom < 12.8 ? "far" : zoom < 15.4 ? "mid" : "close";

  const moving = speed > 0.4;
  // heading currently unused — kept for future "lean toward direction" affordance
  void heading;

  const dims =
    tier === "far"
      ? { w: 10, h: 22 }
      : tier === "mid"
        ? { w: 16, h: 34 }
        : { w: 22, h: 48 };

  return (
    <div
      className="relative pointer-events-none"
      style={{ width: dims.w, height: dims.h }}
    >
      {/* Outer mood halo — the city's awareness of this presence */}
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: -8,
          background: `radial-gradient(ellipse at center, ${mood.glow} 0%, transparent 65%)`,
          filter: "blur(3px)",
        }}
      />

      {/* Slower softer pulse — emotional breathing */}
      <span
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          inset: -3,
          background: `radial-gradient(ellipse at center, ${mood.soft} 0%, transparent 70%)`,
          filter: "blur(1px)",
          animation: "userPresencePulse 5.4s ease-in-out infinite",
        }}
      />

      {/* Figure — luminous silhouette */}
      <svg
        viewBox="0 0 20 40"
        width="100%"
        height="100%"
        className={moving ? "presence-walking" : ""}
        style={{ position: "relative" }}
      >
        <defs>
          <radialGradient
            id={`figBody-${mood.color}`}
            cx="50%"
            cy="38%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="45%" stopColor="rgba(245,240,255,0.78)" />
            <stop offset="100%" stopColor={mood.color} stopOpacity="0.42" />
          </radialGradient>
          <filter
            id={`figBlur-${mood.color}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>

        {/* Soft mood rim behind body */}
        <path
          d="M 7 11 L 4.5 35 C 4.5 38, 5.5 39.5, 7 39.5 L 13 39.5 C 14.5 39.5, 15.5 38, 15.5 35 L 13 11 C 12 9.8, 8 9.8, 7 11 Z"
          fill={mood.color}
          opacity="0.42"
          filter={`url(#figBlur-${mood.color})`}
        />

        {/* Coat body — luminous gradient, the "drifting through the city" shape */}
        <path
          d="M 7.5 11.5 L 5 35 C 5 37.5, 6 39, 7 39 L 13 39 C 14 39, 15 37.5, 15 35 L 12.5 11.5 C 11.5 10.5, 8.5 10.5, 7.5 11.5 Z"
          fill={`url(#figBody-${mood.color})`}
        />

        {/* Head — soft ellipse, faceless */}
        <ellipse
          cx="10"
          cy="7"
          rx="2.7"
          ry="3.1"
          fill={mood.color}
          opacity="0.42"
          filter={`url(#figBlur-${mood.color})`}
        />
        <ellipse
          cx="10"
          cy="7"
          rx="2.4"
          ry="2.8"
          fill={`url(#figBody-${mood.color})`}
        />

        {/* Hood seam — very subtle mood-color rim, only visible close */}
        {tier === "close" && (
          <path
            d="M 7.5 10 C 8.5 9.2, 11.5 9.2, 12.5 10"
            stroke={mood.color}
            strokeOpacity="0.55"
            strokeWidth="0.6"
            fill="none"
          />
        )}

        {/* Eye glow only at close zoom — barely visible, mysterious */}
        {tier === "close" && (
          <>
            <circle cx="9" cy="7" r="0.35" fill={mood.color} opacity="0.9" />
            <circle cx="11" cy="7" r="0.35" fill={mood.color} opacity="0.9" />
          </>
        )}
      </svg>
    </div>
  );
}
