import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "./SoundContext";

export default function SoundControl() {
  const { enabled, volume, setEnabled, setVolume, playEffect } = useSound();

  const toggleSound = () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    if (nextEnabled) playEffect("success");
  };

  return (
    <div className="sound-control">
      <button
        type="button"
        data-sound-ignore
        className={enabled ? "active" : ""}
        aria-label={enabled ? "Mute sound" : "Enable sound"}
        aria-pressed={enabled}
        title={enabled ? "Mute sound" : "Enable sound"}
        onClick={toggleSound}
      >
        {enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        disabled={!enabled}
        aria-label="Sound volume"
        onChange={(event) => setVolume(Number(event.target.value))}
      />
    </div>
  );
}
