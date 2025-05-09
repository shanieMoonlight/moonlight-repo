const fs = require('fs');
const path = require('path');

/**
 * Walks up the directory tree from startPath, looking for tsconfig.base.json.
 * @param {string} [startPath] - Directory to start searching from. Defaults to __dirname.
 * @returns {string|null} - The repository root path, or null if not found.
 */
function findRepositoryRootPath(startPath = __dirname) {
  let currentDir = path.resolve(startPath);

  while (true) {
    const tsconfigPath = path.join(currentDir, 'tsconfig.base.json');
    if (fs.existsSync(tsconfigPath)) {
      return currentDir;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached the filesystem root
      break;
    }
    currentDir = parentDir;
  }

  console.error('Could not find repository root. No tsconfig.base.json file found in parent directories.');
  return null;
}

// Example usage:
const repoRoot = findRepositoryRootPath();
console.log('Repository root:', repoRoot);

//#############################################//

module.exports = findRepositoryRootPath

//#############################################//
