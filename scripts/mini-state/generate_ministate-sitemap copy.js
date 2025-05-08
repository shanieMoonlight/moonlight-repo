
const sitemapGenerator = require('../shared/sitemap/generate-sitemap');


// Configuration for mini-state demo app
const config = {
  siteMapFilename: 'sitemap.xml',
  baseUrl: 'https://spider-baby-mini-state.web.app/',
  appPath: 'C:/Users/Shaneyboy/VsCode/moonlight-repo/apps/mini-state/demo',
  distDir: 'C:/Users/Shaneyboy/VsCode/moonlight-repo/dist/apps/mini-state/demo/browser',
  baseRoutePath: 'C:/Users/Shaneyboy/VsCode/moonlight-repo/apps/mini-state/demo/src/app/app.routes.ts',  // Absolute path
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