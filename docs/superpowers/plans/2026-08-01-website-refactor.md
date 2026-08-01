# Website Refactor (Astro) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild matteoena.com as a bold, oversized-type single-page portfolio built with Astro, deployed as static files to GitHub Pages on the existing custom domain.

**Architecture:** Astro static-output site. One page (`src/pages/index.astro`) composes section components inside a shared `Layout.astro`. All copy lives in a typed `src/data/content.ts`. Styling is Sass with CSS-custom-property design tokens switched by a `data-theme` attribute for the light/dark toggle. Fonts are self-hosted via `@fontsource`. A GitHub Actions workflow builds and publishes `dist/`.

**Tech Stack:** Astro 5, Sass (via Astro's built-in support), `@fontsource/archivo` + `@fontsource/space-grotesk`, TypeScript (Astro default), GitHub Actions + GitHub Pages. Node 22, npm 10.

## Global Constraints

- Node ≥ 20 (dev/CI uses Node 22). Package manager: npm.
- Static output only — no SSR adapter, no client-side UI framework.
- Zero external network requests at runtime — fonts self-hosted, no CDN font links.
- Accent color: dark `#3d7bff`, light `#2f6bf0`. Background: dark `#0d0d0f`, light `#faf9f6`.
- Wordmark/headings font: **Archivo** weight **900** (Archivo Black). Body font: **Space Grotesk**.
- Contact email (exact): `teo.ena.web@pm.me`. LinkedIn (exact): `https://www.linkedin.com/in/matteoena/`.
- Custom domain (exact): `matteoena.com`. `site` in Astro config: `https://matteoena.com`.
- Preserve these files at the built site root: `app-ads.txt`, `manifest.json`, plus a new `CNAME`.
- All motion gated behind `@media (prefers-reduced-motion: reduce)`.
- **Mobile-first CSS:** base styles target small screens; enhance upward with
  `min-width` media queries only. Do not use `max-width` breakpoints. Fluid
  `clamp()` sizing is preferred over breakpoints where it suffices.
- Every commit message ends with the Co-Authored-By trailer already used in this repo.

---

## File Structure

- `package.json` — replaced: Astro deps + scripts (`dev`, `build`, `preview`, `check-build`).
- `astro.config.mjs` — new: `site`, static output.
- `tsconfig.json` — new: extends `astro/tsconfigs/strict`.
- `src/layouts/Layout.astro` — html shell, `<head>` meta/SEO, no-flash theme script, font imports, global style import.
- `src/styles/_tokens.scss` — CSS custom properties for both themes.
- `src/styles/global.scss` — reset, base typography, `@font-face` mapping via fontsource, motion/reveal utilities.
- `src/data/content.ts` — typed site copy (hero, about, skills, certs, links).
- `src/components/Nav.astro` — sticky nav, anchor links, theme-toggle button + toggle script.
- `src/components/Hero.astro`
- `src/components/About.astro`
- `src/components/Skills.astro`
- `src/components/Certifications.astro`
- `src/components/Contact.astro` — contact section + footer.
- `src/pages/index.astro` — composes all sections.
- `public/CNAME`, `public/app-ads.txt`, `public/manifest.json`, `public/favicon.svg`, `public/og.png`.
- `scripts/check-build.mjs` — asserts acceptance-critical facts about `dist/`.
- `.github/workflows/deploy.yml` — build + deploy to GitHub Pages.
- Removed: `index.html`, `fashion/`, `fancy-stuff/`.
- Updated: `CLAUDE.md`.

Because this is a static content site with no runtime logic, each task's verification is `astro build` succeeding plus grep-style assertions against the generated HTML in `dist/`, not a unit-test framework (that would be YAGNI here). Task 13 adds an automated `check-build.mjs` gate for the deploy-critical criteria.

---

### Task 1: Scaffold Astro project

**Files:**
- Modify/replace: `package.json`
- Create: `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `src/layouts/Layout.astro`
- Create: `.gitignore` entry for `dist/` (already added)

**Interfaces:**
- Produces: `Layout.astro` default component accepting props `{ title: string; description: string }` and a default `<slot />`. `index.astro` renders `<Layout>` with those props.

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "matteoena",
  "version": "2.0.0",
  "description": "Personal website of Matteo Ena",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check-build": "node scripts/check-build.mjs"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/matteo-ena/matteoena.com.git"
  },
  "author": "Matteo Ena",
  "license": "ISC",
  "homepage": "https://matteoena.com"
}
```

- [ ] **Step 2: Install Astro and font packages**

Run:
```bash
npm install astro@^5 sass @fontsource/archivo @fontsource/space-grotesk
```
Expected: installs without error; `astro` appears in `dependencies`.

- [ ] **Step 3: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://matteoena.com',
  output: 'static',
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Create src/layouts/Layout.astro (minimal shell for now)**

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 6: Create src/pages/index.astro (placeholder)**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Matteo Ena — Frontend Developer" description="Frontend developer based in Barcelona.">
  <main>
    <h1>Matteo Ena</h1>
  </main>
</Layout>
```

- [ ] **Step 7: Verify dev server runs**

Run: `npm run dev -- --host` then open the printed URL (Ctrl-C to stop).
Expected: page shows "Matteo Ena", no console errors.

- [ ] **Step 8: Verify build succeeds**

Run: `npm run build`
Expected: `dist/index.html` created, exit code 0.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ .gitignore
git commit -m "$(printf 'feat: scaffold Astro project\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 2: Design tokens, global styles, self-hosted fonts, no-flash theme script

**Files:**
- Create: `src/styles/_tokens.scss`, `src/styles/global.scss`
- Modify: `src/layouts/Layout.astro`

**Interfaces:**
- Consumes: `Layout.astro` from Task 1.
- Produces: CSS custom properties `--bg --text --text-muted --accent --border --font-display --font-body` available globally, switched by `html[data-theme="light"]` / default (dark). An inline head script sets `data-theme` before paint. `Layout.astro` imports fontsource CSS and `global.scss`.

- [ ] **Step 1: Create src/styles/_tokens.scss**

```scss
:root {
  --bg: #0d0d0f;
  --text: #f5f5f5;
  --text-muted: #8a8a8a;
  --accent: #3d7bff;
  --border: rgba(255, 255, 255, 0.14);
  --font-display: 'Archivo', system-ui, sans-serif;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
}

html[data-theme='light'] {
  --bg: #faf9f6;
  --text: #111214;
  --text-muted: #5b5f66;
  --accent: #2f6bf0;
  --border: rgba(0, 0, 0, 0.14);
}
```

- [ ] **Step 2: Create src/styles/global.scss**

```scss
@use 'tokens';

*,
*::before,
*::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s ease, color 0.3s ease;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.02em;
  margin: 0;
}

a { color: inherit; }

// Shared section layout utilities (used by every section component)
.section {
  padding: clamp(4rem, 12vh, 9rem) clamp(1rem, 6vw, 5rem);
  border-top: 1px solid var(--border);
}
.section__heading {
  font-size: clamp(2rem, 7vw, 4.5rem);
  margin-bottom: 2rem;
}

// Scroll reveal utility — opt in with class="reveal"
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 3: Wire fonts, styles, and no-flash theme script into Layout.astro**

Replace the full contents of `src/layouts/Layout.astro` with:

```astro
---
import '@fontsource/archivo/900.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '../styles/global.scss';

interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <script is:inline>
      (function () {
        try {
          var stored = localStorage.getItem('theme');
          var theme = stored
            ? stored
            : window.matchMedia('(prefers-color-scheme: light)').matches
              ? 'light'
              : 'dark';
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Verify build succeeds and fonts are bundled locally**

Run: `npm run build`
Expected: exit 0. Then:
```bash
ls dist/_astro | grep -iE 'archivo|space-grotesk' | head
```
Expected: at least one `.woff2`/`.woff` for each family present in `dist/_astro`.

- [ ] **Step 5: Verify no external font request**

Run: `grep -rE "fonts.googleapis|fonts.gstatic" dist/ || echo "NO EXTERNAL FONTS"`
Expected: prints `NO EXTERNAL FONTS`.

- [ ] **Step 6: Commit**

```bash
git add src/styles src/layouts/Layout.astro
git commit -m "$(printf 'feat: add theme tokens, global styles, self-hosted fonts\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 3: Content data module

**Files:**
- Create: `src/data/content.ts`

**Interfaces:**
- Produces: named exports consumed by every component:
  - `hero: { kicker: string; firstName: string; lastName: string; ctaLabel: string }`
  - `about: { heading: string; paragraphs: string[] }`
  - `skills: { heading: string; items: string[] }`
  - `certifications: { heading: string; items: { title: string; issuer: string; status: 'earned' | 'in-progress' }[] }`
  - `contact: { heading: string; email: string; linkedin: string }`
  - `siteMeta: { title: string; description: string }`

- [ ] **Step 1: Create src/data/content.ts**

```ts
export const siteMeta = {
  title: 'Matteo Ena — Frontend Developer',
  description:
    'Matteo Ena — frontend developer based in Barcelona building fast, accessible, modern web interfaces.',
};

export const hero = {
  kicker: 'Frontend Developer · Barcelona',
  firstName: 'MATTEO',
  lastName: 'ENA',
  ctaLabel: 'Get in touch',
};

export const about = {
  heading: 'About',
  paragraphs: [
    'Frontend developer based in Barcelona, focused on building fast, accessible, modern web interfaces.',
    "I work across today's frontend stack — React, Vue, Svelte, TypeScript — with deep enterprise experience in Adobe Experience Manager. Lately I build with AI in the loop, using it to design and ship better software, faster.",
  ],
};

export const skills = {
  heading: 'Skills',
  items: [
    'React', 'Vue', 'Svelte', 'JavaScript', 'TypeScript', 'HTML', 'CSS/Sass',
    'GraphQL', 'Java', 'AEM', 'Azure', 'Web Performance', 'Selenium', 'Git', 'npm',
  ],
};

export const certifications = {
  heading: 'Certifications',
  items: [
    {
      title: 'AEM Sites Developer Expert',
      issuer: 'Adobe Certified Expert',
      status: 'earned' as const,
    },
    {
      title: 'Claude Architect',
      issuer: 'Anthropic',
      status: 'in-progress' as const,
    },
  ],
};

export const contact = {
  heading: "Let's talk",
  email: 'teo.ena.web@pm.me',
  linkedin: 'https://www.linkedin.com/in/matteoena/',
};
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx astro check` (or `npm run build`)
Expected: no TypeScript errors referencing `content.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/data/content.ts
git commit -m "$(printf 'feat: add typed site content module\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 4: Nav with theme toggle

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro` (mount Nav)

**Interfaces:**
- Produces: `<Nav />` — a fixed-position header with anchor links to `#about`, `#skills`, `#certifications`, `#contact`, and a `<button id="theme-toggle">`. Inline script toggles `data-theme` and persists to `localStorage` under key `theme`.

- [ ] **Step 1: Create src/components/Nav.astro**

```astro
---
const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
];
---
<header class="nav">
  <a class="nav__brand" href="#top">ME</a>
  <nav>
    <ul>
      {links.map((l) => (
        <li><a href={l.href}>{l.label}</a></li>
      ))}
    </ul>
  </nav>
  <button id="theme-toggle" type="button" aria-label="Toggle color theme">
    <span class="theme-toggle__dot"></span>
  </button>
</header>

<style lang="scss">
  .nav {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem clamp(1rem, 4vw, 3rem);
    background: color-mix(in srgb, var(--bg) 80%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .nav__brand {
    font-family: var(--font-display);
    font-weight: 900;
    text-decoration: none;
    color: var(--accent);
    font-size: 1.1rem;
  }
  nav ul {
    display: none; // hidden on mobile (scroll-based nav); shown on wider screens
    gap: clamp(0.75rem, 2vw, 1.75rem);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  nav a {
    text-decoration: none;
    font-size: 0.85rem;
    color: var(--text-muted);
    transition: color 0.2s ease;
  }
  nav a:hover { color: var(--accent); }
  #theme-toggle {
    width: 40px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 2px;
  }
  .theme-toggle__dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    transition: transform 0.2s ease;
  }
  :global(html[data-theme='light']) .theme-toggle__dot { transform: translateX(18px); }
  @media (min-width: 601px) {
    nav ul { display: flex; }
  }
</style>

<script is:inline>
  (function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  })();
</script>
```

- [ ] **Step 2: Mount Nav and add #top anchor in index.astro**

Replace `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import { siteMeta } from '../data/content';
---
<Layout title={siteMeta.title} description={siteMeta.description}>
  <Nav />
  <main id="top">
    <h1>Matteo Ena</h1>
  </main>
</Layout>
```

- [ ] **Step 3: Verify toggle in dev**

Run: `npm run dev`
Manual check: click the toggle — background switches dark↔light; reload — choice persists; no flash of wrong theme on reload.

- [ ] **Step 4: Verify build**

Run: `npm run build && grep -q 'theme-toggle' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "$(printf 'feat: add sticky nav with theme toggle\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 5: Hero section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `hero`, `contact` from `content.ts`.
- Produces: `<Hero />` rendering the oversized wordmark and a `mailto:` CTA.

- [ ] **Step 1: Create src/components/Hero.astro**

```astro
---
import { hero, contact } from '../data/content';
---
<section class="hero">
  <p class="hero__kicker">{hero.kicker}</p>
  <h1 class="hero__name">
    {hero.firstName}<br /><span class="hero__accent">{hero.lastName}</span>
  </h1>
  <a class="hero__cta" href={`mailto:${contact.email}`}>{hero.ctaLabel} →</a>
</section>

<style lang="scss">
  .hero {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6rem clamp(1rem, 6vw, 5rem) 3rem;
  }
  .hero__kicker {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0 0 1.5rem;
  }
  .hero__name {
    font-size: clamp(3.5rem, 16vw, 12rem);
  }
  .hero__accent { color: var(--accent); }
  .hero__cta {
    margin-top: 3rem;
    align-self: flex-start;
    text-decoration: none;
    font-size: 0.95rem;
    padding: 0.7rem 1.4rem;
    border: 1px solid var(--accent);
    border-radius: 999px;
    color: var(--text);
    transition: background 0.2s ease, color 0.2s ease;
  }
  .hero__cta:hover { background: var(--accent); color: #fff; }
</style>
```

- [ ] **Step 2: Replace placeholder <main> with Hero in index.astro**

In `src/pages/index.astro`, add the import and replace the `<main>` block:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import { siteMeta } from '../data/content';
---
<Layout title={siteMeta.title} description={siteMeta.description}>
  <Nav />
  <main id="top">
    <Hero />
  </main>
</Layout>
```

- [ ] **Step 3: Verify build and CTA target**

Run: `npm run build && grep -q 'mailto:teo.ena.web@pm.me' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "$(printf 'feat: add oversized-type hero section\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 6: About, Skills, Certifications sections

**Files:**
- Create: `src/components/About.astro`, `src/components/Skills.astro`, `src/components/Certifications.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `about`, `skills`, `certifications` from `content.ts`.
- Produces: `<About />`, `<Skills />`, `<Certifications />`, each a `<section>` with an `id` matching its nav anchor.

The shared `.section` / `.section__heading` layout rules live in `global.scss` (added in Task 2). Components below define only their own unique styles and reuse those global classes.

- [ ] **Step 1: Create src/components/About.astro**

```astro
---
import { about } from '../data/content';
---
<section id="about" class="section reveal">
  <h2 class="section__heading">{about.heading}</h2>
  <div class="about__body">
    {about.paragraphs.map((p) => <p>{p}</p>)}
  </div>
</section>

<style lang="scss">
  .about__body {
    max-width: 60ch;
    font-size: clamp(1.05rem, 2.2vw, 1.4rem);
  }
  .about__body p { margin: 0 0 1.25rem; }
</style>
```

- [ ] **Step 2: Create src/components/Skills.astro**

```astro
---
import { skills } from '../data/content';
---
<section id="skills" class="section reveal">
  <h2 class="section__heading">{skills.heading}</h2>
  <ul class="skills__grid">
    {skills.items.map((s) => <li class="skills__chip">{s}</li>)}
  </ul>
</section>

<style lang="scss">
  .skills__grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .skills__chip {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.55rem 1.1rem;
    font-size: 0.95rem;
    transition: border-color 0.2s ease, color 0.2s ease;
  }
  .skills__chip:hover { border-color: var(--accent); color: var(--accent); }
</style>
```

- [ ] **Step 3: Create src/components/Certifications.astro**

```astro
---
import { certifications } from '../data/content';
---
<section id="certifications" class="section reveal">
  <h2 class="section__heading">{certifications.heading}</h2>
  <div class="certs">
    {certifications.items.map((c) => (
      <article class="cert">
        <span class={`cert__status cert__status--${c.status}`}>
          {c.status === 'earned' ? 'Earned' : 'In progress'}
        </span>
        <h3 class="cert__title">{c.title}</h3>
        <p class="cert__issuer">{c.issuer}</p>
      </article>
    ))}
  </div>
</section>

<style lang="scss">
  .certs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    max-width: 900px;
  }
  .cert {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.75rem;
  }
  .cert__status {
    display: inline-block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    margin-bottom: 1rem;
  }
  .cert__status--earned { background: var(--accent); color: #fff; }
  .cert__status--in-progress { border: 1px solid var(--accent); color: var(--accent); }
  .cert__title { font-size: 1.5rem; margin-bottom: 0.4rem; }
  .cert__issuer { color: var(--text-muted); margin: 0; }
</style>
```

- [ ] **Step 4: Mount the three sections in index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Skills from '../components/Skills.astro';
import Certifications from '../components/Certifications.astro';
import { siteMeta } from '../data/content';
---
<Layout title={siteMeta.title} description={siteMeta.description}>
  <Nav />
  <main id="top">
    <Hero />
    <About />
    <Skills />
    <Certifications />
  </main>
</Layout>
```

- [ ] **Step 5: Verify build and anchors/content**

Run:
```bash
npm run build && \
grep -q 'id="about"' dist/index.html && \
grep -q 'id="skills"' dist/index.html && \
grep -q 'id="certifications"' dist/index.html && \
grep -q 'AEM Sites Developer Expert' dist/index.html && \
grep -q 'Claude Architect' dist/index.html && echo OK
```
Expected: prints `OK`.

- [ ] **Step 6: Commit**

```bash
git add src/components/About.astro src/components/Skills.astro src/components/Certifications.astro src/pages/index.astro
git commit -m "$(printf 'feat: add about, skills, certifications sections\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 7: Contact section + footer, scroll-reveal script

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `contact` from `content.ts`.
- Produces: `<Contact />` — section `id="contact"` with the mailto CTA + LinkedIn link, doubling as footer. Also adds the IntersectionObserver script that adds `.is-visible` to `.reveal` elements.

- [ ] **Step 1: Create src/components/Contact.astro**

```astro
---
import { contact } from '../data/content';
---
<section id="contact" class="section reveal">
  <h2 class="section__heading">{contact.heading}</h2>
  <div class="contact__actions">
    <a class="contact__cta" href={`mailto:${contact.email}`}>Get in touch →</a>
    <a class="contact__link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
  </div>
  <footer class="contact__footer">
    <span>© Matteo Ena</span>
  </footer>
</section>

<style lang="scss">
  .contact__actions {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .contact__cta {
    text-decoration: none;
    padding: 0.85rem 1.6rem;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 1rem;
  }
  .contact__link {
    text-decoration: none;
    color: var(--text-muted);
    transition: color 0.2s ease;
  }
  .contact__link:hover { color: var(--accent); }
  .contact__footer {
    margin-top: clamp(4rem, 10vh, 8rem);
    color: var(--text-muted);
    font-size: 0.85rem;
  }
</style>

<script is:inline>
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  })();
</script>
```

- [ ] **Step 2: Mount Contact in index.astro (after Certifications)**

Add `import Contact from '../components/Contact.astro';` and place `<Contact />` after `<Certifications />` in `<main>`.

- [ ] **Step 3: Verify build, LinkedIn, and reveal**

Run:
```bash
npm run build && \
grep -q 'https://www.linkedin.com/in/matteoena/' dist/index.html && \
grep -q 'id="contact"' dist/index.html && echo OK
```
Expected: prints `OK`. In `npm run dev`, sections fade/slide in on scroll; with OS "reduce motion" on, they appear immediately.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.astro src/pages/index.astro
git commit -m "$(printf 'feat: add contact/footer section and scroll reveal\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 8: SEO meta + Open Graph + favicon

**Files:**
- Modify: `src/layouts/Layout.astro`
- Create: `public/favicon.svg`, `public/og.png`

**Interfaces:**
- Consumes: `Astro.site` (from config), `title`, `description` props.
- Produces: canonical link, OG + Twitter tags, favicon link in `<head>`.

- [ ] **Step 1: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0d0d0f"/>
  <text x="50" y="68" font-family="Arial Black, sans-serif" font-size="52" font-weight="900" fill="#3d7bff" text-anchor="middle">ME</text>
</svg>
```

- [ ] **Step 2: Add a placeholder OG image**

Create `public/og.png` — a 1200×630 PNG. If no design asset exists yet, generate a solid `#0d0d0f` PNG with "MATTEO ENA" in cobalt using any available tool, or copy an existing brand image. Document that it can be replaced later. (Acceptance only requires the file exists and is referenced.)

- [ ] **Step 3: Extend the <head> in Layout.astro**

Add inside `<head>` (after the `<title>`), using `Astro.site`:

```astro
    <link rel="canonical" href={Astro.site} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.json" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={Astro.site} />
    <meta property="og:image" content={new URL('/og.png', Astro.site)} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL('/og.png', Astro.site)} />
```

- [ ] **Step 4: Verify build and meta**

Run:
```bash
npm run build && \
grep -q 'property="og:image"' dist/index.html && \
grep -q 'rel="canonical"' dist/index.html && \
test -f dist/favicon.svg && test -f dist/og.png && echo OK
```
Expected: prints `OK`.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro public/favicon.svg public/og.png
git commit -m "$(printf 'feat: add SEO, Open Graph tags, and favicon\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 9: Preserve root files + CNAME

**Files:**
- Move: `app-ads.txt` → `public/app-ads.txt`
- Move: `manifest.json` → `public/manifest.json`
- Create: `public/CNAME`

**Interfaces:**
- Produces: `dist/app-ads.txt`, `dist/manifest.json`, `dist/CNAME` at the site root after build.

- [ ] **Step 1: Move existing root files into public/**

```bash
git mv app-ads.txt public/app-ads.txt
git mv manifest.json public/manifest.json
```

- [ ] **Step 2: Create public/CNAME**

File `public/CNAME` containing exactly one line:

```
matteoena.com
```

- [ ] **Step 3: Verify they land at dist root**

Run:
```bash
npm run build && \
test -f dist/app-ads.txt && test -f dist/manifest.json && \
grep -qx 'matteoena.com' dist/CNAME && echo OK
```
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add public/CNAME public/app-ads.txt public/manifest.json
git commit -m "$(printf 'chore: serve app-ads.txt, manifest.json, and CNAME from public/\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 10: Remove legacy files + update CLAUDE.md

**Files:**
- Remove: `index.html`, `fashion/`, `fancy-stuff/`
- Modify: `CLAUDE.md`

**Interfaces:** none (cleanup + docs).

- [ ] **Step 1: Remove the old static site and Sass particle system**

```bash
git rm index.html
git rm -r fashion fancy-stuff
```
(`assets/` is intentionally kept per the spec.)

- [ ] **Step 2: Rewrite CLAUDE.md to describe the Astro architecture**

Replace the "Overview", "Commands", and "Architecture" sections so they read:

```markdown
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
```

- [ ] **Step 3: Verify nothing references removed files**

Run: `npm run build && grep -rn 'fashion/\|fancy-stuff' src/ dist/ || echo "NO LEGACY REFS"`
Expected: prints `NO LEGACY REFS`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(printf 'chore: remove legacy static site and update CLAUDE.md\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 11: Build-assertion gate script

**Files:**
- Create: `scripts/check-build.mjs`

**Interfaces:**
- Consumes: `dist/` (must run after `npm run build`).
- Produces: `npm run check-build` exits 0 when all acceptance-critical facts hold, non-zero otherwise.

- [ ] **Step 1: Write scripts/check-build.mjs**

```js
import { readFileSync, existsSync } from 'node:fs';

const checks = [];
function check(name, ok) { checks.push({ name, ok: !!ok }); }

const html = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : '';

check('dist/index.html exists', html.length > 0);
check('mailto is correct', html.includes('mailto:teo.ena.web@pm.me'));
check('linkedin is correct', html.includes('https://www.linkedin.com/in/matteoena/'));
check('has about anchor', html.includes('id="about"'));
check('has skills anchor', html.includes('id="skills"'));
check('has certifications anchor', html.includes('id="certifications"'));
check('has contact anchor', html.includes('id="contact"'));
check('theme toggle present', html.includes('theme-toggle'));
check('no external google fonts', !/fonts\.(googleapis|gstatic)/.test(html));
check('app-ads.txt at root', existsSync('dist/app-ads.txt'));
check('manifest.json at root', existsSync('dist/manifest.json'));
check('CNAME correct', existsSync('dist/CNAME') && readFileSync('dist/CNAME', 'utf8').trim() === 'matteoena.com');
check('og image present', existsSync('dist/og.png'));

let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`);
  if (!c.ok) failed++;
}
if (failed) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll build checks passed.');
```

- [ ] **Step 2: Run it against a fresh build (expect PASS)**

Run: `npm run build && npm run check-build`
Expected: every line `PASS`, final line `All build checks passed.`, exit 0.

- [ ] **Step 3: Sanity-check it can fail**

Temporarily edit one assertion string (e.g. the mailto) to a wrong value, run `npm run check-build`, confirm it exits non-zero, then revert.
Expected: shows a `FAIL` line and non-zero exit before revert.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-build.mjs
git commit -m "$(printf 'test: add build-assertion gate for deploy-critical facts\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 12: GitHub Actions deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: on push to `main`, builds and deploys `dist/` to GitHub Pages.

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run check-build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify workflow YAML is valid locally**

Run: `node -e "require('fs').readFileSync('.github/workflows/deploy.yml','utf8')" && echo "file OK"`
(Or `npx --yes yaml-lint .github/workflows/deploy.yml` if available.)
Expected: no error.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "$(printf 'ci: build and deploy to GitHub Pages on push to main\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

- [ ] **Step 4: Post-merge manual step (document, do not automate)**

In the GitHub repo: Settings → Pages → Build and deployment → Source = "GitHub Actions". Confirm the custom domain `matteoena.com` is set (the `CNAME` file will populate it on first deploy). Note this in the PR description.

---

## Self-Review

**Spec coverage:**
- Astro static output → Task 1, 12. ✓
- Sass retained + tokens → Task 2. ✓
- Component structure + `content.ts` → Tasks 3–7. ✓
- Single page, sticky nav, anchors → Tasks 4–7. ✓
- Oversized-type hero, cobalt accent → Task 5. ✓
- Light/dark toggle, no-flash, system default, persisted → Tasks 2, 4. ✓
- Archivo Black + Space Grotesk self-hosted → Tasks 1, 2. ✓
- About/Skills/Certifications content → Tasks 3, 6. ✓
- Contact mailto + LinkedIn → Tasks 3, 7. ✓
- Motion + reduced-motion → Tasks 2, 7. ✓
- SEO/OG/favicon → Task 8. ✓
- app-ads.txt / manifest.json / CNAME preserved → Task 9. ✓
- Remove particles/legacy, update CLAUDE.md → Task 10. ✓
- GitHub Pages deploy → Task 12. ✓
- Acceptance criteria automated → Task 11. ✓

**Placeholder scan:** OG image (Task 8 Step 2) is the only generated-asset step; acceptance requires only that the file exists and is referenced — acceptable, flagged as replaceable. No other TBD/TODO.

**Type consistency:** `content.ts` export names (`hero`, `about`, `skills`, `certifications`, `contact`, `siteMeta`) are used identically in Tasks 4–8. Cert `status` union `'earned' | 'in-progress'` matches the CSS modifier classes `cert__status--earned` / `cert__status--in-progress`. `theme` localStorage key and `data-theme` attribute are consistent across Layout (Task 2) and Nav (Task 4). `.reveal` / `.is-visible` consistent across Task 2 and Task 7.
