export type LightPreset = "dawn" | "day" | "dusk" | "night";

export function getLightPresetForHour(hour: number): LightPreset {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

export function getCurrentLightPreset(): LightPreset {
  return getLightPresetForHour(new Date().getHours());
}

export function getCityTimeLabel(hour: number): string {
  if (hour >= 5 && hour < 8) return "şafak";
  if (hour >= 8 && hour < 12) return "sabah";
  if (hour >= 12 && hour < 17) return "öğleden sonra";
  if (hour >= 17 && hour < 20) return "alacakaranlık";
  if (hour >= 20 && hour < 23) return "akşam";
  return "gece";
}
