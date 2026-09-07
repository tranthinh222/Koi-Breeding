import type { IPond } from "../types/backend";

export type PondAlert = {
	severity: "warning" | "critical";
	issues: string[];
	message: string;
};

export function getPondAlert(pond: IPond): PondAlert | null {
	const critical: string[] = [];
	const warning: string[] = [];

	if (pond.pH < 6.5 || pond.pH > 8.5) critical.push(`pH ${pond.pH}`);
	else if (pond.pH < 6.8 || pond.pH > 8) warning.push(`pH ${pond.pH}`);

	if (pond.temperature < 15 || pond.temperature > 30) critical.push(`temperature ${pond.temperature}°C`);
	else if (pond.temperature < 20 || pond.temperature > 28) warning.push(`temperature ${pond.temperature}°C`);

	if (pond.oxygen < 4 || pond.oxygen > 12) critical.push(`oxygen ${pond.oxygen} mg/L`);
	else if (pond.oxygen < 5 || pond.oxygen > 10) warning.push(`oxygen ${pond.oxygen} mg/L`);

	if (pond.waterQuality <= 20) critical.push(`water quality ${pond.waterQuality}/100`);
	else if (pond.waterQuality <= 40) warning.push(`water quality ${pond.waterQuality}/100`);

	const issues = [...critical, ...warning];
	if (issues.length === 0) return null;
	const severity = critical.length > 0 ? "critical" : "warning";
	return {
		severity,
		issues,
		message: `${severity === "critical" ? "Critical pond conditions" : "Pond conditions need attention"}: ${issues.join(", ")}.`,
	};
}
