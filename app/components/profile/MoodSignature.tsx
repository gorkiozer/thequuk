"use client";

import { motion } from "framer-motion";
import { moodSignature } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";
import { SectionHeading } from "./MemoryIdentitySummary";

const VIEW = 220;
const STROKE = 22;
const RADIUS = (VIEW - STROKE - 16) / 2; // ~91
const CENTER = VIEW / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function MoodSignature() {
  let cumPercent = 0;

  const arcs = moodSignature.map((entry) => {
    const mood = getMood(entry.mood);
    const len = (entry.percent / 100) * CIRC;
    // Tiny gap between arcs
    const gap = 2;
    const drawn = Math.max(0, len - gap);
    const arc = {
      entry,
      mood,
      drawn,
      offset: -((cumPercent / 100) * CIRC),
    };
    cumPercent += entry.percent;
    return arc;
  });

  const dominant = moodSignature[0];
  const dominantMood = getMood(dominant.mood);

  return (
    <div>
      <SectionHeading title="Duygu imzan" hint="şehir seni böyle okuyor" />
      <div
        className="rounded-2xl p-5 md:p-6 backdrop-blur-xl"
        style={{
          background: "rgba(14,10,26,0.55)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative shrink-0 mx-auto md:mx-0" style={{ width: VIEW, height: VIEW }}>
            <svg
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              width={VIEW}
              height={VIEW}
              style={{ filter: "drop-shadow(0 0 12px rgba(180,138,255,0.15))" }}
            >
              {/* Track */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={STROKE}
              />
              {/* Mood arcs */}
              {arcs.map((a, i) => (
                <motion.circle
                  key={i}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={a.mood.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${a.drawn} ${CIRC}`}
                  strokeDashoffset={a.offset}
                  transform={`rotate(-90 ${CENTER} ${CENTER})`}
                  initial={{ opacity: 0, strokeDasharray: `0 ${CIRC}` }}
                  animate={{
                    opacity: 1,
                    strokeDasharray: `${a.drawn} ${CIRC}`,
                  }}
                  transition={{ duration: 1.1, delay: i * 0.15, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 6px ${a.mood.color})` }}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p
                className="text-[10px] uppercase tracking-[0.28em]"
                style={{ color: dominantMood.color }}
              >
                baskın his
              </p>
              <p className="mt-1 text-[24px] font-display text-white capitalize">
                {dominantMood.label}
              </p>
              <p className="text-[12px] text-white/55">%{dominant.percent}</p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {moodSignature.map((entry) => {
              const mood = getMood(entry.mood);
              return (
                <div
                  key={entry.mood}
                  className="flex items-center gap-3"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: mood.color,
                      boxShadow: `0 0 8px ${mood.color}`,
                    }}
                  />
                  <span className="text-[13px] text-white/82 capitalize flex-1">
                    {mood.label}
                  </span>
                  <div
                    className="relative h-[2px] rounded-full overflow-hidden flex-[1.4] max-w-[180px]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: mood.color, boxShadow: `0 0 6px ${mood.color}` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${entry.percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[11px] tabular-nums text-white/55 w-9 text-right">
                    %{entry.percent}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
