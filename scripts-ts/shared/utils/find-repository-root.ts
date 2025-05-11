import * as fs from 'fs';
import * as path from 'path';

/**
 * Walks up the directory tree from startPath, looking for tsconfig.base.json.
 * @returns {string|null} - The repository root path, or null if not found.
 */
export function findRepositoryRootPath(): string | null {
  let currentDir = path.resolve(__dirname);

  while (true) {
    const tsconfigPath = path.join(currentDir, 'tsconfig.base.json');
    if (fs.existsSync(tsconfigPath)) 
      return currentDir;

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) 
      break;  // Reached the filesystem root    
    
    currentDir = parentDir;
  }

  console.error('Could not find repository root. No tsconfig.base.json file found in parent directories.');
  return null;
}
