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
image: "/assets/images/posts/post-thumbnail.svg"
math: false
updated: 2026-07-01
updateNote: "Added an evaluation section."
draft: false
---

Write the post here.
```

Required fields are `title`, `date`, `description`, `tags`, and `draft`.

Optional fields:

- `image`: 16:9 thumbnail shown on `/blog/` and used as the Open Graph image.
- `math`: set to `true` when the post uses LaTeX math.
- `updated`: date for the update notice shown near the top of the post.
- `updateNote`: short explanation appended to the update notice.

Run `pnpm run build`. The post appears on `/blog/`, gets an individual page at `/blog/file-name/`, and is automatically included in tag archives such as `/blog/tag/rag/` and year archives such as `/blog/2026/`.

## Blog Markdown Features

Use standard Markdown for headings, lists, links, images, and code. `h2` and `h3` headings automatically receive anchors and appear in the desktop table of contents.

For image captions, use the Markdown image title:

```md
![Architecture diagram](/assets/images/posts/rag-system.png "Caption shown below the image.")
```

For math posts, set `math: true` and use KaTeX delimiters:

```md
Inline math: $S = w_aA + w_fF + w_cC$

Block math:

$$
S = w_aA + w_fF + w_cC
$$
```

Put blog thumbnails in `src/assets/images/posts/`. SVG is a good default for diagrams and placeholders; PNG or JPG is fine for real screenshots.

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
