"use client";

import { motion } from "framer-motion";

export default function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none
          px-3 pb-24
          md:items-end md:justify-start md:p-6 md:pl-[284px]"
      >
        <motion.div
          className="w-full max-w-[440px] md:max-w-[420px] pointer-events-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
        >
          <div className="rounded-3xl glass overflow-hidden border border-violet-glow/15 shadow-soft">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-violet-200/30" />
            </div>
            <div className="max-h-[68vh] md:max-h-[78vh] overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
