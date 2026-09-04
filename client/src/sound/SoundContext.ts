import { createContext, useContext } from "react";

export type SoundEffect = "click" | "success" | "error";

export interface SoundContextValue {
  enabled: boolean;
  volume: number;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  playEffect: (effect: SoundEffect) => void;
}

export const SoundContext = createContext<SoundContextValue | null>(null);

export function useSound(): SoundContextValue {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used inside SoundProvider");
  }

  return context;
}
