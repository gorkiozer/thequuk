"use client";

import { motion } from "framer-motion";
import { profileStats } from "@/lib/profileData";
import { SectionHeading } from "./MemoryIdentitySummary";

const STATS = [
  { value: profileStats.totalMemories,   label: "iz bıraktın",       hint: "şehrin senden tuttukları" },
  { value: profileStats.districtsVisited,label: "mahallede göründün",hint: "12 farklı semt" },
  { value: profileStats.likedCount,      label: "kez hissedildin",   hint: "anılarına dokunulma sayısı" },
  { value: profileStats.savedCount,      label: "anın saklandı",     hint: "başkaları kaybolmasını istemedi" },
  { value: profileStats.soundCount,      label: "sesin kayboldu",    hint: "sound memory bıraktığın yerler" },
  { value: profileStats.nightCount,      label: "gece anısı",        hint: "00:00 sonrası bıraktığın izler" },
  { value: profileStats.rainCount,       label: "yağmurda yazdın",   hint: "yağmurla açılan anılar" },
];

export default function CityStats() {
  return (
    <div>
      <SectionHeading title="Bu profil 38 anıdan oluşuyor" hint="şehir kayıtların" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="rounded-2xl p-4 backdrop-blur-xl"
            style={{
              background: "rgba(14,10,26,0.55)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-[24px] font-display text-white tabular-nums">
                {s.value}
              </span>
              <span className="text-[11px] text-white/55">{s.label}</span>
            </div>
            <p className="mt-1 text-[10.5px] text-white/40">{s.hint}</p>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-white/40">
        en çok <span className="text-white/65">gece hatırlandın</span> · {profileStats.mostHeardDistrict} seni daha çok taşıyor
      </p>
    </div>
  );
}
