import type { MoodKey } from "./moodPalette";

export type DistrictSide = "anadolu" | "avrupa";

export type District = {
  id: string;
  name: string;
  side: DistrictSide;
  lng: number;
  lat: number;
  primaryMood: MoodKey;
  secondaryMood?: MoodKey;
  intensity: number; // 0..1 — controls heatmap zone scale + count
  signature: string; // short descriptor for UI
};

export type MemoryType =
  | "text"
  | "sound"
  | "confession"
  | "secret"
  | "night-only"
  | "rain-only"
  | "rare"
  | "popular";

export type MemoryVisibility = "open" | "locked";

export type Memory = {
  id: string;
  text: string;
  mood: MoodKey;
  district: string;
  districtId: string;
  type: MemoryType;
  hasSound?: boolean;
  isNight?: boolean;
  isRain?: boolean;
  popular?: boolean;
  rare?: boolean;
  time: string; // hh:mm
  timeAgo: string; // "5dk", "2sa", "dün", "3 gün"
  lng: number;
  lat: number;
  likes: number;
  visibility: MemoryVisibility;
};

// ────────────────────────────────────────────────────────────────────────────
// Districts — 32 across both sides of the Bosphorus
// ────────────────────────────────────────────────────────────────────────────

export const districts: District[] = [
  // ── Anadolu yakası ──
  { id: "moda",          name: "Moda",            side: "anadolu", lng: 29.0276, lat: 40.9853, primaryMood: "romantik",   secondaryMood: "melankolik", intensity: 0.95, signature: "romantik · melankolik" },
  { id: "kadikoy",       name: "Kadıköy",         side: "anadolu", lng: 29.0244, lat: 40.9923, primaryMood: "yorgun",     secondaryMood: "nostaljik",  intensity: 0.92, signature: "yorgun · nostaljik" },
  { id: "yeldegirmeni",  name: "Yeldeğirmeni",    side: "anadolu", lng: 29.0285, lat: 40.9974, primaryMood: "nostaljik",  secondaryMood: "gizemli",    intensity: 0.78, signature: "nostaljik" },
  { id: "uskudar",       name: "Üsküdar",         side: "anadolu", lng: 29.0155, lat: 41.0244, primaryMood: "huzurlu",    secondaryMood: "nostaljik",  intensity: 0.85, signature: "huzurlu · nostaljik" },
  { id: "kuzguncuk",     name: "Kuzguncuk",       side: "anadolu", lng: 29.0341, lat: 41.0345, primaryMood: "nostaljik",  secondaryMood: "huzurlu",    intensity: 0.6,  signature: "nostaljik" },
  { id: "cengelkoy",     name: "Çengelköy",       side: "anadolu", lng: 29.0574, lat: 41.0461, primaryMood: "huzurlu",    secondaryMood: "sakin",      intensity: 0.5,  signature: "huzurlu" },
  { id: "kalamis",       name: "Kalamış",         side: "anadolu", lng: 29.0397, lat: 40.9772, primaryMood: "sakin",                                   intensity: 0.55, signature: "sakin" },
  { id: "fenerbahce",    name: "Fenerbahçe",      side: "anadolu", lng: 29.0397, lat: 40.9716, primaryMood: "yalniz",     secondaryMood: "melankolik", intensity: 0.5,  signature: "yalnız · melankolik" },
  { id: "bagdat",        name: "Bağdat Caddesi",  side: "anadolu", lng: 29.0608, lat: 40.9700, primaryMood: "heyecanli",  secondaryMood: "yogun",      intensity: 0.8,  signature: "sosyal · enerjik" },
  { id: "caddebostan",   name: "Caddebostan",     side: "anadolu", lng: 29.0654, lat: 40.9692, primaryMood: "yogun",      secondaryMood: "yorgun",     intensity: 0.78, signature: "yoğun · yorgun" },
  { id: "suadiye",       name: "Suadiye",         side: "anadolu", lng: 29.0749, lat: 40.9625, primaryMood: "yorgun",                                  intensity: 0.5,  signature: "yorgun" },
  { id: "bostanci",      name: "Bostancı",        side: "anadolu", lng: 29.0964, lat: 40.9542, primaryMood: "huzurlu",                                 intensity: 0.45, signature: "huzurlu" },
  { id: "maltepe",       name: "Maltepe",         side: "anadolu", lng: 29.1310, lat: 40.9350, primaryMood: "sakin",                                   intensity: 0.4,  signature: "sakin" },
  { id: "kartal",        name: "Kartal",          side: "anadolu", lng: 29.1840, lat: 40.9050, primaryMood: "yorgun",                                  intensity: 0.4,  signature: "yorgun" },
  { id: "atasehir",      name: "Ataşehir",        side: "anadolu", lng: 29.1030, lat: 40.9920, primaryMood: "yogun",      secondaryMood: "karmasik",   intensity: 0.65, signature: "yoğun · karmaşık" },
  { id: "kosuyolu",      name: "Koşuyolu",        side: "anadolu", lng: 29.0460, lat: 41.0070, primaryMood: "huzurlu",                                 intensity: 0.45, signature: "huzurlu" },
  { id: "acibadem",      name: "Acıbadem",        side: "anadolu", lng: 29.0432, lat: 40.9994, primaryMood: "yorgun",                                  intensity: 0.4,  signature: "yorgun" },

  // ── Avrupa yakası ──
  { id: "besiktas",      name: "Beşiktaş",        side: "avrupa", lng: 29.0080, lat: 41.0430, primaryMood: "heyecanli",   secondaryMood: "karmasik",   intensity: 0.95, signature: "enerjik · karmaşık" },
  { id: "karakoy",       name: "Karaköy",         side: "avrupa", lng: 28.9783, lat: 41.0265, primaryMood: "gece",        secondaryMood: "gizemli",    intensity: 0.85, signature: "gece · yaratıcı" },
  { id: "galata",        name: "Galata",          side: "avrupa", lng: 28.9740, lat: 41.0258, primaryMood: "nostaljik",   secondaryMood: "gizemli",    intensity: 0.9,  signature: "nostaljik · gizemli" },
  { id: "taksim",        name: "Taksim",          side: "avrupa", lng: 28.9856, lat: 41.0370, primaryMood: "karmasik",    secondaryMood: "gece",       intensity: 0.9,  signature: "karmaşık · gece" },
  { id: "nisantasi",     name: "Nişantaşı",       side: "avrupa", lng: 28.9920, lat: 41.0490, primaryMood: "melankolik",  secondaryMood: "yalniz",     intensity: 0.7,  signature: "zarif · melankolik" },
  { id: "ortakoy",       name: "Ortaköy",         side: "avrupa", lng: 29.0270, lat: 41.0550, primaryMood: "romantik",    secondaryMood: "huzurlu",    intensity: 0.75, signature: "romantik" },
  { id: "bebek",         name: "Bebek",           side: "avrupa", lng: 29.0440, lat: 41.0780, primaryMood: "romantik",    secondaryMood: "sakin",      intensity: 0.7,  signature: "romantik · sakin" },
  { id: "eminonu",       name: "Eminönü",         side: "avrupa", lng: 28.9740, lat: 41.0177, primaryMood: "yorgun",      secondaryMood: "yogun",      intensity: 0.85, signature: "yorgun · yoğun" },
  { id: "fatih",         name: "Fatih",           side: "avrupa", lng: 28.9490, lat: 41.0200, primaryMood: "nostaljik",   secondaryMood: "gizemli",    intensity: 0.7,  signature: "nostaljik" },
  { id: "balat",         name: "Balat",           side: "avrupa", lng: 28.9430, lat: 41.0290, primaryMood: "nostaljik",   secondaryMood: "gizemli",    intensity: 0.75, signature: "nostaljik · gizli" },
  { id: "bakirkoy",      name: "Bakırköy",        side: "avrupa", lng: 28.8700, lat: 40.9840, primaryMood: "sakin",                                    intensity: 0.45, signature: "sakin" },
  { id: "florya",        name: "Florya",          side: "avrupa", lng: 28.7970, lat: 40.9740, primaryMood: "sakin",       secondaryMood: "huzurlu",    intensity: 0.4,  signature: "sakin" },
  { id: "zeytinburnu",   name: "Zeytinburnu",     side: "avrupa", lng: 28.9100, lat: 40.9940, primaryMood: "yorgun",                                   intensity: 0.4,  signature: "yorgun" },
  { id: "sisli",         name: "Şişli",           side: "avrupa", lng: 28.9890, lat: 41.0600, primaryMood: "yogun",       secondaryMood: "karmasik",   intensity: 0.7,  signature: "yoğun · karmaşık" },
  { id: "levent",        name: "Levent",          side: "avrupa", lng: 29.0140, lat: 41.0800, primaryMood: "yorgun",      secondaryMood: "karmasik",   intensity: 0.65, signature: "yorgun" },
  { id: "maslak",        name: "Maslak",          side: "avrupa", lng: 29.0240, lat: 41.1100, primaryMood: "yorgun",                                   intensity: 0.4,  signature: "yorgun" },
  { id: "sariyer",       name: "Sarıyer",         side: "avrupa", lng: 29.0580, lat: 41.1650, primaryMood: "huzurlu",     secondaryMood: "yalniz",     intensity: 0.5,  signature: "huzurlu · uzak" },
];

export const districtById = (id: string) => districts.find((d) => d.id === id);
export const districtByName = (name: string) =>
  districts.find((d) => d.name === name);

// ────────────────────────────────────────────────────────────────────────────
// Memories — curated set distributed across districts.
// Coordinates are jittered around each district's center deterministically.
// ────────────────────────────────────────────────────────────────────────────

type MemorySeed = {
  districtId: string;
  text: string;
  mood: MoodKey;
  type?: MemoryType;
  hasSound?: boolean;
  isNight?: boolean;
  isRain?: boolean;
  popular?: boolean;
  rare?: boolean;
  likes?: number;
  timeAgo?: string;
};

const memorySeeds: MemorySeed[] = [
  // Moda (8)
  { districtId: "moda", text: "Burada bekledim, gelmedi.", mood: "melankolik", likes: 92, timeAgo: "2sa" },
  { districtId: "moda", text: "Bu sokak gece daha güzel.", mood: "gece", type: "night-only", isNight: true, likes: 47, timeAgo: "dün" },
  { districtId: "moda", text: "İlk öpücüğümüz buradaydı.", mood: "romantik", type: "popular", popular: true, likes: 312, timeAgo: "3 gün" },
  { districtId: "moda", text: "Vapur sesi bir cümleyi yarıda kesti.", mood: "nostaljik", type: "sound", hasSound: true, likes: 73, timeAgo: "4sa" },
  { districtId: "moda", text: "Sahil bandında kalbimi unuttum.", mood: "romantik", likes: 41, timeAgo: "5sa" },
  { districtId: "moda", text: "Burada kendimi ilk defa hafif hissettim.", mood: "huzurlu", likes: 28, timeAgo: "dün" },
  { districtId: "moda", text: "Gece bu sokak benim sırdaşımdı.", mood: "gece", type: "night-only", isNight: true, likes: 22, timeAgo: "2 gün" },
  { districtId: "moda", text: "Bir bankta uzun zaman sustum.", mood: "yalniz", likes: 19, timeAgo: "6sa" },

  // Kadıköy (8)
  { districtId: "kadikoy", text: "Bütün gece yürüdüm, sabaha karşı buradaydım.", mood: "yorgun", type: "night-only", isNight: true, likes: 88, timeAgo: "12sa" },
  { districtId: "kadikoy", text: "Eski kitapçının önünde ilk kez gülümsedim.", mood: "nostaljik", likes: 64, timeAgo: "dün" },
  { districtId: "kadikoy", text: "Bir kahvenin ardından unutulmamış bir cümle.", mood: "melankolik", likes: 156, type: "popular", popular: true, timeAgo: "3 gün" },
  { districtId: "kadikoy", text: "Yağmurda bu durakta hep yalnız kaldım.", mood: "yagmurlu", type: "rain-only", isRain: true, likes: 31, timeAgo: "dün" },
  { districtId: "kadikoy", text: "Çocukluğumun simitçisi hâlâ burada.", mood: "nostaljik", likes: 112, timeAgo: "2 gün" },
  { districtId: "kadikoy", text: "Vapur iskelesinde kimse yalnız değildi.", mood: "huzurlu", type: "sound", hasSound: true, likes: 48, timeAgo: "5sa" },
  { districtId: "kadikoy", text: "Burada bir mektup hiç postalanmadı.", mood: "gizemli", type: "secret", likes: 21, timeAgo: "dün" },
  { districtId: "kadikoy", text: "Annemle son buluşmamız.", mood: "melankolik", likes: 207, timeAgo: "1 hafta" },

  // Yeldeğirmeni (3)
  { districtId: "yeldegirmeni", text: "Eski bir camın ardındaki ışık.", mood: "nostaljik", likes: 15, timeAgo: "3sa" },
  { districtId: "yeldegirmeni", text: "Antikacının vitrinine baktım, bir saat.", mood: "nostaljik", likes: 9, timeAgo: "dün" },
  { districtId: "yeldegirmeni", text: "Sokak müzisyeni Cem Karaca çaldı.", mood: "nostaljik", type: "sound", hasSound: true, likes: 73, timeAgo: "5sa" },

  // Üsküdar (4)
  { districtId: "uskudar", text: "Cami avlusunda nefes aldım.", mood: "huzurlu", likes: 54, timeAgo: "4sa" },
  { districtId: "uskudar", text: "Vapurdan inerken martıların sesi.", mood: "sakin", type: "sound", hasSound: true, likes: 38, timeAgo: "2sa" },
  { districtId: "uskudar", text: "Sabah ezanına bu sokak da uyanmıştı.", mood: "nostaljik", likes: 27, timeAgo: "8sa" },
  { districtId: "uskudar", text: "Burası sessiz değil, sadece konuşmayı bilmiyor.", mood: "yalniz", likes: 33, timeAgo: "dün" },

  // Kuzguncuk (2)
  { districtId: "kuzguncuk", text: "Renkli bir kapı, bir an için yabancı değildi.", mood: "nostaljik", likes: 16, timeAgo: "6sa" },
  { districtId: "kuzguncuk", text: "Eski ahşap evin önünden geçerken durdum.", mood: "huzurlu", likes: 12, timeAgo: "dün" },

  // Çengelköy (1)
  { districtId: "cengelkoy", text: "Boğazda dalga sesi yetti bana.", mood: "huzurlu", type: "sound", hasSound: true, likes: 22, timeAgo: "5sa" },

  // Beşiktaş (5)
  { districtId: "besiktas", text: "Kalabalıkta birine baktım, o da bakıyordu.", mood: "heyecanli", likes: 88, timeAgo: "3sa" },
  { districtId: "besiktas", text: "Stat çıkışında binlerce ses tek bir cümleydi.", mood: "karmasik", type: "popular", hasSound: true, popular: true, likes: 134, timeAgo: "dün" },
  { districtId: "besiktas", text: "Sahafta açtığım kitap eski bir mektup tuttu.", mood: "nostaljik", likes: 41, timeAgo: "6sa" },
  { districtId: "besiktas", text: "Çarşıda iki insan birbirine küstü, bir an.", mood: "karmasik", likes: 19, timeAgo: "dün" },
  { districtId: "besiktas", text: "Burada bir şey unuttum, ne olduğunu unuttum.", mood: "gizemli", type: "rare", rare: true, likes: 8, timeAgo: "2 gün" },

  // Karaköy (4)
  { districtId: "karakoy", text: "Gece 02:13'te bırakılmış kısa bir ses.", mood: "gece", type: "sound", hasSound: true, isNight: true, likes: 96, timeAgo: "dün" },
  { districtId: "karakoy", text: "Bu sokakta bir mesaj hiç gönderilmemiş.", mood: "gizemli", type: "secret", likes: 33, timeAgo: "3 gün" },
  { districtId: "karakoy", text: "Köprü altında çalan müzisyenin sesi.", mood: "gece", type: "sound", hasSound: true, likes: 62, timeAgo: "8sa" },
  { districtId: "karakoy", text: "Burada bir karar verdim, paylaşmadım.", mood: "gizemli", type: "confession", likes: 21, timeAgo: "dün" },

  // Galata (4)
  { districtId: "galata", text: "Buradan geçerken hep aynı şarkı çalıyormuş.", mood: "nostaljik", likes: 78, timeAgo: "5sa" },
  { districtId: "galata", text: "Saat 6'da ışıklar yandığında birini özlemiştim.", mood: "melankolik", likes: 45, timeAgo: "dün" },
  { districtId: "galata", text: "Bir yabancıya yol tarif ettim, gözleri tanıdıktı.", mood: "gizemli", type: "rare", rare: true, likes: 14, timeAgo: "2 gün" },
  { districtId: "galata", text: "Kule gölgesinde bir resim çektirdik.", mood: "romantik", likes: 67, timeAgo: "6sa" },

  // Taksim (3)
  { districtId: "taksim", text: "Burada herkes biraz kayıp.", mood: "karmasik", likes: 142, type: "popular", popular: true, timeAgo: "2sa" },
  { districtId: "taksim", text: "Sokak çiçekçisinden bir tek gül aldım, kimseye vermedim.", mood: "yalniz", likes: 31, timeAgo: "dün" },
  { districtId: "taksim", text: "Cumartesi gecesi, biri dans ediyordu.", mood: "gece", isNight: true, likes: 56, timeAgo: "dün" },

  // Nişantaşı (2)
  { districtId: "nisantasi", text: "Vitrin önünde fazla durdum.", mood: "melankolik", likes: 23, timeAgo: "4sa" },
  { districtId: "nisantasi", text: "Bir kafede yalnızca masaya baktım.", mood: "yalniz", likes: 18, timeAgo: "dün" },

  // Ortaköy (2)
  { districtId: "ortakoy", text: "Köprü ışıklarına baktık uzun süre.", mood: "romantik", likes: 89, timeAgo: "8sa" },
  { districtId: "ortakoy", text: "Cami önünde çay söyledik, susmadık.", mood: "huzurlu", likes: 32, timeAgo: "dün" },

  // Bebek (2)
  { districtId: "bebek", text: "Sahil bandında yürürken kalbimi unuttum.", mood: "romantik", likes: 75, timeAgo: "5sa" },
  { districtId: "bebek", text: "Bir kayık şarkı söylüyordu uzaktan.", mood: "sakin", type: "sound", hasSound: true, likes: 43, timeAgo: "dün" },

  // Eminönü (2)
  { districtId: "eminonu", text: "Simitçinin kokusu hâlâ tekrar ediyor.", mood: "nostaljik", likes: 29, timeAgo: "3sa" },
  { districtId: "eminonu", text: "Vapur iskelesinde kalabalık sustu bir an.", mood: "yogun", type: "sound", hasSound: true, likes: 38, timeAgo: "6sa" },

  // Fatih (2)
  { districtId: "fatih", text: "Eski bir kütüphanenin merdivenlerinde.", mood: "nostaljik", likes: 22, timeAgo: "dün" },
  { districtId: "fatih", text: "Burada saat farklı işliyor.", mood: "gizemli", type: "rare", rare: true, likes: 11, timeAgo: "2 gün" },

  // Balat (3)
  { districtId: "balat", text: "Renkli bir evin önünde durdum.", mood: "nostaljik", likes: 56, timeAgo: "4sa" },
  { districtId: "balat", text: "Bir kapının ardından çocuk sesi geldi.", mood: "gizemli", type: "sound", hasSound: true, likes: 24, timeAgo: "dün" },
  { districtId: "balat", text: "Sokak kedisi beni izledi.", mood: "huzurlu", likes: 18, timeAgo: "dün" },

  // Bakırköy (1)
  { districtId: "bakirkoy", text: "Sahilde rüzgâr.", mood: "sakin", likes: 14, timeAgo: "5sa" },

  // Florya (1)
  { districtId: "florya", text: "Atatürk Köşkü'nün önünden geçtim, sessizdi.", mood: "sakin", likes: 11, timeAgo: "dün" },

  // Şişli (1)
  { districtId: "sisli", text: "Trafikte kornanın ritmi içinde uyukladım.", mood: "yogun", likes: 16, timeAgo: "3sa" },

  // Levent (2)
  { districtId: "levent", text: "Cam binaların gölgesinde küçük hissettim.", mood: "yorgun", likes: 27, timeAgo: "4sa" },
  { districtId: "levent", text: "İş çıkışı kalabalığında biri ağladı.", mood: "melankolik", likes: 41, timeAgo: "dün" },

  // Maslak (1)
  { districtId: "maslak", text: "Burada günler birbirinin tekrarı.", mood: "yorgun", likes: 19, timeAgo: "2 gün" },

  // Sarıyer (2)
  { districtId: "sariyer", text: "Boğaz kıyısında kimsesiz bir akşam.", mood: "yalniz", likes: 33, timeAgo: "dün" },
  { districtId: "sariyer", text: "Bir balıkçının ağını tamir etmesi.", mood: "huzurlu", likes: 21, timeAgo: "5sa" },

  // Koşuyolu (1)
  { districtId: "kosuyolu", text: "Parkta koştum, kalbim duydu beni.", mood: "umutlu", likes: 28, timeAgo: "8sa" },

  // Acıbadem (1)
  { districtId: "acibadem", text: "Hastane kapısından çıkışın hafifliği.", mood: "umutlu", likes: 47, timeAgo: "dün" },

  // Bağdat (3)
  { districtId: "bagdat", text: "Cuma akşamı, herkes biriyle.", mood: "heyecanli", likes: 58, timeAgo: "dün" },
  { districtId: "bagdat", text: "Bir mağaza vitrini, gözüm doldu.", mood: "melankolik", likes: 23, timeAgo: "3sa" },
  { districtId: "bagdat", text: "Caddebostan'a doğru yürürken arkadaşımı buldum.", mood: "mutlu", likes: 65, timeAgo: "6sa" },

  // Caddebostan (3)
  { districtId: "caddebostan", text: "Yağmur sonrası asfaltın kokusu.", mood: "yagmurlu", type: "rain-only", isRain: true, likes: 41, timeAgo: "dün" },
  { districtId: "caddebostan", text: "Sahilde paten kayan çocuk.", mood: "mutlu", likes: 29, timeAgo: "5sa" },
  { districtId: "caddebostan", text: "Sahil yürüyüşü, kimse yok.", mood: "huzurlu", isNight: true, type: "night-only", likes: 28, timeAgo: "dün" },

  // Suadiye (1)
  { districtId: "suadiye", text: "Sahilde mango dondurma.", mood: "mutlu", likes: 22, timeAgo: "4sa" },

  // Bostancı (1)
  { districtId: "bostanci", text: "Vapur kalkarken martı bağırdı.", mood: "sakin", type: "sound", hasSound: true, likes: 18, timeAgo: "8sa" },

  // Maltepe (1)
  { districtId: "maltepe", text: "Sahilde yürürken sis bana kavuştu.", mood: "sakin", likes: 16, timeAgo: "dün" },

  // Kartal (1)
  { districtId: "kartal", text: "Adalar'a baktım, sabah.", mood: "huzurlu", likes: 19, timeAgo: "6sa" },

  // Ataşehir (1)
  { districtId: "atasehir", text: "Plaza çıkışında bir grup kahkaha attı.", mood: "heyecanli", likes: 14, timeAgo: "3sa" },

  // Kalamış (2)
  { districtId: "kalamis", text: "Vapur kornası — şehrin nefesi.", mood: "sakin", type: "sound", hasSound: true, likes: 92, timeAgo: "8sa" },
  { districtId: "kalamis", text: "Pazar günü, vapur sessiz.", mood: "sakin", likes: 12, timeAgo: "dün" },

  // Fenerbahçe (2)
  { districtId: "fenerbahce", text: "Burada uzun zaman sustum.", mood: "yalniz", likes: 22, timeAgo: "5sa" },
  { districtId: "fenerbahce", text: "Çocukluğumun parkı, kimse yok artık.", mood: "melankolik", likes: 41, timeAgo: "dün" },

  // Zeytinburnu (1)
  { districtId: "zeytinburnu", text: "Sahil yolu, otobüs, kimse konuşmadı.", mood: "yorgun", likes: 9, timeAgo: "dün" },
];

// ────────────────────────────────────────────────────────────────────────────
// Seeded random — deterministic between SSR and client (no hydration mismatch)
// ────────────────────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260512);

function deriveType(seed: MemorySeed): MemoryType {
  if (seed.type) return seed.type;
  if (seed.popular) return "popular";
  if (seed.rare) return "rare";
  if (seed.hasSound) return "sound";
  if (seed.isNight) return "night-only";
  if (seed.isRain) return "rain-only";
  return "text";
}

function deriveVisibility(type: MemoryType): MemoryVisibility {
  switch (type) {
    case "night-only":
    case "rain-only":
    case "secret":
    case "confession":
    case "rare":
      return "locked";
    default:
      return "open";
  }
}

function timeFromAgo(ago?: string): string {
  // Decorative only — derive a plausible hh:mm
  if (!ago) return "—";
  if (ago.includes("dk")) return "şimdi";
  if (ago.includes("sa")) return "bugün";
  if (ago === "dün") return "dün";
  return ago;
}

export const memories: Memory[] = memorySeeds.map((seed, i) => {
  const d = districts.find((x) => x.id === seed.districtId)!;
  const type = deriveType(seed);
  const visibility = deriveVisibility(type);
  const lng = d.lng + (rng() - 0.5) * 0.009;
  const lat = d.lat + (rng() - 0.5) * 0.006;
  return {
    id: `m${i + 1}`,
    text: seed.text,
    mood: seed.mood,
    district: d.name,
    districtId: d.id,
    type,
    hasSound: seed.hasSound,
    isNight: seed.isNight,
    isRain: seed.isRain,
    popular: seed.popular,
    rare: seed.rare,
    time: timeFromAgo(seed.timeAgo),
    timeAgo: seed.timeAgo ?? "şimdi",
    lng,
    lat,
    likes: seed.likes ?? Math.floor(rng() * 80) + 5,
    visibility,
  };
});

// Helpers
export function memoriesInDistrict(districtId: string) {
  return memories.filter((m) => m.districtId === districtId);
}

export function countByDistrict(districtId: string) {
  return memoriesInDistrict(districtId).length;
}

export const ISTANBUL_CENTER = { lng: 29.0, lat: 41.025 } as const;
export const KADIKOY_CENTER = { lng: 29.04, lat: 40.985 } as const;
