"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Memory } from "@/lib/istanbulData";
import { getMood } from "@/lib/moodPalette";

type Props = {
  m: Memory;
  index: number;
  expanded: boolean;
  nearby: boolean;
  onClick: (id: string) => void;
};

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

function SoundWave({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-3"
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-sm"
          style={{
            background: color,
            height: 4 + i * 2,
            animation: `soundWave 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function MemoryCapsuleInner({ m, index, expanded, nearby, onClick }: Props) {
  const mood = getMood(m.mood);
  const hidden = m.visibility === "locked";
  const locked = hidden;

  // Visual variants per memory type
  const isSound = m.hasSound;
  const isRare = m.rare;
  const isPopular = m.popular;
  const isNight = m.isNight;
  const isRain = m.isRain;

  return (
    <div className="relative pointer-events-none">
      <AnimatePresence mode="wait">
        {expanded && !locked ? (
          <motion.button
            key="card"
            type="button"
            onClick={() => onClick(m.id)}
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{
              opacity: 1,
              scale: nearby ? 1.05 : 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="rounded-2xl px-3 py-2.5 max-w-[210px] backdrop-blur-xl pointer-events-auto text-left"
            style={{
              background: "rgba(14,10,26,0.72)",
              border: `1px solid ${nearby ? mood.color : "rgba(255,255,255,0.08)"}`,
              boxShadow: nearby
                ? `0 4px 28px ${mood.color}, 0 0 0 1px ${mood.glow} inset`
                : `0 4px 24px ${mood.glow}, 0 1px 0 rgba(255,255,255,0.04) inset`,
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px]">
              <span style={{ color: mood.color }}>{mood.glyph}</span>
              <span className="text-white/55 tracking-wide">{mood.label}</span>
              {isPopular && (
                <span className="ml-auto text-[9.5px] uppercase tracking-widest text-white/65">
                  · popüler
                </span>
              )}
              {!isPopular && isSound && (
                <span className="ml-auto text-[10px]" style={{ color: mood.color }}>
                  ♪
                </span>
              )}
            </div>
            <p className="mt-1 text-[12.5px] leading-snug text-white/92 line-clamp-2">
              {m.text}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/55">
              <HeartGlyph className="w-3 h-3" />
              <span>{m.likes}</span>
              <span className="ml-auto opacity-80">{m.timeAgo}</span>
            </div>
          </motion.button>
        ) : (
          <motion.button
            key="capsule"
            type="button"
            onClick={() => !locked && onClick(m.id)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: nearby ? 1.45 : 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              duration: 0.4,
              delay: !expanded && !locked ? index * 0.03 : 0,
            }}
            className="relative pointer-events-auto"
            disabled={locked}
            aria-label={m.text}
          >
            {/* Outer halo */}
            <span
              aria-hidden
              className="absolute inset-0 -m-1.5 rounded-full blur-md"
              style={{
                background: locked
                  ? "rgba(150,150,180,0.18)"
                  : mood.glow,
                opacity: nearby ? 1 : 0.85,
                animation: isRare
                  ? "rareGlow 4.4s ease-in-out infinite"
                  : nearby
                    ? "breathGlow 1.4s ease-in-out infinite"
                    : isPopular
                      ? "breathGlow 2.0s ease-in-out infinite"
                      : "breathGlow 2.8s ease-in-out infinite",
              }}
            />
            {/* Core */}
            <span
              className="relative block rounded-full"
              style={{
                width: isPopular ? 11 : isRare ? 9 : 8,
                height: isPopular ? 11 : isRare ? 9 : 8,
                background: locked
                  ? "rgba(255,255,255,0.32)"
                  : mood.color,
                boxShadow: locked
                  ? `0 0 7px rgba(180,180,210,0.4)`
                  : `0 0 ${nearby ? "20px" : isPopular ? "16px" : "12px"} ${mood.color}`,
              }}
            />

            {/* Type indicators */}
            {isSound && !locked && <SoundWave color={mood.color} />}

            {isNight && !locked && (
              <span
                className="absolute -top-2.5 -left-2 text-[9px]"
                style={{ color: mood.color }}
              >
                ☾
              </span>
            )}

            {isRain && !locked && (
              <span
                className="absolute -top-2.5 -left-2 text-[9px]"
                style={{ color: mood.color }}
              >
                ❅
              </span>
            )}

            {locked && (
              <span
                aria-hidden
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px]"
                style={{ color: "rgba(245,240,255,0.65)" }}
              >
                {m.isNight ? "☾" : m.isRain ? "❅" : isRare ? "✦" : "◈"}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export const MemoryCapsule = memo(MemoryCapsuleInner);
