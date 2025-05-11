import { LibraryData } from '../../../shared/library-data/models';
import { CommandUtils } from '../../../shared/utils/cmd/command-utils';
import { FsUtils } from '../../../shared/utils/fs/fs-utils';
import { BuildUtils } from '../utils/build-utils';

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

const DEFAULT_LOCAL_NPM_DIR = "C:/Users/Shaneyboy/my-npm"; // Default local NPM directory

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

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