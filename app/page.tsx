"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { moodOptions } from "@/lib/mockData";
import { getMood } from "@/lib/moodPalette";

type Step = "intro" | "mood" | "name" | "ready";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [mood, setMood] = useState<string>("melankolik");
  const [username, setUsername] = useState("");

  // Auto-advance from intro after 2.4s; tap also advances
  useEffect(() => {
    if (step !== "intro") return;
    const t = window.setTimeout(() => setStep("mood"), 2400);
    return () => window.clearTimeout(t);
  }, [step]);

  // Persist onboarding then go to map
  const finish = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("thequuk_mood", mood);
        localStorage.setItem("thequuk_mood_seen", "1");
        if (username.trim()) {
          localStorage.setItem("thequuk_username", username.trim());
        }
      }
    } catch {
      /* localStorage blocked */
    }
    router.push("/map");
  };

  const moodEntry = getMood(mood);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Cinematic city background — mood-responsive */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(ellipse at 30% 18%, ${moodEntry.glow} 0%, transparent 42%),
            radial-gradient(ellipse at 70% 78%, ${moodEntry.soft} 0%, transparent 55%),
            linear-gradient(180deg, #06030F 0%, #0a0518 50%, #06030F 100%)
          `,
        }}
      />

      <DriftingParticles color={moodEntry.color} />
      <CityHorizon color={moodEntry.color} />

      {/* Step content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <IntroStep
                key="intro"
                onContinue={() => setStep("mood")}
              />
            )}

            {step === "mood" && (
              <MoodStep
                key="mood"
                mood={mood}
                onPick={(m) => {
                  setMood(m);
                  setStep("name");
                }}
              />
            )}

            {step === "name" && (
              <NameStep
                key="name"
                value={username}
                onChange={setUsername}
                onContinue={() => setStep("ready")}
                moodColor={moodEntry.color}
              />
            )}

            {step === "ready" && (
              <ReadyStep key="ready" moodKey={mood} username={username} onEnter={finish} />
            )}
          </AnimatePresence>
        </div>

        {/* Step indicator at bottom */}
        <div className="pb-10 flex items-center justify-center gap-2">
          {["intro", "mood", "name", "ready"].map((s) => (
            <span
              key={s}
              className="h-[3px] rounded-full transition-all duration-500"
              style={{
                width: step === s ? 24 : 4,
                background: step === s ? moodEntry.color : "rgba(255,255,255,0.18)",
                boxShadow: step === s ? `0 0 8px ${moodEntry.color}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Steps
// ────────────────────────────────────────────────────────────────────────────

function IntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 1.4 }}
      onClick={onContinue}
      className="text-center max-w-md mx-auto cursor-pointer"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-[34px] md:text-[44px] font-display font-medium text-white/95 leading-tight tracking-tight"
      >
        Şehir<br />seni bekliyor.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
        className="mt-10 text-[11px] uppercase tracking-[0.32em] text-white/40"
      >
        dokun
      </motion.p>
    </motion.button>
  );
}

function MoodStep({
  mood,
  onPick,
}: {
  mood: string;
  onPick: (m: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-md mx-auto"
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-white/40 mb-3">
        bugün
      </p>
      <h2 className="text-[28px] md:text-[34px] font-display font-medium text-white/95 leading-tight">
        Nasıl hissediyorsun?
      </h2>
      <p className="mt-3 text-[13.5px] text-white/55 italic">
        Şehir bu hisle seni karşılayacak.
      </p>

      <div className="mt-9 grid grid-cols-3 gap-2.5">
        {moodOptions.map((m) => {
          const entry = getMood(m.id);
          const active = m.id === mood;
          return (
            <motion.button
              key={m.id}
              onClick={() => onPick(m.id)}
              whileTap={{ scale: 0.96 }}
              className="h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition"
              style={{
                background: active
                  ? `rgba(20,14,38,0.78)`
                  : "rgba(14,10,26,0.45)",
                border: `1px solid ${active ? entry.color : "rgba(255,255,255,0.06)"}`,
                boxShadow: active ? `0 0 18px ${entry.glow}` : "none",
              }}
            >
              <span className="text-[16px]" style={{ color: entry.color }}>
                {entry.glyph}
              </span>
              <span className="text-[12.5px] text-white/85">{m.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function NameStep({
  value,
  onChange,
  onContinue,
  moodColor,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  moodColor: string;
}) {
  const canContinue = value.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-md mx-auto w-full"
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-white/40 mb-3">
        kimlik
      </p>
      <h2 className="text-[28px] md:text-[34px] font-display font-medium text-white/95 leading-tight">
        Adın ne<br />fısıldansın?
      </h2>
      <p className="mt-3 text-[13.5px] text-white/55 italic">
        Şehir seni bu adla hatırlayacak.
      </p>

      <div className="mt-9">
        <div
          className="flex items-center rounded-2xl px-4 py-3 max-w-xs mx-auto"
          style={{
            background: "rgba(14,10,26,0.55)",
            border: `1px solid ${value ? moodColor + "55" : "rgba(255,255,255,0.08)"}`,
            boxShadow: value ? `0 0 14px ${moodColor}33` : "none",
          }}
        >
          <span className="text-white/35 mr-1 text-[16px]">@</span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\s/g, "").toLowerCase())}
            placeholder="gece.yolcusu"
            maxLength={24}
            autoFocus
            className="flex-1 bg-transparent text-[16px] text-white placeholder-white/25 focus:outline-none"
          />
        </div>

        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="mt-7 px-7 h-12 rounded-full text-[13.5px] text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: canContinue
              ? `linear-gradient(135deg, #2a1854 0%, ${moodColor} 100%)`
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${canContinue ? moodColor + "66" : "rgba(255,255,255,0.06)"}`,
            boxShadow: canContinue ? `0 6px 18px ${moodColor}33` : "none",
          }}
        >
          Devam
        </button>
      </div>
    </motion.div>
  );
}

function ReadyStep({
  moodKey,
  username,
  onEnter,
}: {
  moodKey: string;
  username: string;
  onEnter: () => void;
}) {
  const mood = getMood(moodKey);

  // Auto-enter after a moment if user doesn't tap
  useEffect(() => {
    const t = window.setTimeout(onEnter, 3600);
    return () => window.clearTimeout(t);
  }, [onEnter]);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.9 }}
      onClick={onEnter}
      className="text-center max-w-md mx-auto cursor-pointer"
    >
      {/* Glowing orb echo of the user's mood */}
      <motion.div
        className="relative mx-auto mb-8"
        style={{ width: 88, height: 88 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${mood.glow} 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
        <span
          aria-hidden
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, ${mood.color} 50%, ${mood.color}55 100%)`,
            boxShadow: `0 0 28px ${mood.color}`,
          }}
        />
      </motion.div>

      <p className="text-[11px] uppercase tracking-[0.32em] text-white/40 mb-3">
        hoşgeldin
      </p>
      <h2 className="text-[26px] md:text-[32px] font-display font-medium text-white/95 leading-tight">
        @{username || "yolcu"}
      </h2>
      <p className="mt-3 text-[14px] text-white/55 italic max-w-xs mx-auto leading-relaxed">
        Şehir bugün senin için <span style={{ color: mood.color }}>{mood.label}</span>.
      </p>

      <p className="mt-10 text-[11px] uppercase tracking-[0.32em] text-white/40">
        dokun · şehre adım at
      </p>
    </motion.button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Background atmosphere
// ────────────────────────────────────────────────────────────────────────────

function DriftingParticles({ color }: { color: string }) {
  const dots = Array.from({ length: 22 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 73) % 100}%`,
            top: `${(i * 41) % 100}%`,
            width: 2,
            height: 2,
            background: color,
            boxShadow: `0 0 6px ${color}`,
            opacity: 0.45,
          }}
          animate={{
            opacity: [0.15, 0.55, 0.15],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

function CityHorizon({ color }: { color: string }) {
  // Subtle horizontal city silhouette at the bottom — barely visible
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none opacity-50"
      viewBox="0 0 440 220"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="horizonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06030F" stopOpacity="0" />
          <stop offset="55%" stopColor="#06030F" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#06030F" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0 180 L0 140 L20 140 L20 110 L40 110 L40 130 L60 130 L60 90 L80 90 L80 120 L100 120 L100 80 L120 80 L120 60 L140 60 L140 100 L160 100 L160 130 L185 130 L185 95 L210 95 L210 75 L230 75 L230 110 L260 110 L260 90 L285 90 L285 120 L310 120 L310 85 L335 85 L335 105 L360 105 L360 70 L380 70 L380 100 L405 100 L405 130 L440 130 L440 220 L0 220 Z"
        fill="url(#horizonGrad)"
      />
      {[
        [25, 120], [45, 120], [65, 100], [85, 100], [105, 90], [125, 70],
        [165, 110], [190, 105], [215, 85], [245, 100], [270, 100], [295, 110],
        [320, 95], [345, 95], [365, 80], [390, 90],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1.6" height="1.6" fill={color} opacity={0.55}>
          <animate
            attributeName="opacity"
            values="0.2;0.7;0.2"
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}
