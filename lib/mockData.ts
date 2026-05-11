// Re-export Istanbul-wide data so older imports (neighborhoods / memories / KADIKOY_CENTER)
// keep working while new code can import directly from istanbulData.
export {
  districts,
  districts as neighborhoods,
  memories,
  memoriesInDistrict,
  countByDistrict,
  districtById,
  districtByName,
  KADIKOY_CENTER,
  ISTANBUL_CENTER,
  type District,
  type Memory,
  type MemoryType,
  type DistrictSide,
} from "./istanbulData";

import { memories, districts } from "./istanbulData";

// Derived district stats (sound count, night-only count, total) for UI panels.
export function getDistrictStats(districtId: string) {
  const list = memories.filter((m) => m.districtId === districtId);
  return {
    count: list.length,
    sounds: list.filter((m) => m.hasSound).length,
    night: list.filter((m) => m.isNight).length,
    rain: list.filter((m) => m.isRain).length,
    rare: list.filter((m) => m.rare).length,
    popular: list.filter((m) => m.popular).length,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Auxiliary mock data — moods, profile, explore sections, quests
// ────────────────────────────────────────────────────────────────────────────

export const moodOptions = [
  { id: "mutlu",      label: "Mutlu",      glyph: "✦" },
  { id: "sakin",      label: "Sakin",      glyph: "◐" },
  { id: "yorgun",     label: "Yorgun",     glyph: "◌" },
  { id: "yalniz",     label: "Yalnız",     glyph: "○" },
  { id: "heyecanli",  label: "Heyecanlı",  glyph: "✷" },
  { id: "huzurlu",    label: "Huzurlu",    glyph: "❍" },
  { id: "romantik",   label: "Romantik",   glyph: "♡" },
  { id: "nostaljik",  label: "Nostaljik",  glyph: "❉" },
  { id: "melankolik", label: "Melankolik", glyph: "◔" },
  { id: "gece",       label: "Gece",       glyph: "☾" },
];

export const nationalMood = [
  { label: "sakin",     percent: 34 },
  { label: "yorgun",    percent: 22 },
  { label: "huzurlu",   percent: 18 },
  { label: "yalniz",    percent: 14 },
  { label: "heyecanli", percent: 12 },
];

export const profileStats = {
  username: "@gece.yolcusu",
  aura: "Night Walker",
  city: "Kadıköy",
  level: 6,
  memories: 47,
  resonance: 218,
  discovered: 134,
  saved: 9,
  xp: 2380,
  xpToNext: 620,
  xpProgress: 0.62,
  coins: 184,
};

export const badges = [
  { id: "b1", name: "Gece Yürüyüşçüsü", unlocked: true },
  { id: "b2", name: "Sessiz Dinleyici", unlocked: true },
  { id: "b3", name: "Yağmur Toplayıcı", unlocked: false },
  { id: "b4", name: "Vapur Hatırı",     unlocked: true },
  { id: "b5", name: "İlk Anı",          unlocked: true },
];

export const auras = [
  { id: "a1", name: "Mor Sis",     unlocked: true,  gradient: "from-neon-plum/40 to-neon-purple/40" },
  { id: "a2", name: "Gece Mavisi", unlocked: true,  gradient: "from-[#1f2a6e]/60 to-neon-purple/30" },
  { id: "a3", name: "Şafak",       unlocked: false, gradient: "from-[#3a1f6e]/40 to-violet-glow/30" },
];

export const exploreSections = {
  nearby: [
    { id: "n1", title: "Moda Sahili",                  subtitle: "37 anı · 2 sound memory", mood: "romantik",  tag: "Yakın" },
    { id: "n2", title: "Yeldeğirmeni Arka Sokakları",  subtitle: "21 anı · 1 sound memory", mood: "nostaljik", tag: "Yakın" },
    { id: "n3", title: "Kalamış Yürüyüş Yolu",          subtitle: "14 anı",                  mood: "sakin",     tag: "Yakın" },
  ],
  popular: [
    { id: "p1", title: "Kadıköy Vapur İskelesi", subtitle: "Bu hafta 412 anı", mood: "huzurlu",  tag: "Çok Hissedilen" },
    { id: "p2", title: "Bağdat Caddesi",         subtitle: "Bu hafta 287 anı", mood: "yogun",    tag: "Çok Hissedilen" },
    { id: "p3", title: "Salacak",                subtitle: "Bu hafta 201 anı", mood: "sakin",    tag: "Çok Hissedilen" },
  ],
  sound: [
    { id: "s1", title: "Vapur Kornası",  subtitle: "Kalamış · 4'12''",     mood: "sakin",    tag: "07:30" },
    { id: "s2", title: "Yağmur Damlası", subtitle: "Caddebostan · 1'48''", mood: "huzurlu",  tag: "Bugün" },
    { id: "s3", title: "Sessiz Sokak",   subtitle: "Moda · 2'05''",        mood: "yalniz",   tag: "Gece" },
  ],
  hidden: [
    { id: "h1", title: "Bilinmeyen Bir Avlu", subtitle: "Yalnızca gece açılır", mood: "yalniz",  tag: "Gizli" },
    { id: "h2", title: "Kapalı Bir Kapı Önü", subtitle: "Yağmurda görünür",     mood: "yorgun",  tag: "Gizli" },
    { id: "h3", title: "Eski Bir Bank",       subtitle: "Pazar 06:00 sonrası",  mood: "huzurlu", tag: "Gizli" },
  ],
};

export const quests = [
  { id: "q1", title: "Daha önce durmadığın bir yerde 5 dakika kal.", subtitle: "Yeni bir sessizlik bul.", reward: "+40 XP",      tag: "Keşif", distance: "yakın" },
  { id: "q2", title: "Bir sokakta duyduğun en güzel sesi kaydet.",    subtitle: "Sound memory bırak.",     reward: "+60 XP",      tag: "Sound", distance: "Moda" },
  { id: "q3", title: "Gecenin en sakin noktasına bir anı bırak.",     subtitle: "Sadece 00:00 sonrası.",   reward: "Aura: Şafak", tag: "Gece",  distance: "—" },
  { id: "q4", title: "Yakındaki bir TheQuuk Spot'u keşfet.",           subtitle: "Moda · 320m",             reward: "+25 XP",      tag: "Spot",  distance: "320m" },
];
