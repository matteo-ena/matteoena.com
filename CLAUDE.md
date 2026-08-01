# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal single-page site (matteoena.com) built with Astro, output as static
files and deployed to Netlify. One page composed of section components;
all copy lives in `src/data/content.ts`. Styling is Sass with CSS-custom-property
design tokens driving a light/dark theme toggle. Fonts are self-hosted via
@fontsource. No SSR, no client UI framework.

## Commands

```bash
npm run dev          # Astro dev server with HMR
npm run build        # static build to dist/
npm run preview      # preview the built dist/ locally
npm run check-build  # assert deploy-critical facts about dist/
```

## Architecture

- `src/pages/index.astro` composes section components inside `src/layouts/Layout.astro`.
- Sections: `Hero`, `About`, `Skills`, `Certifications`, `Contact` (in `src/components/`).
- Content/copy: `src/data/content.ts` (typed) — edit copy here, not in markup.
- Styling: `src/styles/_tokens.scss` (theme tokens) + `src/styles/global.scss`.
- Theme: `data-theme` on `<html>`, set pre-paint by an inline script in Layout,
  toggled by the Nav button, persisted to localStorage.
- `public/` is served at the site root — includes `app-ads.txt`, `manifest.json`,
  `favicon.svg`, `og.png`.
- Deploy: **Netlify** (custom domain `matteoena.com`). Config in `netlify.toml`
  (`command = "npm run build && npm run check-build"`, `publish = "dist"`,
  Node 22). Netlify builds on push to `main` via the connected GitHub repo. The
  custom domain is managed in Netlify's dashboard, not via a `CNAME` file.
- `assets/` retains the old tech-logo images; they are not currently referenced.

## Assets

`assets/` holds the old tech-logo images (`.webp`, plus `graphql_logo.png`) and
background images from the previous version of the site. They are retained in the
repo but are **not referenced** by the current Astro site. Site-served static files
(favicon, OG image, manifest, app-ads.txt) live in `public/`, not `assets/`.

## Conventions

- **Mobile-first CSS:** base styles target small screens; enhance upward with
  `min-width` media queries only — no `max-width` breakpoints. (A `max-width`
  *property* for content measure, e.g. `max-width: 60ch`, is fine.)
- **Colors via tokens only:** use the CSS custom properties in `_tokens.scss`
  (`--bg`, `--text`, `--text-muted`, `--accent`, `--on-accent`, `--border`) —
  no hardcoded hex in components.
- **Motion is gated:** every transition/animation must be disabled under
  `@media (prefers-reduced-motion: reduce)`. Scroll-reveal is also gated behind
  an `html.js` marker so no-JS visitors see content by default.
- **Shared layout:** `.section` / `.section__heading` live in `global.scss` and
  are reused by section components — don't redefine them per component.
- `scripts/check-build.mjs` (`npm run check-build`) asserts deploy-critical facts
  about `dist/` and runs in the Netlify build; keep it green.
