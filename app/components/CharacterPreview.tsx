"use client";

import { motion } from "framer-motion";

export default function CharacterPreview() {
  return (
    <div className="relative h-72 mx-5 mb-3 rounded-3xl overflow-hidden glass">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-neon-purple/30 blur-3xl" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-neon-plum/40 blur-2xl" />
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-44 h-3 rounded-full bg-violet-glow/25 blur-md" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-[1.5px] rounded-full bg-violet-glow/55" />

      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-8"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 260" width="190" height="247" fill="none">
          <defs>
            <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a1655" />
              <stop offset="100%" stopColor="#150a2c" />
            </linearGradient>
            <linearGradient id="hoodTrim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A06BFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6E3BFF" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="face" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1a0d33" />
              <stop offset="100%" stopColor="#06030F" />
            </radialGradient>
          </defs>

          <path
            d="M50 250 L50 168 C 50 128, 70 108, 100 108 C 130 108, 150 128, 150 168 L150 250 Z"
            fill="url(#hood)"
            stroke="#A06BFF"
            strokeOpacity="0.4"
            strokeWidth="1.4"
          />

          <path
            d="M65 130 C 60 90, 80 60, 100 60 C 120 60, 140 90, 135 130 C 125 110, 115 105, 100 105 C 85 105, 75 110, 65 130 Z"
            fill="url(#hood)"
            stroke="#A06BFF"
            strokeOpacity="0.5"
            strokeWidth="1.4"
          />

          <ellipse cx="100" cy="120" rx="22" ry="26" fill="url(#face)" />

          <circle cx="92" cy="120" r="1.6" fill="#C9A8FF">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="108" cy="120" r="1.6" fill="#C9A8FF">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>

          <path d="M70 92 C 80 80, 120 80, 130 92" stroke="url(#hoodTrim)" strokeWidth="1.5" fill="none" />

          <line x1="100" y1="160" x2="100" y2="220" stroke="#A06BFF" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="100" cy="180" r="2" fill="#C9A8FF">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </circle>

          <path
            d="M62 175 C 56 175, 50 180, 50 195"
            stroke="#A06BFF"
            strokeOpacity="0.35"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M138 175 C 144 175, 150 180, 150 195"
            stroke="#A06BFF"
            strokeOpacity="0.35"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </motion.div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="glass-soft text-[10px] uppercase tracking-widest text-violet-200/70 px-2.5 py-1 rounded-full border border-violet-glow/10">
          360°
        </span>
        <span className="glass-soft text-[10px] uppercase tracking-widest text-violet-glow px-2.5 py-1 rounded-full border border-violet-glow/20">
          Aura · Mor Sis
        </span>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-violet-200/40 uppercase">
        ◂ döndür ▸
      </div>
    </div>
  );
}
