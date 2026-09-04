import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  SoundContext,
  type SoundEffect,
} from "./SoundContext";

const ENABLED_KEY = "koi-sound-enabled";
const SOUND_VOLUME = 0.35;

function loadEnabled() {
  return localStorage.getItem(ENABLED_KEY) === "true";
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(loadEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const enabledRef = useRef(enabled);

  const ensureAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const context = new AudioContext();
      const masterGain = context.createGain();
      masterGain.gain.value = SOUND_VOLUME;
      masterGain.connect(context.destination);
      audioContextRef.current = context;
      masterGainRef.current = masterGain;
    }

    const context = audioContextRef.current;
    if (context.state === "suspended") void context.resume();
    return context;
  }, []);

  const stopAmbience = useCallback(() => {
    ambienceRef.current?.pause();
  }, []);

  const startAmbience = useCallback(() => {
    if (!ambienceRef.current) {
      const ambience = new Audio("/audio/river-in-the-forest-with-birds.mp3");
      ambience.loop = true;
      ambience.preload = "auto";
      ambienceRef.current = ambience;
    }

    ambienceRef.current.volume = SOUND_VOLUME * 0.65;
    void ambienceRef.current.play().catch(() => {
      // The next explicit click on the sound button will retry playback.
    });
  }, []);

  const playEffect = useCallback(
    (effect: SoundEffect) => {
      if (!enabledRef.current) return;

      const context = ensureAudio();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const tones = {
        click: [480, 340, 0.045],
        success: [620, 920, 0.16],
        error: [240, 150, 0.2],
      } as const;
      const [startFrequency, endFrequency, duration] = tones[effect];

      oscillator.type = effect === "error" ? "sawtooth" : "sine";
      oscillator.frequency.setValueAtTime(startFrequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
      gain.gain.setValueAtTime(effect === "click" ? 0.22 : 0.34, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain);
      gain.connect(masterGainRef.current as GainNode);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [ensureAudio],
  );

  const setEnabled = useCallback(
    (nextEnabled: boolean) => {
      if (nextEnabled) {
        const context = ensureAudio();
        void context.resume();
        startAmbience();
      }
      enabledRef.current = nextEnabled;
      setEnabledState(nextEnabled);
    },
    [ensureAudio, startAmbience],
  );

  useEffect(() => {
    enabledRef.current = enabled;
    localStorage.setItem(ENABLED_KEY, String(enabled));
    if (enabled) startAmbience();
    else stopAmbience();
  }, [enabled, startAmbience, stopAmbience]);

  useEffect(() => {
    const handleButtonClick = (event: MouseEvent) => {
      const button = (event.target as Element).closest("button");
      if (button && !button.hasAttribute("data-sound-ignore")) {
        playEffect("click");
      }
    };
    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, [playEffect]);

  useEffect(
    () => () => {
      stopAmbience();
      ambienceRef.current = null;
      void audioContextRef.current?.close();
    },
    [stopAmbience],
  );

  const value = useMemo(
    () => ({ enabled, setEnabled, playEffect }),
    [enabled, setEnabled, playEffect],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
