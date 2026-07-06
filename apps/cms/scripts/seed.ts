/**
 * Gaming Pulse CMS seeder.
 *
 * Loads the fictional demo content from @gaming-pulse/seed-data into Strapi:
 * taxonomies, companies, authors, games, release dates, videos, articles,
 * trends, deals and the homepage/navigation/site-settings single types.
 * Placeholder SVG artwork is uploaded through the media library so publish
 * validation (hero media required) passes exactly as it would for editors.
 *
 * Idempotence: aborts if articles already exist. Run on a fresh database:
 *   npm run seed --workspace apps/cms
 */
import { createStrapi, compileStrapi } from "@strapi/strapi";
import { statSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  articles,
  authors,
  categories,
  companies,
  deals,
  games,
  homepageSections,
  navigation,
  platforms,
  releaseDates,
  siteSettings,
  tags,
  trends,
  videos,
  type SeedImage,
} from "@gaming-pulse/seed-data";

const WEB_PUBLIC = resolve(__dirname, "../../web/public");


async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = "warn";

  const existing = await app.documents("api::article.article").findMany({ limit: 1 });
  if (existing.length > 0) {
    console.log("Seed skipped: articles already exist. Use a fresh database to reseed.");
    await app.destroy();
    process.exit(0);
  }

  const uploadService = app.plugin("upload").service("upload");
  const mediaCache = new Map<string, number>();

  async function uploadImage(image: SeedImage): Promise<number | null> {
    if (mediaCache.has(image.src)) return mediaCache.get(image.src)!;
    const filePath = join(WEB_PUBLIC, image.src);
    try {
      const size = statSync(filePath).size;
      const [file] = await uploadService.upload({
        data: {
          fileInfo: {
            name: image.src.split("/").pop(),
            alternativeText: image.alt,
            caption: image.caption ?? image.credit ?? "",
          },
        },
        files: {
          filepath: filePath,
          originalFilename: image.src.split("/").pop(),
          mimetype: "image/svg+xml",
          size,
        },
      });
      mediaCache.set(image.src, file.id);
      return file.id;
    } catch (error) {
      console.warn(`  media upload failed for ${image.src}: ${(error as Error).message}`);
      return null;
    }
  }

  const ids = {
    platform: new Map<string, string>(),
    genre: new Map<string, string>(),
    company: new Map<string, string>(),
    author: new Map<string, string>(),
    category: new Map<string, string>(),
    tag: new Map<string, string>(),
    game: new Map<string, string>(),
    video: new Map<string, string>(),
    article: new Map<string, string>(),
  };

  console.log("Seeding platforms, genres, companies, authors, categories, tags…");
  for (const p of platforms) {
    const doc = await app.documents("api::platform.platform").create({
      data: { name: p.name, slug: p.slug, shortName: p.shortName, description: p.description, accent: p.accent },
    });
    ids.platform.set(p.slug, doc.documentId);
  }

  const genreNames = [...new Set(games.flatMap((g) => g.genres))];
  for (const name of genreNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const doc = await app.documents("api::genre.genre").create({ data: { name, slug } });
    ids.genre.set(name, doc.documentId);
  }

  for (const c of companies) {
    const doc = await app.documents("api::company.company").create({
      data: { name: c.name, slug: c.slug, role: c.role, country: c.country, founded: c.founded, description: c.description },
    });
    ids.company.set(c.slug, doc.documentId);
  }

  for (const a of authors) {
    const avatarId = await uploadImage(a.avatar);
    const doc = await app.documents("api::author.author").create({
      data: { name: a.name, slug: a.slug, role: a.role, bio: a.bio, expertise: a.expertise, avatar: avatarId },
    });
    ids.author.set(a.slug, doc.documentId);
  }

  for (const c of categories) {
    const doc = await app.documents("api::category.category").create({
      data: { name: c.name, slug: c.slug, description: c.description },
    });
    ids.category.set(c.slug, doc.documentId);
  }

  for (const t of tags) {
    const doc = await app.documents("api::tag.tag").create({ data: { name: t.name, slug: t.slug } });
    ids.tag.set(t.slug, doc.documentId);
  }

  console.log("Seeding games…");
  for (const g of games) {
    const coverId = await uploadImage(g.cover);
    const heroId = await uploadImage(g.heroArtwork);
    const screenshotIds = (await Promise.all(g.screenshots.map(uploadImage))).filter(Boolean);
    const doc = await app.documents("api::game.game").create({
      data: {
        name: g.name,
        slug: g.slug,
        externalDatabaseId: g.externalDatabaseId,
        summary: g.summary,
        description: g.description,
        cover: coverId,
        heroArtwork: heroId,
        screenshots: screenshotIds as number[],
        genres: g.genres.map((name) => ids.genre.get(name)!),
        themes: g.themes,
        platforms: g.platformSlugs.map((s) => ids.platform.get(s)!),
        developer: ids.company.get(g.developerSlug),
        publisher: ids.company.get(g.publisherSlug),
        franchise: g.franchise,
        releaseStatus: g.releaseStatus,
        ageRatings: g.ageRatings,
        gameModes: g.gameModes,
        officialWebsite: g.officialWebsite,
        storeLinks: g.storeLinks,
        trendingScore: g.trendingScore,
        dataSource: g.dataSource,
        lastSynchronizedAt: g.lastSynchronizedAt,
        seo: { seoTitle: `${g.name} — news, release dates and coverage`, seoDescription: g.summary.slice(0, 160) },
      },
    });
    await app.documents("api::game.game").publish({ documentId: doc.documentId });
    ids.game.set(g.slug, doc.documentId);
  }

  console.log("Seeding release dates…");
  for (const rd of releaseDates) {
    await app.documents("api::release-date.release-date").create({
      data: {
        game: ids.game.get(rd.gameSlug),
        platforms: rd.platformSlugs.map((s) => ids.platform.get(s)!),
        region: rd.region,
        date: rd.date,
        precision: rd.precision,
        kind: rd.kind,
        confirmed: rd.confirmed,
        note: rd.note,
      },
    });
  }

  console.log("Seeding videos…");
  for (const v of videos) {
    const posterId = await uploadImage(v.poster);
    const doc = await app.documents("api::video.video").create({
      data: {
        title: v.title,
        slug: v.slug,
        kind: v.kind,
        provider: "demo-local",
        poster: posterId,
        durationSeconds: v.durationSeconds,
        description: v.description,
        relatedGame: v.relatedGameSlug ? ids.game.get(v.relatedGameSlug) : undefined,
        publishedAt: undefined,
      },
    });
    await app.documents("api::video.video").publish({ documentId: doc.documentId });
    ids.video.set(v.slug, doc.documentId);
  }

  // Link game -> trailers now that videos exist.
  for (const g of games) {
    if (g.trailerSlugs.length === 0) continue;
    await app.documents("api::game.game").update({
      documentId: ids.game.get(g.slug)!,
      data: { trailers: g.trailerSlugs.map((s) => ids.video.get(s)!).filter(Boolean) } as Record<string, unknown>,
    });
    await app.documents("api::game.game").publish({ documentId: ids.game.get(g.slug)! });
  }

  console.log("Seeding articles…");
  for (const a of articles) {
    const heroId = await uploadImage(a.heroImage);
    const gallery = [];
    for (const item of a.gallery ?? []) {
      const imageId = await uploadImage(item);
      if (imageId) gallery.push({ image: imageId, caption: item.caption, credit: item.credit });
    }
    const doc = await app.documents("api::article.article").create({
      data: {
        title: a.title,
        slug: a.slug,
        subtitle: a.subtitle,
        excerpt: a.excerpt,
        body: a.body,
        articleType: a.articleType,
        factStatus: a.factStatus,
        category: ids.category.get(a.categorySlug),
        platforms: a.platformSlugs.map((s) => ids.platform.get(s)!),
        relatedGames: a.relatedGameSlugs.map((s) => ids.game.get(s)!),
        tags: a.tagSlugs.map((s) => ids.tag.get(s)!),
        author: ids.author.get(a.authorSlug),
        reviewer: a.reviewerSlug ? ids.author.get(a.reviewerSlug) : undefined,
        heroMedia: heroId,
        heroCaption: a.heroImage.caption,
        heroCredit: a.heroImage.credit,
        gallery,
        videos: (a.videoSlugs ?? []).map((s) => ids.video.get(s)!).filter(Boolean),
        sources: a.sources,
        keyPoints: a.keyPoints,
        confirmedFacts: a.confirmedFacts,
        unconfirmedPoints: a.unconfirmedPoints,
        correctionLog: a.correctionLog,
        review: a.review
          ? {
              score: a.review.score,
              verdict: a.review.verdict,
              pros: a.review.pros,
              cons: a.review.cons,
              reviewedOnPlatform: a.review.reviewedOnPlatform,
              copyProvidedBy: a.review.copyProvidedBy,
            }
          : undefined,
        isBreaking: a.isBreaking,
        isFeatured: a.isFeatured,
        isSponsored: a.isSponsored,
        sponsorName: a.sponsorName,
        aiAssisted: a.aiAssisted,
        humanReviewed: a.humanReviewed,
        newsletterPlacement: a.newsletterPlacement,
        seo: { seoTitle: a.seoTitle, seoDescription: a.seoDescription },
      },
    });
    await app.documents("api::article.article").publish({ documentId: doc.documentId });
    ids.article.set(a.slug, doc.documentId);
  }

  console.log("Seeding trends and deals…");
  for (const t of trends) {
    const doc = await app.documents("api::trend.trend").create({
      data: {
        title: t.title,
        slug: t.slug,
        whyTrending: t.whyTrending,
        context: t.context,
        score: t.score,
        pinned: t.pinned,
        hidden: t.hidden,
        manualAdjustment: t.manualAdjustment,
        expiresAt: t.expiresAt,
        relatedArticles: t.relatedArticleSlugs.map((s) => ids.article.get(s)!).filter(Boolean),
        relatedGames: t.relatedGameSlugs.map((s) => ids.game.get(s)!).filter(Boolean),
        signals: { searchInterest: Math.round(t.score * 0.8), engagementVelocity: Math.round(t.score * 0.6), peakEngagementVelocity: 100 },
      },
    });
    await app.documents("api::trend.trend").publish({ documentId: doc.documentId });
  }

  for (const d of deals) {
    const doc = await app.documents("api::deal.deal").create({
      data: {
        title: d.title,
        slug: d.slug,
        game: d.gameSlug ? ids.game.get(d.gameSlug) : undefined,
        retailer: d.retailer,
        url: d.url,
        price: d.price,
        originalPrice: d.originalPrice,
        currency: d.currency,
        discountPercent: d.discountPercent,
        isFree: d.isFree,
        startsAt: d.startsAt,
        endsAt: d.endsAt,
        platforms: d.platformSlugs.map((s) => ids.platform.get(s)!),
        note: d.note,
      },
    });
    await app.documents("api::deal.deal").publish({ documentId: doc.documentId });
  }

  console.log("Seeding site configuration…");
  const homepage = await app.documents("api::homepage-config.homepage-config").create({
    data: { sections: homepageSections },
  });
  await app.documents("api::homepage-config.homepage-config").publish({ documentId: homepage.documentId });

  const nav = await app.documents("api::navigation-config.navigation-config").create({
    data: {
      primary: navigation.primary.map((item) => ({
        label: item.label,
        href: item.href,
        children: (item.children ?? []).map((c) => ({ label: c.label, href: c.href })),
      })),
      footer: navigation.footer.map((item) => ({ label: item.label, href: item.href, children: [] })),
    },
  });
  await app.documents("api::navigation-config.navigation-config").publish({ documentId: nav.documentId });

  await app.documents("api::site-setting.site-setting").create({
    data: {
      siteName: siteSettings.siteName,
      tagline: siteSettings.tagline,
      demoNotice: siteSettings.demoNotice,
      socialLinks: siteSettings.socialLinks,
      newsletterHeading: siteSettings.newsletterHeading,
      newsletterSubheading: siteSettings.newsletterSubheading,
    },
  });

  console.log(
    `Seed complete: ${articles.length} articles, ${games.length} games, ${releaseDates.length} release dates, ${videos.length} videos, ${trends.length} trends, ${deals.length} deals.`,
  );
  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
