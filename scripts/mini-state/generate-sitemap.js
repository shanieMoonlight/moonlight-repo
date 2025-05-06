/**
 * Sitemap Generator for Spider Baby Mini-State Demo
 * 
 * This script analyzes route files in the mini-state demo app
 * and generates a sitemap.xml file for better SEO.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const BASE_URL = 'https://spider-baby-mini-state.web.app';
const APP_PATH = 'apps/mini-state/demo';
const OUTPUT_DIR = 'dist/apps/mini-state/demo/browser';
const PRIORITY_MAP = {
  '/': 1.0,            // Home page gets highest priority
  '/simple': 0.9,      // Demo pages get high priority
  '/detail': 0.9,
  '/crud': 0.9,
  '/combined': 0.9, 
  '/search': 0.9,
  '/api': 0.8,         // API docs get medium-high priority
  default: 0.7         // Default priority for other pages
};

/**
 * Extracts routes from Angular route configuration files
 * @returns {string[]} Array of routes
 */
function extractRoutes() {
  // Start with known routes
//   const knownRoutes = new Set([
//     '/',
//     '/simple',
//     '/detail/1',
//     '/crud',
//     '/crud-state',
//     '/search',
//     '/combined',
//     '/api'
//   ]);
  const knownRoutes = new Set(['/']);  // Keep at least the home route
  knownRoutes.add('/detail/1');  // Just add specific instances we need

  // Find all route files in the app
  const routeFiles = glob.sync(`${APP_PATH}/src/app/**/*.routes.ts`);
  
  // Process each route file to extract additional routes
  routeFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Extract path strings from route configurations
    const pathMatches = content.match(/path:\s*['"]([^'"]+)['"]/g);
    
    if (pathMatches) {
      pathMatches.forEach(match => {
        const path = match.replace(/path:\s*['"]([^'"]+)['"]/, '$1');
        
        // Skip empty paths, wildcard routes, and paths with parameters
        if (path && path !== '**' && path !== '' && !path.includes(':')) {
          // Determine the parent path from the file structure
          const filePathSegments = file.split('/');
          const featuresIndex = filePathSegments.indexOf('features');
          
          if (featuresIndex > -1 && filePathSegments[featuresIndex + 1]) {
            const parentFeature = filePathSegments[featuresIndex + 1];
            // Add with parent path if appropriate
            if (parentFeature !== 'home' && path !== parentFeature) 
              knownRoutes.add(`/${parentFeature}/${path}`);            
          } else {
            // Add as root path
            knownRoutes.add(`/${path}`);
          }
        }
      });
    }
  });
  
  return Array.from(knownRoutes);
}

/**
 * Gets priority for a route
 * @param {string} route - The route path
 * @returns {number} Priority value between 0 and 1
 */
function getPriority(route) {
  // Check for exact route match
  if (PRIORITY_MAP[route]) {
    return PRIORITY_MAP[route];
  }
  
  // Check for parent route match
  for (const key of Object.keys(PRIORITY_MAP)) {
    if (route.startsWith(key) && key !== '/') {
      return PRIORITY_MAP[key] - 0.1; // Slightly lower priority for child routes
    }
  }
  
  return PRIORITY_MAP.default;
}

/**
 * Gets change frequency for a route
 * @param {string} route - The route path
 * @returns {string} Change frequency value
 */
function getChangeFreq(route) {
  if (route === '/') {
    return 'weekly';
  } else if (route.includes('/api/')) {
    return 'monthly';
  } else {
    return 'monthly';
  }
}

/**
 * Generates the sitemap XML
 * @param {string[]} routes - Array of routes
 * @returns {string} Sitemap XML content
 */
function generateSitemap(routes) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    const priority = getPriority(route);
    const changefreq = getChangeFreq(route);
    
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

/**
 * Main execution function
 */
function main() {
  console.log('Generating sitemap for Spider Baby Mini-State Demo...');
  
  // Extract routes
  const routes = extractRoutes();
  console.log(`Found ${routes.length} routes to include in sitemap`);
  
  // Generate sitemap XML
  const sitemap = generateSitemap(routes);
  
  // Check if output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`Output directory ${OUTPUT_DIR} doesn't exist. Creating public folder for development...`);
    // If we're running this during development, write to the public folder instead
    const publicDir = path.join(APP_PATH, 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log(`Sitemap written to ${publicDir}/sitemap.xml`);
  } else {
    // Write to build output directory
    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
    console.log(`Sitemap written to ${OUTPUT_DIR}/sitemap.xml`);
  }
}

// Execute main function
main();