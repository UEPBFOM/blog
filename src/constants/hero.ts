// The terminal on the home hero. Each step types a command, then prints its output.
// Edit freely; keep it short, the whole thing should finish typing in a few seconds.
export const HERO_PROMPT = "mfxian@blog:~$";

export const HERO_TERMINAL: { command: string; output: string }[] = [
	{ command: "whoami", output: "MFxian，软件工程大三学生" },
	{ command: "cat motto.txt", output: "不要让上学耽误了学习" },
	{ command: "ls ~/now", output: "TypeScript/  Agent/  这个博客/" },
];
