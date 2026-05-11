"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userMemories, type UserMemory } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";
import { SectionHeading } from "./MemoryIdentitySummary";

type FilterKey =
  | "all"
  | "text"
  | "sound"
  | "secret"
  | "night"
  | "rain"
  | "liked"
  | "saved";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",    label: "Tümü" },
  { key: "text",   label: "Yazı" },
  { key: "sound",  label: "Ses" },
  { key: "secret", label: "Gizli" },
  { key: "night",  label: "Gece" },
  { key: "rain",   label: "Yağmur" },
  { key: "liked",  label: "Beğenilen" },
  { key: "saved",  label: "Kaydedilen" },
];

function passes(m: UserMemory, f: FilterKey): boolean {
  switch (f) {
    case "all":    return true;
    case "text":   return m.type === "text";
    case "sound":  return !!m.hasSound;
    case "secret": return m.type === "secret" || m.type === "confession";
    case "night":  return !!m.isNight;
    case "rain":   return !!m.isRain;
    case "liked":  return m.likes >= 40;
    case "saved":  return !!m.saved;
  }
}

export default function MemoryArchive() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const list = useMemo(
    () => userMemories.filter((m) => passes(m, filter)),
    [filter]
  );

  return (
    <div>
      <SectionHeading title="Anı arşivin" hint={`${userMemories.length} iz`} />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] transition`}
              style={{
                background: active
                  ? "rgba(160,107,255,0.20)"
                  : "rgba(14,10,26,0.55)",
                border: active
                  ? "1px solid rgba(180,138,255,0.45)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: active ? "rgba(245,240,255,0.96)" : "rgba(245,240,255,0.62)",
                boxShadow: active ? "0 0 14px rgba(160,107,255,0.32)" : "none",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {list.length === 0 && <Empty filter={filter} />}
          {list.map((m, i) => (
            <ArchiveRow key={m.id} m={m} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {list.length > 0 && list.length < userMemories.length && (
        <p className="mt-4 text-[11px] text-white/40 text-center">
          {userMemories.length - list.length} anı bu filtrenin dışında
        </p>
      )}
    </div>
  );
}

function ArchiveRow({ m, index }: { m: UserMemory; index: number }) {
  const mood = getMood(m.mood);
  const locked = m.visibility === "locked";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.02, 0.4) }}
      className="relative rounded-2xl p-4 overflow-hidden backdrop-blur-xl transition hover:bg-[rgba(20,14,38,0.65)]"
      style={{
        background: "rgba(14,10,26,0.55)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl"
        style={{ background: mood.glow, opacity: 0.55 }}
      />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-[10px] mb-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: mood.color, boxShadow: `0 0 6px ${mood.color}` }}
          />
          <span className="text-white/55 capitalize tracking-wide">
            {mood.label}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/55 uppercase tracking-[0.18em]">
            {m.district}
            {m.place ? ` · ${m.place}` : ""}
          </span>
          <span className="ml-auto text-white/45">{m.timeAgo}</span>
        </div>

        <p
          className={`text-[14.5px] leading-snug ${locked ? "italic text-white/55" : "text-white/92"}`}
        >
          {locked ? "—" : `"${m.text}"`}
        </p>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-white/55">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {m.likes} kişi hissetti
          </span>
          {m.hasSound && (
            <span style={{ color: mood.color }}>♪ sound</span>
          )}
          {m.isNight && (
            <span style={{ color: mood.color }}>☾ gece</span>
          )}
          {m.isRain && (
            <span style={{ color: mood.color }}>❅ yağmur</span>
          )}
          {m.saved && (
            <span className="ml-auto flex items-center gap-1 text-white/65">
              <Bookmark className="w-3 h-3" />
              kayıtlı
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Empty({ filter }: { filter: FilterKey }) {
  const messages: Record<FilterKey, string> = {
    all:    "Henüz şehirde bir iz bırakmadın.",
    text:   "Yazılı bir anın yok henüz.",
    sound:  "Henüz bir ses memory bırakmadın.",
    secret: "Saklı bir notun yok.",
    night:  "Gece bir iz bırakmadın.",
    rain:   "Yağmurda yazılmış bir anın yok.",
    liked:  "Henüz bir anın 40'tan fazla kişiye dokunmadı.",
    saved:  "Henüz bir anı saklamadın.",
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl p-6 text-center"
      style={{
        background: "rgba(14,10,26,0.4)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <p className="text-[13px] text-white/55">{messages[filter]}</p>
      <p className="mt-1 text-[11px] text-white/35">
        Bir yer seç, şehir seni hatırlasın.
      </p>
    </motion.div>
  );
}

function Heart({ className = "" }: { className?: string }) {
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

function Bookmark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 4h12v17l-6-3.5L6 21V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
