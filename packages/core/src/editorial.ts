/** Editorial taxonomy shared between CMS and web. */

export const ARTICLE_TYPES = [
  "breaking",
  "news",
  "official-announcement",
  "report",
  "rumor",
  "leak",
  "review",
  "guide",
  "opinion",
  "analysis",
  "interview",
  "feature",
  "sponsored",
] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];

export const FACT_STATUSES = ["confirmed", "reported", "unconfirmed", "rumor", "opinion"] as const;
export type FactStatus = (typeof FACT_STATUSES)[number];

/** Types whose content is not confirmed reporting and must be visually distinct. */
export const SPECULATIVE_TYPES: ReadonlySet<ArticleType> = new Set([
  "rumor",
  "leak",
  "opinion",
]);

export function isSpeculative(type: ArticleType, factStatus?: FactStatus): boolean {
  if (SPECULATIVE_TYPES.has(type)) return true;
  return factStatus === "rumor" || factStatus === "unconfirmed";
}

export interface PublishValidationInput {
  title?: string | null;
  articleType?: string | null;
  author?: unknown;
  heroMedia?: unknown;
  sources?: unknown[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isSponsored?: boolean | null;
  sponsorName?: string | null;
}

/**
 * Publication gate: returns a list of human-readable problems; empty means OK.
 * Mirrored in the CMS lifecycle hook — keep in sync.
 */
export function validateArticleForPublish(input: PublishValidationInput): string[] {
  const problems: string[] = [];
  if (!input.title?.trim()) problems.push("Title is required.");
  if (!input.articleType) problems.push("Article type is required.");
  if (!input.author) problems.push("An author must be assigned before publishing.");
  if (!input.heroMedia) problems.push("A hero image or video is required.");
  if (!input.sources || input.sources.length === 0)
    problems.push("At least one source is required (primary source preferred).");
  if (!input.seoTitle?.trim()) problems.push("SEO title is required.");
  if (!input.seoDescription?.trim()) problems.push("SEO description is required.");
  if (input.isSponsored && !input.sponsorName?.trim())
    problems.push("Sponsored articles must disclose a sponsor name.");
  return problems;
}
