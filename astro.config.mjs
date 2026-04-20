// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import remarkInlineFootnotes from "./src/lib/remarkInlineFootnotes.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://chen-yingfa.github.io",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkInlineFootnotes],
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
