const fs = require('fs');
const path = require('path');

// Helper function for recursive search
function findIndexHtmlRecursive(currentSearchPath, originalBaseRoute, foundPathsSet) {
  // Check for index.html in the currentSearchPath itself
  const indexHtmlPath = path.join(currentSearchPath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    try {
      const stat = fs.statSync(indexHtmlPath);
      if (stat.isFile()) {
        const relativePath = path.relative(originalBaseRoute, currentSearchPath);
        // path.relative(base, base) results in '', which represents the base directory itself.
        // path.relative(base, path.join(base, 'foo')) results in 'foo'.
        const normalizedRelativePath = relativePath.replace(/\\/g, '/');
        foundPathsSet.add(normalizedRelativePath);
      }
    } catch (e) {
      // Silently ignore stat errors (e.g. permissions, or file disappearing)
      // console.warn(`Could not stat file ${indexHtmlPath}: ${e.message}`);
    }
  }

  // Recursively search in subdirectories
  let entries;
  try {
    entries = fs.readdirSync(currentSearchPath, { withFileTypes: true });
  } catch (e) {
    // Silently ignore readdir errors (e.g. permissions)
    // console.warn(`Could not read directory ${currentSearchPath}: ${e.message}`);
    return; // Cannot proceed further down this path
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nextSearchPath = path.join(currentSearchPath, entry.name);
      findIndexHtmlRecursive(nextSearchPath, originalBaseRoute, foundPathsSet);
    }
  }
}

/**
 * Finds subdirectories containing an index.html file, searching recursively from specified entry points
 * or from the baseRoute itself.
 *
 * @param {string} baseRoute - The absolute path to the base directory. Relative paths in the
 *                             result will be calculated from this route.
 * @param {string[]} [entrySubdirectories] - An array of subdirectory names (relative to baseRoute)
 *                                          from which to start the recursive search.
 *                                          If undefined, null, or empty, the search starts from baseRoute itself.
 * @returns {string[]} An array of unique relative subdirectory paths (e.g., "docs", "docs/api", or "" for baseRoute itself)
 *                     that contain an index.html file, sorted alphabetically.
 */
function extractSubdirectoriesWithIndexHtml(baseRoute, entrySubdirectories) {
  const foundRelativePaths = new Set();

  if (!fs.existsSync(baseRoute) || !fs.statSync(baseRoute).isDirectory()) {
    console.error(`Error: Base route "${baseRoute}" does not exist or is not a directory.`);
    return [];
  }

  // If entrySubdirectories is not provided, empty, or null, default to scanning from baseRoute itself.
  // We use ['.'] as a placeholder to mean "the baseRoute directory itself" in the loop.
  const effectiveEntryPoints = (entrySubdirectories && entrySubdirectories.length > 0)
    ? entrySubdirectories
    : ['.'];

  for (const entrySubDir of effectiveEntryPoints) {
    // path.resolve correctly handles entrySubDir being '.' (resolves to baseRoute)
    // or a relative path (resolves relative to baseRoute).
    const startSearchPath = path.resolve(baseRoute, entrySubDir);

    if (fs.existsSync(startSearchPath) && fs.statSync(startSearchPath).isDirectory()) {
      // Start recursion from this entry point.
      // The paths added to foundRelativePaths will be relative to the original baseRoute.
      findIndexHtmlRecursive(startSearchPath, baseRoute, foundRelativePaths);
    } else {
      // Optional: Warn if an explicitly provided entry point is not a valid directory.
      // This check is more relevant if entrySubdirectories were explicitly provided.
      // if (entrySubdirectories && entrySubdirectories.length > 0) {
      //   console.warn(`Entry point "${entrySubDir}" (resolved to "${startSearchPath}") is not a valid directory. Skipping.`);
      // }
    }
  }

  return Array.from(foundRelativePaths).sort();
}

//#############################//

module.exports = {
  extractSubdirectoriesWithIndexHtml
};

//#############################//