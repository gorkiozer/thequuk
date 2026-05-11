import type { MoodKey } from "./moodPalette";

export type NotifKind =
  | "resonance"   // your memory got resonance
  | "save"        // someone saved your memory
  | "react"       // someone reacted/touched a memory
  | "discover"    // a hidden memory near you was discovered
  | "system"      // city events (rain coming, night unlocks)
  | "trace";      // a new trace you left

export type PersonalNotification = {
  id: string;
  kind: NotifKind;
  text: string;
  detail?: string;
  district?: string;
  mood: MoodKey;
  timeAgo: string;
  memorySnippet?: string;
  count?: number;
  unread?: boolean;
};

// Time groups for the personal feed
export type NotifTimeGroup = "now" | "today" | "week" | "earlier";
export function getTimeGroup(timeAgo: string): NotifTimeGroup {
  if (timeAgo.includes("dakika") || timeAgo.includes("şimdi")) return "now";
  if (timeAgo.includes("saat") || timeAgo === "bugün") return "today";
  if (timeAgo.includes("gün") || timeAgo.includes("hafta")) return "week";
  return "earlier";
}

export const personalNotifications: PersonalNotification[] = [
  {
    id: "n1",
    kind: "resonance",
    text: "Anın Galata'da parladı",
    detail: "24 kişi hissetti",
    district: "Galata",
    mood: "gizemli",
    timeAgo: "3 dakika önce",
    memorySnippet: "Burada bir karar verdim, paylaşmadım.",
    count: 24,
    unread: true,
  },
  {
    id: "n2",
    kind: "react",
    text: "Biri bir anına dokundu",
    district: "Moda",
    mood: "melankolik",
    timeAgo: "12 dakika önce",
    memorySnippet: "Burada bekledim, gelmedi.",
    unread: true,
  },
  {
    id: "n3",
    kind: "save",
    text: "Birisi anını sakladı",
    detail: "Kaybolmasını istemediler.",
    district: "Moda",
    mood: "romantik",
    timeAgo: "48 dakika önce",
    memorySnippet: "İlk öpücüğümüz buradaydı.",
    unread: true,
  },
  {
    id: "n4",
    kind: "system",
    text: "Yağmur Moda'ya yaklaşıyor",
    detail: "3 yağmur anın açılacak.",
    mood: "yagmurlu",
    timeAgo: "1 saat önce",
  },
  {
    id: "n5",
    kind: "trace",
    text: "Bir iz bıraktın",
    detail: "Şehir aldı.",
    district: "Moda Sahili",
    mood: "melankolik",
    timeAgo: "2 saat önce",
    memorySnippet: "Bu sokaktan geçerken hep aynı şarkı çalıyordu.",
  },
  {
    id: "n6",
    kind: "discover",
    text: "Yakınında gizli bir anı açıldı",
    detail: "Birinin sustuğu bir cümle.",
    district: "Üsküdar",
    mood: "gizemli",
    timeAgo: "4 saat önce",
  },
  {
    id: "n7",
    kind: "resonance",
    text: "Anın bu hafta Kadıköy'de trend",
    detail: "112 kişi hissetti, 27 kişi sakladı.",
    district: "Kadıköy",
    mood: "nostaljik",
    timeAgo: "dün",
    memorySnippet: "Bir kahvenin ardından unutulmamış bir cümle.",
    count: 112,
  },
  {
    id: "n8",
    kind: "react",
    text: "Üç kişi anına dokundu",
    district: "Karaköy",
    mood: "gece",
    timeAgo: "2 gün önce",
    memorySnippet: "Gece 02:13'te bırakılmış kısa bir ses.",
  },
  {
    id: "n9",
    kind: "system",
    text: "Gece anıları açıldı",
    detail: "Saat 00:00 — şehrin sessiz tarafları parladı.",
    mood: "gece",
    timeAgo: "3 gün önce",
  },
  {
    id: "n10",
    kind: "save",
    text: "Bir anın 'Sahil Sessizliği' rozetine yaklaşıyor",
    detail: "İki anı daha bırakırsan açılır.",
    mood: "huzurlu",
    timeAgo: "1 hafta önce",
  },
];

export function notifKindLabel(kind: NotifKind): string {
  switch (kind) {
    case "resonance": return "rezonans";
    case "save":      return "saklandı";
    case "react":     return "dokunuldu";
    case "discover":  return "keşfedildi";
    case "trace":     return "iz";
    case "system":    return "şehir";
  }
}
