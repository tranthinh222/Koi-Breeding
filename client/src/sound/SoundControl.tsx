import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "./SoundContext";

export default function SoundControl() {
  const { enabled, setEnabled, playEffect } = useSound();

  const toggleSound = () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    if (nextEnabled) playEffect("success");
  };

  return (
    <button
      type="button"
      data-sound-ignore
      className={`sound-control ${enabled ? "active" : ""}`}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      aria-pressed={enabled}
      title={enabled ? "Mute sound" : "Enable sound"}
      onClick={toggleSound}
    >
      {enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
    </button>
  );
}
