import type { MoodKey } from "./moodPalette";

export type CityWhisper = {
  id: string;
  text: string;
  district?: string;
  hint?: string;
  mood: MoodKey;
  timeWindow?: string;
};

// Hand-curated whispers — what the city is telling you today.
// Order matters: most atmospheric first, gentle late-night nudges deeper down.
export const cityWhispers: CityWhisper[] = [
  {
    id: "galata-quiet",
    text: "Galata bu gece sessiz. Bir not bırakırsan duyulur.",
    district: "Galata",
    mood: "gizemli",
  },
  {
    id: "rain-approaching",
    text: "Yağmur Moda'ya yaklaşıyor — birkaç eski anı uyanmak üzere.",
    district: "Moda",
    hint: "yağmur anıları açılacak",
    mood: "yagmurlu",
  },
  {
    id: "iskele",
    text: "Kadıköy iskelesinde biri iki saattir yalnız.",
    district: "Kadıköy",
    mood: "yalniz",
  },
  {
    id: "midnight-open",
    text: "Saat 03:00 yaklaşıyor. Bir anının açılma vakti var.",
    timeWindow: "00:00 — 03:00",
    mood: "gece",
  },
  {
    id: "bostanci-bench",
    text: "Bostancı'da kimsenin durmadığı bir bank şu an parlak.",
    district: "Bostancı",
    mood: "huzurlu",
  },
  {
    id: "besiktas-secret",
    text: "Birinin söyleyemediği bir şey Beşiktaş'ta gizlenmiş.",
    district: "Beşiktaş",
    hint: "yakına gittiğinde açılır",
    mood: "gizemli",
  },
  {
    id: "uskudar-morning",
    text: "Üsküdar bu sabah daha sakin, ezana yaklaşırken.",
    district: "Üsküdar",
    mood: "huzurlu",
  },
  {
    id: "karakoy-dense",
    text: "Karaköy'de gece anıları yoğunlaştı — bir şey hatırlıyor.",
    district: "Karaköy",
    mood: "gece",
  },
  {
    id: "bagdat-still",
    text: "Bağdat caddesinde herkes bir yere gidiyor — biri durmuş.",
    district: "Caddebostan",
    mood: "yogun",
  },
  {
    id: "rain-quiet",
    text: "Yağmur başladığında bazı sokaklar konuşmaya başlayacak.",
    hint: "şehir hava değişimini bekliyor",
    mood: "yagmurlu",
  },
];
