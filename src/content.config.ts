import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const listOrString = z.union([z.string(), z.array(z.string())]).transform((value) =>
  typeof value === "string" ? [value] : value,
);

const postSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  date: z.coerce.date(),
  categories: listOrString.optional(),
  tags: listOrString.optional(),
  thumbnail: z.string().optional(),
  cover: z
    .object({
      image: z.string().optional(),
    })
    .optional(),
});

const pageSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional(),
  type: z.string().optional(),
  toc: z.boolean().optional(),
});

const researchPosts = defineCollection({
  loader: glob({ base: "./src/content/research_posts", pattern: "**/index.md" }),
  schema: postSchema,
});

const lifePosts = defineCollection({
  loader: glob({ base: "./src/content/life_posts", pattern: "**/*.md" }),
  schema: postSchema,
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
  schema: pageSchema,
});

export const collections = {
  researchPosts,
  lifePosts,
  pages,
};
