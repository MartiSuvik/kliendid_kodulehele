const { join } = require("path");

/**
 * Keep Chromium inside node_modules so it lands in Netlify's build cache.
 * Puppeteer's default (~/.cache/puppeteer) is outside the cached directory, so
 * every build would re-download ~180 MB — and a local `npm run build` would not
 * find the binary that `npm install` just fetched.
 */
module.exports = {
  cacheDirectory: join(__dirname, "node_modules", ".cache", "puppeteer"),
};
