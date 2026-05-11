"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";

export default function IdentityCard() {
  const mood = getMood(profile.dominantMood);

  return (
    <div className="text-center max-w-xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-[28px] md:text-[34px] font-display font-medium tracking-tight text-white/95"
      >
        @{profile.username}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        className="mt-3 text-[15px] md:text-[16px] italic text-white/72 leading-relaxed"
      >
        "{profile.citySentence}"
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.7 }}
        className="mt-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em]"
      >
        <span className="flex items-center gap-1.5" style={{ color: mood.color }}>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: mood.color, boxShadow: `0 0 6px ${mood.color}` }}
          />
          {mood.label} presence
        </span>
        <span className="text-white/20">·</span>
        <span className="text-white/45">son iz · {profile.lastTrace.place}</span>
      </motion.div>
    </div>
  );
}
