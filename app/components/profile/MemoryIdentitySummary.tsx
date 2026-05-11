"use client";

import { motion } from "framer-motion";
import { getMood } from "@/lib/moodPalette";
import { profile, profileStats, moodSignature, footprint } from "@/lib/profileData";

type Card = {
  title: string;
  value: string;
  hint?: string;
  moodKey?: string;
};

export default function MemoryIdentitySummary() {
  const topMood = moodSignature[0];
  const topDistrict = footprint[0];

  const cards: Card[] = [
    {
      title: "En çok bıraktığın his",
      value: getMood(topMood.mood).label,
      hint: `%${topMood.percent} anılarında bu his`,
      moodKey: topMood.mood,
    },
    {
      title: "En çok iz bıraktığın yer",
      value: topDistrict.district,
      hint: `${topDistrict.count} anı · ${getMood(topDistrict.mood).label}`,
      moodKey: topDistrict.mood,
    },
    {
      title: "En sık hatırlandığın saat",
      value: profileStats.mostActiveHour,
      hint: "Gece anıların daha çok beğeniliyor",
      moodKey: "gece",
    },
    {
      title: "Sesinin saklandığı sayı",
      value: `${profileStats.soundCount} sound memory`,
      hint: "Sesli anıların 7 kez kaydedildi",
      moodKey: "sakin",
    },
    {
      title: "Bu ay göründüğün mahalle",
      value: `${profileStats.districtsVisited} farklı yer`,
      hint: `${profile.homeDistrict} seni daha çok taşıyor`,
      moodKey: profile.dominantMood,
    },
    {
      title: "Son parıltın",
      value: profile.lastTrace.place,
      hint: profile.lastTrace.timeAgo,
      moodKey: "romantik",
    },
  ];

  return (
    <div>
      <SectionHeading title="Şehir seni böyle hatırlıyor" hint="duygusal özet" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c, i) => {
          const mood = getMood(c.moodKey);
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="relative rounded-2xl p-4 overflow-hidden backdrop-blur-xl transition group hover:-translate-y-0.5"
              style={{
                background: "rgba(14,10,26,0.55)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition group-hover:opacity-100"
                style={{ background: mood.glow, opacity: 0.6 }}
              />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: mood.color,
                      boxShadow: `0 0 6px ${mood.color}`,
                    }}
                  />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                    {c.title}
                  </p>
                </div>
                <p className="mt-2 text-[18px] font-display text-white capitalize">
                  {c.value}
                </p>
                {c.hint && (
                  <p className="mt-1 text-[12px] text-white/55">{c.hint}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function SectionHeading({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h2 className="text-[16px] md:text-[18px] font-display text-white">
        {title}
      </h2>
      {hint && (
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">
          {hint}
        </span>
      )}
    </div>
  );
}
