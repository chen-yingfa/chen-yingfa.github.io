# chen-yingfa.github.io (Astro)

Personal website and blog for Yingfa Chen, rebuilt with Astro.

## Tech Stack

- [Astro](https://astro.build/)
- `@astrojs/sitemap`
- Shiki syntax highlighting (light/dark themes)
- MathJax for equations in posts

## Requirements

- Node.js `>= 22.12.0`
- npm

## Local Development

Run from the repository root:

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run dev` - start development server (`http://localhost:4321`)
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally

## Content Structure

Main content lives in `src/content/` and is validated by `src/content.config.ts`.

- `src/content/research_posts/` - research blog posts
- `src/content/life_posts/` - life posts
- `src/content/pages/` - static pages (`about`, `archives`, `search`)

Site-wide settings are in:

- `src/config/site.ts` - title, nav, profile, social links
- `public/assets/css/theme.css` - global theme and component styling
- `src/layouts/Layout.astro` - shared layout, MathJax, theme toggle, mobile nav

## Writing Posts

- Research posts are folder-based (`.../post-slug/index.md`), and can include local images.
- Life posts can be either `index.md` in a folder or a single `.md` file.
- Recommended frontmatter fields:
  - `title`
  - `date`
  - `tags`
  - `categories`
  - optional `cover.image` or `thumbnail`

## Deployment

This repository is configured for the public site URL:

- `https://chen-yingfa.github.io`

Build output is generated to `dist/`. Deploy by publishing `dist/` with your preferred workflow (for example, GitHub Pages Actions).
