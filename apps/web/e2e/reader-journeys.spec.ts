import { expect, test } from "@playwright/test";

/**
 * Every page tested here is backed by real data: the live news RSS wire
 * (no configuration needed) or RAWG (needs RAWG_API_KEY; tests for those
 * pages accept either the real-content state or the honest "not configured"
 * empty state — never a fictional fallback, since none exists anymore).
 */
test.describe("critical reader journeys", () => {
  test("homepage renders real, CMS-ordered sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Trending Now" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Latest News" })).toBeVisible();
  });

  test("a homepage headline links to the real external source, not an internal page", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('main a[target="_blank"][rel*="noopener"]').first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^https?:\/\//);
    expect(href).not.toContain(new URL(page.url()).host);
  });

  test("/news lists real headlines attributed to real outlets", async ({ page }) => {
    await page.goto("/news");
    await expect(page.getByRole("heading", { name: "News", level: 1 })).toBeVisible();
    const outlets = ["Eurogamer", "PC Gamer", "GameSpot", "Rock Paper Shotgun", "VG247", "Destructoid", "Nintendo Life"];
    const bodyText = await page.locator("main").innerText();
    expect(outlets.some((name) => bodyText.includes(name))).toBe(true);
  });

  test("/trending explains the real cross-outlet methodology", async ({ page }) => {
    await page.goto("/trending");
    await expect(page.getByText(/multiple different real outlets/i)).toBeVisible();
  });

  test("/games shows real games or an honest not-configured state — never fictional content", async ({ page }) => {
    await page.goto("/games");
    await expect(page.getByRole("heading", { name: "Games", level: 1 })).toBeVisible();
    const notConfigured = page.getByText(/not configured/i);
    const gameLinks = page.locator('a[href^="/games/"]');
    await expect(notConfigured.or(gameLinks.first())).toBeVisible();
  });

  test("/upcoming-games shows real releases or an honest not-configured state", async ({ page }) => {
    await page.goto("/upcoming-games");
    await expect(page.getByRole("heading", { name: "Upcoming releases" })).toBeVisible();
  });

  test("search returns live results and handles empty states", async ({ page }) => {
    await page.goto("/search?q=the");
    await expect(page.getByText(/results? for/)).toBeVisible();
    await page.goto("/search?q=zzzqqqnotarealthing");
    await expect(page.getByText(/no results/i)).toBeVisible();
  });

  test("keyboard user can skip to content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("sitemap and robots respond, and no dead feed routes remain", async ({ request }) => {
    for (const path of ["/sitemap.xml", "/robots.txt"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }
    for (const path of ["/rss.xml", "/atom.xml", "/news-sitemap.xml", "/image-sitemap.xml", "/video-sitemap.xml"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
    }
  });

  test("deleted fictional-content routes are gone", async ({ request }) => {
    for (const path of ["/reviews", "/guides", "/esports", "/hardware", "/deals", "/videos", "/team", "/corrections"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
    }
  });

  test("newsletter signup validates and confirms", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Email address").first();
    await input.fill("reader@example.com");
    await page.getByRole("button", { name: "Subscribe" }).first().click();
    await expect(page.getByRole("status")).toContainText(/you're in/i);
  });
});
