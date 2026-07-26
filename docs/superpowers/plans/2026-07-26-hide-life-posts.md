# Hide Life Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make life posts inaccessible from the public Astro site while retaining their source files in the repository.

**Architecture:** The public site will read only `researchPosts` for navigation, archives, tag pages, and search data. The life-post source files will live outside Astro's content pipeline, and removing their routes and public assets prevents any life-post pages or files from being emitted.

**Tech Stack:** Astro 6, TypeScript, Astro content collections, npm.

## Global Constraints

- Keep life-post source files in `private/life_posts/`, outside Astro's content pipeline.
- Do not generate public `/life_posts/` routes or include life-post text in public indices.
- Do not add dependencies.

---

### Task 1: Remove life-post public entry points and indexes

**Files:**
- Modify: `src/config/site.ts:5-11`
- Modify: `src/pages/archives.astro:1-12`
- Modify: `src/pages/tags/[tag].astro:1-62`
- Modify: `src/pages/index.json.ts:1-17`
- Modify: `src/content.config.ts:1-43`
- Move: `src/content/life_posts/` to `private/life_posts/`
- Delete: `public/life_posts/`
- Delete: `src/pages/life_posts/index.astro`
- Delete: `src/pages/life_posts/[...slug].astro`

**Interfaces:**
- Consumes: Astro `getCollection("researchPosts")`.
- Produces: Public navigation, archives, tag paths, and search data containing research posts only.

- [ ] **Step 1: Write the failing build assertions**

Add a temporary PowerShell check after a production build:

```powershell
if (Test-Path "dist/life_posts") { throw "Life-post routes were generated." }
if ((Get-Content "dist/index.json" -Raw) -match '"permalink":"/life_posts/') {
  throw "Life posts remain in the search index."
}
```

- [ ] **Step 2: Run the assertions against the current build**

Run:

```powershell
npm run build
if (Test-Path "dist/life_posts") { throw "Life-post routes were generated." }
```

Expected: the assertion fails because the current build emits `dist/life_posts`.

- [ ] **Step 3: Limit public consumers to research posts and remove route modules**

Apply these targeted source changes:

```ts
// src/config/site.ts
navItems: [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/research_posts" },
  { label: "About Me", href: "/about" },
  { label: "Search", href: "/search", icon: "mingcute:search-line" },
],

// src/pages/archives.astro
const allPosts = sortPostsByDate(
  researchPosts.map((post) => ({ ...post, section: "research_posts" as const })),
);

// src/pages/index.json.ts
const posts = sortPostsByDate(
  researchPosts.map((post) => ({ ...post, section: "research_posts" as const })),
);
```

In `src/pages/tags/[tag].astro`, remove `getCollection("lifePosts")`, create tag paths from `researchPosts`, and use the fixed section literal `"research_posts"` for every post. Remove `lifePosts` from `src/content.config.ts`, move its source files to `private/life_posts/`, remove `public/life_posts/`, and delete both modules under `src/pages/life_posts/`.

- [ ] **Step 4: Run the build and public-output assertions**

Run:

```powershell
npm run build
if (Test-Path "dist/life_posts") { throw "Life-post routes were generated." }
if ((Get-Content "dist/index.json" -Raw) -match '"permalink":"/life_posts/') {
  throw "Life posts remain in the search index."
}
```

Expected: build completes successfully and neither assertion throws.

- [ ] **Step 5: Inspect source references**

Run:

```powershell
rg 'getCollection\("lifePosts"\)|href: "/life_posts"|/life_posts/' src/config src/pages
```

Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add src/config/site.ts src/pages/archives.astro src/pages/tags/[tag].astro src/pages/index.json.ts src/pages/life_posts
git commit -m "hide life posts from public site"
```
