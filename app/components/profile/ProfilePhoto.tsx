"use client";

import { useProfilePhoto } from "@/lib/profilePhoto";

type Props = {
  initial: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  /** When true, renders the user's uploaded photo (from localStorage) if any. */
  self?: boolean;
  /** Allow callers (e.g. an edit modal) to display a preview without storing. */
  photoOverride?: string | null;
};

const SIZES = {
  sm: { d: 36, font: 14 },
  md: { d: 80, font: 30 },
  lg: { d: 112, font: 40 },
};

/**
 * Standard avatar — uploaded image (when `self` is on) or initial letter on
 * dark glass otherwise. The avatar of other users always falls back to initial.
 */
export default function ProfilePhoto({
  initial,
  size = "md",
  online,
  self,
  photoOverride,
}: Props) {
  const storedPhoto = useProfilePhoto();
  const photo = photoOverride ?? (self ? storedPhoto : null);

  const { d, font } = SIZES[size];

  return (
    <div
      className="relative rounded-full overflow-hidden flex items-center justify-center shrink-0 select-none"
      style={{
        width: d,
        height: d,
        background:
          "linear-gradient(160deg, rgba(36,28,62,0.95) 0%, rgba(14,10,26,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow:
          "0 6px 22px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt="profil"
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <span
          className="font-display font-medium text-white/92"
          style={{ fontSize: font, lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          {initial.toUpperCase()}
        </span>
      )}

      {online && (
        <span
          className="absolute bottom-0.5 right-0.5 rounded-full"
          style={{
            width: Math.max(8, d * 0.16),
            height: Math.max(8, d * 0.16),
            background: "#7FB8D9",
            boxShadow: "0 0 8px rgba(127,184,217,0.85), 0 0 0 2px #0a0518",
          }}
        />
      )}
    </div>
  );
}
