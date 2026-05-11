"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProfilePhoto from "@/app/components/profile/ProfilePhoto";
import PhotoUpload from "@/app/components/profile/PhotoUpload";
import ProfileEditModal from "@/app/components/profile/ProfileEditModal";
import { profile, profileStats, likedMemoryIds, savedMemoryIds, userMemories } from "@/lib/profileData";
import { memories as allMemories, type Memory } from "@/lib/istanbulData";
import { getMood } from "@/lib/moodPalette";
import { userForMemoryId } from "@/lib/fakeUsers";

type Tab = "memories" | "liked" | "saved";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("memories");
  const [editOpen, setEditOpen] = useState(false);

  const liked = useMemo(
    () => allMemories.filter((m) => likedMemoryIds.includes(m.id)),
    []
  );

  const saved = useMemo(() => {
    // Own memories that user saved + external memories saved
    const own = userMemories.filter((m) => m.saved);
    const external = allMemories.filter((m) => savedMemoryIds.includes(m.id));
    return [...own, ...external];
  }, []);

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen pb-32 md:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(110,59,255,0.12) 0%, transparent 45%),
            linear-gradient(180deg, #06030F 0%, #0a0518 60%, #06030F 100%)
          `,
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 md:px-8 pt-10 md:pt-14">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
          <div className="flex justify-center md:justify-start">
            <div className="md:hidden">
              <PhotoUpload initial={initial} size="md" online />
            </div>
            <div className="hidden md:block">
              <PhotoUpload initial={initial} size="lg" online />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            {/* Username + edit */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h1 className="text-[20px] md:text-[22px] font-display text-white/95 tracking-tight">
                @{profile.username}
              </h1>
              {profile.visibility === "private" && <PrivateBadge />}
              <button
                onClick={() => setEditOpen(true)}
                className="px-3 py-1.5 rounded-full text-[11.5px] text-white/75 transition hover:bg-white/[0.05]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Düzenle
              </button>
            </div>

            {/* Bio */}
            <p className="mt-2 text-[13.5px] text-white/65 italic max-w-md mx-auto md:mx-0 leading-relaxed">
              "{profile.citySentence}"
            </p>
            <p className="mt-1 text-[12px] text-white/45">
              {profile.homeDistrict} · {profile.joinedAt}
            </p>

            {/* Primary stats */}
            <div className="mt-5 flex items-center justify-center md:justify-start gap-5 md:gap-7">
              <Stat label="anı" value={profileStats.totalMemories} />
              <Divider />
              <Stat label="beğeni" value={profileStats.likedCount} />
              <Divider />
              <Stat label="kayıt" value={profileStats.savedCount} />
            </div>

            {/* Subtle followers / following */}
            <div className="mt-3 flex items-center justify-center md:justify-start gap-3 text-[11.5px] text-white/45">
              <span><b className="text-white/75 font-medium tabular-nums">{profileStats.followers}</b> takipçi</span>
              <span className="text-white/20">·</span>
              <span><b className="text-white/75 font-medium tabular-nums">{profileStats.following}</b> takip</span>
            </div>
          </div>
        </header>

        {/* TABS */}
        <nav className="mt-9 md:mt-12 flex items-center justify-center md:justify-start gap-1">
          <TabButton active={tab === "memories"} onClick={() => setTab("memories")} label="Anılar" />
          <TabButton active={tab === "liked"} onClick={() => setTab("liked")} label="Beğeniler" />
          <TabButton active={tab === "saved"} onClick={() => setTab("saved")} label="Kayıtlar" />
        </nav>

        <div className="h-px w-full mt-2 bg-white/[0.06]" />

        {/* TAB CONTENT */}
        <div className="mt-5 md:mt-7">
          <AnimatePresence mode="wait">
            {tab === "memories" && (
              <TabPane key="memories">
                <MemoryGrid items={userMemories} ownTab />
              </TabPane>
            )}
            {tab === "liked" && (
              <TabPane key="liked">
                <MemoryGrid items={liked} />
              </TabPane>
            )}
            {tab === "saved" && (
              <TabPane key="saved">
                <MemoryGrid items={saved} />
              </TabPane>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editOpen && <ProfileEditModal onClose={() => setEditOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-[18px] md:text-[20px] font-display font-medium text-white/95 tabular-nums leading-none">
        {value.toLocaleString("tr-TR")}
      </p>
      <p className="mt-1 text-[10.5px] uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-7 bg-white/[0.08]" />;
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 text-[13px] transition"
      style={{
        color: active ? "rgba(245,240,255,0.96)" : "rgba(245,240,255,0.50)",
      }}
    >
      {label}
      {active && (
        <motion.span
          layoutId="profileTabUnderline"
          className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, #A06BFF 0%, #C9A8FF 100%)",
            boxShadow: "0 0 8px rgba(180,138,255,0.55)",
          }}
        />
      )}
    </button>
  );
}

function TabPane({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Memory feed — Twitter-style vertical note list
// ────────────────────────────────────────────────────────────────────────────

function MemoryGrid({
  items,
  ownTab,
}: {
  items: (Memory & { saved?: boolean; place?: string })[];
  ownTab?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl p-7 text-center"
        style={{
          background: "rgba(14,10,26,0.4)",
          border: "1px dashed rgba(255,255,255,0.08)",
        }}
      >
        <p className="text-[13px] text-white/55">Henüz bir şey yok.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/[0.06] max-w-2xl mx-auto">
      {items.map((m, i) => (
        <FeedRow key={m.id} memory={m} index={i} ownTab={ownTab} />
      ))}
    </ul>
  );
}

function FeedRow({
  memory,
  index,
  ownTab,
}: {
  memory: Memory & { saved?: boolean; place?: string };
  index: number;
  ownTab?: boolean;
}) {
  const mood = getMood(memory.mood);
  const locked = memory.visibility === "locked";
  const user = !ownTab ? userForMemoryId(memory.id) : null;

  const displayName = ownTab ? profile.username : user?.username ?? "—";
  const initial = ownTab
    ? profile.username.charAt(0).toUpperCase()
    : user?.initial ?? "—";

  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.025, 0.2) }}
      className="flex items-start gap-3 py-4 px-1"
    >
      <ProfilePhoto initial={initial} size="sm" self={ownTab} />

      <div className="flex-1 min-w-0">
        {/* Header — username · location · time */}
        <div className="flex items-center flex-wrap gap-x-1.5 text-[12.5px]">
          <span className="font-medium text-white/95">@{displayName}</span>
          <span className="text-white/25">·</span>
          <span className="text-white/55">
            {memory.place ?? memory.district}
          </span>
          <span className="text-white/25">·</span>
          <span className="text-white/40">{memory.timeAgo}</span>
        </div>

        {/* Body */}
        <p
          className={`mt-1.5 text-[15px] leading-relaxed ${
            locked ? "italic text-white/50" : "text-white/92"
          }`}
        >
          {locked ? "—" : `"${memory.text}"`}
        </p>

        {/* Footer — mood + likes + saved */}
        <div className="mt-2.5 flex items-center gap-3 text-[11.5px] text-white/50">
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: mood.color,
                boxShadow: `0 0 5px ${mood.color}`,
              }}
            />
            <span className="capitalize">{mood.label}</span>
          </span>

          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span className="tabular-nums">{memory.likes}</span>
          </span>

          {memory.hasSound && (
            <span className="flex items-center gap-1" style={{ color: mood.color }}>
              <span>♪</span>
              <span className="text-white/40">ses</span>
            </span>
          )}

          {memory.saved && (
            <span className="ml-auto flex items-center gap-1 text-white/55">
              <Bookmark className="w-3.5 h-3.5" />
              <span>kayıtlı</span>
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
}

function PrivateBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] uppercase tracking-[0.22em] text-white/65"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
      title="Yalnızca takipçilerin görür"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
        <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      gizli
    </span>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function Bookmark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
