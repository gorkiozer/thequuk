"use client";

import { motion } from "framer-motion";
import { cityWhispers } from "@/lib/cityWhispers";
import { getMood } from "@/lib/moodPalette";
import { getCityTimeLabel } from "@/lib/timeOfDay";

export default function CityWhispersPage() {
  const hour = new Date().getHours();
  const timeLabel = getCityTimeLabel(hour);

  return (
    <div className="relative min-h-screen pb-32 md:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 12%, rgba(110,59,255,0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(160,107,255,0.10) 0%, transparent 55%),
            linear-gradient(180deg, #06030F 0%, #0a0518 50%, #06030F 100%)
          `,
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl px-5 md:px-8 pt-12 md:pt-16">
        <header className="text-center">
          <p className="text-[10.5px] uppercase tracking-[0.35em] text-white/40">
            şu an · {timeLabel}
          </p>
          <h1 className="mt-3 text-[28px] md:text-[36px] font-display font-medium tracking-tight text-white/95 leading-tight">
            Şehir Fısıltıları
          </h1>
          <p className="mt-3 text-[14px] md:text-[15px] text-white/55 italic max-w-md mx-auto leading-relaxed">
            Bugün şehir sana ne söylüyor.
          </p>
        </header>

        <div className="mt-12 md:mt-16 space-y-3 md:space-y-4">
          {cityWhispers.map((w, i) => (
            <WhisperRow key={w.id} whisper={w} index={i} />
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/25">
          <div className="h-px w-8 bg-white/15" />
          <span>şehir konuşuyor</span>
          <div className="h-px w-8 bg-white/15" />
        </div>
      </div>
    </div>
  );
}

function WhisperRow({
  whisper,
  index,
}: {
  whisper: typeof cityWhispers[number];
  index: number;
}) {
  const mood = getMood(whisper.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.08 * index, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden backdrop-blur-xl group transition hover:bg-[rgba(20,14,38,0.6)]"
      style={{
        background: "rgba(14,10,26,0.5)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Mood color stripe on left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background: mood.color,
          boxShadow: `0 0 12px ${mood.color}`,
        }}
      />

      {/* Soft mood glow blob */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none transition group-hover:opacity-100"
        style={{ background: mood.glow, opacity: 0.4 }}
      />

      <div className="relative pl-5 pr-4 py-4 md:pl-6 md:pr-5 md:py-5">
        <p className="text-[15px] md:text-[16px] text-white/88 leading-relaxed italic">
          {whisper.text}
        </p>

        <div className="mt-2.5 flex items-center flex-wrap gap-2 text-[10.5px] uppercase tracking-[0.22em] text-white/40">
          <span style={{ color: mood.color }}>{mood.label}</span>
          {whisper.district && (
            <>
              <span className="text-white/20">·</span>
              <span>{whisper.district}</span>
            </>
          )}
          {whisper.timeWindow && (
            <>
              <span className="text-white/20">·</span>
              <span>{whisper.timeWindow}</span>
            </>
          )}
          {whisper.hint && (
            <span className="ml-auto text-white/35 normal-case tracking-normal italic">
              {whisper.hint}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
