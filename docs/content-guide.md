# Content Guide

This site is built with Eleventy. Source files live in `src/`; generated files are written to `dist/` and deployed by GitHub Actions.

## Update Profile Details

Edit these JSON files:

- `src/_data/profile.json`
- `src/_data/education.json`
- `src/_data/experience.json`
- `src/_data/social.json`

Keep placeholder values wrapped in brackets until you replace them.

## Add a Blog Post

Create a Markdown file in `src/content/posts/`:

```md
---
title: "Post title"
date: 2026-06-16
description: "One-line summary for lists and metadata."
tags: ["RAG", "LLM Evaluation"]
draft: false
---

Write the post here.
```

Run `pnpm run build`. The post appears on `/blog/` and gets an individual page at `/blog/file-name/`.

## Add a Project

Create a Markdown file in `src/content/projects/`:

```md
---
title: "Project title"
date: 2026-06-16
order: 1
description: "Two-line summary for project cards."
tags: ["LangGraph", "RAG", "FastAPI"]
github: "https://github.com/..."
demo: "https://..."
draft: false
---

Write the project note here.
```

Projects appear on `/projects/` and on the homepage. Lower `order` values appear first.

## Drafts

Set `draft: true` to keep a post or project out of listings and deployment navigation.

## Theme

The site defaults to the visitor's OS theme and includes a manual toggle. The selected theme is saved in `localStorage`.
