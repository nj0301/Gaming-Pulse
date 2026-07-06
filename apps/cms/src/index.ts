import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { validateArticleForPublish } from "./utils/publish-validation";
import { bootstrapEditorialRoles } from "./editorial/roles";

const { ApplicationError } = errors;

const WORDS_PER_MINUTE = 225;

function estimateReadingTime(body: string): number {
  const words = String(body ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    /**
     * Document-service middleware:
     *  - blocks publishing articles that fail editorial validation
     *    (missing source, author, hero media, type or SEO fields)
     *  - computes readingTime on create/update
     *  - writes an audit log line for publish/unpublish/delete of articles
     */
    strapi.documents.use(async (context, next) => {
      if (context.uid !== "api::article.article") return next();

      if (context.action === "create" || context.action === "update") {
        const data = (context.params as { data?: { body?: string; readingTime?: number } }).data;
        if (data?.body) {
          data.readingTime = estimateReadingTime(data.body);
        }
      }

      if (context.action === "publish") {
        const documentId = (context.params as { documentId?: string }).documentId;
        if (documentId) {
          const draft = await strapi.documents("api::article.article").findOne({
            documentId,
            status: "draft",
            populate: ["author", "heroMedia", "sources", "seo"],
          });
          const problems = validateArticleForPublish({
            title: draft?.title,
            articleType: draft?.articleType,
            author: draft?.author,
            heroMedia: draft?.heroMedia,
            sources: draft?.sources as unknown[],
            seo: draft?.seo,
            isSponsored: draft?.isSponsored,
            sponsorName: draft?.sponsorName,
          });
          if (problems.length > 0) {
            throw new ApplicationError(`Cannot publish article: ${problems.join(" ")}`);
          }
        }
      }

      const result = await next();

      if (["publish", "unpublish", "delete"].includes(context.action)) {
        strapi.log.info(
          `[editorial-audit] action=${context.action} uid=${context.uid} documentId=${(context.params as { documentId?: string }).documentId ?? "n/a"}`,
        );
      }

      return result;
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await bootstrapEditorialRoles(strapi);

    // Open public read access for content the website consumes.
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });
    if (publicRole) {
      const readActions = [
        "api::article.article.find",
        "api::article.article.findOne",
        "api::game.game.find",
        "api::game.game.findOne",
        "api::release-date.release-date.find",
        "api::release-date.release-date.findOne",
        "api::platform.platform.find",
        "api::platform.platform.findOne",
        "api::genre.genre.find",
        "api::genre.genre.findOne",
        "api::company.company.find",
        "api::company.company.findOne",
        "api::author.author.find",
        "api::author.author.findOne",
        "api::category.category.find",
        "api::category.category.findOne",
        "api::tag.tag.find",
        "api::tag.tag.findOne",
        "api::video.video.find",
        "api::video.video.findOne",
        "api::deal.deal.find",
        "api::deal.deal.findOne",
        "api::trend.trend.find",
        "api::trend.trend.findOne",
        "api::homepage-config.homepage-config.find",
        "api::navigation-config.navigation-config.find",
        "api::site-setting.site-setting.find",
        "api::search.search.query",
        "api::newsletter-subscriber.newsletter-subscriber.create",
      ];
      for (const action of readActions) {
        const existing = await strapi
          .query("plugin::users-permissions.permission")
          .findOne({ where: { action, role: publicRole.id } });
        if (!existing) {
          await strapi
            .query("plugin::users-permissions.permission")
            .create({ data: { action, role: publicRole.id } });
        }
      }
    }
  },
};
