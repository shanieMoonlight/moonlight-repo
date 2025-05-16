
const sitemapGenerator = require('../shared/sitemap/generate-sitemap-from-app-entry-points');
const path = require('path');
const rootFinder = require('../shared/utils/find-repository-root');

const repoRoot = rootFinder.findRepositoryRootPath();
console.log('Current directory:', __dirname);
console.log('Repo root:', repoRoot);

const baseRoute = path.join(repoRoot, 'dist/apps/routes/routes/browser');

const entryPoints = ['/', 'main', 'admin']
console.log('baseRoute:', baseRoute);
console.log('entryPoints:', entryPoints);


// Configuration for mini-state demo app
const config = {
  siteMapFilename: 'sitemap.xml',
  baseUrl: 'https://spider-baby-route-defs.web.app/',
  baseRoute: baseRoute,
  distDir: path.join(repoRoot, 'dist/apps/routes/routes/browser'),
  priorityMap: {
    '/': 1.0,
    '/main/tutorial': 0.9,
    // '/admin': 0.8,
    default: 0.7
  },
  entryPoints: entryPoints,
  verbose: true
};

console.log(`Generating sitemap for ${config.baseUrl}...`);

// Generate the sitemap
sitemapGenerator.generate(config);

//npx nx run spider-baby-hub:build --configuration=production 