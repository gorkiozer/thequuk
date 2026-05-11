import { districts, memories } from "./istanbulData";
import { getMood } from "./moodPalette";

export type CitySignal = {
  id: string;
  text: string;
  mood?: string;
};

// Generate a rotating set of poetic "live city signals" from the dataset.
// All deterministic so SSR and client agree.
export function generateCitySignals(): CitySignal[] {
  const signals: CitySignal[] = [];
  const ix = (n: number, mod: number) => Math.abs(Math.floor(Math.sin(n * 9301 + 49297) * 233280)) % mod;

  // Per-district lookups
  for (let i = 0; i < districts.length; i++) {
    const d = districts[i];
    const list = memories.filter((m) => m.districtId === d.id);
    if (list.length === 0) continue;

    const sounds = list.filter((m) => m.hasSound).length;
    const nights = list.filter((m) => m.isNight).length;
    const rare = list.filter((m) => m.rare).length;

    // Pick one signal template per district based on data shape
    if (sounds > 1) {
      signals.push({
        id: `s-${d.id}-sound`,
        text: `${d.name}'ta sesli anılar artıyor.`,
        mood: d.primaryMood,
      });
    } else if (nights > 0) {
      signals.push({
        id: `s-${d.id}-night`,
        text: `${d.name} çevresinde gece anıları yoğunlaştı.`,
        mood: "gece",
      });
    } else if (rare > 0) {
      signals.push({
        id: `s-${d.id}-rare`,
        text: `${d.name}'ta nadir bir anı parladı.`,
        mood: d.primaryMood,
      });
    } else if (d.intensity > 0.7) {
      const mins = 4 + ix(i * 7, 18);
      signals.push({
        id: `s-${d.id}-active`,
        text: `${d.name}'da ${mins} dakikadır yeni bir anı parlıyor.`,
        mood: d.primaryMood,
      });
    } else if (d.intensity < 0.5) {
      signals.push({
        id: `s-${d.id}-calm`,
        text: `${d.name} bugün daha sakin.`,
        mood: "sakin",
      });
    } else {
      const mood = getMood(d.primaryMood);
      signals.push({
        id: `s-${d.id}-feel`,
        text: `${d.name} şu an ${mood.label} hissediyor.`,
        mood: d.primaryMood,
      });
    }
  }

  // Mix in a few "ambient" signals
  signals.push({ id: "amb-rain", text: "Kadıköy'de yağmur anıları kapalı.", mood: "yagmurlu" });
  signals.push({ id: "amb-night", text: "Gece anıları 00:00 sonrası açılacak.", mood: "gece" });

  return signals;
}
