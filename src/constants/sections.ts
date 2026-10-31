// The three content sections. A post joins one with `type:` in its frontmatter (blog by default).
export const SECTIONS = {
	blog: {
		name: "Blog",
		url: "/blog/",
		description: "完整的文章和随笔",
	},
	note: {
		name: "Notes",
		url: "/notes/",
		description: "学习笔记与读书摘录，比博客更零碎，主要写给自己",
	},
	project: {
		name: "Projects",
		url: "/projects/",
		description: "做过的项目，附介绍和仓库链接",
	},
} as const;

export type SectionType = keyof typeof SECTIONS;

// Shown when a section has nothing published yet.
export const EMPTY_SECTION_TEXT = "还在整理中，敬请期待。";
