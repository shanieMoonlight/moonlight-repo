const fs = require('fs');
const path = require('path');
const findRepositoryRootPath = require('./find-repo-root.js');

/**
 * Extracts dynamic package info from a library root.
 * @param {string} libraryRootRelative - Relative path from repo root to the library (e.g. 'libs/packages/@spider-baby/ssr/storage')
 * @returns {object} - { packageName, pkgVersion, nxBuildTarget, packageDistPath, libraryRootAbsolute }
 */
function extractLibraryData(libraryRootRelative) {

  const repoRoot = findRepositoryRootPath();
  const libraryRootAbsolute = path.join(repoRoot, libraryRootRelative);

  // Read package.json
  const packageJsonPath = path.join(libraryRootAbsolute, 'package.json');
  if (!fs.existsSync(packageJsonPath)) 
    throw new Error(`package.json not found at ${packageJsonPath}`);
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = packageJson.name;
  const pkgVersion = packageJson.version;


  // Read project.json
  const projectJsonPath = path.join(libraryRootAbsolute, 'project.json');
  if (!fs.existsSync(projectJsonPath)) 
    throw new Error(`project.json not found at ${projectJsonPath}`);
  
  const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
  const nxBuildTarget = `${projectJson.name}:build:production`;


  // Compute dist path (relative to repo root)
  let packageDistPath;
  const ngPackageJsonPath = path.join(libraryRootAbsolute, 'ng-package.json');
  if (fs.existsSync(ngPackageJsonPath)) {
    const ngPackageJson = JSON.parse(fs.readFileSync(ngPackageJsonPath, 'utf8'));
    if (ngPackageJson.dest) {
      // If dest is relative, resolve it from libraryRootAbsolute, then make it relative to repoRoot
      const absDest = path.resolve(libraryRootAbsolute, ngPackageJson.dest);
      packageDistPath = path.relative(repoRoot, absDest);
    }
  }
  // Fallback if ng-package.json or dest not found
  if (!packageDistPath) 
    packageDistPath = path.join('dist', libraryRootRelative);
  

  return {
    packageName,
    pkgVersion,
    nxBuildTarget,
    packageDistPath,
    libraryRootAbsolute,
    repoRoot
  };
}

//####################################################//

module.exports = extractLibraryData;

//####################################################//