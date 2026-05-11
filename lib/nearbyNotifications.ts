import type { MoodKey } from "./moodPalette";

export type NearbyNotifKind =
  | "new-memory"     // a new memory was shared nearby
  | "trending"       // a memory is trending in your area
  | "many-reactions" // N people reacted to a memory nearby
  | "new-activity"   // a district near you has new activity
  | "spot"           // a place / cafe became a memory spot
  | "unlock";        // a hidden memory near you unlocked

export type NearbyNotification = {
  id: string;
  kind: NearbyNotifKind;
  text: string;
  detail?: string;
  district: string;
  mood: MoodKey;
  timeAgo: string;
  memorySnippet?: string;
  count?: number;
};

// Notifications are framed around the user's home district (Kadıköy) and
// adjacent neighborhoods (Moda, Kalamış, Caddebostan, Yeldeğirmeni, Fenerbahçe).
export const nearbyNotifications: NearbyNotification[] = [
  {
    id: "near1",
    kind: "new-memory",
    text: "Moda'da yeni bir anı paylaşıldı",
    district: "Moda",
    mood: "romantik",
    timeAgo: "3 dakika önce",
    memorySnippet: "Sahilde elini bırakmadan yürüdük.",
  },
  {
    id: "near2",
    kind: "trending",
    text: "Kalamış'taki bir anı çevrende parlıyor",
    detail: "Son bir saatte 42 kişi hissetti.",
    district: "Kalamış",
    mood: "sakin",
    timeAgo: "11 dakika önce",
    memorySnippet: "Vapur kornası — şehrin nefesi.",
    count: 42,
  },
  {
    id: "near3",
    kind: "many-reactions",
    text: "Yakınında 18 kişi bir anıya tepki verdi",
    detail: "Caddebostan sahili.",
    district: "Caddebostan",
    mood: "huzurlu",
    timeAgo: "32 dakika önce",
    count: 18,
  },
  {
    id: "near4",
    kind: "spot",
    text: "Yeldeğirmeni'nde bir kafe popüler memory spot oldu",
    detail: "Mavi Kahve — bu hafta 31 anı bırakıldı.",
    district: "Yeldeğirmeni",
    mood: "nostaljik",
    timeAgo: "1 saat önce",
    count: 31,
  },
  {
    id: "near5",
    kind: "new-activity",
    text: "Caddebostan'da yeni emotional aktivite",
    detail: "Son saatte 7 yeni anı bırakıldı.",
    district: "Caddebostan",
    mood: "yogun",
    timeAgo: "2 saat önce",
    count: 7,
  },
  {
    id: "near6",
    kind: "unlock",
    text: "Moda Sahili'nde bir gece anısı açıldı",
    detail: "Sadece şu an görünür.",
    district: "Moda",
    mood: "gece",
    timeAgo: "3 saat önce",
    memorySnippet: "Gece 02:13'te bırakılmış kısa bir ses.",
  },
  {
    id: "near7",
    kind: "trending",
    text: "Fenerbahçe'de saklanan bir not parladı",
    detail: "Birinin yalnız kalmasından kalan bir cümle.",
    district: "Fenerbahçe",
    mood: "yalniz",
    timeAgo: "4 saat önce",
    memorySnippet: "Burada uzun zaman sustum.",
  },
  {
    id: "near8",
    kind: "new-memory",
    text: "Bağdat caddesinde yeni bir sound memory",
    detail: "Caddebostan yakını · 1'48''",
    district: "Caddebostan",
    mood: "heyecanli",
    timeAgo: "7 saat önce",
  },
  {
    id: "near9",
    kind: "new-activity",
    text: "Kalamış sahilinde sessiz bir akşam",
    detail: "Bugün senin bölgende 12 anı bırakıldı.",
    district: "Kalamış",
    mood: "sakin",
    timeAgo: "dün",
    count: 12,
  },
  {
    id: "near10",
    kind: "spot",
    text: "Moda Çayevi anı haritasında yeni",
    detail: "Bu hafta 14 anı bırakıldı.",
    district: "Moda",
    mood: "romantik",
    timeAgo: "2 gün önce",
    count: 14,
  },
];

export function nearbyNotifVerb(kind: NearbyNotifKind): string {
  switch (kind) {
    case "new-memory":     return "yeni anı";
    case "trending":       return "trend";
    case "many-reactions": return "tepkiler";
    case "new-activity":   return "aktivite";
    case "spot":           return "yeni nokta";
    case "unlock":         return "açıldı";
  }
}
