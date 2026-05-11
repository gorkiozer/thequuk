"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MapboxMap from "@/app/components/MapboxMap";
import BottomSheet from "@/app/components/BottomSheet";
import MoodModal from "@/app/components/MoodModal";
import DropMemoryModal from "@/app/components/DropMemoryModal";
import MemoryDetailCard from "@/app/components/map/MemoryDetailCard";
import CitySignalsPanel from "@/app/components/map/CitySignalsPanel";
import DemoControls from "@/app/components/map/DemoControls";
import {
  districts,
  memoriesInDistrict,
  memories,
  getDistrictStats,
} from "@/lib/mockData";
import { getMood } from "@/lib/moodPalette";
import { DemoModeProvider, useDemoMode } from "@/lib/demoMode";

export default function MapPage() {
  return (
    <DemoModeProvider>
      <MapPageInner />
    </DemoModeProvider>
  );
}

function MapPageInner() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [showMood, setShowMood] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [mood, setMood] = useState<string>("romantik");
  const demo = useDemoMode();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("thequuk_mood_seen");
    if (!seen) setShowMood(true);
    const stored = window.localStorage.getItem("thequuk_mood");
    if (stored) setMood(stored);
  }, []);

  const onMoodPick = (m: string) => {
    setMood(m);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("thequuk_mood_seen", "1");
      window.localStorage.setItem("thequuk_mood", m);
    }
    setShowMood(false);
  };

  const hood = selectedDistrict
    ? districts.find((d) => d.id === selectedDistrict) ?? null
    : null;

  const memoryDetail = selectedMemory
    ? memories.find((m) => m.id === selectedMemory) ?? null
    : null;

  // City mood derived from demo state — gece overrides, otherwise user-picked
  const cityMoodKey = demo.night ? "gece" : demo.rain ? "yagmurlu" : mood;
  const cityMood = getMood(cityMoodKey);

  // Total active count for header
  const totalCount = useMemo(() => {
    return memories.filter((m) => {
      if (m.isNight && !demo.night) return false;
      if (m.isRain && !demo.rain) return false;
      return true;
    }).length;
  }, [demo.night, demo.rain]);

  return (
    <div className="relative w-full min-h-screen">
      <MapboxMap
        onSelectDistrict={setSelectedDistrict}
        onSelectMemory={setSelectedMemory}
      />

      {/* Top status pill — minimal city signal */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4 md:pt-6 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-full backdrop-blur-2xl pointer-events-auto"
          style={{
            background: "rgba(14,10,26,0.55)",
            border: `1px solid ${cityMood.glow}`,
            boxShadow: `0 4px 24px ${cityMood.glow}`,
            padding: "6px 14px",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[10.5px] uppercase tracking-[0.22em] text-white/55">
              İstanbul şu an
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{
                background: cityMood.color,
                boxShadow: `0 0 6px ${cityMood.color}`,
              }}
            />
            <span
              className="text-[13px] capitalize"
              style={{ color: cityMood.color }}
            >
              {cityMood.label}
            </span>
            <span className="text-white/25 text-[10px]">·</span>
            <span className="text-[10.5px] text-white/55">{totalCount} anı</span>
          </div>
        </motion.div>
      </div>

      {/* City signals — small rotating panel */}
      <CitySignalsPanel />

      {/* Demo controls — bottom-left toggle pill */}
      <DemoControls />

      {/* Organic Anı Bırak button */}
      <button
        onClick={() => setShowDrop(true)}
        className="absolute right-5 bottom-28 md:right-8 md:bottom-10 z-30 group"
        aria-label="Anı bırak"
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative">
            <span
              className="absolute inset-0 rounded-full bg-neon-purple/35 blur-2xl"
              style={{ animation: "breathGlow 3.6s ease-in-out infinite" }}
            />
            <span
              className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-md transition group-active:scale-95"
              style={{
                background: "radial-gradient(circle at 35% 30%, #2a1854 0%, #150a2c 70%)",
                border: "1px solid rgba(180,138,255,0.30)",
                boxShadow:
                  "0 8px 32px rgba(110,59,255,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              <DropGlyph className="w-6 h-6 md:w-7 md:h-7 text-violet-glow" />
            </span>
          </div>
          <span className="text-[10px] tracking-[0.22em] uppercase text-white/65 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            anı bırak
          </span>
        </div>
      </button>

      {/* District bottom sheet */}
      <AnimatePresence>
        {hood && (
          <BottomSheet onClose={() => setSelectedDistrict(null)}>
            <DistrictSheet
              districtId={hood.id}
              onSelectMemory={(id) => {
                setSelectedMemory(id);
                setSelectedDistrict(null);
              }}
            />
          </BottomSheet>
        )}
      </AnimatePresence>

      {/* Memory detail card */}
      <AnimatePresence>
        {memoryDetail && (
          <MemoryDetailCard
            memory={memoryDetail}
            onClose={() => setSelectedMemory(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMood && (
          <MoodModal onPick={onMoodPick} onClose={() => setShowMood(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDrop && <DropMemoryModal onClose={() => setShowDrop(false)} />}
      </AnimatePresence>
    </div>
  );
}

function DistrictSheet({
  districtId,
  onSelectMemory,
}: {
  districtId: string;
  onSelectMemory: (id: string) => void;
}) {
  const d = districts.find((x) => x.id === districtId)!;
  const list = memoriesInDistrict(districtId);
  const stats = getDistrictStats(districtId);
  const mood = getMood(d.primaryMood);

  return (
    <div className="px-5 pt-4 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: mood.color, boxShadow: `0 0 10px ${mood.color}` }}
            />
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              {d.signature}
            </p>
          </div>
          <h3 className="text-2xl font-display font-semibold text-white mt-1">
            {d.name}
          </h3>
          <p className="mt-1 text-sm text-white/65">
            Bugün <span className="text-white">{stats.count}</span> anı görünüyor
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats.sounds > 0 && <Stat label="Sound" value={stats.sounds} />}
          {stats.night > 0 && <Stat label="Gece" value={stats.night} />}
          {stats.rare > 0 && <Stat label="Nadir" value={stats.rare} />}
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {list.length === 0 && (
          <div className="text-white/50 text-sm">Bu sokak henüz sessiz.</div>
        )}
        {list.map((m) => (
          <MemoryRow key={m.id} m={m} onClick={() => onSelectMemory(m.id)} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="px-2.5 py-1.5 rounded-xl text-center min-w-[44px]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="text-base font-semibold text-white">{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-white/50">{label}</div>
    </div>
  );
}

function MemoryRow({
  m,
  onClick,
}: {
  m: ReturnType<typeof memoriesInDistrict>[number];
  onClick: () => void;
}) {
  const mood = getMood(m.mood);
  const locked = m.visibility === "locked";

  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full text-left rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl transition hover:scale-[1.005]"
      style={{
        background: "rgba(14,10,26,0.55)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl"
        style={{ background: mood.glow }}
      />
      <p className={`relative text-[15px] leading-snug ${locked ? "text-white/55 italic" : "text-white/92"}`}>
        {locked ? "—" : `"${m.text}"`}
      </p>
      <div className="relative mt-2.5 flex items-center gap-2 text-[11px] text-white/55">
        <span style={{ color: mood.color }}>{mood.glyph}</span>
        <span className="capitalize">{mood.label}</span>
        <span>·</span>
        <span>{m.timeAgo}</span>
        {m.hasSound && (
          <>
            <span>·</span>
            <span style={{ color: mood.color }}>sound</span>
          </>
        )}
        {m.isNight && (
          <>
            <span>·</span>
            <span style={{ color: mood.color }}>gece</span>
          </>
        )}
        {m.isRain && (
          <>
            <span>·</span>
            <span style={{ color: mood.color }}>yağmur</span>
          </>
        )}
        <span className="ml-auto flex items-center gap-1">
          <HeartGlyph className="w-3 h-3" />
          {m.likes}
        </span>
      </div>
    </button>
  );
}

function HeartGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3.5c3 4 6 7.2 6 11.1a6 6 0 1 1-12 0c0-3.9 3-7.1 6-11.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 14c.4 1.4 1.5 2.4 2.8 2.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
