"use client";

import Image from "next/image";

export default function Logo({
  size = 64,
  glow = true,
}: {
  size?: number;
  glow?: boolean;
}) {
  return (
    <div
      className="relative inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-[28%] bg-neon-purple/30 blur-2xl pointer-events-none"
          style={{ transform: "scale(1.18)" }}
        />
      )}
      <Image
        src="/logo.png"
        alt="TheQuuk"
        width={size}
        height={size}
        priority
        draggable={false}
        className="relative rounded-[28%]"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
