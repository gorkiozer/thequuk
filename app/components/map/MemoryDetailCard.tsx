"use client";

import { motion } from "framer-motion";
import { type Memory } from "@/lib/istanbulData";
import { getMood } from "@/lib/moodPalette";

type Props = {
  memory: Memory;
  onClose: () => void;
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

function BookmarkGlyph({ className = "" }: { className?: string }) {
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

function FakeWaveform({ color }: { color: string }) {
  // 28 bars, deterministic heights — no randomness re-render churn
  const bars = Array.from({ length: 28 }).map((_, i) => {
    const h = 6 + ((i * 31) % 14) + (Math.sin(i * 1.4) + 1) * 4;
    return Math.min(28, h);
  });
  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm"
          style={{
            background: color,
            opacity: 0.4 + (i % 5) * 0.12,
            height: h,
            animation: `soundWave 1.2s ease-in-out ${(i % 4) * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function MemoryDetailCard({ memory, onClose }: Props) {
  const mood = getMood(memory.mood);
  const isSound = memory.hasSound;
  const isNight = memory.isNight;
  const isRain = memory.isRain;
  const isRare = memory.rare;
  const isPopular = memory.popular;
  const isSecret = memory.type === "secret" || memory.type === "confession";

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none
          px-3 pb-24
          md:items-end md:justify-start md:p-6 md:pl-[268px]"
      >
        <motion.div
          className="w-full max-w-[440px] md:max-w-[440px] pointer-events-auto"
          initial={{ y: "100%", opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div
            className="rounded-3xl overflow-hidden backdrop-blur-2xl"
            style={{
              background: "rgba(14,10,26,0.75)",
              border: `1px solid ${mood.glow}`,
              boxShadow: `0 12px 48px ${mood.glow}, 0 1px 0 rgba(255,255,255,0.04) inset`,
            }}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            <div className="px-5 pt-2 pb-6">
              {/* Header */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: mood.color, boxShadow: `0 0 10px ${mood.color}` }}
                />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/55">
                  {mood.label}
                </span>
                <span className="text-white/30 text-[10px]">·</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {memory.district}
                </span>
                <span className="ml-auto text-[11px] text-white/45">
                  {memory.timeAgo}
                </span>
              </div>

              {/* Body */}
              <p className="mt-4 text-[17px] md:text-[18px] leading-snug text-white/94">
                "{memory.text}"
              </p>

              {/* Type-specific block */}
              {isSound && (
                <div
                  className="mt-4 rounded-2xl p-3 flex items-center gap-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: mood.color,
                      boxShadow: `0 0 14px ${mood.color}`,
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0a0613]" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <FakeWaveform color={mood.color} />
                  <span className="text-[11px] text-white/55 ml-auto">2'14"</span>
                </div>
              )}

              {isNight && (
                <p
                  className="mt-3 text-[12px] flex items-center gap-2"
                  style={{ color: mood.color }}
                >
                  <span>☾</span>
                  <span className="opacity-80">Sadece gece görünür</span>
                </p>
              )}

              {isRain && (
                <p
                  className="mt-3 text-[12px] flex items-center gap-2"
                  style={{ color: mood.color }}
                >
                  <span>❅</span>
                  <span className="opacity-80">Yağmur başlayınca açılır</span>
                </p>
              )}

              {isRare && (
                <p
                  className="mt-3 text-[12px] flex items-center gap-2"
                  style={{ color: mood.color }}
                >
                  <span>✦</span>
                  <span className="opacity-80">Nadir bir anı</span>
                </p>
              )}

              {isSecret && (
                <p
                  className="mt-3 text-[12px] flex items-center gap-2"
                  style={{ color: mood.color }}
                >
                  <span>◈</span>
                  <span className="opacity-80">Bu bir itiraf — yakınında ortaya çıkar</span>
                </p>
              )}

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] text-white/85 transition hover:bg-white/[0.06]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <HeartGlyph className="w-3.5 h-3.5" />
                  <span>{memory.likes}</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] text-white/85 transition hover:bg-white/[0.06]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <BookmarkGlyph className="w-3.5 h-3.5" />
                  <span>Sakla</span>
                </button>
                {isPopular && (
                  <span
                    className="ml-auto text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: mood.color }}
                  >
                    popüler
                  </span>
                )}
              </div>

              {/* CTA */}
              <button
                className="mt-4 w-full h-12 rounded-2xl text-[14px] text-white transition active:scale-[0.99]"
                style={{
                  background: `linear-gradient(135deg, #2a1854 0%, #5b32c2 100%)`,
                  border: `1px solid rgba(180,138,255,0.30)`,
                  boxShadow: `0 8px 24px rgba(110,59,255,0.35)`,
                }}
              >
                Bu yere ben de anı bırak
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
