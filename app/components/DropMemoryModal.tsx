"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { moodOptions } from "@/lib/mockData";
import { getMood } from "@/lib/moodPalette";

const HOLD_MS = 1400;

export default function DropMemoryModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [moodId, setMoodId] = useState<string>("melankolik");
  const [phase, setPhase] = useState<"write" | "released">("write");

  const mood = getMood(moodId);

  const handleSubmit = () => {
    setPhase("released");
    // Auto-close after the ripple ritual finishes
    window.setTimeout(onClose, 2600);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={phase === "write" ? onClose : undefined}
      />

      <AnimatePresence mode="wait">
        {phase === "write" && (
          <motion.div
            key="write"
            className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none
              px-3 pb-24
              md:items-center md:p-6 md:pl-[260px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-[460px] pointer-events-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div
                className="rounded-3xl overflow-hidden backdrop-blur-2xl"
                style={{
                  background: "rgba(14,10,26,0.78)",
                  border: `1px solid ${mood.glow}`,
                  boxShadow: `0 16px 56px ${mood.glow}`,
                }}
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-white/15" />
                </div>

                <div className="px-6 pt-3 pb-6 md:px-7">
                  {/* Atmospheric eyebrow */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: mood.color, boxShadow: `0 0 8px ${mood.color}` }}
                    />
                    <p className="text-[10.5px] uppercase tracking-[0.28em] text-white/55">
                      bu yere
                    </p>
                  </div>

                  <h3 className="mt-1.5 text-[20px] md:text-[22px] font-display text-white/95 leading-tight">
                    Ne bırakıyorsun?
                  </h3>

                  {/* Writing surface — no visible textbox border, just a horizon line */}
                  <div className="mt-5 relative">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="bir cümle, bir his, bir an..."
                      rows={4}
                      maxLength={140}
                      className="w-full bg-transparent text-white/92 placeholder-white/25 focus:outline-none text-[16px] md:text-[17px] leading-relaxed resize-none italic"
                      autoFocus
                    />
                    {/* Soft horizon */}
                    <div
                      className="h-px w-full"
                      style={{
                        background: `linear-gradient(to right, transparent, ${mood.color}66, transparent)`,
                      }}
                    />
                    <p className="mt-2 text-right text-[10.5px] text-white/35 tabular-nums">
                      {text.length}/140
                    </p>
                  </div>

                  {/* Mood dots — horizontal selector */}
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2.5">
                      hissin
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {moodOptions.map((m) => {
                        const entry = getMood(m.id);
                        const active = m.id === moodId;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMoodId(m.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition"
                            style={{
                              background: active ? `${entry.color}22` : "rgba(255,255,255,0.03)",
                              border: `1px solid ${active ? entry.color + "88" : "rgba(255,255,255,0.06)"}`,
                              boxShadow: active ? `0 0 12px ${entry.glow}` : "none",
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: entry.color,
                                boxShadow: `0 0 5px ${entry.color}`,
                              }}
                            />
                            <span
                              className={`text-[11.5px] ${active ? "text-white/95" : "text-white/60"}`}
                            >
                              {m.label.toLowerCase()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional capture buttons — muted, second-priority */}
                  <div className="mt-4 flex gap-2">
                    <SoftButton glyph="♪" label="ses kaydet" />
                    <SoftButton glyph="◇" label="foto" />
                  </div>

                  <p className="mt-5 text-[11px] text-white/40 leading-relaxed italic">
                    Günde sadece bir anı bırakabilirsin. Yavaş ol, derin bırak.
                  </p>

                  {/* The ritual: long-press to submit */}
                  <HoldToSubmit
                    disabled={text.trim().length < 2}
                    mood={mood}
                    onComplete={handleSubmit}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "released" && (
          <ReleasedOverlay key="released" mood={mood} />
        )}
      </AnimatePresence>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hold-to-submit ritual button
// ────────────────────────────────────────────────────────────────────────────

function HoldToSubmit({
  disabled,
  mood,
  onComplete,
}: {
  disabled: boolean;
  mood: ReturnType<typeof getMood>;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef<number>();
  const startRef = useRef(0);

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
    setHolding(false);
    setProgress(0);
  };

  const start = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setHolding(true);
    startRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const p = Math.min(1, elapsed / HOLD_MS);
      setProgress(p);
      if (p >= 1) {
        stop();
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => stop(), []);

  const label = holding ? "şehre bırakıyorum…" : "şehre bırakmak için basılı tut";

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      className="mt-4 w-full h-14 rounded-2xl relative overflow-hidden transition disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : mood.color + "55"}`,
        boxShadow: holding ? `0 0 24px ${mood.glow}` : "none",
      }}
    >
      {/* Mood fill (progress) */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 transition-none"
        style={{
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${mood.color}22 0%, ${mood.color}88 100%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: holding
            ? `radial-gradient(circle at ${progress * 100}% 50%, ${mood.glow} 0%, transparent 60%)`
            : "none",
        }}
      />
      <span className="relative text-[13px] text-white/90 tracking-wide flex items-center justify-center gap-2">
        {holding && <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />}
        {label}
      </span>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// The "şehir aldı" moment — ripple + soft message
// ────────────────────────────────────────────────────────────────────────────

function ReleasedOverlay({ mood }: { mood: ReturnType<typeof getMood> }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Expanding ripple ring */}
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: 16,
          height: 16,
          border: `2px solid ${mood.color}`,
          boxShadow: `0 0 40px ${mood.color}`,
        }}
        initial={{ scale: 0.4, opacity: 0.85 }}
        animate={{ scale: 80, opacity: 0 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      />

      {/* Second slower ripple */}
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: 16,
          height: 16,
          border: `1px solid ${mood.color}`,
          opacity: 0.6,
        }}
        initial={{ scale: 0.4, opacity: 0.6 }}
        animate={{ scale: 50, opacity: 0 }}
        transition={{ duration: 2.4, ease: "easeOut", delay: 0.25 }}
      />

      {/* Central pulse and text */}
      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="mx-auto w-16 h-16 mb-6 rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, ${mood.color} 55%, ${mood.color}55 100%)`,
            boxShadow: `0 0 36px ${mood.color}`,
          }}
          animate={{ scale: [0.6, 1.2, 0.95] }}
          transition={{ duration: 2.4, ease: "easeOut" }}
        />
        <motion.p
          className="text-[14px] uppercase tracking-[0.3em] mb-2"
          style={{ color: mood.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, times: [0, 0.25, 0.75, 1] }}
        >
          şehir aldı
        </motion.p>
        <motion.p
          className="text-white/65 text-[15px] italic max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: 2.4, times: [0, 0.3, 0.75, 1] }}
        >
          bu sokak artık sana biraz daha ait.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function SoftButton({ glyph, label }: { glyph: string; label: string }) {
  return (
    <button
      type="button"
      className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-[12px] text-white/65 transition hover:bg-white/[0.05]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-white/55">{glyph}</span>
      <span>{label}</span>
    </button>
  );
}
