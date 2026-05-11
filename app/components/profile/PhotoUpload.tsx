"use client";

import { useRef, useState } from "react";
import { compressImage, saveProfilePhoto } from "@/lib/profilePhoto";
import ProfilePhoto from "./ProfilePhoto";

type Props = {
  initial: string;
  size?: "md" | "lg";
  online?: boolean;
};

export default function PhotoUpload({ initial, size = "lg", online }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      saveProfilePhoto(dataUrl);
    } catch (caught) {
      setErr(caught instanceof Error ? caught.message : "Yükleme başarısız.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={handlePick}
        className="relative rounded-full group cursor-pointer transition active:scale-[0.99]"
        aria-label="Profil fotoğrafını değiştir"
      >
        <ProfilePhoto initial={initial} size={size} online={online} self />

        {/* Hover/tap overlay */}
        <span
          className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 100%)",
          }}
        >
          {busy ? (
            <span
              className="block w-5 h-5 rounded-full border-2 border-white/30 border-t-white/95"
              style={{ animation: "spin 0.9s linear infinite" }}
            />
          ) : (
            <CameraIcon className="w-5 h-5 text-white/95" />
          )}
        </span>
      </button>

      {err && (
        <p className="mt-2 text-[11px] text-rose-300/80 max-w-[140px]">{err}</p>
      )}
    </div>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
