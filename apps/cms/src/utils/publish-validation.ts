/**
 * Publish gate for articles — mirrors validateArticleForPublish in
 * @gaming-pulse/core (canonical, unit-tested). Keep in sync.
 */

export interface ArticlePublishData {
  title?: string | null;
  articleType?: string | null;
  author?: unknown;
  heroMedia?: unknown;
  sources?: unknown[] | null;
  seo?: { seoTitle?: string | null; seoDescription?: string | null } | null;
  isSponsored?: boolean | null;
  sponsorName?: string | null;
}

export function validateArticleForPublish(input: ArticlePublishData): string[] {
  const problems: string[] = [];
  if (!input.title?.trim()) problems.push("Title is required.");
  if (!input.articleType) problems.push("Article type is required.");
  if (!input.author) problems.push("An author must be assigned before publishing.");
  if (!input.heroMedia) problems.push("A hero image or video is required.");
  if (!input.sources || input.sources.length === 0)
    problems.push("At least one source is required (primary source preferred).");
  if (!input.seo?.seoTitle?.trim()) problems.push("SEO title is required.");
  if (!input.seo?.seoDescription?.trim()) problems.push("SEO description is required.");
  if (input.isSponsored && !input.sponsorName?.trim())
    problems.push("Sponsored articles must disclose a sponsor name.");
  return problems;
}
