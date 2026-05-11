"use client";

import { motion } from "framer-motion";
import PresenceAvatar from "./PresenceAvatar";
import { profile, totalMemoryCount } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";

type Props = {
  onEdit: () => void;
};

export default function ProfileHeader({ onEdit }: Props) {
  const mood = getMood(profile.dominantMood);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden backdrop-blur-2xl"
      style={{
        background: "rgba(14,10,26,0.55)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: mood.glow, opacity: 0.6 }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full blur-3xl"
          style={{ background: mood.glow, opacity: 0.35 }}
        />

        {/* Low-opacity map line grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="profileLines" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30 L60 30 M30 0 L30 60" fill="none" stroke="#C9A8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profileLines)" />
        </svg>

        {/* Small drifting glow dots */}
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${25 + (i * 17) % 50}%`,
              background: mood.color,
              boxShadow: `0 0 10px ${mood.color}`,
            }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative px-5 md:px-10 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center md:justify-start"
          >
            <PresenceAvatar moodKey={profile.dominantMood} size="md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: mood.color, boxShadow: `0 0 8px ${mood.color}` }}
              />
              <p className="text-[10.5px] uppercase tracking-[0.28em] text-white/55">
                {profile.homeDistrict} · {mood.label}
              </p>
            </div>

            <h1 className="mt-1.5 text-3xl md:text-[42px] font-display font-semibold tracking-tight text-white">
              @{profile.username}
            </h1>

            <p className="mt-2 text-[15px] md:text-base text-white/75 italic">
              "{profile.citySentence}"
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <Tag label={`${totalMemoryCount} anı`} mood={mood.color} />
              <Tag label={`Son iz: ${profile.lastTrace.place}`} />
              <Tag label={profile.status} />
              <Tag label={visibilityLabel(profile.visibility)} dim />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex md:flex-col gap-2 md:items-stretch justify-center"
          >
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-full text-[12.5px] text-white/85 transition hover:bg-white/[0.06]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Profili düzenle
            </button>
            <button
              className="px-4 py-2 rounded-full text-[12.5px] text-white transition active:scale-[0.99]"
              style={{
                background: `linear-gradient(135deg, #2a1854 0%, #5b32c2 100%)`,
                border: `1px solid rgba(180,138,255,0.30)`,
                boxShadow: `0 6px 18px rgba(110,59,255,0.30)`,
              }}
            >
              Anı bırak
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Tag({ label, mood, dim }: { label: string; mood?: string; dim?: boolean }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] backdrop-blur-md ${dim ? "text-white/45" : "text-white/75"}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${mood ? mood + "55" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {label}
    </span>
  );
}

function visibilityLabel(v: typeof profile.visibility): string {
  switch (v) {
    case "public":  return "Profil herkese açık";
    case "private": return "Gizli profil";
  }
}
