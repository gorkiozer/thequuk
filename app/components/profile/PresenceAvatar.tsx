"use client";

import { motion } from "framer-motion";
import { getMood } from "@/lib/moodPalette";

type Size = "md" | "lg" | "hero";

type Props = {
  moodKey: string;
  size?: Size;
};

const SIZES: Record<Size, { w: number; h: number; outerR: number }> = {
  md:   { w: 140, h: 220, outerR: 76 },
  lg:   { w: 200, h: 320, outerR: 110 },
  hero: { w: 280, h: 420, outerR: 160 },
};

export default function PresenceAvatar({ moodKey, size = "hero" }: Props) {
  const mood = getMood(moodKey);
  const s = SIZES[size];

  // Two ambient mood particles — barely-there atmospheric dust, not a halo of energy.
  const particles = Array.from({ length: 2 }).map((_, i) => {
    const angle = i === 0 ? 110 : 290;
    const radius = s.outerR * 0.85;
    const duration = 36 + i * 6;
    return {
      angle,
      radius,
      duration,
      delay: i * 2.4,
      size: 3,
    };
  });

  return (
    <motion.div
      className="relative pointer-events-none"
      style={{ width: s.w, height: s.h }}
      animate={{ rotate: [-0.25, 0.25, -0.25] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Soft ambient mood wash — like streetlight falling on the figure */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: s.w * 1.4,
          height: s.h * 0.85,
          background: `radial-gradient(ellipse at center, ${mood.soft} 0%, transparent 70%)`,
          filter: "blur(2px)",
          zIndex: -2,
        }}
      />

      {/* Slow inner pulse — body warmth, very subtle */}
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: s.w * 0.95,
          height: s.h * 0.6,
          background: `radial-gradient(ellipse at center, ${mood.glow} 0%, transparent 65%)`,
          filter: "blur(1px)",
          zIndex: -1,
        }}
        animate={{ opacity: [0.42, 0.72, 0.42] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2 ambient particles — quiet, not a swarm */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: mood.color,
            boxShadow: `0 0 ${p.size * 2}px ${mood.color}`,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            opacity: 0.6,
          }}
          animate={{
            x: [
              Math.cos((p.angle * Math.PI) / 180) * p.radius,
              Math.cos(((p.angle + 360) * Math.PI) / 180) * p.radius,
            ],
            y: [
              Math.sin((p.angle * Math.PI) / 180) * p.radius * 0.78,
              Math.sin(((p.angle + 360) * Math.PI) / 180) * p.radius * 0.78,
            ],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}

      {/* Character — slight breathing, grounded posture */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ width: s.w, height: s.h }}
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <HoodedFigure moodColor={mood.color} moodGlow={mood.glow} />
      </motion.div>

      {/* Ground shadow — anchor in the city */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -1,
          width: s.w * 0.4,
          height: 5,
          background: `radial-gradient(ellipse at center, ${mood.glow} 0%, transparent 70%)`,
          filter: "blur(2.5px)",
        }}
      />
    </motion.div>
  );
}

function HoodedFigure({ moodColor }: { moodColor: string; moodGlow: string }) {
  return (
    <svg viewBox="0 0 200 320" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="hoodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#211432" />
          <stop offset="100%" stopColor="#08040f" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#170d28" />
          <stop offset="100%" stopColor="#06030f" />
        </linearGradient>
        <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#100920" />
          <stop offset="100%" stopColor="#040209" />
        </linearGradient>
        <radialGradient id="faceShadow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#02010a" />
          <stop offset="100%" stopColor="#080414" />
        </radialGradient>
        <radialGradient id="chestGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={moodColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={moodColor} stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* === LEGS === */}
      <g>
        <path
          d="M 80 198 L 76 292 L 90 294 L 96 210 Z"
          fill="url(#pantsGrad)"
          stroke={moodColor}
          strokeOpacity="0.14"
          strokeWidth="0.5"
        />
        <path
          d="M 104 210 L 110 294 L 124 292 L 120 198 Z"
          fill="url(#pantsGrad)"
          stroke={moodColor}
          strokeOpacity="0.14"
          strokeWidth="0.5"
        />
        {/* Center seam */}
        <line x1="100" y1="208" x2="100" y2="290" stroke={moodColor} strokeOpacity="0.08" strokeWidth="0.5" />
      </g>

      {/* === SHOES === */}
      <g>
        <path
          d="M 70 290 Q 72 304 80 304 L 96 304 L 96 292 L 76 290 Z"
          fill="#04020a"
          stroke={moodColor}
          strokeOpacity="0.18"
          strokeWidth="0.5"
        />
        <path
          d="M 104 292 L 104 304 L 120 304 Q 128 304 130 290 L 124 290 Z"
          fill="#04020a"
          stroke={moodColor}
          strokeOpacity="0.18"
          strokeWidth="0.5"
        />
      </g>

      {/* === HOODIE BODY === */}
      <g>
        <path
          d="M 50 200 C 50 130, 65 105, 100 105 C 135 105, 150 130, 150 200 L 144 212 C 130 207, 70 207, 56 212 Z"
          fill="url(#bodyGrad)"
          stroke={moodColor}
          strokeOpacity="0.22"
          strokeWidth="0.5"
        />

        {/* Front pocket — only suggestion */}
        <path
          d="M 70 172 Q 100 180, 130 172 L 128 196 Q 100 202, 72 196 Z"
          fill="#03010a"
          opacity="0.55"
        />
        <path
          d="M 70 172 Q 100 180, 130 172"
          stroke={moodColor}
          strokeOpacity="0.13"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Drawstrings — minimal, organic */}
        <path d="M 93 116 C 92 132, 91 144, 90 152" stroke={moodColor} strokeOpacity="0.35" strokeWidth="0.7" fill="none" />
        <path d="M 107 116 C 108 132, 109 144, 110 152" stroke={moodColor} strokeOpacity="0.35" strokeWidth="0.7" fill="none" />
        <circle cx="90" cy="154" r="1" fill={moodColor} opacity="0.65" />
        <circle cx="110" cy="154" r="1" fill={moodColor} opacity="0.65" />
      </g>

      {/* === CHEST WARMTH — very subtle inner glow === */}
      <ellipse cx="100" cy="158" rx="18" ry="14" fill="url(#chestGlow)" filter="url(#softGlow)">
        <animate attributeName="opacity" values="0.50;0.78;0.50" dur="5.6s" repeatCount="indefinite" />
      </ellipse>

      {/* === HOOD === */}
      <g>
        <path
          d="M 64 100 C 60 50, 76 30, 100 30 C 124 30, 140 50, 136 100 L 126 90 Q 100 96, 74 90 Z"
          fill="url(#hoodGrad)"
          stroke={moodColor}
          strokeOpacity="0.32"
          strokeWidth="0.6"
        />

        {/* Hood rim catches light */}
        <path
          d="M 66 90 C 70 95, 130 95, 134 90"
          stroke={moodColor}
          strokeOpacity="0.42"
          strokeWidth="0.7"
          fill="none"
        />

        {/* Face shadow — deeper, more hidden */}
        <ellipse cx="100" cy="78" rx="22" ry="25" fill="url(#faceShadow)" />

        {/* Eyes — very small, mood-glowing */}
        <circle cx="93" cy="80" r="1.3" fill={moodColor}>
          <animate attributeName="opacity" values="0.5;0.95;0.5" dur="3.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="107" cy="80" r="1.3" fill={moodColor}>
          <animate attributeName="opacity" values="0.5;0.95;0.5" dur="3.6s" repeatCount="indefinite" />
        </circle>
        {/* Eye soft glow */}
        <circle cx="93" cy="80" r="2.8" fill={moodColor} opacity="0.20" filter="url(#softGlow)" />
        <circle cx="107" cy="80" r="2.8" fill={moodColor} opacity="0.20" filter="url(#softGlow)" />

        {/* Hood top — fabric hint */}
        <path
          d="M 82 36 C 90 30, 110 30, 118 36"
          stroke={moodColor}
          strokeOpacity="0.22"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    </svg>
  );
}
