"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  socialNotifications,
  socialNotifVerb,
  type SocialNotification,
} from "@/lib/socialNotifications";
import {
  nearbyNotifications,
  nearbyNotifVerb,
  type NearbyNotification,
} from "@/lib/nearbyNotifications";
import { profile } from "@/lib/profileData";
import { getMood } from "@/lib/moodPalette";
import ProfilePhoto from "@/app/components/profile/ProfilePhoto";

type Tab = "for-you" | "nearby";

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>("for-you");
  const unread = socialNotifications.filter((n) => n.unread).length;

  return (
    <div className="relative min-h-screen pb-32 md:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(110,59,255,0.10) 0%, transparent 45%),
            linear-gradient(180deg, #06030F 0%, #0a0518 60%, #06030F 100%)
          `,
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl px-5 md:px-8 pt-10 md:pt-14">
        <header className="flex items-center justify-between">
          <h1 className="text-[22px] md:text-[24px] font-display font-medium text-white/95 tracking-tight">
            Bildirimler
          </h1>
          <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            {profile.homeDistrict}
          </span>
        </header>

        {/* Tabs */}
        <nav className="mt-7 flex items-center gap-1 border-b border-white/[0.06]">
          <TabButton active={tab === "for-you"} onClick={() => setTab("for-you")} label="Senin için">
            {unread > 0 && (
              <span
                className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-medium ml-2"
                style={{ background: "rgba(180,138,255,0.85)", color: "#fff" }}
              >
                {unread}
              </span>
            )}
          </TabButton>
          <TabButton active={tab === "nearby"} onClick={() => setTab("nearby")} label="Yakında" />
        </nav>

        {/* Content */}
        <div className="mt-5 md:mt-6">
          <AnimatePresence mode="wait">
            {tab === "for-you" ? (
              <motion.div
                key="for-you"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <ForYouList />
              </motion.div>
            ) : (
              <motion.div
                key="nearby"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <NearbyList />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2.5 text-[13.5px] flex items-center transition"
      style={{
        color: active ? "rgba(245,240,255,0.96)" : "rgba(245,240,255,0.50)",
      }}
    >
      <span>{label}</span>
      {children}
      {active && (
        <motion.span
          layoutId="notifTabUnderline"
          className="absolute left-2 right-2 -bottom-[1px] h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, #A06BFF 0%, #C9A8FF 100%)",
            boxShadow: "0 0 8px rgba(180,138,255,0.55)",
          }}
        />
      )}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// FOR YOU — classic social
// ────────────────────────────────────────────────────────────────────────────

function ForYouList() {
  return (
    <ul className="divide-y divide-white/[0.05]">
      {socialNotifications.map((n, i) => (
        <SocialRow key={n.id} n={n} index={i} />
      ))}
    </ul>
  );
}

function SocialRow({ n, index }: { n: SocialNotification; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.025, 0.2) }}
      className="relative flex items-start gap-3 py-3.5 px-1"
    >
      <ProfilePhoto initial={n.user.initial} size="sm" />

      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-white/88 leading-snug">
          <span className="font-medium text-white">@{n.user.username}</span>
          {n.othersCount && n.othersCount > 1 && (
            <span className="text-white/65"> ve {n.othersCount} kişi</span>
          )}{" "}
          <span className="text-white/65">{socialNotifVerb(n.kind)}</span>
          {n.kind === "popular" && (
            <span className="text-white/65"> · {n.othersCount} kişi hissetti</span>
          )}
        </p>

        {n.commentText && (
          <p
            className="mt-1.5 pl-3 text-[13px] text-white/72 italic leading-snug border-l border-white/15"
          >
            "{n.commentText}"
          </p>
        )}

        {n.memorySnippet && !n.commentText && (
          <p className="mt-1 text-[12.5px] text-white/50 leading-snug truncate">
            "{n.memorySnippet}"
          </p>
        )}

        <p className="mt-1 text-[11px] text-white/35">{n.timeAgo}</p>
      </div>

      {n.kind === "follow" && (
        <button
          className="px-3 py-1.5 rounded-full text-[11.5px] text-white transition shrink-0 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #6E3BFF 0%, #A06BFF 100%)",
            boxShadow: "0 4px 14px rgba(110,59,255,0.30)",
          }}
        >
          Takip et
        </button>
      )}

      {n.unread && (
        <span
          className="absolute top-5 right-0 w-1.5 h-1.5 rounded-full"
          style={{
            background: "#A06BFF",
            boxShadow: "0 0 8px rgba(180,138,255,0.95)",
          }}
        />
      )}
    </motion.li>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// NEARBY — location-based
// ────────────────────────────────────────────────────────────────────────────

function NearbyList() {
  return (
    <div className="space-y-2.5">
      {nearbyNotifications.map((n, i) => (
        <NearbyCard key={n.id} n={n} index={i} />
      ))}
    </div>
  );
}

function NearbyCard({ n, index }: { n: NearbyNotification; index: number }) {
  const mood = getMood(n.mood);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
      className="relative rounded-2xl overflow-hidden backdrop-blur-xl transition hover:bg-[rgba(20,14,38,0.65)]"
      style={{
        background: "rgba(14,10,26,0.5)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: mood.color, boxShadow: `0 0 10px ${mood.color}` }}
      />
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none"
        style={{ background: mood.glow, opacity: 0.32 }}
      />

      <div className="relative flex items-start gap-3 pl-5 pr-4 py-3.5">
        <DistrictGlyph color={mood.color} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 text-[10px] uppercase tracking-[0.22em]">
            <span style={{ color: mood.color }}>{nearbyNotifVerb(n.kind)}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/45">{n.district}</span>
            <span className="ml-auto text-white/35 normal-case tracking-normal">
              {n.timeAgo}
            </span>
          </div>

          <p className="text-[14px] text-white/90 leading-snug">{n.text}</p>

          {n.detail && (
            <p className="mt-1 text-[12.5px] text-white/55">{n.detail}</p>
          )}

          {n.memorySnippet && (
            <p
              className="mt-2 pl-3 text-[12.5px] text-white/65 italic leading-snug border-l"
              style={{ borderColor: `${mood.color}55` }}
            >
              "{n.memorySnippet}"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DistrictGlyph({ color }: { color: string }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}44`,
        boxShadow: `0 0 12px ${color}33`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ color }}>
        <path
          d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}
