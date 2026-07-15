const path = require("node:path");

module.exports = {
  testDir: path.resolve(__dirname, "capture"),
  testMatch: "**/kerno-product-demo.spec.cjs",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [["line"]],
  outputDir: path.resolve(__dirname, ".test-results"),
  use: {
    headless: process.env.KERNO_VIDEO_HEADED !== "1",
    actionTimeout: 20_000,
    navigationTimeout: 35_000,
    ignoreHTTPSErrors: true,
  },
};
