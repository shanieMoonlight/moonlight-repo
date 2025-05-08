/**
 * Sitemap Generator for Angular applications
 * 
 * This script analyzes route files in Angular apps
 * It starts from a given route file and follws all child routes recursively.
 * You must be using lazy routes (loadChildren, loadComponent) for this to work.
 * and generates a sitemap.xml file for better SEO.
 */

const fs = require('fs');
const path = require('path');


/**
 * Recursively extracts routes from route files
 * @param {string} routeFilePath - Path to the route file
 * @param {string} parentPath - Parent path prefix
 * @param {Set<string>} knownRoutes - Set of collected routes
 * @param {bol} verbose - Log Everything to console
 */
function extractRoutesRecursively(routeFilePath, parentPath, knownRoutes, verbose) {
  if (!fs.existsSync(routeFilePath)) {
    if (verbose)
      console.warn(`Route file not found: ${routeFilePath}`);

    return;
  }

  knownRoutes ??= new Set([]);

  const content = fs.readFileSync(routeFilePath, 'utf8');
  // const appDir = path.join(config.appPath, 'src/app');

  const appDir = path.dirname(routeFilePath);


  // Extract path strings from route configurations
  const pathMatches = content.match(/path:\s*['"]([^'"]+)['"]/g);

  // Get import paths and route paths for child routes
  const routeData = getImportRouteData(content);
  // console.log('Route data:', routeData);


  if (verbose) {
    console.log(`Processing ${routeFilePath} with parent path: ${parentPath}`);
    console.log('Route imports:', routeData);
  }

  // Process direct paths in this file
  if (pathMatches) {
    for (let i = 0; i < pathMatches.length; i++) {
      const match = pathMatches[i];
      const routePath = match.replace(/path:\s*['"]([^'"]+)['"]/, '$1');

      // Skip empty paths, wildcard routes, and paths with parameters
      if (!routePath || routePath === '**' || routePath.includes(':'))
        continue;

      // Skip empty root path if we have a parent (handled by parent already)
      if (routePath === '' && parentPath !== '')
        continue;

      // Combine parent path with this route path
      const fullPath = buildFullPath(parentPath, routePath);
      console.log(`Adding route: ${fullPath}`);

      if (fullPath)
        knownRoutes.add(fullPath);

    }
  }

  // Recursively process children
  if (routeData && routeData.length > 0) {
    for (const { loaderType, importPath, routePath } of routeData) {
      // Only recurse for loadChildren (modules with child routes)
      if (loaderType === 'loadChildren') {
        // Build the full path to the imported route file
        const importedFilePath = resolveImportPath(routeFilePath, importPath, appDir);

        if (importedFilePath) {
          // Combine parent path with the current route path for recursive call
          const newParentPath = buildFullPath(parentPath, routePath);
          extractRoutesRecursively(importedFilePath, newParentPath, knownRoutes, verbose);
        }
      } else if (loaderType === 'loadComponent') {
        // For components, just add the route and don't recurse
        const fullPath = buildFullPath(parentPath, routePath);
        if (fullPath)
          knownRoutes.add(fullPath);

      }
    }
  }
}

//- - - - - - - - - - - - - - -//

/**
 * Resolve an import path to an actual file path
 * @param {string} sourceFilePath - Path of the file containing the import
 * @param {string} importPath - The import path string
 * @param {string} appDir - Base application directory
 * @returns {string|null} Resolved file path or null if can't be resolved
 */
function resolveImportPath(sourceFilePath, importPath, appDir) {
  // Handle absolute imports (from app root)
  if (!importPath.startsWith('./') && !importPath.startsWith('../')) 
    return path.join(appDir, importPath + '.ts');

  // Handle relative imports
  const sourceDir = path.dirname(sourceFilePath);
  const resolvedPath = path.resolve(sourceDir, importPath);

  // If import path doesn't include '.ts', add it
  if (!resolvedPath.endsWith('.ts'))
    return `${resolvedPath}.ts`;

  return resolvedPath;
}

//- - - - - - - - - - - - - - -//

/**
 * Build a full route path by combining parent and child paths
 * @param {string} parentPath - The parent route path
 * @param {string} routePath - The current route path
 * @returns {string} The combined path
 */
function buildFullPath(parentPath, routePath) {
  // Empty path means this is the default route for this level
  if (routePath === '') 
    return parentPath;
  

  // For root-level paths
  if (parentPath === '') 
    return routePath === '' ? '/' : `/${routePath}`;
  

  // Standard nested path
  return `${parentPath}/${routePath}`.replace(/\/+/g, '/');
}

//- - - - - - - - - - - - - - -//

/**
 * Extract import paths and their context from route file content
 * @param {string} content - File content to analyze
 * @returns {Array<{loaderType: string, importPath: string, routePath: string}>} Array of loader types, import paths and route paths
 */
function getImportRouteData(content) {
  const routeDataList = [];

  // Debug - log route segments
  if (console.debug) {
    const routeSegments = content.split(/[{},]/);
    console.debug('Route segments:', routeSegments);
    for (const segment of routeSegments) {
      console.debug('Processing segment:', segment.trim());
    }
  }

  // Look for complete route objects with both path and loader properties
  // This regex finds route objects with both path and loadChildren/loadComponent
  const routeRegex = /{\s*path\s*:\s*['"]([^'"]*)['"]\s*,\s*(loadChildren|loadComponent)\s*:\s*\(\s*\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)/g;

  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const routePath = match[1];
    const loaderType = match[2];
    const importPath = match[3];

    routeDataList.push({
      loaderType,
      importPath,
      routePath
    });
  }

  // Debug - log found route data
  if (console.debug) {
    console.debug('Route data list:', routeDataList);
  }

  return routeDataList;
}


//=============================//

module.exports = {
  extractRoutesRecursively
};

//=============================//