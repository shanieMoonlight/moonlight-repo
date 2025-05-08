// filepath: scripts/mini-state/generate_ministate-sitemap.js
const path = require('path');
const sitemapGenerator = require('../shared/sitemap/generate-sitemap');

//--------------------------------//

const repoRoot = path.resolve(__dirname, '../..');
console.log('Repo root:', repoRoot);
console.log('Current directory:', __dirname);

const config = {
  siteMapFilename: 'sitemap.xml',
  baseUrl: 'https://spider-baby-mini-state.web.app/',
  appPath: path.join(repoRoot, 'apps/mini-state/demo'),
  distDir: path.join(repoRoot, 'dist/apps/mini-state/demo/browser'),
  baseRoutePath: path.join(repoRoot, 'apps/mini-state/demo/src/app/app.routes.ts'),
  priorityMap: {
    '/': 1.0,
    '/api': 0.8,
    default: 0.7
  },
  knownRoutes: ['/'],
  verbose: true
};

sitemapGenerator.generate(config);