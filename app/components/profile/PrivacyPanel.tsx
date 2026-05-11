"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  defaultPrivacy,
  type PrivacySettings,
  type ProfileVisibility,
  type AudienceLevel,
  type LocationPrecision,
  type PresenceVisibility,
} from "@/lib/profileData";
import { SectionHeading } from "./MemoryIdentitySummary";

export default function PrivacyPanel() {
  const [s, set] = useState<PrivacySettings>(defaultPrivacy);

  const update = <K extends keyof PrivacySettings>(key: K, val: PrivacySettings[K]) =>
    set((prev) => ({ ...prev, [key]: val }));

  return (
    <div>
      <SectionHeading title="Görünürlük" hint="anılar senin" />

      <div
        className="rounded-2xl p-5 md:p-6 backdrop-blur-xl space-y-5"
        style={{
          background: "rgba(14,10,26,0.55)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Choice
          label="Profil görünürlüğü"
          hint="Gizli olduğunda yalnızca takipçilerin profilini ve anılarını görür."
          value={s.profile}
          onChange={(v) => update("profile", v as ProfileVisibility)}
          options={[
            { value: "public",  label: "Herkese açık" },
            { value: "private", label: "Gizli" },
          ]}
        />

        <Choice
          label="Anılarının görünürlüğü"
          hint="Bıraktığın izleri kim okuyabilir?"
          value={s.memories}
          onChange={(v) => update("memories", v as AudienceLevel)}
          options={[
            { value: "everyone", label: "Herkes" },
            { value: "circle",   label: "Yakın çevre" },
            { value: "self",     label: "Sadece ben" },
          ]}
        />

        <Choice
          label="Konum hassasiyeti"
          hint="Anılarının konumu nasıl gösterilsin?"
          value={s.location}
          onChange={(v) => update("location", v as LocationPrecision)}
          options={[
            { value: "approximate", label: "Yaklaşık bölge" },
            { value: "exact",       label: "Tam konum" },
          ]}
        />

        <Choice
          label="Haritada nasıl görüneyim?"
          hint="Şehir seni nasıl hissetsin?"
          value={s.presence}
          onChange={(v) => update("presence", v as PresenceVisibility)}
          options={[
            { value: "visible",   label: "Tam görünür" },
            { value: "glow-only", label: "Sadece ışık" },
            { value: "hidden",    label: "Gizli" },
          ]}
        />

        <div className="border-t border-white/[0.05] pt-5 space-y-3">
          <Toggle
            label="Beğendiğim anılar gizlensin"
            hint="Liked memories başka kullanıcılara görünmesin"
            value={s.likedHidden}
            onChange={(v) => update("likedHidden", v)}
          />
          <Toggle
            label="Kaydettiğim anılar gizlensin"
            hint="Sakladığın anılar sadece sende kalsın"
            value={s.savedHidden}
            onChange={(v) => update("savedHidden", v)}
          />
        </div>
      </div>
    </div>
  );
}

function Choice<T extends string>({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <div className="mb-2">
        <p className="text-[13px] text-white/85">{label}</p>
        {hint && <p className="text-[10.5px] text-white/40 mt-0.5">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className="px-3 py-1.5 rounded-full text-[12px] transition"
              style={{
                background: active
                  ? "rgba(160,107,255,0.18)"
                  : "rgba(255,255,255,0.03)",
                border: active
                  ? "1px solid rgba(180,138,255,0.45)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: active ? "rgba(245,240,255,0.96)" : "rgba(245,240,255,0.65)",
                boxShadow: active ? "0 0 10px rgba(160,107,255,0.30)" : "none",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
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
      className="w-full flex items-center justify-between gap-3"
    >
      <div className="text-left">
        <p className="text-[13px] text-white/85">{label}</p>
        {hint && <p className="text-[10.5px] text-white/40 mt-0.5">{hint}</p>}
      </div>
      <span
        className="w-10 h-6 rounded-full relative transition shrink-0"
        style={{
          background: value ? "rgba(160,107,255,0.6)" : "rgba(255,255,255,0.10)",
          boxShadow: value ? "0 0 14px rgba(160,107,255,0.55)" : "none",
        }}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white"
          animate={{ x: value ? 16 : 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
        />
      </span>
    </button>
  );
}
