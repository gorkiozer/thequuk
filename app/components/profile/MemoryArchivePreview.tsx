"use client";

import { motion } from "framer-motion";
import { userMemories } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";

export default function MemoryArchivePreview() {
  // Take 4 most resonant memories — sorted by likes, but mix a sound or night one in
  const sorted = [...userMemories].sort((a, b) => b.likes - a.likes);
  const picks: typeof userMemories = [];

  for (const m of sorted) {
    if (picks.length === 4) break;
    if (m.visibility === "locked") continue;
    picks.push(m);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="h-px w-12 bg-white/10" />
        <p className="mx-4 text-[10.5px] uppercase tracking-[0.35em] text-white/40">
          son izler
        </p>
        <div className="h-px w-12 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {picks.map((m, i) => {
          const mood = getMood(m.mood);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 * i, ease: "easeOut" }}
              className="relative rounded-2xl p-4 overflow-hidden backdrop-blur-xl transition group hover:-translate-y-0.5"
              style={{
                background: "rgba(14,10,26,0.55)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition group-hover:opacity-100"
                style={{ background: mood.glow, opacity: 0.5 }}
              />
              <div className="relative">
                <p className="text-[14px] leading-snug text-white/88">
                  "{m.text}"
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-white/45">
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: mood.color, boxShadow: `0 0 5px ${mood.color}` }}
                  />
                  <span className="capitalize">{mood.label}</span>
                  <span className="text-white/20">·</span>
                  <span>{m.place ?? m.district}</span>
                  <span className="text-white/20">·</span>
                  <span>{m.timeAgo}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
