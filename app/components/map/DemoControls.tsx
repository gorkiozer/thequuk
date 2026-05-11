"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDemoMode } from "@/lib/demoMode";

export default function DemoControls() {
  const [open, setOpen] = useState(false);
  const dm = useDemoMode();

  return (
    <div
      className="absolute left-3 md:left-6 bottom-32 md:bottom-8 z-30"
      style={{ pointerEvents: "auto" }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="mb-2 rounded-2xl backdrop-blur-2xl p-3 w-60"
            style={{
              background: "rgba(14,10,26,0.65)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
            }}
          >
            <p className="text-[9.5px] uppercase tracking-[0.28em] text-white/45 mb-2.5">
              Demo Modu
            </p>

            <Toggle
              label="Gece modu"
              hint="Gece anılarını aç"
              value={dm.night}
              onChange={dm.setNight}
            />
            <Toggle
              label="Yağmur modu"
              hint="Yağmur anılarını aç"
              value={dm.rain}
              onChange={dm.setRain}
            />
            <Toggle
              label="Yürüyüş"
              hint="Konum hareketi"
              value={dm.walk}
              onChange={dm.setWalk}
            />

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-white/80">Yoğunluk</span>
                <span className="text-[10px] text-white/45">
                  %{Math.round(dm.density * 100)}
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.1}
                value={dm.density}
                onChange={(e) => dm.setDensity(parseFloat(e.target.value))}
                className="w-full accent-[#A06BFF]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition hover:bg-[rgba(14,10,26,0.7)]"
        style={{
          background: "rgba(14,10,26,0.55)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-violet-glow"
          style={{ boxShadow: "0 0 8px rgba(180,138,255,0.95)" }}
        />
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/65">
          demo
        </span>
      </button>
    </div>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between gap-3 py-1.5 group"
    >
      <div className="text-left">
        <p className="text-[12px] text-white/85">{label}</p>
        {hint && <p className="text-[10px] text-white/40 mt-0.5">{hint}</p>}
      </div>
      <span
        className="w-9 h-5 rounded-full relative transition"
        style={{
          background: value ? "rgba(160,107,255,0.6)" : "rgba(255,255,255,0.10)",
          boxShadow: value ? "0 0 14px rgba(160,107,255,0.55)" : "none",
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
          style={{
            transform: value ? "translateX(16px)" : "translateX(0)",
          }}
        />
      </span>
    </button>
  );
}
