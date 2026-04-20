import type { CollectionEntry } from "astro:content";

export type PostCollection = "researchPosts" | "lifePosts";

export function sortPostsByDate<T extends CollectionEntry<PostCollection>>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function readingTimeFromText(text: string): string {
  const words = text.trim().split(/\s+/u).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min`;
}

export function postExcerpt(markdown: string): string {
  const cutoffToken = "<!-- more -->";
  const beforeMore = markdown.includes(cutoffToken) ? markdown.split(cutoffToken)[0] : markdown;
  const stripped = beforeMore
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$(?:\\.|[^$\n])+\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\\[a-zA-Z]+(?:\{[^}]*\})*/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\$/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= 320) return stripped;
  return `${stripped.slice(0, 317)}...`;
}

export function postImageUrl(section: "research_posts" | "life_posts", slug: string, image?: string) {
  if (!image) return undefined;
  return `/${section}/${slug}/${image}`;
}

export function routeSlugFromId(id: string): string {
  return id.replace(/\/index\.md$/u, "").replace(/\.md$/u, "");
}

export function tagToSlug(tag: string): string {
  const source = tag.trim();
  const normalized = tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "");
  if (normalized) return normalized;
  const codepointSlug = Array.from(source)
    .map((char) => char.codePointAt(0)?.toString(16) ?? "")
    .filter(Boolean)
    .join("-");
  return `tag-${codepointSlug}`;
}
