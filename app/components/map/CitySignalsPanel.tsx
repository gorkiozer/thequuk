"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { generateCitySignals, type CitySignal } from "@/lib/citySignals";
import { getMood } from "@/lib/moodPalette";

const ROTATE_MS = 4500;

export default function CitySignalsPanel() {
  const signals = useMemo<CitySignal[]>(() => generateCitySignals(), []);
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded || signals.length === 0) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % signals.length);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [signals.length, expanded]);

  if (signals.length === 0) return null;

  const current = signals[idx];
  const mood = getMood(current.mood);

  return (
    <div
      className="absolute top-16 md:top-20 right-3 md:right-6 z-30 pointer-events-auto"
      style={{ maxWidth: "min(90vw, 320px)" }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div
          className="rounded-2xl backdrop-blur-xl px-3.5 py-2.5 transition group hover:bg-[rgba(14,10,26,0.6)]"
          style={{
            background: "rgba(14,10,26,0.50)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: mood.color,
                boxShadow: `0 0 8px ${mood.color}`,
                animation: "breathGlow 2.4s ease-in-out infinite",
              }}
            />
            <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
              Şehir Sinyalleri
            </span>
            <span className="ml-auto text-[9.5px] text-white/35">
              {idx + 1}/{signals.length}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              className="text-[13px] leading-snug text-white/88"
            >
              {current.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 rounded-2xl backdrop-blur-xl overflow-hidden"
            style={{
              background: "rgba(14,10,26,0.55)",
              border: "1px solid rgba(255,255,255,0.06)",
              maxHeight: 280,
            }}
          >
            <div className="overflow-y-auto scrollbar-hide max-h-[280px] divide-y divide-white/5">
              {signals.map((s) => {
                const m = getMood(s.mood);
                return (
                  <div key={s.id} className="px-3.5 py-2 flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }}
                    />
                    <p className="text-[12.5px] leading-snug text-white/80">{s.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
