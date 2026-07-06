import { describe, expect, it } from "vitest";
import type { RawgGame } from "@/lib/rawg";
import { breadcrumbJsonLd, gameJsonLd, organizationJsonLd } from "@/lib/seo/jsonld";

const sampleGame: RawgGame = {
  slug: "elden-ring",
  name: "Elden Ring",
  summary: "An action RPG.",
  description: "An action RPG set in a vast open world.",
  cover: { src: "https://media.rawg.io/cover.jpg", alt: "Elden Ring cover art", width: 1280, height: 720, credit: "RAWG" },
  heroArtwork: { src: "https://media.rawg.io/hero.jpg", alt: "Elden Ring key art", width: 1280, height: 720, credit: "RAWG" },
  screenshots: [],
  genres: ["RPG", "Action"],
  genreSlugs: ["role-playing-games-rpg", "action"],
  platformNames: ["PC", "PlayStation 5"],
  releaseStatus: "released",
  releaseDate: "2022-02-25",
  rating: 4.6,
  website: "https://example.com",
  storeLinks: [{ store: "Steam", url: "https://store.steampowered.com/elden-ring" }],
};

describe("JSON-LD builders (real-data structured data)", () => {
  it("builds an Organization entry with no fictional policy links", () => {
    const org = organizationJsonLd();
    expect(org["@type"]).toBe("Organization");
    expect(org).not.toHaveProperty("publishingPrinciples");
    expect(org).not.toHaveProperty("correctionsPolicy");
  });

  it("builds positioned breadcrumbs with absolute URLs", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", href: "/" },
      { name: "Games", href: "/games" },
    ]) as { itemListElement: Array<{ position: number; item: string }> };
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[1].item).toMatch(/^https?:\/\//);
  });

  it("builds a VideoGame entry from real RAWG data, including rating", () => {
    const data = gameJsonLd(sampleGame) as Record<string, unknown>;
    expect(data["@type"]).toBe("VideoGame");
    expect(data.name).toBe("Elden Ring");
    expect(data.genre).toEqual(["RPG", "Action"]);
    expect(data.gamePlatform).toEqual(["PC", "PlayStation 5"]);
    expect(data).toHaveProperty("aggregateRating");
    expect((data.aggregateRating as { ratingValue: number }).ratingValue).toBe(4.6);
  });

  it("omits aggregateRating when RAWG has no rating yet", () => {
    const data = gameJsonLd({ ...sampleGame, rating: 0 }) as Record<string, unknown>;
    expect(data).not.toHaveProperty("aggregateRating");
  });
});
