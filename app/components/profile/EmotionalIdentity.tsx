"use client";

import { motion } from "framer-motion";

const PHRASES = [
  "Geceyarısından sonra burada parlar.",
  "Anılarını sahil hattına bırakır.",
  "Şehir onu melankolik hatırlıyor.",
  "En çok Kadıköy'de iz bıraktı.",
  "Gece anıları daha derin yankılanıyor.",
];

export default function EmotionalIdentity() {
  return (
    <div className="text-center max-w-lg mx-auto space-y-3 md:space-y-4">
      {PHRASES.map((p, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 + i * 0.18, ease: "easeOut" }}
          className="text-[14px] md:text-[15px] text-white/65 leading-relaxed tracking-wide"
        >
          {p}
        </motion.p>
      ))}
    </div>
  );
}
