export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

export function formatPostDate(date: Date, hasTime = false): string {
	if (!hasTime) return formatDateToYYYYMMDD(date);
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Taipei",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	}).formatToParts(date);
	const value = (type: string) =>
		parts.find((part) => part.type === type)?.value;
	return `${value("year")}-${value("month")}-${value("day")} ${value("hour")}:${value("minute")}`;
}
