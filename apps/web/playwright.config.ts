import { defineConfig, devices } from "@playwright/test";

/**
 * E2E suite for critical reader journeys. Runs against the fixture-backed
 * site by default:  npx playwright install chromium && npm run test:e2e
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run start -- --port 3100",
    port: 3100,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce" } },
    },
  ],
});
