"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Map, { Marker, type MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { memories, KADIKOY_CENTER, type Memory } from "@/lib/istanbulData";
import { useUserPresence } from "@/lib/useUserPresence";
import { useDemoMode } from "@/lib/demoMode";
import { haversine } from "@/lib/geo";
import { getCurrentLightPreset } from "@/lib/timeOfDay";

import MoodLayer from "./map/MoodLayer";
import DistrictMarkers from "./map/DistrictMarkers";
import { MemoryCapsule } from "./map/MemoryCapsule";
import {
  UserLightPool,
  UserTrail,
  UserPresenceMarker,
} from "./map/UserPresence";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const CARD_ZOOM = 14.7;
const CAPSULE_ZOOM = 13.6; // below this, memories don't render individually
const PROXIMITY_M = 60;

type GlowDot = { id: number; lng: number; lat: number; o: number; dur: number };

export default function MapboxMap({
  onSelectDistrict,
  onSelectMemory,
}: {
  onSelectDistrict: (id: string) => void;
  onSelectMemory: (id: string) => void;
}) {
  const mapRef = useRef<MapRef | null>(null);
  const [zoom, setZoom] = useState(13.6);
  const showCards = zoom >= CARD_ZOOM;
  const showCapsules = zoom >= CAPSULE_ZOOM;

  const presence = useUserPresence();
  const demo = useDemoMode();

  // Ambient activity glow dots — clustered around city center
  const [dots] = useState<GlowDot[]>(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      lng: KADIKOY_CENTER.lng + (Math.random() - 0.5) * 0.16,
      lat: KADIKOY_CENTER.lat + (Math.random() - 0.5) * 0.10,
      o: 0.3 + Math.random() * 0.5,
      dur: 7 + Math.random() * 9,
    }))
  );

  // Visible memories — locked memories drop out unless their unlock condition is on
  const visibleMemories = useMemo(() => {
    const out: Memory[] = [];
    const densityCutoff = demo.density;
    for (let i = 0; i < memories.length; i++) {
      const m = memories[i];
      // Density slider — uniformly drop memories at lower densities
      const keepHash = ((i * 73 + 17) % 100) / 100;
      if (keepHash >= densityCutoff) continue;

      if (m.visibility === "locked") {
        if (m.isNight && !demo.night) continue;
        if (m.isRain && !demo.rain) continue;
        // rare / secret still hidden until proximity (handled below)
      }
      out.push(m);
    }
    return out;
  }, [demo.density, demo.night, demo.rain]);

  // Nearby memories — refresh on user position change
  const nearbyIds = useMemo(() => {
    const s = new Set<string>();
    if (!presence.position) return s;
    for (const m of visibleMemories) {
      if (haversine([m.lng, m.lat], presence.position) < PROXIMITY_M) {
        s.add(m.id);
      }
    }
    return s;
  }, [presence.position, visibleMemories]);

  // Cinematic intro — pulls the camera in once on mount
  useEffect(() => {
    const t = window.setTimeout(() => {
      mapRef.current?.getMap().easeTo({
        zoom: 15.05,
        bearing: -30,
        pitch: 62,
        duration: 6500,
        center: [KADIKOY_CENTER.lng, KADIKOY_CENTER.lat],
      });
    }, 800);
    return () => window.clearTimeout(t);
  }, []);

  // Auto-evolve lightPreset with real time; demo.night forces override.
  useEffect(() => {
    const apply = () => {
      const map = mapRef.current?.getMap() as any;
      if (!map) return;
      try {
        map.setConfigProperty(
          "basemap",
          "lightPreset",
          demo.night ? "night" : getCurrentLightPreset()
        );
      } catch {
        /* style config unavailable */
      }
    };
    apply();
    // Re-check every minute so hour transitions update without reload
    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, [demo.night]);

  if (!TOKEN) return <NoTokenState />;

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={{
          longitude: KADIKOY_CENTER.lng,
          latitude: KADIKOY_CENTER.lat,
          zoom: 13.6,
          pitch: 58,
          bearing: -22,
        }}
        maxPitch={75}
        minZoom={10.5}
        maxZoom={18}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onMove={(evt) => {
          const z = evt.viewState.zoom;
          setZoom((prev) => (Math.abs(prev - z) > 0.05 ? z : prev));
        }}
        onLoad={() => {
          const map = mapRef.current?.getMap() as any;
          if (!map) return;
          try {
            const preset = demo.night ? "night" : getCurrentLightPreset();
            map.setConfigProperty("basemap", "lightPreset", preset);
            map.setConfigProperty("basemap", "showPlaceLabels", true);
            map.setConfigProperty("basemap", "showRoadLabels", false);
            map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
            map.setConfigProperty("basemap", "showTransitLabels", false);
            map.setConfigProperty("basemap", "show3dObjects", true);
          } catch {
            /* Standard style config unavailable */
          }
        }}
      >
        <MoodLayer />

        <UserLightPool presence={presence} />
        <UserTrail presence={presence} />

        {/* Ambient glow dots — anonymous "activity" */}
        {dots.map((d, i) => (
          <Marker key={d.id} longitude={d.lng} latitude={d.lat} anchor="center">
            <motion.div
              className="w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 0 10px rgba(255,255,255,0.65)",
                opacity: d.o,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [d.o * 0.3, d.o * 0.85, d.o * 0.3],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: d.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          </Marker>
        ))}

        <DistrictMarkers zoom={zoom} onSelect={onSelectDistrict} />

        {showCapsules &&
          visibleMemories.map((m, i) => (
            <Marker
              key={m.id}
              longitude={m.lng}
              latitude={m.lat}
              anchor="center"
            >
              <MemoryCapsule
                m={m}
                index={i}
                expanded={showCards}
                nearby={nearbyIds.has(m.id)}
                onClick={onSelectMemory}
              />
            </Marker>
          ))}

        <UserPresenceMarker presence={presence} zoom={zoom} />
      </Map>

      <AtmosphericOverlay rain={demo.rain} />
    </div>
  );
}

function AtmosphericOverlay({ rain }: { rain: boolean }) {
  return (
    <>
      <style>{`
        .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right { display: none !important; }
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.7); }
          50% { transform: scaleY(1); }
        }
        @keyframes rareGlow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes rainDrop {
          0% { transform: translateY(-12vh); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(112vh); opacity: 0; }
        }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(10,5,30,0.35) 0%, transparent 35%),
            radial-gradient(ellipse at 50% 100%, rgba(6,3,15,0.55) 0%, transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 140px rgba(6,3,15,0.7)" }}
      />

      {rain && <RainOverlay />}
    </>
  );
}

function RainOverlay() {
  const drops = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        left: (i * 37) % 100,
        delay: (i * 13) % 30 / 10,
        duration: 1.2 + ((i * 19) % 12) / 10,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute top-0 w-px h-12"
          style={{
            left: `${d.left}%`,
            background:
              "linear-gradient(to bottom, transparent, rgba(180,200,220,0.45), transparent)",
            animation: `rainDrop ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function NoTokenState() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(110, 59, 255, 0.22), transparent 55%),
            radial-gradient(ellipse at 70% 70%, rgba(160, 107, 255, 0.18), transparent 55%),
            linear-gradient(180deg, #06030F 0%, #0A0520 50%, #0A0420 100%)
          `,
        }}
      />
      <div className="relative h-full w-full flex items-center justify-center p-6">
        <div className="glass rounded-3xl w-full max-w-md p-7 ring-glow-soft">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-plum to-neon-purple flex items-center justify-center text-xl text-white">
              ◌
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-violet-glow">
                Harita
              </p>
              <h3 className="text-lg font-display text-violet-100 leading-tight">
                Mapbox token gerekli
              </h3>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-violet-200/70 leading-relaxed">
            <code className="text-violet-glow">.env.local</code> dosyasına
            <code className="text-violet-glow"> NEXT_PUBLIC_MAPBOX_TOKEN</code>'ı ekle ve
            <code className="text-violet-glow"> npm run dev</code>'i yeniden başlat.
          </p>
        </div>
      </div>
    </div>
  );
}
