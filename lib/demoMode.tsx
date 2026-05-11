"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type DemoMode = {
  night: boolean;
  rain: boolean;
  walk: boolean;
  density: number; // 0.2 .. 1.0 — fraction of memories to display
  setNight: (v: boolean) => void;
  setRain: (v: boolean) => void;
  setWalk: (v: boolean) => void;
  setDensity: (v: number) => void;
};

const Ctx = createContext<DemoMode | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [night, setNight] = useState(false);
  const [rain, setRain] = useState(false);
  const [walk, setWalk] = useState(true);
  const [density, setDensity] = useState(1.0);

  const value = useMemo(
    () => ({ night, rain, walk, density, setNight, setRain, setWalk, setDensity }),
    [night, rain, walk, density]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoMode(): DemoMode {
  const v = useContext(Ctx);
  if (!v) {
    // Reasonable defaults when consumed outside a provider
    return {
      night: false,
      rain: false,
      walk: true,
      density: 1.0,
      setNight: () => {},
      setRain: () => {},
      setWalk: () => {},
      setDensity: () => {},
    };
  }
  return v;
}
