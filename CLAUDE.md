# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal single-page site (matteoena.com) built with Astro, output as static
files and deployed to GitHub Pages. One page composed of section components;
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
  `CNAME` (custom domain), `favicon.svg`, `og.png`.
- Deploy: `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages
  on push to `main`.
- `assets/` retains the old tech-logo images; they are not currently referenced.

## Assets

Tech-logo particle images live in `assets/` as `.webp` (except `graphql_logo.png`). When adding a logo to the particle rotation, add the file and append its `url(...)` to `$imgList` in styles.scss.
