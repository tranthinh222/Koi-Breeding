import { Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "./ThemeContext";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Night", icon: Moon },
];

export default function ThemeControl() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="theme-control" aria-label="Appearance">
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <button
          type="button"
          key={value}
          className={preference === value ? "active" : ""}
          aria-label={`${label} theme`}
          aria-pressed={preference === value}
          title={`${label} theme`}
          onClick={() => setPreference(value)}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
