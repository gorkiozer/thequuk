"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapIcon, ExploreIcon, DropIcon, ProfileIcon, NotificationIcon } from "./NavIcons";

type Item = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
  center?: boolean;
};

const items: Item[] = [
  { href: "/map",           label: "Harita",     icon: MapIcon },
  { href: "/explore",       label: "Keşfet",     icon: ExploreIcon },
  { href: "/drop",          label: "Anı Bırak",  icon: DropIcon,        center: true },
  { href: "/notifications", label: "Bildirim",   icon: NotificationIcon },
  { href: "/profile",       label: "Profil",     icon: ProfileIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[480px] px-3 pt-2 pointer-events-none"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="absolute inset-x-3 -top-6 h-14 bg-gradient-to-t from-ink-900 via-ink-900/85 to-transparent pointer-events-none" />
      <div
        className="relative rounded-3xl px-2 py-2.5 flex items-end justify-between pointer-events-auto backdrop-blur-2xl"
        style={{
          background: "rgba(14,10,26,0.55)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/map" && pathname?.startsWith("/map"));
          const Icon = item.icon;

          if (item.center) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-8 flex flex-col items-center group"
              >
                <span className="relative">
                  <span
                    className="absolute inset-0 rounded-full bg-neon-purple/45 blur-xl"
                    style={{ animation: "breathGlow 3.6s ease-in-out infinite" }}
                  />
                  <span
                    className="relative w-14 h-14 rounded-full flex items-center justify-center transition group-active:scale-95"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, #2a1854 0%, #150a2c 70%)",
                      border: "1px solid rgba(180,138,255,0.30)",
                      boxShadow:
                        "0 8px 24px rgba(110,59,255,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset",
                    }}
                  >
                    <Icon className="w-6 h-6 text-violet-glow" />
                  </span>
                </span>
                <span className="mt-1.5 text-[9.5px] uppercase tracking-[0.18em] text-white/70">
                  bırak
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center py-1.5"
            >
              <Icon
                className={`w-5 h-5 transition ${
                  active ? "text-white" : "text-white/45"
                }`}
              />
              <span
                className={`mt-1 text-[10px] tracking-wide ${
                  active ? "text-white" : "text-white/45"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <motion.span
                  layoutId="navDot"
                  className="mt-0.5 w-1 h-1 rounded-full bg-violet-glow"
                  style={{ boxShadow: "0 0 10px rgba(180,138,255,0.95)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
