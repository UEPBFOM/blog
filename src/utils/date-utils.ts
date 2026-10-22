import { SITE_TIMEZONE } from "../constants/constants";

export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

export function getDateParts(date: Date): Record<string, string> {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: SITE_TIMEZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	}).formatToParts(date);
	return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function formatPostDate(date: Date, hasTime = false): string {
	if (!hasTime) return formatDateToYYYYMMDD(date);
	const p = getDateParts(date);
	return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}
