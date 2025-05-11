import path from "path";
import fs from "fs";
import { findRepositoryRootPath } from "../utils/find-repository-root";
import { LibraryDependency, LibraryData } from "./models";


//####################################################//

function mapDepsToObjects(deps: Record<string, string>): LibraryDependency[] {
    return Object.entries(deps).map(([name, version]) => ({ name, version }));
}

//####################################################//

function mapDepsToObjectsWithPaths(
    deps: Record<string, string>,
    repoRootPath: string
): LibraryDependency[] {
    const tsConfigBasePath = path.join(repoRootPath, 'tsconfig.base.json');
    let tsConfig: any = {};
    if (!fs.existsSync(tsConfigBasePath))
        throw new Error(`'tsconfig.base.json' not found at ${tsConfigBasePath}`)

    tsConfig = JSON.parse(fs.readFileSync(tsConfigBasePath, 'utf8'));

    const paths: Record<string, string[]> = tsConfig?.compilerOptions?.paths || {};

    return Object.entries(deps).map(([name, version]) => {
        let relativePath: string | undefined;
        let absolutePath: string | undefined;

        // Try to find a matching path alias in tsconfig.base.json
        if (paths[name] && paths[name][0]) {
            // Remove any trailing /* from the alias and path
            let aliasPath = paths[name][0].replace(/\/\*$/, '');

            // Remove /src/index.ts or /index.ts or /index.js or /index.d.ts from the end
            aliasPath = aliasPath.replace(/(\/src)?\/index\.(ts|js|d\.ts)$/, '');

            relativePath = aliasPath;
            absolutePath = path.resolve(repoRootPath, aliasPath);
        }

        return { name, version, relativePath, absolutePath };
    });
}

//####################################################//


/**
 * Extracts dynamic package info from a library root, including dependencies.
 * @param {string} libraryRootRelative - Relative path from repo root to the library (e.g. 'libs/packages/@spider-baby/ssr/storage')
 * @returns {LibraryData} - Library data object with package information
 */
export function extractLibraryData(libraryRootRelative: string): LibraryData {

    const repoRoot = findRepositoryRootPath();
    if (!repoRoot)
        throw new Error(`Cannot find the repo root!!!`);

    const libraryRootAbsolute = path.join(repoRoot, libraryRootRelative);

    // Read package.json
    const packageJsonPath = path.join(libraryRootAbsolute, 'package.json');
    if (!fs.existsSync(packageJsonPath))
        throw new Error(`package.json not found at ${packageJsonPath}`);

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const packageName = packageJson.name;
    const pkgVersion = packageJson.version;
    const dependencies = mapDepsToObjectsWithPaths(packageJson.dependencies || {}, repoRoot);
    const peerDependencies = mapDepsToObjects(packageJson.peerDependencies || {});
    const devDependencies = mapDepsToObjects(packageJson.devDependencies || {});

    // Read project.json
    const projectJsonPath = path.join(libraryRootAbsolute, 'project.json');
    if (!fs.existsSync(projectJsonPath))
        throw new Error(`project.json not found at ${projectJsonPath}`);

    const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
    const nxBuildTarget = `${projectJson.name}:build:production`;

    // Compute dist path (relative to repo root)
    let packageDistPathRelative = ''
    let packageDistPathAbsolute = ''
    const ngPackageJsonPath = path.join(libraryRootAbsolute, 'ng-package.json');
    if (fs.existsSync(ngPackageJsonPath)) {
        const ngPackageJson = JSON.parse(fs.readFileSync(ngPackageJsonPath, 'utf8'));
        if (ngPackageJson.dest) {
            // If dest is relative, resolve it from libraryRootAbsolute, then make it relative to repoRoot
            packageDistPathAbsolute = path.resolve(libraryRootAbsolute, ngPackageJson.dest);
            packageDistPathRelative = path.relative(repoRoot, packageDistPathAbsolute);
        }
    }
    // Fallback if ng-package.json or dest not found
    if (!packageDistPathRelative)
        packageDistPathRelative = path.join('dist', libraryRootRelative);

    return {
        packageName,
        pkgVersion,
        nxBuildTarget,
        packageDistPathRelative,
        packageDistPathAbsolute,
        libraryRootAbsolute,
        repoRoot,
        dependencies,
        peerDependencies,
        devDependencies
    };
}