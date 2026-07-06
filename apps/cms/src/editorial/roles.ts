/**
 * Editorial role bootstrap.
 *
 * Creates the eight Gaming Pulse admin roles idempotently. Permissions follow
 * the editorial matrix in docs/CMS-EDITORIAL-GUIDE.md:
 *
 *  - Super Admin ......... built-in Strapi role (not created here)
 *  - Managing Editor ..... full content control incl. publish + sponsored
 *  - Editor .............. read/update/publish articles; no settings
 *  - Writer .............. create/update own drafts; cannot publish
 *  - Fact Checker ........ update articles (fact status, sources); no publish
 *  - SEO Reviewer ........ update articles (SEO component); no publish
 *  - Video Editor ........ full control of videos; read articles
 *  - Contributor ......... create drafts only; no settings, no other users
 *
 * Strapi's admin RBAC stores permissions per role; fine-grained field-level
 * conditions (e.g. Fact Checker editing only factStatus) are enforced
 * editorially and via review workflow — Strapi CE does not support
 * field-level write permissions.
 */
import type { Core } from "@strapi/strapi";

const CONTENT_UIDS = [
  "api::article.article",
  "api::game.game",
  "api::release-date.release-date",
  "api::platform.platform",
  "api::genre.genre",
  "api::company.company",
  "api::author.author",
  "api::category.category",
  "api::tag.tag",
  "api::video.video",
  "api::deal.deal",
  "api::trend.trend",
] as const;

type Action = "create" | "read" | "update" | "delete" | "publish";

const perm = (action: Action, subject: string) => ({
  action: `plugin::content-manager.explorer.${action}`,
  subject,
  conditions: [] as string[],
  properties: {},
});

interface RoleSpec {
  name: string;
  code: string;
  description: string;
  grants: Array<{ subjects: readonly string[]; actions: Action[]; ownOnly?: boolean }>;
}

const ROLE_SPECS: RoleSpec[] = [
  {
    name: "Managing Editor",
    code: "gp-managing-editor",
    description: "Full editorial control including publishing, sponsored content, trends and homepage curation.",
    grants: [{ subjects: [...CONTENT_UIDS, "api::homepage-config.homepage-config", "api::navigation-config.navigation-config", "api::site-setting.site-setting"], actions: ["create", "read", "update", "delete", "publish"] }],
  },
  {
    name: "Editor",
    code: "gp-editor",
    description: "Reviews, edits and publishes articles, games and release dates. No site settings access.",
    grants: [
      { subjects: ["api::article.article", "api::game.game", "api::release-date.release-date", "api::video.video", "api::deal.deal", "api::trend.trend"], actions: ["create", "read", "update", "publish"] },
      { subjects: ["api::platform.platform", "api::genre.genre", "api::company.company", "api::author.author", "api::category.category", "api::tag.tag"], actions: ["create", "read", "update"] },
    ],
  },
  {
    name: "Writer",
    code: "gp-writer",
    description: "Drafts articles; cannot publish. Sponsored-content fields are reviewed by editors before publish.",
    grants: [
      { subjects: ["api::article.article"], actions: ["create", "read", "update"], ownOnly: true },
      { subjects: ["api::game.game", "api::platform.platform", "api::genre.genre", "api::company.company", "api::category.category", "api::tag.tag", "api::video.video"], actions: ["read"] },
    ],
  },
  {
    name: "Fact Checker",
    code: "gp-fact-checker",
    description: "Verifies sources and factual status on drafts. Cannot publish.",
    grants: [
      { subjects: ["api::article.article"], actions: ["read", "update"] },
      { subjects: ["api::game.game", "api::company.company", "api::release-date.release-date"], actions: ["read"] },
    ],
  },
  {
    name: "SEO Reviewer",
    code: "gp-seo-reviewer",
    description: "Reviews SEO metadata on drafts. Cannot publish.",
    grants: [{ subjects: ["api::article.article", "api::game.game", "api::category.category"], actions: ["read", "update"] }],
  },
  {
    name: "Video Editor",
    code: "gp-video-editor",
    description: "Manages video content and galleries; read-only on articles.",
    grants: [
      { subjects: ["api::video.video"], actions: ["create", "read", "update", "delete", "publish"] },
      { subjects: ["api::article.article", "api::game.game"], actions: ["read"] },
    ],
  },
  {
    name: "Contributor",
    code: "gp-contributor",
    description: "Creates own drafts only. No settings, users or publishing access.",
    grants: [
      { subjects: ["api::article.article"], actions: ["create", "read", "update"], ownOnly: true },
      { subjects: ["api::category.category", "api::tag.tag"], actions: ["read"] },
    ],
  },
];

export async function bootstrapEditorialRoles(strapi: Core.Strapi): Promise<void> {
  const roleService = strapi.service("admin::role");
  const permissionService = strapi.service("admin::permission");

  for (const spec of ROLE_SPECS) {
    try {
      const existing = await strapi.query("admin::role").findOne({ where: { code: spec.code } });
      if (existing) continue;

      const role = await roleService.create({
        name: spec.name,
        code: spec.code,
        description: spec.description,
      });

      const permissions = spec.grants.flatMap((grant) =>
        grant.subjects.flatMap((subject) =>
          grant.actions.map((action) => {
            const p = perm(action, subject);
            if (grant.ownOnly && (action === "read" || action === "update")) {
              p.conditions = ["admin::is-creator"];
            }
            return p;
          }),
        ),
      );

      await permissionService.assign(role.id, permissions);
      strapi.log.info(`[editorial-roles] created role ${spec.name}`);
    } catch (error) {
      strapi.log.warn(`[editorial-roles] could not create ${spec.name}: ${(error as Error).message}`);
    }
  }
}
