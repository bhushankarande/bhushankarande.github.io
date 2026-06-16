# Bhushan Personal Website

Academic-style personal website for Bhushan, built with Eleventy and deployed to GitHub Pages.

## Local Development

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:8080`.

## Build

```bash
pnpm run build
```

The generated site is written to `dist/`.

## Content

- Blog posts: `src/content/posts/*.md`
- Projects: `src/content/projects/*.md`
- Profile data: `src/_data/profile.json`
- Education: `src/_data/education.json`
- Experience: `src/_data/experience.json`
- Social links: `src/_data/social.json`
- Navigation: `src/_data/nav.json`

See `docs/content-guide.md` for details.
