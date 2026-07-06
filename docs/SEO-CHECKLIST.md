# SEO Checklist

Status of the discovery layer. ✅ implemented · 🔲 production task.

## Metadata
- ✅ Dynamic `generateMetadata` on every route (title template, description, canonical)
- ✅ Open Graph + Twitter card metadata site-wide
- ✅ Dynamic OG images per article (`/news/[slug]/opengraph-image`)
- ✅ Accurate published/modified dates on articles (visible + structured data)
- ✅ `noIndex` support per entry (CMS SEO component) and on internal search pages
- ✅ Pagination with `rel=prev/next` links and page-numbered listings

## Structured data
- ✅ `NewsMediaOrganization` (site-wide) with publishing principles + corrections policy URLs
- ✅ `NewsArticle` for news types / `Article` for evergreen / `Review` with rating **only** when a real review payload exists
- ✅ `BreadcrumbList` on articles and game profiles
- ✅ `VideoGame` on game profiles, `VideoObject` on the video catalog
- ✅ Sponsor attribution in JSON-LD for sponsored articles
- ✅ Unit-tested builders (`apps/web/test/seo.test.ts`)

## Sitemaps & feeds
- ✅ `/sitemap.xml` — all indexable routes incl. articles, games, taxonomies, authors
- ✅ `/news-sitemap.xml` — news types only, rolling 48 h window, sponsored excluded; older entries drop out automatically while remaining in the standard sitemap
- ✅ `/image-sitemap.xml`, `/video-sitemap.xml`
- ✅ `/rss.xml` + `/atom.xml` (autodiscovery links in the layout)
- ✅ `robots.txt` (blocks `/api/`, `/search`; lists both sitemaps)

## Production tasks
- 🔲 Set `NEXT_PUBLIC_SITE_URL` to the real domain (all absolute URLs derive from it)
- 🔲 Submit sitemaps in Search Console; request Google News inclusion
- 🔲 Validate structured data on live URLs (Rich Results test) after real content lands
- 🔲 Add `hreflang` when localized editions launch
- 🔲 Point `publishingPrinciples`/`correctionsPolicy` at final policy URLs if paths change
