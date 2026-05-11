"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { memories, type Memory } from "@/lib/istanbulData";
import { getMood, moodPalette } from "@/lib/moodPalette";
import { getCityTimeLabel } from "@/lib/timeOfDay";

// ────────────────────────────────────────────────────────────────────────────
// Discover — emotional editorial, not a feed
// ────────────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const hour = new Date().getHours();
  const timeLabel = getCityTimeLabel(hour);

  // The "city mood this week" — pick the most-represented mood among popular memories
  const weeklyMood = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of memories) {
      if (m.popular || m.likes > 50) {
        counts[m.mood] = (counts[m.mood] || 0) + 1;
      }
    }
    let best = "romantik";
    let bestCount = 0;
    for (const [k, c] of Object.entries(counts)) {
      if (c > bestCount) {
        best = k;
        bestCount = c;
      }
    }
    return best;
  }, []);

  // Section data — filtered slices of memories
  const heartbreakMemories = useMemo(
    () =>
      memories
        .filter(
          (m) =>
            ["melankolik", "yalniz", "yorgun"].includes(m.mood) &&
            m.visibility === "open"
        )
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6),
    []
  );

  const silentMemories = useMemo(
    () =>
      memories
        .filter((m) => m.likes < 30 && m.visibility === "open")
        .slice(0, 6),
    []
  );

  const nightWalkers = useMemo(
    () =>
      memories
        .filter((m) => m.isNight || m.mood === "gece")
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6),
    []
  );

  const trending = useMemo(
    () =>
      memories
        .filter((m) => m.popular || m.likes > 70)
        .slice(0, 6),
    []
  );

  const rainAwaiting = useMemo(
    () =>
      memories
        .filter((m) => m.isRain)
        .slice(0, 6),
    []
  );

  return (
    <div className="relative min-h-screen pb-32 md:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(110,59,255,0.18) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 80%, rgba(160,107,255,0.08) 0%, transparent 55%),
            linear-gradient(180deg, #06030F 0%, #0a0518 60%, #06030F 100%)
          `,
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8 pt-12 md:pt-16">
        <header className="text-center">
          <p className="text-[10.5px] uppercase tracking-[0.35em] text-white/40">
            keşfet · {timeLabel}
          </p>
          <h1 className="mt-3 text-[28px] md:text-[36px] font-display font-medium tracking-tight text-white/95 leading-tight">
            Şehrin duygusu
          </h1>
        </header>

        {/* HERO — editorial cover */}
        <section className="mt-10 md:mt-14">
          <WeeklyCover moodKey={weeklyMood} />
        </section>

        {/* Section streams */}
        <DiscoverSection
          title="Bu hafta en çok kırılanlar"
          subtitle="Şehre düşen melankoli, yalnızlık, yorgunluk."
          glyph="♡"
          memories={heartbreakMemories}
        />

        <DiscoverSection
          title="Bu gece gece yürüyenleri"
          subtitle="Saat geçtikçe parlayanlar."
          glyph="☾"
          memories={nightWalkers}
        />

        <DiscoverSection
          title="Sessiz kalan anılar"
          subtitle="Çok kişiye dokunmadı ama duyulmayı hak ediyor."
          glyph="◌"
          memories={silentMemories}
        />

        <DiscoverSection
          title="Şu an parlayanlar"
          subtitle="Bu hafta en çok hissedilenler."
          glyph="✦"
          memories={trending}
        />

        {rainAwaiting.length > 0 && (
          <DiscoverSection
            title="Yağmuru bekleyen anılar"
            subtitle="Yağmur başladığında ortaya çıkacaklar."
            glyph="❅"
            memories={rainAwaiting}
            locked
          />
        )}

        <div className="mt-16 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/25">
          <div className="h-px w-8 bg-white/15" />
          <span>günün sonu yok · şehir konuşmaya devam ediyor</span>
          <div className="h-px w-8 bg-white/15" />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Weekly cover hero
// ────────────────────────────────────────────────────────────────────────────

function WeeklyCover({ moodKey }: { moodKey: string }) {
  const mood = getMood(moodKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        height: 380,
        background: `
          radial-gradient(ellipse at 30% 50%, ${mood.glow} 0%, transparent 65%),
          radial-gradient(ellipse at 70% 28%, ${mood.soft} 0%, transparent 70%),
          linear-gradient(180deg, rgba(20,14,38,0.78) 0%, rgba(8,4,22,0.96) 100%)
        `,
        border: `1px solid ${mood.color}33`,
        boxShadow: `0 12px 48px ${mood.glow}`,
      }}
    >
      {/* City silhouette behind */}
      <CitySilhouetteBackdrop color={mood.color} />

      {/* Drifting mood particles */}
      <DriftDots color={mood.color} count={14} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[10.5px] uppercase tracking-[0.32em] text-white/55"
        >
          bu hafta · İstanbul
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-3 text-[64px] md:text-[88px] font-display font-medium leading-[0.95] text-white capitalize tracking-tight"
          style={{ textShadow: `0 0 28px ${mood.glow}` }}
        >
          {mood.label}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="mt-4 text-[14px] md:text-[15px] text-white/65 italic max-w-md leading-relaxed"
        >
          Şehrin atmosferi son 7 günde {mood.label}. Bin'den fazla anı bu hisle bırakıldı.
        </motion.p>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section
// ────────────────────────────────────────────────────────────────────────────

function DiscoverSection({
  title,
  subtitle,
  glyph,
  memories: list,
  locked,
}: {
  title: string;
  subtitle: string;
  glyph: string;
  memories: Memory[];
  locked?: boolean;
}) {
  if (list.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-end justify-between mb-4 md:mb-5">
        <div>
          <div className="flex items-center gap-2 text-white/45 mb-1">
            <span className="text-[12px]">{glyph}</span>
            <p className="text-[10px] uppercase tracking-[0.32em]">koleksiyon</p>
          </div>
          <h3 className="text-[20px] md:text-[22px] font-display text-white/95 leading-tight">
            {title}
          </h3>
          <p className="mt-1 text-[12.5px] md:text-[13px] text-white/55 italic">
            {subtitle}
          </p>
        </div>
        <button className="text-[10.5px] uppercase tracking-[0.28em] text-white/40 hover:text-white/75 transition">
          Tümü
        </button>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div
        className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1
          md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-visible md:mx-0 md:px-0"
      >
        {list.map((m, i) => (
          <MemoryCard key={m.id} m={m} index={i} locked={locked} />
        ))}
      </div>
    </section>
  );
}

function MemoryCard({
  m,
  index,
  locked,
}: {
  m: Memory;
  index: number;
  locked?: boolean;
}) {
  const mood = getMood(m.mood);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: i_index(index), ease: "easeOut" }}
      className="shrink-0 w-72 md:w-auto relative rounded-2xl overflow-hidden backdrop-blur-xl transition group hover:-translate-y-0.5"
      style={{
        background: "rgba(14,10,26,0.55)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Visual band on top — soft mood gradient with subtle texture */}
      <div
        className="relative h-32"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, ${mood.glow} 0%, transparent 70%),
            radial-gradient(ellipse at 70% 60%, ${mood.soft} 0%, transparent 70%),
            linear-gradient(135deg, rgba(20,14,38,0.6) 0%, rgba(10,5,30,0.85) 100%)
          `,
        }}
      >
        <DriftDots color={mood.color} count={5} small />

        {/* Top meta — mood pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: mood.color, boxShadow: `0 0 6px ${mood.color}` }}
          />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/65">
            {mood.label}
          </span>
        </div>

        {/* Top right meta — likes */}
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-white/60">
          <Heart className="w-3 h-3" />
          {m.likes}
        </div>

        {/* Bottom — district label */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-white/55">
            {m.district}
          </p>
          <p className="text-[10.5px] text-white/40">{m.timeAgo}</p>
        </div>
      </div>

      {/* Body — memory text */}
      <div className="p-4 md:p-5">
        <p className={`text-[14.5px] leading-snug ${locked ? "text-white/45 italic" : "text-white/90"}`}>
          {locked ? "—" : `"${m.text}"`}
        </p>
        {locked && (
          <p className="mt-2 text-[10.5px] uppercase tracking-[0.22em] text-white/40">
            yağmurda açılır
          </p>
        )}
      </div>
    </motion.article>
  );
}

function i_index(i: number) {
  return Math.min(i * 0.06, 0.3);
}

// ────────────────────────────────────────────────────────────────────────────
// Small visuals
// ────────────────────────────────────────────────────────────────────────────

function CitySilhouetteBackdrop({ color }: { color: string }) {
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 w-full opacity-25 pointer-events-none"
      viewBox="0 0 440 120"
      preserveAspectRatio="none"
      style={{ height: 110 }}
    >
      <defs>
        <linearGradient id="cityHero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06030F" stopOpacity="0" />
          <stop offset="100%" stopColor="#06030F" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        d="M0 80 L0 60 L20 60 L20 40 L40 40 L40 50 L60 50 L60 30 L80 30 L80 45 L100 45 L100 25 L120 25 L120 15 L140 15 L140 35 L160 35 L160 50 L185 50 L185 30 L210 30 L210 22 L230 22 L230 40 L260 40 L260 30 L285 30 L285 50 L310 50 L310 28 L335 28 L335 40 L360 40 L360 18 L380 18 L380 35 L405 35 L405 50 L440 50 L440 120 L0 120 Z"
        fill="url(#cityHero)"
      />
      {[
        [25, 60], [45, 50], [65, 40], [85, 50], [105, 35], [125, 25],
        [165, 45], [190, 40], [215, 32], [245, 45], [270, 40], [295, 50],
        [320, 35], [345, 32], [365, 25], [390, 35],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1.4" height="1.4" fill={color} opacity={0.6}>
          <animate
            attributeName="opacity"
            values="0.25;0.85;0.25"
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}

function DriftDots({
  color,
  count,
  small,
}: {
  color: string;
  count: number;
  small?: boolean;
}) {
  const dots = Array.from({ length: count });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 73 + 11) % 100}%`,
            top: `${(i * 41 + 23) % 100}%`,
            width: small ? 1.5 : 2,
            height: small ? 1.5 : 2,
            background: color,
            boxShadow: `0 0 ${small ? 4 : 6}px ${color}`,
            opacity: 0.45,
          }}
          animate={{
            opacity: [0.15, 0.6, 0.15],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 7 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
