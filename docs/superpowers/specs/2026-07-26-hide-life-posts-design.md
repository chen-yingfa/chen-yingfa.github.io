# Hide Life Posts from the Frontend

## Goal

Keep the existing life-post Markdown files and assets in the repository, but make life posts inaccessible from the deployed frontend.

## Scope

- Remove the life-post entry from the global navigation.
- Exclude life posts from archives, tag listings, and the JSON search index.
- Remove the generated `/life_posts/` index and individual post routes so existing life-post URLs return the site's normal 404 response.
- Retain life-post source files in `private/life_posts/`, outside Astro's public content pipeline.

## Implementation Design

The public site will consume only the `researchPosts` collection:

1. Remove the navigation item whose target is `/life_posts`.
2. Update Archives to build its post list only from `researchPosts`.
3. Update tag-page static paths to derive tags and post cards only from `researchPosts`. Tags present solely in life posts will no longer produce public tag routes.
4. Update `/index.json` to export only research posts, preventing the client-side search page from indexing life-post titles or bodies.
5. Delete the Astro page modules that generate `/life_posts/` and `/life_posts/<slug>/`.
6. Move life-post source files out of `src/content/`, remove their collection definition, and remove duplicate public life-post assets so Astro cannot emit them.

## Verification

Run a production build and confirm it succeeds. Inspect the generated `dist/` output and search-index data to verify that no `/life_posts/` routes or life-post content remain publicly generated.
