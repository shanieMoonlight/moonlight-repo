/**
 * Sitemap Generator for Angular applications
 * 
 * This script analyzes route files in Angular apps
 * and generates a sitemap.xml file for better SEO.
 */

const fs = require('fs');
const path = require('path');
const routeExtractor = require('../routes/extract-routes-recursively'); // Assuming this is the correct path to the route extractor module

/**
 * @typedef {Object} SitemapConfig
 * @property {string} siteMapFilename - Name of the sitemap file
 * @property {string} baseUrl - Base URL of the site
 * @property {string} appPath - Path to the application
 * @property {string} distDir - Path to the build output directory
 * @property {Object} priorityMap - Map of routes to priorities
 * @property {Set<string>} knownRoutes - Initial set of known routes
 * @property {boolean} verbose - Enable detailed logging
 * @property {string} baseRoutePath - Absolute path to the starting route file (required)
 */

/**
 * Extracts routes from Angular route configuration files
 * @param {SitemapConfig} config - Configuration for sitemap generation
 * @returns {string[]} Array of routes
 */
function extractRoutes(config) {
  const knownRoutes = new Set(config.knownRoutes || []);

  // Validate baseRoutePath is provided
  if (!config.baseRoutePath)
    throw new Error('baseRoutePath is required for route extraction');

  // baseRoutePath is already absolute, no need to resolve with appPath
  const baseRoutePath = config.baseRoutePath;

  if (!fs.existsSync(baseRoutePath))
    throw new Error(`Base route file not found: ${baseRoutePath}`);


  // Start recursion from the app routes file with an empty parent path
  routeExtractor.extractRoutesRecursively(baseRoutePath, '', knownRoutes, config.verbose);

  if (config.verbose)
    console.log('Routes found recursively:', Array.from(knownRoutes).sort());


  return Array.from(knownRoutes);
}

//- - - - - - - - - - - - - - -//

/**
 * Gets priority for a route
 * @param {string} route - The route path
 * @param {Object} priorityMap - Map of routes to priorities
 * @returns {number} Priority value between 0 and 1
 */
function getPriority(route, priorityMap) {
  // Check for exact route match
  if (priorityMap[route])
    return priorityMap[route];

  // Check for parent route match
  for (const key of Object.keys(priorityMap)) {
    if (route.startsWith(key) && key !== '/')
      return priorityMap[key] - 0.1; // Slightly lower priority for child routes
  }

  return priorityMap.default || 0.7; // Default priority if not specified
}

//- - - - - - - - - - - - - - -//

/**
 * Gets change frequency for a route
 * @param {string} route - The route path
 * @returns {string} Change frequency value
 */
function getChangeFreq(route) {
  if (route === '/')
    return 'weekly';
  else if (route.includes('/api/'))
    return 'monthly';
  else
    return 'monthly';
}

//- - - - - - - - - - - - - - -//

/**
 * Generates the sitemap XML
 * @param {string[]} routes - Array of routes
 * @param {Object} config - Configuration for sitemap generation
 * @returns {string} Sitemap XML content
 */
function generateSitemap(routes, config) {
  const today = new Date().toISOString().split('T')[0];

  // Ensure baseUrl doesn't end with a slash
  const baseUrl = config.baseUrl.endsWith('/')
    ? config.baseUrl.slice(0, -1)
    : config.baseUrl;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach(route => {
    const priority = getPriority(route, config.priorityMap);
    const changefreq = getChangeFreq(route);

    xml += '  <url>\n';
    // Ensure route always starts with a slash for proper URL joining
    const formattedRoute = route.startsWith('/') ? route : `/${route}`;
    xml += `    <loc>${baseUrl}${formattedRoute}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

//- - - - - - - - - - - - - - -//

/**
 * Main sitemap generation function
 * @param {SitemapConfig} config - Configuration for sitemap generation
 */
function generate(config) {
  if (!config)
    throw new Error('Configuration is required for sitemap generation');

  const requiredProps = ['siteMapFilename', 'baseUrl', 'appPath', 'distDir', 'priorityMap'];
  for (const prop of requiredProps) {
    if (!config[prop]) 
      throw new Error(`Missing required configuration property: ${prop}`);    
  }

  console.log(`Generating sitemap for ${config.baseUrl}...`);

  // Extract routes
  const routes = extractRoutes(config);
  console.log(`Found ${routes.length} routes to include in sitemap`);

  // Generate sitemap XML
  const sitemap = generateSitemap(routes, config);

  // Check if output directory exists
  if (!fs.existsSync(config.distDir)) 
    throw new Error(`Output directory ${config.distDir} doesn't exist. Please create it or specify a valid directory.`);
  
  
  // Write to build output directory
  fs.writeFileSync(path.join(config.distDir, config.siteMapFilename), sitemap);
  console.log(`Sitemap written to ${config.distDir}/${config.siteMapFilename}`);
}

//- - - - - - - - - - - - - - -//

module.exports = {
  generate
};