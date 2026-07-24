const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Store Chromium inside node_modules/.cache/puppeteer so Render preserves it after build
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
