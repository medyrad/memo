import { defineConfig, devices } from "@playwright/test";

const python = process.env.PYTHON || ".venv/bin/python";
export default defineConfig({
  testDir: "./tests/e2e", timeout: 60_000, expect: { timeout: 10_000 }, fullyParallel: false, retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { outputFolder: "output/playwright-report", open: "never" }]],
  use: { baseURL: process.env.E2E_STOREFRONT_URL || "http://localhost:3000", trace: "retain-on-failure", screenshot: "only-on-failure", video: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["iPhone 13"] } }],
  webServer: process.env.E2E_EXTERNAL === "1" ? undefined : [
    { command: `rm -f /tmp/memostyles-e2e.sqlite3 && DJANGO_SETTINGS_MODULE=config.settings.e2e ${python} apps/backend/manage.py migrate --noinput && DJANGO_SETTINGS_MODULE=config.settings.e2e ${python} apps/backend/manage.py seed_e2e && DJANGO_SETTINGS_MODULE=config.settings.e2e ${python} apps/backend/manage.py runserver 0.0.0.0:8000`, url: "http://localhost:8000/health/ready/", timeout: 120_000, reuseExistingServer: !process.env.CI },
    { command: "pnpm --filter @memostyles/storefront dev", url: "http://localhost:3000", timeout: 120_000, reuseExistingServer: !process.env.CI, env: { NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000/api", NEXT_PUBLIC_SITE_URL: "http://localhost:3000" } },
    { command: "pnpm --filter @memostyles/admin-panel dev", url: "http://localhost:3001/login", timeout: 120_000, reuseExistingServer: !process.env.CI, env: { NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000/api", API_BASE_URL: "http://localhost:8000/api" } },
  ],
});
