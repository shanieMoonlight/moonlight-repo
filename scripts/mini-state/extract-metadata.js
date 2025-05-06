// extract-metadata.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find components in features folders
const componentFiles = glob.sync('apps/mini-state/demo/src/app/**/features/**/*.component.ts');
const metadataMap = {};
console.log(`Found ${componentFiles.length} feature components:`);
componentFiles.forEach(file => console.log(` - ${file}`));

/**
 * Determine the route from a feature component file path
 * @param {string} filePath - Path to the component file
 * @returns {string} - The route for this component
 */
function determineRouteFromFile(filePath) {
  // Extract relative path focusing on features
  const featuresMatch = filePath.match(/features\/(.+?)\.component\.ts$/);
  
  if (featuresMatch && featuresMatch[1]) {
    // Extract the feature name
    let route = '/' + featuresMatch[1].replace(/\\+/g, '/');
    
    // Handle special cases
    if (route.includes('/component')) {
      route = route.replace('/component', '');
    }
    
    // Special case for API home
    if (filePath.includes('api/features/home')) {
      route = '/api/';
    }
    
    // Ensure route starts with / and ends with /
    if (!route.startsWith('/')) {
      route = '/' + route;
    }
    if (!route.endsWith('/')) {
      route = route + '/';
    }
    
    console.log(`Determined route '${route}' from file: ${filePath}`);
    return route;
  }
  
  console.warn(`Could not determine route for: ${filePath}, using fallback`);
  return '/api/';
}

/**
 * Parse keywords from a string like "['keyword1', 'keyword2']"
 * @param {string} keywordsStr - The string containing keywords
 * @returns {string[]} - Array of keyword strings
 */
function parseKeywords(keywordsStr) {
  // Extract strings contained in quotes (single, double or backticks)
  const keywordMatches = keywordsStr.match(/['"`]([^'"`]+)['"`]/g) || [];
  
  // Remove the quotes and return the array
  return keywordMatches.map(k => k.replace(/['"`]/g, '').trim());
}

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Look for updateMetadata calls regardless of the service variable name
  const metadataMatch = content.match(/\.updateMetadata\(\{([\s\S]*?)\}\)/);
  
  if (metadataMatch) {
    // Extract title, description, keywords
    const titleMatch = content.match(/title:\s*['"`](.+?)['"`]/);
    
    // Extract description - handle both inline and property references
    let description = '';
    const descriptionMatch = content.match(/description:\s*['"`]([\s\S]*?)['"`]/m);
    const descRefMatch = content.match(/description:\s*this\.description/);
    
    if (descriptionMatch && descriptionMatch[1]) {
      description = descriptionMatch[1].replace(/\n\s+/g, ' ').trim();
    } else if (descRefMatch) {
      // Look for description property in the component
      const descVarMatch = content.match(/description\s*=\s*[`'"]([^`'"]+)[`'"]/);
      if (descVarMatch && descVarMatch[1]) {
        description = descVarMatch[1].replace(/\n\s+/g, ' ').trim();
      } else {
        // Try multiline template string
        const multilineDescMatch = content.match(/description\s*=\s*`([\s\S]*?)`/);
        if (multilineDescMatch && multilineDescMatch[1]) {
          description = multilineDescMatch[1].replace(/\n\s+/g, ' ').trim();
        }
      }
    }
    
    // Extract keywords
    const keywordsMatch = content.match(/keywords:\s*\[([\s\S]*?)\]/);
    
    // Build metadata entry
    if (titleMatch || description) {
      // Determine the route for this component
      const route = determineRouteFromFile(file);
      
      metadataMap[route] = {
        title: titleMatch ? titleMatch[1] : 'Spider Baby Mini-State',
        description: description || 'A lightweight, signals-based state management library for Angular applications.',
        keywords: keywordsMatch ? parseKeywords(keywordsMatch[1]) : ['Angular', 'State Management', 'Signals']
      };
    }
  }
});

// Create the output directory if it doesn't exist
const outputDir = 'apps/mini-state/demo/src/app/shared/metadata';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Output as TypeScript config
fs.writeFileSync(
  'apps/mini-state/demo/src/app/shared/metadata/metadata-config.ts',
  `export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

/**
 * Centralized metadata configuration for all pages
 * Used by both Angular components and search indexer
 */
export const METADATA_CONFIG: Record<string, PageMetadata> = ${JSON.stringify(metadataMap, null, 2)};

/**
 * Get metadata for a specific route
 * Falls back to default values if route not found
 */
export function getMetadataForRoute(route: string): PageMetadata {
  // Normalize route
  const normalizedRoute = route.endsWith('/') ? route : \`\${route}/\`;
  
  // Find exact match first
  if (METADATA_CONFIG[route]) {
    return METADATA_CONFIG[route];
  }
  
  // Try with normalized route
  if (METADATA_CONFIG[normalizedRoute]) {
    return METADATA_CONFIG[normalizedRoute];
  }
  
  // Fall back to default metadata
  return {
    title: 'Spider Baby Mini-State',
    description: 'A lightweight, signals-based state management library for Angular applications, handling loading states, errors, and success notifications while leveraging Angular\\'s signals for reactivity.',
    keywords: ['Angular', 'State Management', 'Signals']
  };
}
`
);

console.log(`Generated metadata config with ${Object.keys(metadataMap).length} routes.`);
if (Object.keys(metadataMap).length > 0) {
  console.log('Routes found:', Object.keys(metadataMap).join(', '));
} else {
  console.warn('No routes found! Check that your components contain updateMetadata calls.');
}