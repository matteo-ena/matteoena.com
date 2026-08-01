# matteoena.com — Full Refactor Design

**Date:** 2026-08-01
**Status:** Approved (pending spec review)

## Goal

Completely refactor the personal site (matteoena.com) into a modern, bold single-page
portfolio for Matteo Ena — a Barcelona-based frontend developer. Replace the current
static HTML + Sass-particle site with an Astro-built static site that keeps the same
static-output, custom-domain deployment model.

## Non-goals (YAGNI)

- No blog, no projects page, no CMS.
- No client-side framework (React/Vue/Svelte) — Astro static output only.
- No backend, no forms, no analytics beyond what already exists.
- The particle animation system is **retired**, not ported.

## Stack & architecture

- **Astro** (static-first). `astro build` outputs plain static files to `dist/`.
  Zero JS shipped by default; a minimal amount of vanilla JS only for the theme toggle
  and (if needed) scroll reveals.
- **Sass retained** — Astro compiles `.scss` natively. Design tokens live in
  `src/styles/_tokens.scss`; global base styles in `src/styles/global.scss`.
- **Component-based** structure:
  - `src/layouts/Layout.astro` — html shell, `<head>` meta, no-flash theme script, font links.
  - `src/components/Nav.astro` — sticky nav with anchor links + theme toggle button.
  - `src/components/Hero.astro`
  - `src/components/About.astro`
  - `src/components/Skills.astro`
  - `src/components/Certifications.astro`
  - `src/components/Contact.astro` (also serves as footer)
  - `src/pages/index.astro` — composes the sections in order.
- **Content data** in `src/data/content.ts`: bio text, skills list, cert list,
  contact links (typed exports). Copy edits never touch markup.
- The old `index.html` and the particle Sass system are removed. Files in `assets/`
  (tech logos, backgrounds) remain in the repo but are no longer referenced. Old
  `fashion/` Sass/CSS is removed once the new styles are in place.

## Page structure

Single page, sticky top nav, scroll sections in this order:

```
Hero → About → Skills → Certifications → Contact (footer)
```

Nav links are in-page anchors (`#about`, `#skills`, `#certifications`, `#contact`).
Nav collapses to a compact bar on scroll. Nav also holds the theme toggle.

## Visual system

### Direction
"Oversized type" — radical minimalism, the wordmark is the design, one accent color,
everything else monochrome.

### Themes (light + dark, toggle)
Tokens are CSS custom properties switched by a `data-theme` attribute on `<html>`.

| Token            | Dark            | Light           |
|------------------|-----------------|-----------------|
| `--bg`           | `#0d0d0f`       | `#faf9f6`       |
| `--text`         | `#f5f5f5`       | `#111214`       |
| `--text-muted`   | `#8a8a8a`       | `#5b5f66`       |
| `--accent`       | `#3d7bff`       | `#2f6bf0`       |
| `--border`       | `rgba(255,255,255,.14)` | `rgba(0,0,0,.14)` |

- **Default theme:** follow system preference (`prefers-color-scheme`) on first visit;
  respect the user's explicit choice thereafter.
- **No-flash:** an inline script in `<head>` sets `data-theme` from `localStorage`
  (falling back to system preference) before first paint.
- **Toggle:** a button in the nav toggles the theme and persists the choice to `localStorage`.

### Typography (self-hosted)
- **Archivo Black** — giant hero wordmark and section headings.
- **Space Grotesk** — all body copy, labels, nav, buttons.
- Font files downloaded into `public/fonts/` and declared with `@font-face`
  (`font-display: swap`). No external font-service request at runtime.

### Hero
- Small uppercase kicker: `Frontend Developer · Barcelona`.
- Oversized wordmark `MATTEO` / `ENA`, with `ENA` in `--accent`.
- Pill CTA `Get in touch →` with generous top margin below the wordmark.

## Content

- **Hero:** name + role/location kicker + `Get in touch` CTA.
- **About** (approved draft, editable in `content` data):
  > Frontend developer based in Barcelona, focused on building fast, accessible, modern
  > web interfaces. I work across today's frontend stack — React, Vue, Svelte, TypeScript
  > — with deep enterprise experience in Adobe Experience Manager. Lately I build with AI
  > in the loop, using it to design and ship better software, faster.
- **Skills:** text tag grid (chips), no logo images. Seed list:
  React, Vue, Svelte, JavaScript, TypeScript, HTML, CSS/Sass, GraphQL, Java, AEM, Azure,
  Web Performance, Selenium, Git, npm.
- **Certifications:** two cards —
  - **Adobe Certified Expert — AEM Sites Developer Expert** (earned)
  - **Anthropic Claude Architect** (in progress)
- **Contact:**
  - Primary CTA → `mailto:teo.ena.web@pm.me`
  - LinkedIn link → `https://www.linkedin.com/in/matteoena/`
  - No GitHub link, no Adobe badge link.

## Motion

- CSS-first fade/slide-up reveal on scroll (CSS scroll-driven animations where supported;
  graceful no-op fallback otherwise).
- Subtle accent hover on CTA and nav links.
- All motion gated behind `prefers-reduced-motion: reduce` (disabled when the user prefers
  reduced motion).

## SEO / meta

- `<title>`, meta description, canonical URL.
- Open Graph + Twitter card tags; a simple static OG share image in `public/`.
- Favicon.
- `lang="en"`, semantic landmarks (`header`/`main`/`section`/`footer`), accessible
  contrast in both themes, keyboard-focusable nav and toggle.

## Deployment

- **GitHub Actions** workflow (`.github/workflows/deploy.yml`): on push to `main`,
  install deps, run `astro build`, deploy `dist/` to **GitHub Pages**.
- `astro.config.mjs`: `site: 'https://matteoena.com'`, static output.
- `public/` holds root-served files. **Preserve `app-ads.txt` and `manifest.json`**;
  add a `CNAME` file containing `matteoena.com` so the custom domain resolves.

## File-level plan (summary)

- Add: `astro.config.mjs`, `package.json` (updated deps/scripts), `src/**`,
  `public/fonts/**`, `public/CNAME`, `.github/workflows/deploy.yml`.
- Move to `public/`: `app-ads.txt`, `manifest.json`, favicon.
- Remove: `index.html`, `fashion/`, `fancy-stuff/`.
- Update: `CLAUDE.md` to describe the new Astro architecture and commands.

## Acceptance criteria

1. `npm install && npm run build` produces a static `dist/` with no errors.
2. `npm run dev` serves a working single page with all five sections.
3. Theme toggle works, persists across reloads, defaults to system preference, no flash.
4. `Get in touch` opens `mailto:teo.ena.web@pm.me`; LinkedIn link is correct.
5. Fonts are self-hosted; no external font request in the network tab.
6. `app-ads.txt`, `manifest.json`, and `CNAME` are present at the site root in `dist/`.
7. Both themes meet WCAG AA contrast for body text; motion respects `prefers-reduced-motion`.
8. Pushing to `main` builds and deploys to GitHub Pages on the custom domain.
