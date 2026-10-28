// Sums Claude Code token usage per day into src/data/token-usage.json.
// Usage: pnpm usage
// Reads the local transcripts in ~/.claude/projects (only the token counts, never
// message content or project names). Claude Code deletes old transcripts, so days
// already in the JSON are kept and only the days found in this scan are replaced.
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const ROOT = path.join(os.homedir(), ".claude", "projects");
const OUT = path.join("src", "data", "token-usage.json");
const TIME_ZONE = "Asia/Shanghai";

const dayOf = new Intl.DateTimeFormat("en-CA", {
	timeZone: TIME_ZONE,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

async function* transcripts(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* transcripts(full);
		else if (entry.name.endsWith(".jsonl")) yield full;
	}
}

// One API response can be written as several lines; keep a single usage per response.
const responses = new Map();
for await (const file of transcripts(ROOT)) {
	for (const line of (await readFile(file, "utf8")).split("\n")) {
		if (!line.includes('"usage"')) continue;
		let row;
		try {
			row = JSON.parse(line);
		} catch {
			continue;
		}
		const usage = row.message?.usage;
		if (row.type !== "assistant" || !usage || !row.timestamp) continue;
		const key = `${row.message.id ?? row.uuid}:${row.requestId ?? ""}`;
		responses.set(key, {
			day: dayOf.format(new Date(row.timestamp)),
			input: usage.input_tokens ?? 0,
			output: usage.output_tokens ?? 0,
			cacheWrite: usage.cache_creation_input_tokens ?? 0,
			cacheRead: usage.cache_read_input_tokens ?? 0,
		});
	}
}

const scanned = {};
for (const r of responses.values()) {
	const d = (scanned[r.day] ??= {
		input: 0,
		output: 0,
		cacheWrite: 0,
		cacheRead: 0,
	});
	d.input += r.input;
	d.output += r.output;
	d.cacheWrite += r.cacheWrite;
	d.cacheRead += r.cacheRead;
}

const previous = existsSync(OUT)
	? JSON.parse(await readFile(OUT, "utf8"))
	: { days: {} };
const days = { ...previous.days, ...scanned };
const sorted = Object.fromEntries(
	Object.keys(days)
		.sort()
		.map((k) => [k, days[k]]),
);

await writeFile(
	OUT,
	`${JSON.stringify(
		{ updated: dayOf.format(new Date()), timeZone: TIME_ZONE, days: sorted },
		null,
		"\t",
	)}\n`,
);
console.log(
	`${responses.size} responses, ${Object.keys(scanned).length} days scanned, ${Object.keys(sorted).length} days in ${OUT}`,
);
