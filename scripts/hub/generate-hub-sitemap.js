
const sitemapGenerator = require('../shared/sitemap/generate-sitemap-from-app-entry-points');
const path = require('path');
const rootFinder = require('../shared/utils/find-repository-root');

const repoRoot = rootFinder.findRepositoryRootPath();
console.log('Current directory:', __dirname);
console.log('Repo root:', repoRoot);

const baseRoute = path.join(repoRoot, 'dist/apps/hub/sb-hub/browser');

const entryPoints = ['main']
console.log('baseRoute:', baseRoute);
console.log('entryPoints:', entryPoints);



// Configuration for mini-state demo app
const config = {
  siteMapFilename: 'sitemap.xml',
  baseUrl: 'https://spider-baby-hub.web.app/',
  baseRoute: baseRoute,
  appPath: path.join(repoRoot, 'apps/sb-mat-thm-demo/src/app'),
  distDir: path.join(repoRoot, 'dist/apps/hub/sb-hub/browser'),
  priorityMap: {
    '/': 1.0,
    '/api': 0.8,
    default: 0.7
  },
  entryPoints: entryPoints,
  verbose: true
};

console.log(`Generating sitemap for ${config.baseUrl}...`);

// Generate the sitemap
sitemapGenerator.generate(config);

//npx nx run spider-baby-hub:build --configuration=production 