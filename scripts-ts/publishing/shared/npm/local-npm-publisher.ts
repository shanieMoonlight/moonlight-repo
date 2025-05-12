/**
 * Local NPM Publisher
 * 
 * This module provides functionality to build, pack, and store NPM packages locally.
 * It's useful for testing packages before publishing them to a remote NPM registry
 * or for sharing packages within a local development environment.
 */
import { LibraryData } from '../../../shared/library-data/models';
import { CommandUtils } from '../../../shared/utils/cmd/command-utils';
import { FsUtils } from '../../../shared/utils/fs/fs-utils';
import { BuildUtils } from '../utils/build-utils';

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/** Default directory where local NPM packages will be stored */
const DEFAULT_LOCAL_NPM_DIR = "C:/Users/Shaneyboy/my-npm"; // Default local NPM directory

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Prints information about the package publishing process to the console
 * 
 * @param libraryData - Library data containing package details
 * @param localNpmDir - Directory where the package will be stored locally
 */
function printStartInfo(libraryData: LibraryData, localNpmDir: string) {
    console.log('==================================================');
    console.log(`Publishing ${libraryData.packageName} to Local NPM (Node.js/TS)`);
    console.log('==================================================');
    console.log(`Package Dist Path: ${libraryData.packageDistPathAbsolute}`);
    console.log(`Nx Build Target: ${libraryData.nxBuildTarget}`);
    console.log(`Local NPM Directory: ${localNpmDir}`);
    console.log('==================================================\n');
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Builds and publishes an NPM package to a local directory
 * 
 * This function performs the following steps:
 * 1. Builds the library using the specified NX build target
 * 2. Creates a tarball (.tgz) of the package using 'npm pack'
 * 3. Moves the tarball to the specified local NPM directory
 * 4. Returns the path to the created tarball
 * 
 * @param libraryData - Data about the library to be published, including package name and build details
 * @param localNpmDir - Directory where the package will be stored locally (defaults to DEFAULT_LOCAL_NPM_DIR)
 * @returns Promise that resolves to the full path of the created tarball file
 * @throws Error if any step in the process fails
 */
export async function localNpmPublishPackage(libraryData: LibraryData, localNpmDir: string = DEFAULT_LOCAL_NPM_DIR): Promise<string> {

    const {
        packageName,
        packageDistPathAbsolute,
        nxBuildTarget
    } = libraryData;

    printStartInfo(libraryData, localNpmDir);

    // Ensure the local npm directory exists
    FsUtils.createDirIfNotExists(localNpmDir)

    // --- Build Step ---
    console.log(`INFO: Building ${packageName} library for production...`);
    const buildResult = BuildUtils.buildLibraryForProduction(nxBuildTarget);
    if (buildResult.status !== 0)
        throw new Error(`Build failed for ${packageName}.\n${buildResult.stderr}`);

    console.log('INFO: Build successful.\n');

    // --- Packaging and Moving ---
    if (!FsUtils.dirExists(packageDistPathAbsolute))
        throw new Error(`Distribution directory '${packageDistPathAbsolute}' does not exist or is not accessible.`)

    console.log(`INFO: Navigating to ${packageDistPathAbsolute}`);
    // Save current working directory to restore later
    const originalCwd = process.cwd();
    process.chdir(packageDistPathAbsolute);

    try {
        console.log(`INFO: Packing ${packageName}...`);
        const npmPackResult = CommandUtils.npmPack(true);
        console.log(`DEBUG: npm pack output: ${npmPackResult.stdout}`);

        if (npmPackResult.status !== 0)
            throw new Error(`npm pack failed with exit code ${npmPackResult.status}\n${npmPackResult.stderr}`);

        // Find .tgz files in the dist directory (async)
        const tgzFiles = await FsUtils.getFilesInDirectoryByExtensionAsync('.tgz', packageDistPathAbsolute);
        if (!tgzFiles.length)
            throw new Error('npm pack did not create any .tgz files.');
        console.log(`INFO: Found .tgz files: ${tgzFiles.join(', ')}`);

        // Move all .tgz files to the local npm directory (async)
        await FsUtils.moveFilesToDirectoryAsync(tgzFiles, localNpmDir);

        // Find the latest tarball for this package (async)
        const packageNameClean = packageName.replace('@', '').replace('/', '-');
        const tarballs = await FsUtils.getFilesInformationDirectoryAsync(
            localNpmDir,
            f => f.startsWith(packageNameClean) && f.endsWith('.tgz')
        );

        const tarballPath = tarballs.length ? tarballs[0].fullPath : null;
        if (!tarballPath)
            throw new Error(`Could not find the moved tarball in ${localNpmDir}`);

        console.log(`INFO: Successfully packed ${packageName} to ${tarballPath}\n`);
        console.log('To install this package in a project, run:');
        console.log(`npm install ${tarballPath}\n`)

        return tarballPath;

    } finally {
        // Restore original working directory
        process.chdir(originalCwd);
    }

}