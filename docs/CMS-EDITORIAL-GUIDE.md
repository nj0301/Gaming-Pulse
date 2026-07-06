# CMS Editorial Guide

How to run the Gaming Pulse newsroom inside Strapi (`http://localhost:1337/admin`).

## Roles and what they can do

| Role | Draft | Edit | Publish | Settings | Notes |
| --- | --- | --- | --- | --- | --- |
| Super Admin | ✓ | ✓ | ✓ | ✓ | Built-in Strapi role |
| Managing Editor | ✓ | ✓ | ✓ | ✓ (content config) | Also controls homepage, navigation, sponsored content, trends |
| Editor | ✓ | ✓ | ✓ | ✗ | Articles, games, release dates, videos, deals, trends |
| Writer | ✓ (own) | ✓ (own) | ✗ | ✗ | Sees taxonomies read-only |
| Fact Checker | ✗ | ✓ (fact fields) | ✗ | ✗ | Verifies sources & fact status on drafts |
| SEO Reviewer | ✗ | ✓ (SEO fields) | ✗ | ✗ | |
| Video Editor | ✓ videos | ✓ videos | ✓ videos | ✗ | Read-only on articles |
| Contributor | ✓ (own) | ✓ (own) | ✗ | ✗ | No access to users or settings |

Roles are created automatically on first CMS start (see `src/editorial/roles.ts`). Strapi Community Edition has no field-level write permissions, so "fact fields only" is enforced by workflow convention plus the publish gate; upgrade to EE review workflows for hard enforcement.

## Writing and publishing an article

1. **Content Manager → Article → Create new entry.**
2. Fill in title, subtitle, excerpt, body (markdown; pull quotes are blockquotes, tables are GFM).
3. Choose the **article type** (breaking, news, official-announcement, report, rumor, leak, review, guide, opinion, analysis, interview, feature, sponsored) and the **fact status**. Rumor/leak/opinion automatically render with warning banners and distinct badges on the site.
4. Assign category, platforms, related games, tags, author (and reviewer for fact-checked work).
5. Upload/select **hero media** — publishing is blocked without it.
6. Add **sources** (publisher, URL, type, authority 1–5, official flag). At least one is required to publish.
7. Fill the **SEO component** (title ≤70 chars, description ≤170). Required to publish.
8. Optional: key points ("what you need to know"), confirmed facts, unconfirmed points, gallery, videos, correction log entries, review component (score, verdict, pros/cons, copy provenance — required for review structured data).
9. **Sponsored content:** toggle `isSponsored` and set `sponsorName` — the gate refuses sponsored articles without a named sponsor, and the site labels them on every surface.
10. Save → **Publish**. If anything required is missing, Strapi returns the exact list of problems.

Reading time is computed automatically on save. Publishing, unpublishing and deleting write audit-log lines to the server log.

## Corrections

Never silently edit a published claim: add an entry to the **correction log** (date + note), update the body, and re-publish. Material corrections also get an entry on the site's `/corrections` page.

## Games and release dates

- Create the **Game** first (cover + hero artwork + summary required for a good profile page).
- Add **Release Date** entries per platform group/region. Set **precision** honestly: `exact`, `month`, `quarter`, `year` or `tba` — the site formats accordingly ("Q3 2026", "November 2026", "TBA") and never invents a day. Tick `confirmed` only for officially announced dates.
- `kind` distinguishes full releases from early access, DLC, expansions, remakes, remasters and ports; the calendar filters on it.
- Games synchronized from external databases arrive as drafts with `dataSource` set; tick `editorOverride` to stop sync from ever overwriting your edits.

## Homepage control

**Content Manager → Homepage Configuration** (single type): a repeatable list of sections, each with kind, title, `enabled`, `order`, `maxItems` and optional `curatedSlugs` (e.g. pin a specific article into the hero). Reorder or hide sections and publish — the site updates within 5 minutes, or instantly if the revalidate webhook is configured.

**Navigation Configuration** controls the header (with platform submenu children) and footer link groups. **Site Settings** holds the site name, tagline, demo notice and newsletter copy.

## Trends

Each trend requires a **plain-language `whyTrending` explanation** — it renders on every trending card. Editors can:
- **Pin** (floats to top, glows), **hide** (removed from the site), set an **expiry** (auto-hides after the timestamp),
- Nudge the score with **manualAdjustment** (−100…+100, weighted at 5%), set **editorialSignificance** (0–100, 5%),
- Relate articles, games and videos (these drive the recency/sources/reach signals).

Scores recalculate every 30 minutes (cron) from recency, engagement/search signals (stored in `signals`), source count/authority and platform reach.

## Deals

Human-checked only. Include retailer, URL, price(s), window (`startsAt`/`endsAt` — expired deals sink to a dimmed section automatically) and a one-line note explaining why the deal is good.
