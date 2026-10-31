import { defineCollection, z } from "astro:content";

// Quote full timestamps in frontmatter so their precision survives YAML parsing.
const postDate = z.union([z.date(), z.string().datetime({ offset: true })]);
const hasTime = (value: Date | string | undefined) =>
	typeof value === "string" ||
	(value instanceof Date && value.getTime() % 86400000 !== 0);

const postsCollection = defineCollection({
	schema: z
		.object({
			title: z.string(),
			published: postDate,
			updated: postDate.optional(),
			draft: z.boolean().optional().default(false),
			encrypted: z.string().optional(),
			status: z.enum(["done", "partial", "wip"]).optional(),
			// Which section the post belongs to: Blog, Notes or Projects.
			type: z.enum(["blog", "note", "project"]).optional().default("blog"),
			description: z.string().optional().default(""),
			image: z.string().optional().default(""),
			tags: z.array(z.string()).optional().default([]),
			category: z.string().optional().nullable().default(""),
			lang: z.string().optional().default(""),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		})
		.transform((data) => ({
			...data,
			publishedHasTime: hasTime(data.published),
			updatedHasTime: hasTime(data.updated),
			published: new Date(data.published),
			updated: data.updated === undefined ? undefined : new Date(data.updated),
		})),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
