import type { Memory } from "./istanbulData";
import type { MoodKey } from "./moodPalette";

// ────────────────────────────────────────────────────────────────────────────
// Identity
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// Character clothing system (future feature — partners give points, points buy
// clothing, rarity = profile elitism). Data structure ready; UI shows only a
// tiny rarity row below the avatar for now.
// ────────────────────────────────────────────────────────────────────────────

export type ClothingRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ClothingSlot = "hood" | "jacket" | "pants" | "shoes" | "accessory";

export type ClothingItem = {
  id: string;
  slot: ClothingSlot;
  name: string;
  rarity: ClothingRarity;
  unlocked: boolean;
  acquiredFrom?: string;
};

export const rarityPalette: Record<
  ClothingRarity,
  { color: string; glow: string; label: string }
> = {
  common:    { color: "#8a93b5", glow: "rgba(138,147,181,0.32)", label: "standart" },
  uncommon:  { color: "#7fb8d9", glow: "rgba(127,184,217,0.42)", label: "ender" },
  rare:      { color: "#a088e0", glow: "rgba(160,136,224,0.50)", label: "nadir" },
  epic:      { color: "#e8a4b8", glow: "rgba(232,164,184,0.52)", label: "epik" },
  legendary: { color: "#f2c58f", glow: "rgba(242,197,143,0.60)", label: "efsane" },
};

export const ownedItems: ClothingItem[] = [
  { id: "default-hood",     slot: "hood",      name: "Sokak Kapüşonu",          rarity: "common",    unlocked: true },
  { id: "default-jacket",   slot: "jacket",    name: "Gece Hırkası",            rarity: "common",    unlocked: true },
  { id: "default-pants",    slot: "pants",     name: "Asfalt Pantolonu",        rarity: "common",    unlocked: true },
  { id: "default-sneakers", slot: "shoes",     name: "Sahil Sneaker'ı",         rarity: "common",    unlocked: true },
  { id: "moda-cap",         slot: "accessory", name: "Moda Kahvesi Şapkası",    rarity: "rare",      unlocked: true,  acquiredFrom: "Moda Kahvesi" },
  { id: "galata-coat",      slot: "jacket",    name: "Galata Sırrı Paltosu",     rarity: "epic",      unlocked: false, acquiredFrom: "Galata Spots" },
  { id: "midnight-jacket",  slot: "jacket",    name: "03:00 Ceketi",            rarity: "legendary", unlocked: false },
];

export const equipped: Partial<Record<ClothingSlot, string>> = {
  hood:      "default-hood",
  jacket:    "default-jacket",
  pants:     "default-pants",
  shoes:     "default-sneakers",
  accessory: "moda-cap",
};

export function getEquippedItem(slot: ClothingSlot): ClothingItem | undefined {
  const id = equipped[slot];
  return id ? ownedItems.find((i) => i.id === id) : undefined;
}

// ────────────────────────────────────────────────────────────────────────────
// Identity
// ────────────────────────────────────────────────────────────────────────────

export type ProfileVisibility = "public" | "private";

export type Profile = {
  username: string;
  status: string;
  citySentence: string;
  homeDistrictId: string;
  homeDistrict: string;
  homeMood: MoodKey;
  dominantMood: MoodKey;
  lastTrace: { district: string; place: string; timeAgo: string };
  visibility: ProfileVisibility;
  joinedAt: string;
};

export const profile: Profile = {
  username: "gorkem",
  status: "Gece yürüyen biri.",
  citySentence: "Bazı sokaklar insandan daha çok şey hatırlar.",
  homeDistrictId: "kadikoy",
  homeDistrict: "Kadıköy",
  homeMood: "melankolik",
  dominantMood: "melankolik",
  lastTrace: { district: "Moda", place: "Moda Sahili", timeAgo: "2 saat önce" },
  visibility: "public",
  joinedAt: "2024 sonbaharı",
};

// ────────────────────────────────────────────────────────────────────────────
// Memory archive — 38 total, 22 shown in detail
// ────────────────────────────────────────────────────────────────────────────

export const totalMemoryCount = 38;

const archiveSeed: Array<{
  text: string;
  mood: MoodKey;
  district: string;
  place?: string;
  hasSound?: boolean;
  isNight?: boolean;
  isRain?: boolean;
  type?: Memory["type"];
  timeAgo: string;
  likes: number;
  saved?: boolean;
}> = [
  { text: "Bu sokaktan geçerken hep aynı şarkı çalıyordu.",        mood: "melankolik", district: "Moda",       place: "Moda Sahili",     timeAgo: "2 gün önce",    likes: 24, saved: true },
  { text: "Burada bir mesaj yazıldı ama hiç gönderilmedi.",         mood: "gizemli",    district: "Kadıköy",    place: "Kadıköy Çarşı",   timeAgo: "5 gün önce",    likes: 41, type: "secret" },
  { text: "Yağmur başlayınca herkes sustu, şehir konuştu.",          mood: "yagmurlu",   district: "Galata",     place: "Galata Köprüsü", timeAgo: "1 hafta önce",  likes: 67, isRain: true, type: "rain-only" },
  { text: "Gece 03:12'de burası başka bir yere benziyordu.",         mood: "gece",       district: "Beşiktaş",   place: "Beşiktaş Çarşı", timeAgo: "2 hafta önce",  likes: 32, isNight: true, type: "night-only" },
  { text: "Bir kahvenin ardından unutulmamış bir cümle kaldı.",      mood: "nostaljik",  district: "Karaköy",    place: "Bir kahve dükkânı", timeAgo: "3 hafta önce", likes: 88, saved: true },
  { text: "Burada ilk defa yalnızlığı kötü bir şey gibi hissetmedim.", mood: "huzurlu",  district: "Üsküdar",    place: "Salacak",         timeAgo: "1 ay önce",     likes: 56, saved: true },
  { text: "Birinin gözleri bir an dolu dolu baktı, geçti.",          mood: "melankolik", district: "Kadıköy",    place: "Vapur iskelesi", timeAgo: "3 gün önce",    likes: 19 },
  { text: "Vapurun arka güvertesinde rüzgâr beni biliyordu.",        mood: "huzurlu",    district: "Kalamış",    place: "Vapur",          timeAgo: "1 hafta önce",  likes: 44, hasSound: true, type: "sound" },
  { text: "Eski bir telefonun zili çaldı, hiç açmadım.",             mood: "nostaljik",  district: "Moda",       place: "Bir sokak ağzı", timeAgo: "4 gün önce",    likes: 22 },
  { text: "Gecenin biteceğine inanmadım.",                            mood: "gece",       district: "Karaköy",    place: "Liman",          timeAgo: "10 gün önce",   likes: 51, isNight: true, type: "night-only" },
  { text: "Birinin söyleyemediği şeyi taşıdım buradan.",              mood: "gizemli",    district: "Galata",     place: "Kuledibi",       timeAgo: "2 hafta önce",  likes: 38, type: "confession", saved: true },
  { text: "Bir mağaza vitrini gözüm doldu sebepsiz.",                 mood: "melankolik", district: "Nişantaşı", place: "Teşvikiye",      timeAgo: "5 gün önce",    likes: 14 },
  { text: "Sahafta açtığım kitap eski bir mektup tuttu.",             mood: "nostaljik",  district: "Beşiktaş",   place: "Akaretler",      timeAgo: "1 hafta önce",  likes: 73, saved: true },
  { text: "Yağmurun durmadığı bir akşam burayı sevdim.",              mood: "yagmurlu",   district: "Kadıköy",    place: "Bahariye",       timeAgo: "3 hafta önce",  likes: 29, isRain: true, type: "rain-only" },
  { text: "Sahil bandında biri benim adımı haykırdı, dönmedim.",      mood: "romantik",   district: "Moda",       place: "Moda Sahili",    timeAgo: "4 hafta önce",  likes: 95 },
  { text: "Cami avlusunda nefes aldım, taşlar dinledi.",              mood: "huzurlu",    district: "Üsküdar",    place: "Mihrimah",       timeAgo: "1 ay önce",     likes: 41 },
  { text: "İki yabancı arasında bir bakış kaldı, anladılar.",         mood: "romantik",   district: "Kadıköy",    place: "Tellalzade",     timeAgo: "6 gün önce",    likes: 64 },
  { text: "Geceyi dinleyebildiğim tek yer burasıydı.",                 mood: "gece",       district: "Moda",       place: "Moda Burnu",     timeAgo: "3 hafta önce",  likes: 47, isNight: true, hasSound: true, type: "sound" },
  { text: "Eski bir bisikletin gölgesinde durdum.",                    mood: "nostaljik",  district: "Galata",     place: "Galata Sokak",   timeAgo: "1 ay önce",     likes: 18 },
  { text: "Burada bekledim, ne kadar olduğunu bilmiyorum.",            mood: "melankolik", district: "Kadıköy",    place: "Bir bank",       timeAgo: "5 hafta önce",  likes: 53, saved: true },
  { text: "Karanlık bir balkonda biri keman çalıyordu.",                mood: "gece",       district: "Beşiktaş",   place: "Akaretler",      timeAgo: "12 gün önce",   likes: 86, isNight: true, hasSound: true, type: "sound" },
  { text: "Sessizliğin altında bir karar buldum.",                      mood: "gizemli",    district: "Üsküdar",    place: "Kuzguncuk yolu", timeAgo: "2 hafta önce",  likes: 33, type: "confession" },
];

const rng = (() => {
  let s = 20260513 >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

export type UserMemory = Memory & {
  place?: string;
  saved?: boolean;
};

export const userMemories: UserMemory[] = archiveSeed.map((s, i) => {
  const type: Memory["type"] = s.type ?? (s.hasSound ? "sound" : s.isNight ? "night-only" : s.isRain ? "rain-only" : "text");
  const locked = type === "night-only" || type === "rain-only" || type === "secret" || type === "confession" || type === "rare";
  return {
    id: `u${i + 1}`,
    text: s.text,
    mood: s.mood,
    district: s.district,
    districtId: s.district.toLowerCase().replace(/ı/g, "i").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ /g, "-"),
    type,
    hasSound: s.hasSound,
    isNight: s.isNight,
    isRain: s.isRain,
    time: "—",
    timeAgo: s.timeAgo,
    lng: 29 + rng() * 0.1,
    lat: 40.97 + rng() * 0.05,
    likes: s.likes,
    visibility: locked ? "locked" : "open",
    place: s.place,
    saved: s.saved ?? false,
  };
});

// ────────────────────────────────────────────────────────────────────────────
// City footprint — districts where the user has left traces
// ────────────────────────────────────────────────────────────────────────────

export type FootprintEntry = {
  districtId: string;
  district: string;
  lng: number;
  lat: number;
  count: number;
  mood: MoodKey;
  lastTrace: string;
};

export const footprint: FootprintEntry[] = [
  { districtId: "kadikoy",       district: "Kadıköy",    lng: 29.0244, lat: 40.9923, count: 18, mood: "melankolik", lastTrace: "3 saat önce" },
  { districtId: "moda",          district: "Moda",       lng: 29.0276, lat: 40.9853, count: 11, mood: "romantik",   lastTrace: "2 saat önce" },
  { districtId: "besiktas",      district: "Beşiktaş",   lng: 29.0080, lat: 41.0430, count: 7,  mood: "nostaljik",  lastTrace: "1 hafta önce" },
  { districtId: "uskudar",       district: "Üsküdar",    lng: 29.0155, lat: 41.0244, count: 5,  mood: "huzurlu",    lastTrace: "10 gün önce" },
  { districtId: "galata",        district: "Galata",     lng: 28.9740, lat: 41.0258, count: 4,  mood: "gizemli",    lastTrace: "2 hafta önce" },
  { districtId: "karakoy",       district: "Karaköy",    lng: 28.9783, lat: 41.0265, count: 3,  mood: "gece",       lastTrace: "3 hafta önce" },
  { districtId: "nisantasi",     district: "Nişantaşı", lng: 28.9920, lat: 41.0490, count: 2, mood: "melankolik", lastTrace: "1 ay önce" },
  { districtId: "kalamis",       district: "Kalamış",    lng: 29.0397, lat: 40.9772, count: 2, mood: "huzurlu",     lastTrace: "1 hafta önce" },
  { districtId: "yeldegirmeni",  district: "Yeldeğirmeni", lng: 29.0285, lat: 40.9974, count: 2, mood: "nostaljik", lastTrace: "5 gün önce" },
  { districtId: "fenerbahce",    district: "Fenerbahçe", lng: 29.0397, lat: 40.9716, count: 1,  mood: "yalniz",     lastTrace: "2 hafta önce" },
  { districtId: "ortakoy",       district: "Ortaköy",    lng: 29.0270, lat: 41.0550, count: 1,  mood: "romantik",   lastTrace: "1 ay önce" },
  { districtId: "balat",         district: "Balat",      lng: 28.9430, lat: 41.0290, count: 1,  mood: "nostaljik",  lastTrace: "1 ay önce" },
];

// ────────────────────────────────────────────────────────────────────────────
// Mood signature — the user's emotional fingerprint
// ────────────────────────────────────────────────────────────────────────────

export type MoodSignatureEntry = { mood: MoodKey; percent: number };

export const moodSignature: MoodSignatureEntry[] = [
  { mood: "melankolik", percent: 34 },
  { mood: "nostaljik",  percent: 22 },
  { mood: "romantik",   percent: 18 },
  { mood: "huzurlu",    percent: 12 },
  { mood: "gizemli",    percent: 9 },
  { mood: "karmasik",   percent: 5 },
];

// ────────────────────────────────────────────────────────────────────────────
// Ritual badges — TheQuuk-specific, not gamey
// ────────────────────────────────────────────────────────────────────────────

export type RitualBadge = {
  id: string;
  name: string;
  description: string;
  mood: MoodKey;
  unlocked: boolean;
  unlockedAt?: string;
};

export const ritualBadges: RitualBadge[] = [
  { id: "gece-yuruyeni", name: "Gece Yürüyeni",     description: "Gece 00:00'dan sonra 5 anı bıraktın.",        mood: "gece",       unlocked: true,  unlockedAt: "3 hafta önce" },
  { id: "yagmurda",      name: "Yağmurda Yazılmış", description: "Yağmurlu havada bir anı bıraktın.",            mood: "yagmurlu",   unlocked: true,  unlockedAt: "1 ay önce" },
  { id: "moda-sakini",   name: "Moda Sakini",       description: "Moda'da 10'dan fazla iz bıraktın.",            mood: "romantik",   unlocked: true,  unlockedAt: "2 hafta önce" },
  { id: "galata-sirri",  name: "Galata Sırrı",      description: "Galata'da bir gizli not bıraktın.",            mood: "gizemli",    unlocked: true,  unlockedAt: "10 gün önce" },
  { id: "ilk-iz",         name: "İlk İz",            description: "Şehre ilk anını bıraktın.",                    mood: "nostaljik",  unlocked: true,  unlockedAt: "geçen sonbahar" },
  { id: "saklanan-ses",   name: "Saklanan Ses",      description: "Bir sound memory'in 50'den fazla kez dinlendi.", mood: "huzurlu",  unlocked: true,  unlockedAt: "1 hafta önce" },
  { id: "yedi-mahalle",   name: "7 Mahalle",         description: "7 farklı mahallede iz bıraktın.",              mood: "umutlu",     unlocked: true,  unlockedAt: "1 ay önce" },
  { id: "uc-sifir-anisi", name: "03:00 Anısı",       description: "Saat 03:00'da bir anı bıraktın.",              mood: "gece",       unlocked: false },
  { id: "sahil-sessizligi", name: "Sahil Sessizliği", description: "Sahil hattında 3 anı bıraktın.",              mood: "sakin",      unlocked: false },
  { id: "kaybolan-not",    name: "Kaybolan Not",     description: "Bir anın 7 gün sonra otomatik silindi.",       mood: "melankolik", unlocked: false },
];

// ────────────────────────────────────────────────────────────────────────────
// Privacy defaults
// ────────────────────────────────────────────────────────────────────────────

export type LocationPrecision = "exact" | "approximate";
export type AudienceLevel = "everyone" | "circle" | "self";
export type PresenceVisibility = "visible" | "glow-only" | "hidden";

export type PrivacySettings = {
  profile: ProfileVisibility;
  memories: AudienceLevel;
  location: LocationPrecision;
  likedHidden: boolean;
  savedHidden: boolean;
  presence: PresenceVisibility;
};

export const defaultPrivacy: PrivacySettings = {
  profile: "public",
  memories: "everyone",
  location: "approximate",
  likedHidden: false,
  savedHidden: true,
  presence: "glow-only",
};

// ────────────────────────────────────────────────────────────────────────────
// Liked / Saved — references into istanbulData.memories (other users' memories)
// ────────────────────────────────────────────────────────────────────────────

// These ids reference memories in lib/istanbulData.ts. Stable for the demo.
export const likedMemoryIds: string[] = [
  "m1",  // Bu sokak gece daha güzel — Moda · gece
  "m11", // Sokak müzisyeni Cem Karaca çaldı — Moda · nostaljik · sound
  "m14", // Buradan İstanbul'a baktım, susmuştu — Kalamış · huzurlu
  "m4",  // Vapur kornası — şehrin nefesi — Kalamış · sakin · sound
  "m6",  // Burada uzun zaman sustum — Fenerbahçe · yalniz
  "m13", // Çocukluğumun parkı, kimse yok artık — Fenerbahçe · nostaljik
  "m3",  // Biri buraya bir şarkı bırakmış — Yeldeğirmeni · romantik · sound
  "m8",  // Sahil yürüyüşü, kimse yok — Caddebostan · huzurlu · gece
];

export const savedMemoryIds: string[] = [
  "m12", // İlk öpücüğümüz buradaydı — Moda · romantik
  "m4",  // Vapur kornası — Kalamış · sound
  "m11", // Cem Karaca — Moda · sound
  "m2",  // Burada kendimi ilk defa hafif hissettim — Moda · huzurlu
  "m14", // Buradan İstanbul'a baktım, susmuştu — Kalamış
];

// ────────────────────────────────────────────────────────────────────────────
// Aggregate stats — derived but stored for UI convenience
// ────────────────────────────────────────────────────────────────────────────

export const profileStats = {
  totalMemories: 38,
  districtsVisited: footprint.length,
  savedCount: 17,
  likedCount: 142, // total resonances received
  soundCount: 6,
  nightCount: 14,
  rainCount: 4,
  mostActiveHour: "23:00 — 02:00",
  mostHeardDistrict: "Moda",
  followers: 124,
  following: 89,
};
