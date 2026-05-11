"use client";

import { motion } from "framer-motion";
import { ritualBadges } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";
import { SectionHeading } from "./MemoryIdentitySummary";

export default function RitualBadges() {
  const unlockedCount = ritualBadges.filter((b) => b.unlocked).length;

  return (
    <div>
      <SectionHeading
        title="Şehir ritüellerin"
        hint={`${unlockedCount} / ${ritualBadges.length} açıldı`}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {ritualBadges.map((b, i) => {
          const mood = getMood(b.mood);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="relative rounded-2xl p-3.5 overflow-hidden backdrop-blur-xl"
              style={{
                background: b.unlocked
                  ? "rgba(14,10,26,0.55)"
                  : "rgba(14,10,26,0.35)",
                border: `1px solid ${
                  b.unlocked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"
                }`,
                opacity: b.unlocked ? 1 : 0.6,
              }}
            >
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl"
                style={{
                  background: b.unlocked ? mood.glow : "rgba(255,255,255,0.04)",
                  opacity: b.unlocked ? 0.55 : 0.2,
                }}
              />

              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: b.unlocked
                      ? `radial-gradient(circle at 35% 30%, ${mood.color} 0%, rgba(20,12,38,0.6) 100%)`
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${b.unlocked ? mood.glow : "rgba(255,255,255,0.05)"}`,
                    boxShadow: b.unlocked ? `0 0 12px ${mood.glow}` : "none",
                  }}
                >
                  <span
                    style={{
                      color: b.unlocked ? "white" : "rgba(255,255,255,0.45)",
                      fontSize: 14,
                    }}
                  >
                    {b.unlocked ? mood.glyph : "◌"}
                  </span>
                </div>
                <p className="text-[12.5px] text-white/92 leading-tight">
                  {b.name}
                </p>
                <p className="text-[10.5px] text-white/50 mt-1 leading-snug line-clamp-2">
                  {b.description}
                </p>
                {b.unlocked && b.unlockedAt && (
                  <p className="text-[10px] text-white/35 mt-1.5">
                    {b.unlockedAt}
                  </p>
                )}
                {!b.unlocked && (
                  <p className="text-[10px] text-white/35 mt-1.5">kilitli</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
