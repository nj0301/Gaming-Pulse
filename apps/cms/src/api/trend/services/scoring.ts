/**
 * Trend scoring service: recalculates every visible trend's composite score
 * from its stored signals plus live relation data. Invoked by the cron task
 * (config/cron-tasks.ts) and available for manual runs from admin tooling.
 *
 * Editors keep control: `pinned` trends float to the top regardless of score,
 * `manualAdjustment` feeds the 5% editorial band, `hidden` removes a trend
 * from the public API, and `expiresAt` retires it automatically.
 */
import type { Core } from "@strapi/strapi";
import { calculateTrendScore, type TrendSignals } from "../../../utils/trending";

interface StoredSignals extends Partial<TrendSignals> {
  searchInterest?: number;
  engagementVelocity?: number;
  peakEngagementVelocity?: number;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async recalculateAll(): Promise<{ updated: number; expired: number }> {
    const now = new Date();
    const trends = await strapi.documents("api::trend.trend").findMany({
      status: "published",
      populate: ["relatedArticles", "relatedArticles.sources", "relatedArticles.platforms", "relatedGames"],
      limit: 200,
    });

    let updated = 0;
    let expired = 0;

    for (const trend of trends) {
      if (trend.expiresAt && new Date(trend.expiresAt) < now) {
        // Cast: generated content types lag behind schema edits until `strapi ts:generate-types` runs.
        await strapi.documents("api::trend.trend").update({
          documentId: trend.documentId,
          data: { hidden: true } as Record<string, unknown>,
        });
        await strapi.documents("api::trend.trend").publish({ documentId: trend.documentId });
        expired += 1;
        continue;
      }

      const articles = (trend.relatedArticles ?? []) as Array<{
        publishedAt?: string;
        sources?: Array<{ authorityLevel?: number }>;
        platforms?: unknown[];
      }>;

      const newestSignal = articles
        .map((a) => (a.publishedAt ? +new Date(a.publishedAt) : 0))
        .reduce((max, t) => Math.max(max, t), 0);
      const hoursSinceLastSignal = newestSignal
        ? (now.getTime() - newestSignal) / 3_600_000
        : 24 * 7;

      const allSources = articles.flatMap((a) => a.sources ?? []);
      const platformSet = new Set(
        articles.flatMap((a) => (a.platforms ?? []).map((p) => JSON.stringify(p))),
      );

      const stored = (trend.signals ?? {}) as StoredSignals;

      const score = calculateTrendScore({
        hoursSinceLastSignal,
        engagementVelocity: stored.engagementVelocity ?? 0,
        peakEngagementVelocity: stored.peakEngagementVelocity ?? 100,
        searchInterest: stored.searchInterest ?? 0,
        sourceCount: allSources.length,
        averageSourceAuthority:
          allSources.length > 0
            ? allSources.reduce((sum, s) => sum + (s.authorityLevel ?? 3), 0) / allSources.length
            : 1,
        platformCount: platformSet.size,
        editorialSignificance: trend.editorialSignificance ?? 50,
        manualAdjustment: trend.manualAdjustment ?? 0,
      });

      await strapi.documents("api::trend.trend").update({
        documentId: trend.documentId,
        data: { score } as Record<string, unknown>,
      });
      await strapi.documents("api::trend.trend").publish({ documentId: trend.documentId });
      updated += 1;
    }

    strapi.log.info(`[trend-scoring] recalculated=${updated} expired=${expired}`);
    return { updated, expired };
  },
});
