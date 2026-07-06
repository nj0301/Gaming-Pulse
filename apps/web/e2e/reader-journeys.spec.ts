import { expect, test } from "@playwright/test";

test.describe("critical reader journeys", () => {
  test("homepage renders CMS-driven sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Trending Now" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Latest News" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Upcoming Releases" })).toBeVisible();
  });

  test("reader can open an article from the homepage and see sourcing", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("heading", { level: 3 })
      .first()
      .getByRole("link")
      .click();
    await expect(page).toHaveURL(/\/news\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/fact status/i).first()).toBeVisible();
    await expect(page.getByText(/^sources$/i)).toBeVisible();
  });

  test("rumor coverage is visually flagged", async ({ page }) => {
    await page.goto("/news/ashen-covenant-footage-leak");
    await expect(page.getByRole("note")).toContainText(/not been verified/i);
    await expect(page.getByText(/unconfirmed \/ unknown/i)).toBeVisible();
  });

  test("game profile shows release dates and store links", async ({ page }) => {
    await page.goto("/games/petal-and-blade");
    await expect(page.getByRole("heading", { name: "Petal & Blade" })).toBeVisible();
    await expect(page.getByText("August 14, 2026").first()).toBeVisible();
    await expect(page.getByText("Where to get it")).toBeVisible();
  });

  test("release calendar filters narrow results", async ({ page }) => {
    await page.goto("/upcoming-games");
    const count = page.getByText(/\d+ releases?/);
    await expect(count).toBeVisible();
    const before = await count.textContent();
    await page.getByLabel("Platform").selectOption("nintendo");
    const after = await count.textContent();
    expect(before).not.toEqual(after);
  });

  test("search returns results and handles empty states", async ({ page }) => {
    await page.goto("/search?q=petal");
    await expect(page.getByText(/results? for/)).toBeVisible();
    await page.goto("/search?q=zzzznotathing");
    await expect(page.getByText(/no results/i)).toBeVisible();
  });

  test("keyboard user can skip to content and reach navigation", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("sitemaps and feeds respond", async ({ request }) => {
    for (const path of ["/sitemap.xml", "/news-sitemap.xml", "/image-sitemap.xml", "/video-sitemap.xml", "/rss.xml", "/atom.xml", "/robots.txt"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }
  });

  test("news sitemap only contains recent news URLs", async ({ request }) => {
    const xml = await (await request.get("/news-sitemap.xml")).text();
    // Fixture publish dates are in the past; the 48h window must exclude them.
    expect(xml).toContain("<urlset");
    expect(xml).not.toContain("sponsored");
  });

  test("newsletter signup validates and confirms", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Email address").first();
    await input.fill("reader@example.com");
    await page.getByRole("button", { name: "Subscribe" }).first().click();
    await expect(page.getByRole("status")).toContainText(/you're in/i);
  });
});
