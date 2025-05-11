import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import { FsUtils } from '../../../shared/utils/fs/fs-utils';
import { CommandUtils } from '../../../shared/utils/cmd/command-utils';
import { BuildUtils } from '../utils/build-utils';

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

function printStartInfo(packageName: string, packageDistPath: string, nxBuildTarget: string, distPackageJsonPath: string) {


    console.log('==================================================');
    console.log(` Publishing ${packageName} to NPM (Node.js/TS)!!!`);
    console.log('==================================================');
    console.log(`Package JSON Path: ${distPackageJsonPath}`);
    console.log(`Package Dist Path: ${packageDistPath}`);
    console.log(`Nx Build Target: ${nxBuildTarget}`);
    console.log('==================================================\n');
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

// Confirm all dependencies are published
function confirmAllDependenciesPublished(packageJsonPath: string): boolean {
    console.log(`INFO [Check-AllDependencies]: Checking dependencies in '${packageJsonPath}'...`);
    if (!fs.existsSync(packageJsonPath)) {
        console.error(`ERROR: Cannot find package.json at '${packageJsonPath}'`);
        return false;
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = packageJson.dependencies || {};

    for (const [dep, versionRange] of Object.entries(dependencies)) {
        const npmSpec = `${dep}@${versionRange}`;
        console.log(`DEBUG: Checking '${npmSpec}' on npm...`);
        const { status } = CommandUtils.run(`npm view ${npmSpec} version --json`);

        if (status !== 0) {
            console.error(`ERROR: Required dependency version '${npmSpec}' not found on npm!`);
            return false;
        } else {
            console.log(`INFO: Found suitable version for '${npmSpec}' on npm.`);
        }
    }

    console.log('INFO: All dependencies found successfully.');
    return true;
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

function getPackageVersion(distPackageJsonPath: string): string | null | undefined {
    const packageJson = JSON.parse(fs.readFileSync(distPackageJsonPath, 'utf-8'));
    return packageJson?.version;
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

function isPackageVersionAlreadyPublished(packageName: string, packageVersion: string): boolean {
    const npmPackageSpec = `${packageName}@${packageVersion}`;
    console.log(`INFO: Checking for ${npmPackageSpec}...`);
    const versionCheck = CommandUtils.run(`npm view ${npmPackageSpec} version`);
    return versionCheck.status === 0
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

async function confirmPublishPromptAsync(): Promise<boolean> {

    const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'If everything looks correct, publish for real?',
        initial: true
    });

    if (!response.value)
        console.log('Publish cancelled by user.');

    return !!response.value

}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

// Main function to export
export async function publishToNpmAsync(
    packageName: string,
    packageDistPath: string,
    nxBuildTarget: string,
    noConfirm = false
): Promise<void> {
    const distPackageJsonPath = path.join(packageDistPath, 'package.json');

    printStartInfo(packageName, packageDistPath, nxBuildTarget, distPackageJsonPath);

    // --- Build Step ---
    console.log(`INFO: Building ${packageName} library for production...`);
    const buildResult = BuildUtils.buildLibraryForProduction(nxBuildTarget);
    if (buildResult.status !== 0)
        throw new Error(`Build failed for ${packageName}.\n${buildResult.stderr}`);
    console.log('INFO: Build successful.\n');


    // --- Check Dependencies ---
    if (!confirmAllDependenciesPublished(distPackageJsonPath))
        throw new Error('Dependency check failed. Please ensure all dependencies are published first.');


    // --- Check if Main Package Version Exists ---
    if (!FsUtils.fileExists(distPackageJsonPath))
        throw new Error(`Cannot find built package.json at '${distPackageJsonPath}'.`);


    const packageVersion = getPackageVersion(distPackageJsonPath);
    if (!packageVersion)
        throw new Error(`Could not extract version from '${distPackageJsonPath}'.`);

    const npmPackageSpec = `${packageName}@${packageVersion}`;

    if (isPackageVersionAlreadyPublished(packageName, packageVersion)) {
        console.log(`INFO: ${npmPackageSpec} already published, skipping.`);
        return;
    }

    console.log(`INFO: Version ${packageVersion} not found on npm. Proceeding with publish...\n`);


    // --- Publish Step ---
    // Dry run
    console.log(`INFO: Performing npm publish dry run...`);
    const dryRun = CommandUtils.npmPublishPublic(packageDistPath, true);
    if (dryRun.status !== 0)
        throw new Error('npm publish dry run failed.\n' + dryRun.stderr);

    console.log('INFO: Dry run complete. Review the files listed above.\n');

    // Confirmation prompt
    if (!noConfirm && !await confirmPublishPromptAsync())
        return;

    // Actual publish
    console.log(`INFO: Publishing ${npmPackageSpec} to npm...`);
    const publishResult = CommandUtils.npmPublishPublic(packageDistPath, false, true);
    if (publishResult.status !== 0)
        throw new Error('!!! ERROR: npm publish failed !!!\n' + publishResult.stderr);

    console.log(`INFO: Successfully published ${npmPackageSpec}.`);
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

// CLI entry point for direct execution
if (require.main === module) {
    // Parse CLI args
    const [, , packageName, packageDistPath, nxBuildTarget, ...rest] = process.argv;
    const noConfirm = rest.includes('--no-confirm');
    publishToNpmAsync(packageName, packageDistPath, nxBuildTarget, noConfirm)
        .catch(err => {
            console.error('ERROR:', err);
            process.exit(1);
        });
}