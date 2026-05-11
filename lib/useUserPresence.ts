"use client";

import { useEffect, useRef, useState } from "react";
import { bearing, haversine, lerp, type LngLat } from "./geo";
import { KADIKOY_CENTER } from "./mockData";

// Walking loop through Moda → Yeldeğirmeni → Kalamış → back to Moda.
// Picked to cross multiple mood zones so the demo visibly weaves through them.
const SIM_PATH: LngLat[] = [
  [29.0270, 40.9820],
  [29.0260, 40.9860],
  [29.0270, 40.9900],
  [29.0285, 40.9960],
  [29.0285, 40.9990],
  [29.0265, 40.9990],
  [29.0245, 40.9950],
  [29.0260, 40.9890],
  [29.0298, 40.9858],
  [29.0310, 40.9820],
  [29.0340, 40.9790],
  [29.0395, 40.9772],
  [29.0395, 40.9740],
  [29.0350, 40.9760],
  [29.0300, 40.9800],
  [29.0270, 40.9820],
];

// Demo speed — fast walk so movement is visible within seconds.
// Real GPS positions override speed/heading with whatever the device reports.
const SIM_SPEED_MPS = 5.5;
const REAL_GPS_KADIKOY_RADIUS_M = 3500;

const TRAIL_INTERVAL_MS = 140;
const TRAIL_MAX_AGE_MS = 1800;
const POSITION_TICK_MS = 33; // ~30fps state updates for marker

export type PresenceMode = "real" | "simulated" | "denied" | "loading";

export type TrailDot = { lng: number; lat: number; born: number };

export type PresenceState = {
  position: LngLat | null;
  heading: number;
  speed: number; // m/s
  trail: TrailDot[];
  mode: PresenceMode;
};

export function useUserPresence(): PresenceState {
  const [position, setPosition] = useState<LngLat | null>(null);
  const [heading, setHeading] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [mode, setMode] = useState<PresenceMode>("loading");

  const targetRef = useRef<LngLat | null>(null);
  const positionRef = useRef<LngLat | null>(null);
  const headingRef = useRef(0);
  const speedRef = useRef(0);
  const modeRef = useRef<PresenceMode>("loading");

  // Simulation state
  const segIdxRef = useRef(0);
  const segProgressRef = useRef(0);

  // Set up geolocation watch (if available) — falls back to simulation gracefully
  useEffect(() => {
    let watchId: number | null = null;

    const switchToSim = (newMode: PresenceMode = "simulated") => {
      modeRef.current = newMode;
      setMode(newMode);
      if (!positionRef.current) {
        positionRef.current = SIM_PATH[0];
        targetRef.current = SIM_PATH[0];
        setPosition(SIM_PATH[0]);
      }
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          const distToKadikoy = haversine(
            [lng, lat],
            [KADIKOY_CENTER.lng, KADIKOY_CENTER.lat]
          );
          if (distToKadikoy > REAL_GPS_KADIKOY_RADIUS_M) {
            if (modeRef.current !== "simulated") switchToSim("simulated");
            return;
          }
          modeRef.current = "real";
          setMode("real");
          targetRef.current = [lng, lat];
          if (!positionRef.current) {
            positionRef.current = [lng, lat];
            setPosition([lng, lat]);
          }
          if (
            pos.coords.heading !== null &&
            !Number.isNaN(pos.coords.heading)
          ) {
            headingRef.current = pos.coords.heading;
          }
          if (pos.coords.speed !== null && !Number.isNaN(pos.coords.speed)) {
            speedRef.current = pos.coords.speed;
          }
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) switchToSim("denied");
          else switchToSim("simulated");
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 4000 }
      );
    }

    // Always start simulation immediately — real GPS upgrades it once available
    switchToSim("simulated");

    return () => {
      if (watchId !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // rAF loop — drives both simulation advance + lerp toward real-GPS target
  useEffect(() => {
    let raf = 0;
    let lastTick = performance.now();
    let positionAccum = 0;
    let trailAccum = 0;

    const step = (now: number) => {
      const dt = Math.min(now - lastTick, 100); // clamp big jumps
      lastTick = now;

      if (modeRef.current === "simulated" || modeRef.current === "denied") {
        // Advance along simulation segment
        const segStart = SIM_PATH[segIdxRef.current];
        const segEnd = SIM_PATH[(segIdxRef.current + 1) % SIM_PATH.length];
        const segLen = haversine(segStart, segEnd);
        if (segLen > 0) {
          const dProgress = ((SIM_SPEED_MPS * dt) / 1000) / segLen;
          segProgressRef.current += dProgress;
          while (segProgressRef.current >= 1) {
            segProgressRef.current -= 1;
            segIdxRef.current = (segIdxRef.current + 1) % SIM_PATH.length;
          }
        }
        const segStart2 = SIM_PATH[segIdxRef.current];
        const segEnd2 = SIM_PATH[(segIdxRef.current + 1) % SIM_PATH.length];
        const t = segProgressRef.current;
        positionRef.current = [
          lerp(segStart2[0], segEnd2[0], t),
          lerp(segStart2[1], segEnd2[1], t),
        ];
        headingRef.current = bearing(segStart2, segEnd2);
        speedRef.current = SIM_SPEED_MPS;
      } else if (modeRef.current === "real") {
        const target = targetRef.current;
        const current = positionRef.current ?? target;
        if (target && current) {
          // Critically damped lerp ~600ms to target
          const f = 1 - Math.pow(1 - 0.12, dt / 16);
          const next: LngLat = [
            lerp(current[0], target[0], f),
            lerp(current[1], target[1], f),
          ];
          // Update heading from movement if device didn't supply
          if (haversine(current, next) > 0.5) {
            headingRef.current = bearing(current, next);
          }
          positionRef.current = next;
        }
      }

      // Flush position state at ~30fps
      positionAccum += dt;
      if (positionAccum >= POSITION_TICK_MS) {
        positionAccum = 0;
        if (positionRef.current) {
          setPosition(positionRef.current);
          setHeading(headingRef.current);
          setSpeed(speedRef.current);
        }
      }

      // Push trail dot + cull old ones
      trailAccum += dt;
      if (trailAccum >= TRAIL_INTERVAL_MS && positionRef.current && speedRef.current > 0.3) {
        trailAccum = 0;
        const [lng, lat] = positionRef.current;
        setTrail((prev) => {
          const cutoff = now - TRAIL_MAX_AGE_MS;
          const next = prev.filter((d) => d.born >= cutoff);
          next.push({ lng, lat, born: now });
          return next;
        });
      } else if (trailAccum >= 250) {
        // Cull periodically even when stationary
        trailAccum = 0;
        setTrail((prev) => {
          const cutoff = now - TRAIL_MAX_AGE_MS;
          const filtered = prev.filter((d) => d.born >= cutoff);
          return filtered.length === prev.length ? prev : filtered;
        });
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { position, heading, speed, trail, mode };
}
