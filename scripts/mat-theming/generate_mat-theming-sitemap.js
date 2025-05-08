
const sitemapGenerator = require('../shared/sitemap/generate-sitemap');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
console.log('Repo root:', repoRoot);
console.log('Current directory:', __dirname);

// Configuration for mini-state demo app
const config = {
  siteMapFilename: 'sitemap.xml',
  baseUrl: 'https://spiderbabymaterialtheming.web.app/',
  appPath:  path.join(repoRoot, 'apps/sb-mat-thm-demo/src/app'),
  distDir: path.join(repoRoot, 'dist/apps/sb-mat-thm-demo/browser'),
  baseRoutePath:  path.join(repoRoot, 'apps/sb-mat-thm-demo/src/app/app.routes.ts'),  // Absolute path
  priorityMap: {
    '/': 1.0,
    '/api': 0.8,
    default: 0.7
  },
  knownRoutes: ['/'],
  verbose: true
};

console.log(`Generating sitemap for ${config.baseUrl}...`);

// Generate the sitemap
sitemapGenerator.generate(config);