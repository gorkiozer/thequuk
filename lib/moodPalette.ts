export type MoodEntry = {
  color: string;
  glow: string;
  soft: string;
  label: string;
  glyph: string;
};

export const moodPalette: Record<string, MoodEntry> = {
  // base / calm
  sakin:      { color: "#7FB8D9", glow: "rgba(127,184,217,0.42)", soft: "rgba(127,184,217,0.10)", label: "sakin",      glyph: "◐" },
  huzurlu:    { color: "#A3D9B8", glow: "rgba(163,217,184,0.38)", soft: "rgba(163,217,184,0.10)", label: "huzurlu",    glyph: "❍" },
  // warm
  romantik:   { color: "#E8A4B8", glow: "rgba(232,164,184,0.42)", soft: "rgba(232,164,184,0.12)", label: "romantik",   glyph: "♡" },
  umutlu:     { color: "#F2C09A", glow: "rgba(242,192,154,0.42)", soft: "rgba(242,192,154,0.12)", label: "umutlu",     glyph: "✧" },
  mutlu:      { color: "#F2C58F", glow: "rgba(242,197,143,0.42)", soft: "rgba(242,197,143,0.12)", label: "mutlu",      glyph: "✦" },
  heyecanli:  { color: "#F2D08F", glow: "rgba(242,208,143,0.42)", soft: "rgba(242,208,143,0.12)", label: "heyecanlı",  glyph: "✷" },
  // tired / heavy
  yorgun:     { color: "#C9A88F", glow: "rgba(201,168,143,0.36)", soft: "rgba(201,168,143,0.10)", label: "yorgun",     glyph: "◌" },
  melankolik: { color: "#8A93B5", glow: "rgba(138,147,181,0.40)", soft: "rgba(138,147,181,0.12)", label: "melankolik", glyph: "◔" },
  yalniz:     { color: "#8FA5D9", glow: "rgba(143,165,217,0.38)", soft: "rgba(143,165,217,0.10)", label: "yalnız",     glyph: "○" },
  // dense / chaotic
  yogun:      { color: "#E8A488", glow: "rgba(232,164,136,0.42)", soft: "rgba(232,164,136,0.12)", label: "yoğun",      glyph: "✦" },
  karmasik:   { color: "#E89A75", glow: "rgba(232,154,117,0.42)", soft: "rgba(232,154,117,0.12)", label: "karmaşık",   glyph: "≋" },
  // memory / mystery
  nostaljik:  { color: "#D9C088", glow: "rgba(217,192,136,0.40)", soft: "rgba(217,192,136,0.12)", label: "nostaljik",  glyph: "❉" },
  gece:       { color: "#A088E0", glow: "rgba(160,136,224,0.44)", soft: "rgba(160,136,224,0.12)", label: "gece",       glyph: "☾" },
  gizemli:    { color: "#7E70B5", glow: "rgba(126,112,181,0.42)", soft: "rgba(126,112,181,0.12)", label: "gizemli",    glyph: "◈" },
  yagmurlu:   { color: "#9BB8C9", glow: "rgba(155,184,201,0.38)", soft: "rgba(155,184,201,0.12)", label: "yağmurlu",   glyph: "❅" },
};

export type MoodKey = keyof typeof moodPalette;

export function getMood(key?: string): MoodEntry {
  if (!key) return moodPalette.sakin;
  return moodPalette[key] ?? moodPalette.sakin;
}

export const MOOD_COLOR_EXPRESSION: any = [
  "match",
  ["get", "mood"],
  "sakin",      moodPalette.sakin.color,
  "huzurlu",    moodPalette.huzurlu.color,
  "romantik",   moodPalette.romantik.color,
  "yorgun",     moodPalette.yorgun.color,
  "yogun",      moodPalette.yogun.color,
  "yalniz",     moodPalette.yalniz.color,
  "nostaljik",  moodPalette.nostaljik.color,
  "gece",       moodPalette.gece.color,
  "heyecanli",  moodPalette.heyecanli.color,
  "mutlu",      moodPalette.mutlu.color,
  "melankolik", moodPalette.melankolik.color,
  "gizemli",    moodPalette.gizemli.color,
  "umutlu",     moodPalette.umutlu.color,
  "karmasik",   moodPalette.karmasik.color,
  "yagmurlu",   moodPalette.yagmurlu.color,
  "#B388FF",
];
