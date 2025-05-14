/**
 * Sitemap Generator for Angular applications
 * 
 * This script analyzes route files in Angular apps
 * and generates a sitemap.xml file for better SEO.
 */

/**
 * @typedef {Object} SitemapConfig
 * @property {string} baseUrl - Base URL of the site
 * @property {Object} priorityMap - Map of routes to priorities
 */



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

  console.log('routes:', routes);
  console.log('config:', config);
  

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

  // console.log('Generated XML:', xml);
  

  return xml;
}

//#############################//

module.exports = {
  generateSitemap
};

//#############################//