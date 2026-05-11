"use client";

import { motion } from "framer-motion";
import { moodOptions } from "@/lib/mockData";

export default function MoodModal({
  onPick,
  onClose,
}: {
  onPick: (m: string) => void;
  onClose: () => void;
}) {
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
          px-4 pb-6
          md:items-center md:p-6 md:pl-[260px]"
      >
        <motion.div
          className="w-full max-w-[420px] pointer-events-auto"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
        >
          <div className="glass rounded-3xl p-5 ring-glow">
            <p className="text-[11px] uppercase tracking-[0.25em] text-violet-200/55">Bugün</p>
            <h3 className="mt-1 text-2xl font-display font-semibold text-violet-100">
              Nasıl hissediyorsun?
            </h3>
            <p className="mt-1 text-sm text-violet-200/60">
              Şehir senin için bir his bırakacak.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {moodOptions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onPick(m.label.toLowerCase())}
                  className="h-20 rounded-2xl glass-soft hover:bg-violet-glow/10 flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition border border-violet-glow/10"
                >
                  <span className="text-violet-glow text-lg">{m.glyph}</span>
                  <span className="text-sm text-violet-100">{m.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full h-11 rounded-xl text-violet-200/55 text-sm"
            >
              Şimdi değil
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
