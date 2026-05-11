"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/profileData";
import { moodPalette, getMood } from "@/lib/moodPalette";
import { districts } from "@/lib/istanbulData";
import {
  compressImage,
  saveProfilePhoto,
  clearProfilePhoto,
  useProfilePhoto,
} from "@/lib/profilePhoto";
import ProfilePhoto from "./ProfilePhoto";

type Props = {
  onClose: () => void;
};

const CITY_SENTENCES = [
  "Bazı sokaklar insandan daha çok şey hatırlar.",
  "Geceleri yürürken daha iyi düşünüyorum.",
  "Bir sokak, bir his — yeterli.",
  "Şehir bana her sabah başka bir cümle söylüyor.",
  "Kadıköy beni biraz fazla biliyor.",
];

export default function ProfileEditModal({ onClose }: Props) {
  const photo = useProfilePhoto();
  const [username, setUsername] = useState(profile.username);
  const [status, setStatus] = useState(profile.status);
  const [sentence, setSentence] = useState(profile.citySentence);
  const [moodKey, setMoodKey] = useState(profile.dominantMood);
  const [visibility, setVisibility] = useState<"public" | "private">(
    profile.visibility
  );
  const [homeId, setHomeId] = useState(profile.homeDistrictId);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoErr, setPhotoErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const mood = getMood(moodKey);
  const initial = username.charAt(0).toUpperCase();

  const pickPhoto = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoErr(null);
    setPhotoBusy(true);
    try {
      const dataUrl = await compressImage(file);
      saveProfilePhoto(dataUrl);
    } catch (caught) {
      setPhotoErr(caught instanceof Error ? caught.message : "Yükleme başarısız.");
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none
          px-3 pb-24
          md:items-center md:p-6 md:pl-[260px]"
      >
        <motion.div
          className="w-full max-w-[480px] pointer-events-auto"
          initial={{ y: "100%", opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div
            className="rounded-3xl overflow-hidden backdrop-blur-2xl"
            style={{
              background: "rgba(14,10,26,0.78)",
              border: `1px solid ${mood.glow}`,
              boxShadow: `0 12px 48px ${mood.glow}, 0 1px 0 rgba(255,255,255,0.04) inset`,
            }}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            <div className="px-5 md:px-7 pb-7 pt-2 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <p className="text-[10.5px] uppercase tracking-[0.25em] text-white/50">
                Düzenle
              </p>
              <h3 className="mt-1 text-[19px] font-display text-white">
                Profilini düzenle
              </h3>

              {/* PHOTO SECTION */}
              <div className="mt-5 flex items-center gap-4">
                <ProfilePhoto initial={initial} size="md" self />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] text-white/85">Profil fotoğrafı</p>
                  <p className="text-[10.5px] text-white/40 mt-0.5">
                    Kareye otomatik kırpılır, ~256px'e küçültülür.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFile}
                    />
                    <button
                      type="button"
                      onClick={pickPhoto}
                      disabled={photoBusy}
                      className="px-3 py-1.5 rounded-full text-[11.5px] text-white/85 transition disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {photoBusy ? "Yükleniyor…" : photo ? "Değiştir" : "Foto yükle"}
                    </button>
                    {photo && (
                      <button
                        type="button"
                        onClick={() => clearProfilePhoto()}
                        className="px-3 py-1.5 rounded-full text-[11.5px] text-white/55 transition hover:text-white/85"
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        Kaldır
                      </button>
                    )}
                  </div>
                  {photoErr && (
                    <p className="mt-1.5 text-[11px] text-rose-300/80">{photoErr}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="mt-5">
                <Label>Kullanıcı adı</Label>
                <Input
                  prefix="@"
                  value={username}
                  onChange={setUsername}
                  placeholder="gorkem"
                />
              </div>

              {/* Status */}
              <div className="mt-4">
                <Label>Kısa durum</Label>
                <Input
                  value={status}
                  onChange={setStatus}
                  placeholder="Gece yürüyen biri."
                />
              </div>

              {/* City sentence */}
              <div className="mt-4">
                <Label>Şehir cümlesi</Label>
                <p className="text-[10.5px] text-white/40 mb-1.5">
                  Biri profiline baktığında okuyacağı tek cümle.
                </p>
                <Textarea value={sentence} onChange={setSentence} />

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CITY_SENTENCES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSentence(s)}
                      className="text-[10.5px] px-2.5 py-1 rounded-full text-white/55 transition hover:text-white/85"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {s.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood color picker */}
              <div className="mt-4">
                <Label>Vurgu rengi</Label>
                <p className="text-[10.5px] text-white/40 mb-1.5">
                  Profil aksanı ve detay rengi.
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(moodPalette).slice(0, 12).map(([k, m]) => {
                    const active = k === moodKey;
                    return (
                      <button
                        key={k}
                        onClick={() => setMoodKey(k)}
                        className="w-7 h-7 rounded-full transition"
                        style={{
                          background: m.color,
                          boxShadow: active
                            ? `0 0 0 2px rgba(255,255,255,0.85), 0 0 14px ${m.color}`
                            : `0 0 8px ${m.glow}`,
                          opacity: active ? 1 : 0.85,
                        }}
                        aria-label={m.label}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Home district */}
              <div className="mt-4">
                <Label>Favori mahalle</Label>
                <div
                  className="mt-1.5 max-h-32 overflow-y-auto scrollbar-hide rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {districts.slice(0, 16).map((d) => {
                    const active = d.id === homeId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setHomeId(d.id)}
                        className="w-full text-left px-3 py-2 transition flex items-center gap-2 hover:bg-white/[0.04]"
                        style={{
                          background: active ? "rgba(160,107,255,0.10)" : undefined,
                          color: active ? "rgba(245,240,255,0.96)" : "rgba(245,240,255,0.7)",
                        }}
                      >
                        <span className="text-[12.5px]">{d.name}</span>
                        {active && (
                          <span className="ml-auto text-[10px] text-violet-glow">seçildi</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility — 2 options */}
              <div className="mt-4">
                <Label>Profil görünürlüğü</Label>
                <div className="grid grid-cols-2 gap-2">
                  <VisibilityCard
                    active={visibility === "public"}
                    onClick={() => setVisibility("public")}
                    glyph={<GlobeIcon className="w-4 h-4" />}
                    title="Herkese açık"
                    hint="Profilin ve anıların herkes tarafından görülebilir."
                    accent={mood.color}
                  />
                  <VisibilityCard
                    active={visibility === "private"}
                    onClick={() => setVisibility("private")}
                    glyph={<LockIcon className="w-4 h-4" />}
                    title="Gizli"
                    hint="Yalnızca takipçilerin profilini ve anılarını görür."
                    accent={mood.color}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2 sticky bottom-0 pt-2"
                style={{ background: "linear-gradient(to top, rgba(14,10,26,0.95) 60%, transparent 100%)" }}
              >
                <button
                  onClick={onClose}
                  className="flex-1 h-12 rounded-2xl text-[13px] text-white/65 transition"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Vazgeç
                </button>
                <button
                  onClick={onClose}
                  className="flex-[1.5] h-12 rounded-2xl text-[13px] text-white transition active:scale-[0.99]"
                  style={{
                    background: `linear-gradient(135deg, #2a1854 0%, ${mood.color} 100%)`,
                    border: `1px solid ${mood.glow}`,
                    boxShadow: `0 8px 24px ${mood.glow}`,
                  }}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10.5px] uppercase tracking-[0.22em] text-white/45 mb-1.5">
      {children}
    </p>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div
      className="flex items-center rounded-xl px-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {prefix && <span className="text-white/45 mr-1.5 text-[14px]">{prefix}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none"
      />
    </div>
  );
}

function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      maxLength={140}
      className="w-full rounded-xl px-3 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none resize-none"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />
  );
}

function VisibilityCard({
  active,
  onClick,
  glyph,
  title,
  hint,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  glyph: React.ReactNode;
  title: string;
  hint: string;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-3 rounded-2xl transition"
      style={{
        background: active ? "rgba(160,107,255,0.10)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? accent + "88" : "rgba(255,255,255,0.06)"}`,
        boxShadow: active ? `0 0 14px ${accent}33` : "none",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5" style={{ color: active ? accent : "rgba(255,255,255,0.65)" }}>
        {glyph}
        <span className="text-[13px] text-white/95">{title}</span>
      </div>
      <p className="text-[10.5px] text-white/45 leading-snug">{hint}</p>
    </button>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
