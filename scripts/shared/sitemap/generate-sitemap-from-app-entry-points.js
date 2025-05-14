/**
 * Sitemap Generator for Angular applications
 * 
 * This script analyzes route files in Angular apps
 * and generates a sitemap.xml file for better SEO.
 */

const fs = require('fs');
const path = require('path');
const subdirectoryExtractor = require('../routes/extract-routes-recursively-paths');
const sitemapGenerator = require('./generate-sitemap'); // Assuming this is the correct path to the route extractor module

/**
 * @typedef {Object} SitemapConfig
 * @property {string} siteMapFilename - Name of the sitemap file
 * @property {string} baseUrl - Base URL of the site
 * @property {string} distDir - Path to the build output directory
 * @property {Object} priorityMap - Map of routes to priorities
 * @property {boolean} verbose - Enable detailed logging
 * @property {Array} entryPoints - Enable detailed logging
 */

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
  const routes = subdirectoryExtractor.extractSubdirectoriesWithIndexHtml(config.baseRoute, config.entryPoints);
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