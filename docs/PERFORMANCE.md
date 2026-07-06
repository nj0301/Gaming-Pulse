# Performance Notes

## Budget & approach

Editorial content is server-rendered (RSC) and cached with ISR (5-minute revalidate + webhook-driven instant invalidation). Client JavaScript is limited to interaction islands: header/search, platform tabs, calendar filters, share buttons, newsletter form, analytics, and the motion wrappers.

## What keeps Core Web Vitals healthy

- **LCP:** hero images use `next/image` with `priority` only above the fold; AVIF/WebP served automatically; fonts loaded via `next/font` (self-hosted, `display: swap`, no layout shift from FOIT).
- **CLS:** every image carries width/height or `fill` with a reserved aspect-ratio box; skeleton loaders reserve space; no layout-shifting animations (transform/opacity only).
- **INP:** scroll handlers are rAF-throttled and passive; filtering happens over pre-joined in-memory data; no heavy hydration on listing pages.
- **Animation cost:** mesh/grid/ticker/pulse effects are pure CSS; Motion is tree-shaken and only used in small client components; card tilt is pointer-gated (desktop only); everything obeys `prefers-reduced-motion` **and** the site "Reduce effects" toggle (`<html data-effects>` kills CSS animation globally). This is the animation-lite fallback.
- **No third-party media:** demo build embeds no external players or hotlinked images; video cards are posters with play affordances.

## Measured locally (production build, fixture mode)

Route generation: 16 article pages SSG'd; static pages prerendered; listings ISR. First-load JS stays dominated by the framework bundle since sections are server components. Run your own numbers:

```bash
npm run build:web && npm run start --workspace apps/web
npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --throttling.cpuSlowdownMultiplier=4
```

## Production checklist

- 🔲 Enable a CDN in front of both the site and the CMS media library (`MEDIA_CDN_HOST`)
- 🔲 Verify Lighthouse mobile ≥ 90 on home, article, game and calendar pages with real content volumes
- 🔲 Watch article-body length — bodies over ~3k words should adopt the optional table of contents
- 🔲 If a WebGL/particle hero is ever added, lazy-load it behind the effects toggle and the `saveData` hint
