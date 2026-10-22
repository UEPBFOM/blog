// Encrypts a private Markdown file into public/private/<name>.json.
// Usage: pnpm encrypt private/welcome.md welcome
// The passphrase is read interactively (or from PRIVATE_PASSPHRASE) and is never stored.
import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";

const ITERATIONS = 600000;

const [source, name] = process.argv.slice(2);
if (!source || !name || !/^[\w-]+$/.test(name)) {
	console.error("Usage: pnpm encrypt <markdown-file> <name>");
	process.exit(1);
}

function askHidden(prompt) {
	return new Promise((resolve) => {
		process.stdout.write(prompt);
		const stdin = process.stdin;
		stdin.setRawMode?.(true);
		stdin.resume();
		stdin.setEncoding("utf8");
		let value = "";
		const onData = (chunk) => {
			for (const ch of chunk) {
				if (ch === "\u0003") process.exit(130);
				if (ch === "\r" || ch === "\n") {
					stdin.setRawMode?.(false);
					stdin.pause();
					stdin.removeListener("data", onData);
					process.stdout.write("\n");
					resolve(value);
					return;
				}
				if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
				else value += ch;
			}
		};
		stdin.on("data", onData);
	});
}

let passphrase = process.env.PRIVATE_PASSPHRASE;
if (!passphrase) {
	passphrase = await askHidden("Passphrase: ");
	const again = await askHidden("Repeat passphrase: ");
	if (passphrase !== again) {
		console.error("Passphrases do not match.");
		process.exit(1);
	}
}
if (!passphrase) {
	console.error("Passphrase must not be empty.");
	process.exit(1);
}

const html = new MarkdownIt({ html: false, linkify: true }).render(
	await readFile(source, "utf8"),
);

const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(passphrase, salt, ITERATIONS, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
// WebCrypto expects the GCM auth tag appended to the ciphertext.
const data = Buffer.concat([
	cipher.update(html, "utf8"),
	cipher.final(),
	cipher.getAuthTag(),
]);

const out = path.join("public", "private", `${name}.json`);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(
	out,
	JSON.stringify({
		v: 1,
		iter: ITERATIONS,
		salt: salt.toString("base64"),
		iv: iv.toString("base64"),
		data: data.toString("base64"),
	}),
);
console.log(`Encrypted ${source} -> ${out}`);
