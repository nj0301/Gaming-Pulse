export default {
  /**
   * Recalculate trend scores every 30 minutes.
   * Enabled via CRON_ENABLED=true (see config/server.ts).
   */
  trendScoring: {
    task: async ({ strapi }: { strapi: import('@strapi/strapi').Core.Strapi }) => {
      try {
        await strapi.service("api::trend.scoring").recalculateAll();
      } catch (error) {
        strapi.log.error(`[trend-scoring] failed: ${(error as Error).message}`);
      }
    },
    options: { rule: "*/30 * * * *" },
  },
};
