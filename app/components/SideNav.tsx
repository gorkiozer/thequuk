"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { MapIcon, ExploreIcon, ProfileIcon, DropIcon, NotificationIcon } from "./NavIcons";
import { profile } from "@/lib/profileData";
import ProfilePhoto from "./profile/ProfilePhoto";

const items = [
  { href: "/map", label: "Harita", icon: MapIcon },
  { href: "/explore", label: "Keşfet", icon: ExploreIcon },
  { href: "/notifications", label: "Bildirimler", icon: NotificationIcon },
  { href: "/profile", label: "Profil", icon: ProfileIcon },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[244px] flex-col p-5 backdrop-blur-2xl"
      style={{
        background: "rgba(10,7,20,0.85)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Link href="/map" className="flex items-center gap-2.5 group">
        <Logo size={36} glow={false} />
        <span className="text-[17px] font-display tracking-tight text-white group-hover:text-violet-glow transition">
          TheQuuk
        </span>
      </Link>

      <nav className="mt-10 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href === "/map" && pathname?.startsWith("/map"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition ${
                active
                  ? "bg-white/[0.05] text-white"
                  : "text-white/55 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] transition ${
                  active ? "text-violet-glow" : ""
                }`}
              />
              <span className="text-[14px]">{item.label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-glow"
                  style={{ boxShadow: "0 0 8px rgba(180,138,255,0.85)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/drop"
        className="mt-6 relative flex items-center justify-center gap-2 h-12 rounded-full text-white text-[14px] font-medium group"
        style={{
          background:
            "linear-gradient(135deg, #6E3BFF 0%, #A06BFF 100%)",
          boxShadow: "0 8px 24px rgba(110,59,255,0.35)",
        }}
      >
        <span
          className="absolute inset-0 rounded-full bg-neon-purple/40 blur-xl -z-10"
          style={{ animation: "breathGlow 3.6s ease-in-out infinite" }}
        />
        <DropIcon className="w-4 h-4" />
        <span>Anı bırak</span>
      </Link>

      <div className="mt-auto pt-6">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/[0.03] transition group"
        >
          <ProfilePhoto
            initial={profile.username.charAt(0).toUpperCase()}
            size="sm"
            self
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white/90 leading-tight truncate">
              @{profile.username}
            </p>
            <p className="text-[10px] text-white/45 leading-tight mt-0.5 truncate">
              {profile.homeDistrict}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
