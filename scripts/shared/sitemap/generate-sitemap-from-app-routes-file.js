/**
 * Sitemap Generator for Angular applications
 * 
 * This script analyzes route files in Angular apps
 * and generates a sitemap.xml file for better SEO.
 */

const fs = require('fs');
const path = require('path');
const routeExtractor = require('../routes/extract-routes-recursively-from-route-files'); // Assuming this is the correct path to the route extractor module
const sitemapGenerator = require('./generate-sitemap'); // Assuming this is the correct path to the route extractor module

/**
 * @typedef {Object} SitemapConfig
 * @property {string} siteMapFilename - Name of the sitemap file
 * @property {string} baseUrl - Base URL of the site
 * @property {string} distDir - Path to the build output directory
 * @property {Object} priorityMap - Map of routes to priorities
 * @property {Set<string>} knownRoutes - Initial set of known routes
 * @property {boolean} verbose - Enable detailed logging
 * @property {string} baseRoutePath - Absolute path to the starting route file (required)
 * @property {Set<string>} routesToSkip - Path to the application
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

  const baseRoutePath = config.baseRoutePath;

  if (!fs.existsSync(baseRoutePath))
    throw new Error(`Base route file not found: ${baseRoutePath}`);


  // Start recursion from the app routes file with an empty parent path
  routeExtractor.extractRoutesRecursively(baseRoutePath, '', knownRoutes, config.routesToSkip, config.verbose);

  if (config.verbose)
    console.log('Routes found recursively:', Array.from(knownRoutes).sort());


  return Array.from(knownRoutes);
}

//- - - - - - - - - - - - - - -//

/**
 * Main sitemap generation function
 * @param {SitemapConfig} config - Configuration for sitemap generation
 */
function generate(config) {
  if (!config)
    throw new Error('Configuration is required for sitemap generation');

  const requiredProps = ['siteMapFilename', 'baseUrl', 'distDir', 'priorityMap'];
  for (const prop of requiredProps) {
    if (!config[prop])
      throw new Error(`Missing required configuration property: ${prop}`);
  }

  console.log(`Generating sitemap for ${config.baseUrl}...`);

  // Extract routes
  const routes = extractRoutes(config);
  console.log(`Found ${routes.length} routes to include in sitemap`);

  // Generate sitemap XML
  const sitemap = sitemapGenerator.generateSitemap(routes, config);

  // Check if output directory exists
  if (!fs.existsSync(config.distDir))
    throw new Error(`Output directory ${config.distDir} doesn't exist. Please create it or specify a valid directory.`);


  // Write to build output directory
  fs.writeFileSync(path.join(config.distDir, config.siteMapFilename), sitemap);
  console.log(`Sitemap written to ${config.distDir}/${config.siteMapFilename}`);
}

//#############################//

module.exports = {
  generate
};

//#############################//