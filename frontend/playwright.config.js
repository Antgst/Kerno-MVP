import { defineConfig, devices } from "@playwright/test";

const env = globalThis.process?.env || {};
const frontendBaseUrl = env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const apiBaseUrl = env.VITE_API_BASE_URL || "http://localhost:5001/api";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: frontendBaseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `VITE_API_BASE_URL=${apiBaseUrl} npm run dev -- --host 127.0.0.1 --port 5173`,
    url: frontendBaseUrl,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
