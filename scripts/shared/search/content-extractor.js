const fs = require('fs');
const cheerio = require('cheerio');
const { log } = require('@angular-devkit/build-angular/src/builders/ssr-dev-server');

/**
 * Extracts clean content from HTML files for search indexing
 * @param {string} entryPath - Path to the HTML file
 * @param {string} prerenderedDir - Base directory for route calculation
 * @param {Object} config - Configuration options
 * @returns {Object|null} - Extracted document or null if extraction failed
 */
function extractDocumentFromFile(entryPath, prerenderedDir, config) {

  log (`Processing file: ${entryPath}`, prerenderedDir);
  try {
    const htmlContent = fs.readFileSync(entryPath, 'utf8');
    const $ = cheerio.load(htmlContent);

    // Extract route information
    let route = entryPath.replace(prerenderedDir, '')
      .replace(/\\/g, '/') // Normalize path separators to URL format
      .replace(/\/index\.html$/, '/') // Convert /index.html to trailing slash
      .replace(/\.html$/, ''); // Remove .html extension

    // Make sure route starts with /
    if (!route.startsWith('/')) route = '/' + route;

    // Extract title from the page

    const rawTitle = $('title').text() || $('h1').first().text() || 'Untitled Page';
    const title = rawTitle
      .replace(' | Spider Baby Demo', '') // Remove site suffix if present
      .trim();

    // IMPROVED CONTENT EXTRACTION
    // Remove script tags to eliminate JavaScript noise
    $('script').remove();

    // Remove noscript tags (they often contain duplicate content)
    $('noscript').remove();

    let cleanedContent = '';

    // Extract content using different strategies

    // Strategy 1: Find API palette section
    const bodyHtml = $('body').html();
    const apiPaletteIndex = bodyHtml?.indexOf('API palette');
    const jsDisabledIndex = bodyHtml?.indexOf('Please enable JavaScript');

    if (apiPaletteIndex > -1 && jsDisabledIndex > -1) {
      // Extract just the API documentation section
      const apiContent = bodyHtml.substring(
        apiPaletteIndex,
        jsDisabledIndex
      );

      // Parse the API content
      const $apiContent = cheerio.load(apiContent);
      cleanedContent = $apiContent.text();
    }
    // Strategy 2: Target specific content elements
    else {
      const mainElement = $('main');
      const contentElement = $('.content');
      const articleElement = $('article');

      if (mainElement.length) {
        cleanedContent = mainElement.text();
      } else if (contentElement.length) {
        cleanedContent = contentElement.text();
      } else if (articleElement.length) {
        cleanedContent = articleElement.text();
      } else {
        // Fall back to body text with JS stripped
        cleanedContent = $('body').text()
          .replace(/\(\(\)=>\{function p\(t,n,r,o,e,i,f,m\).*?window\.__jsaction_bootstrap.*?\];/gs, '')
          .replace(/\{"__nghData__".*$/gs, '');
      }
    }

    // Clean up common code and formatting patterns
    const textContent = cleanedContent
      .replace(/EXPLORE/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\bfunction\b|\blet\b|\bconst\b|\breturn\b|\bif\b|\belse\b/g, '')
      .replace(/[{}()[\]<>]/g, ' ')
      .trim();

    if (!textContent.trim()) {
      console.warn(`Warning: No content found in ${entryPath}`);
      return null;
    }

    console.log(`Extracted ${textContent.length} chars of content`);

    // Extract meta description if available
    const description = $('meta[name="description"]').attr('content') || '';

    // Return the document object
    return {
      title,
      content: textContent,
      description,
      route
    };
  } catch (error) {
    console.error(`Error processing ${entryPath}:`, error);
    return null;
  }
}

//=======================================//

module.exports = {
  extractDocumentFromFile
};

//=======================================//