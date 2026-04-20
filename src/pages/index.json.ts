import { getCollection } from "astro:content";
import { routeSlugFromId, sortPostsByDate } from "../lib/posts";

export async function GET() {
  const researchPosts = await getCollection("researchPosts");
  const lifePosts = await getCollection("lifePosts");
  const posts = sortPostsByDate([
    ...researchPosts.map((post) => ({ ...post, section: "research_posts" as const })),
    ...lifePosts.map((post) => ({ ...post, section: "life_posts" as const })),
  ]);

  const body = posts.map((post) => ({
    title: post.data.title,
    permalink: `/${post.section}/${routeSlugFromId(post.id)}/`,
    content: post.body,
    summary: post.body.slice(0, 300),
  }));

  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
