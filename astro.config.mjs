// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import rehypeMathjax from "rehype-mathjax/chtml";
import remarkMath from "remark-math";
import remarkInlineFootnotes from "./src/lib/remarkInlineFootnotes.mjs";

const mathjaxFontURL =
  "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2";

// https://astro.build/config
export default defineConfig({
  site: "https://chen-yingfa.github.io",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath, remarkInlineFootnotes],
    rehypePlugins: [
      [
        rehypeMathjax,
        {
          chtml: { fontURL: mathjaxFontURL },
        },
      ],
    ],
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
