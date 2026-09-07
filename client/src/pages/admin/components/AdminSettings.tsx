import { Bell, LayoutDashboard, MoonStar, SlidersHorizontal, SunMedium } from "lucide-react";

export interface AdminPreferences {
	notifications: boolean;
	compactTables: boolean;
}

interface Props {
	theme: "light" | "dark";
	onThemeChange: (theme: "light" | "dark") => void;
	preferences: AdminPreferences;
	onPreferencesChange: (value: AdminPreferences) => void;
}

export default function AdminSettings({ theme, onThemeChange, preferences, onPreferencesChange }: Props) {
	const update = (key: keyof AdminPreferences, checked: boolean) =>
		onPreferencesChange({ ...preferences, [key]: checked });

	return (
		<div className="settings-page admin-settings-view">
			<div className="page-heading">
				<div><p className="eyebrow">Workspace</p><h1>Admin preferences</h1><p>Personalize how the console looks and behaves on this device.</p></div>
				<span className="settings-saved-badge">Saved automatically</span>
			</div>
			<div className="settings-grid">
				<article className="settings-card settings-card-inline">
					<div className="settings-header"><div><p className="eyebrow">Appearance</p><h2>Display mode</h2></div><SlidersHorizontal size={19} /></div>
					<p>Choose the contrast that is most comfortable for your workspace.</p>
					<div className="settings-toggle-row" role="group" aria-label="Display mode">
						<button type="button" className={`settings-toggle ${theme === "light" ? "is-active" : ""}`} onClick={() => onThemeChange("light")}><SunMedium size={17} />Light</button>
						<button type="button" className={`settings-toggle ${theme === "dark" ? "is-active" : ""}`} onClick={() => onThemeChange("dark")}><MoonStar size={17} />Dark</button>
					</div>
				</article>
				<article className="settings-card settings-card-inline">
					<div className="settings-header"><div><p className="eyebrow">Behavior</p><h2>Console experience</h2></div><LayoutDashboard size={19} /></div>
					<label className="settings-option"><span className="settings-option-copy"><Bell size={18} /><span><strong>Header notifications</strong><small>Show operational notifications in the admin header.</small></span></span><input type="checkbox" checked={preferences.notifications} onChange={(e) => update("notifications", e.target.checked)} /></label>
					<label className="settings-option"><span className="settings-option-copy"><LayoutDashboard size={18} /><span><strong>Compact data tables</strong><small>Reduce row height to see more records at once.</small></span></span><input type="checkbox" checked={preferences.compactTables} onChange={(e) => update("compactTables", e.target.checked)} /></label>
				</article>
			</div>
		</div>
	);
}
