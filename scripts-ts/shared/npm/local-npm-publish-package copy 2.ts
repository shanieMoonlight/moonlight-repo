import { BuildUtils } from '../utils/build-utils';
import { CommandUtils } from '../utils/command-utils';
import { FileUtils } from '../utils/file-utils';

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

const DEFAULT_LOCAL_NPM_DIR = "C:/Users/Shaneyboy/my-npm"; // Default local NPM directory


//= = = = = = = = = = = = = = = = = = = = = = = = = = //

function printStartInfo(packageName: string, packageDistPath: string, nxBuildTarget: string, localNpmDir: string) {


    console.log('==================================================');
    console.log(`Publishing ${packageName} to Local NPM (Node.js/TS)`);
    console.log('==================================================');
    console.log(`Package Dist Path: ${packageDistPath}`);
    console.log(`Nx Build Target: ${nxBuildTarget}`);
    console.log(`Local NPM Directory: ${localNpmDir}`);
    console.log('==================================================\n');
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //


export async function localNpmPublishPackage(
    packageName: string,
    packageDistPath: string,
    nxBuildTarget: string,
    localNpmDir: string = DEFAULT_LOCAL_NPM_DIR
): Promise<void> {

    printStartInfo(packageName, packageDistPath, nxBuildTarget, localNpmDir);

    // Ensure the local npm directory exists
    FileUtils.createDirIfNotExists(localNpmDir)

    // --- Build Step ---
    console.log(`INFO: Building ${packageName} library for production...`);
    const buildResult = BuildUtils.buildLibraryForProduction(nxBuildTarget);
    if (buildResult.status !== 0)
        throw new Error(`Build failed for ${packageName}.\n${buildResult.stderr}`);

    console.log('INFO: Build successful.\n');

    // --- Packaging and Moving ---
    if (!FileUtils.dirExists(packageDistPath))
        throw new Error(`Distribution directory '${packageDistPath}' does not exist or is not accessible.`)

    console.log(`INFO: Navigating to ${packageDistPath}`);
    // Save current working directory to restore later
    const originalCwd = process.cwd();
    process.chdir(packageDistPath);

    try {
        console.log(`INFO: Packing ${packageName}...`);
        const npmPackResult = CommandUtils.run('npm pack --verbose');
        console.log(`DEBUG: npm pack output: ${npmPackResult.stdout}`);

        if (npmPackResult.status !== 0) 
            throw new Error(`npm pack failed with exit code ${npmPackResult.status}\n${npmPackResult.stderr}`);
        

        // Find .tgz files in the dist directory
        const tgzFiles = FileUtils.getFilesInDirectoryByExtension('.tgz');
        if (!tgzFiles.length)
            throw new Error('npm pack did not create any .tgz files.');
        console.log(`INFO: Found .tgz files: ${tgzFiles.join(', ')}`);

        // Move all .tgz files to the local npm directory
        FileUtils.moveFilesToDirectory(tgzFiles, localNpmDir);

        // Find the latest tarball for this package
        const packageNameClean = packageName.replace('@', '').replace('/', '-');
        const tarballs = FileUtils.getFilesInformationDirectory(
            localNpmDir,
            f => f.startsWith(packageNameClean) && f.endsWith('.tgz')
        )

        const tarballPath = tarballs.length ? tarballs[0].fullPath : null;
        if (!tarballPath)
            throw new Error(`Could not find the moved tarball in ${localNpmDir}`);

        console.log(`INFO: Successfully packed ${packageName} to ${tarballPath}\n`);
        console.log('To install this package in a project, run:');
        console.log(`npm install ${tarballPath}\n`)

    } finally {
        // Restore original working directory
        process.chdir(originalCwd);
    }

    console.log('INFO: Local publish script finished.');
}