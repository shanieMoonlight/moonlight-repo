import chalk from 'chalk'; // Added chalk for consistent styling
import * as path from 'path';
import prompts from 'prompts';
import { LibraryData, LibraryDependency } from '../../../shared/library-data/models'; // Assuming LibraryData is here
import { CommandUtils } from '../../../shared/utils/cmd/command-utils';
import { BuildUtils } from '../utils/build-utils';

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

function printStartInfo(libraryData: LibraryData) {
    const distPackageJsonPath = path.join(libraryData.packageDistPathAbsolute, 'package.json');

    console.log(chalk.blue('=================================================='));
    console.log(chalk.blueBright(` Publishing ${chalk.bold(libraryData.packageName)} to NPM`));
    console.log(chalk.blue('=================================================='));
    console.log(chalk.gray(`Package Name:        ${libraryData.packageName}`));
    console.log(chalk.gray(`Package Version:     ${libraryData.pkgVersion}`)); // Assuming pkgVersion is in LibraryData
    console.log(chalk.gray(`Dist Path:           ${libraryData.packageDistPathAbsolute}`));
    console.log(chalk.gray(`Dist package.json:   ${distPackageJsonPath}`));
    console.log(chalk.gray(`Nx Build Target:     ${libraryData.nxBuildTarget}`));
    console.log(chalk.blue('==================================================\n'));
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

// Confirm all dependencies are published
async function confirmAllDependenciesPublished(
    dependenciesToCheck: LibraryDependency[],
    dependencyType: string = 'dependencies',
    retries = 3,
    retryDelayMs = 5000
): Promise<boolean> {
    console.log(chalk.cyan(`INFO [Check-AllDependencies]: Checking ${dependencyType} from source...`));

    if (!dependenciesToCheck || dependenciesToCheck.length === 0) {
        console.log(chalk.green(`INFO: No ${dependencyType} to check.`));
        return true;
    }

    for (const dep of dependenciesToCheck) {
        const npmSpec = `${dep.name}@${dep.version}`;
        // Use isPackageVersionAlreadyPublished which has retry logic
        const found = await isPackageVersionAlreadyPublished(dep.name, dep.version, retries, retryDelayMs);

        if (!found) {
            console.error(chalk.red(`ERROR: Required ${dependencyType} '${npmSpec}' not found on npm after ${retries + 1} attempts!`));
            return false;
        }

        console.log(chalk.green(`INFO: Found suitable version for '${npmSpec}' on npm.`));
    }

    console.log(chalk.green(`INFO: All ${dependencyType} from source found successfully.`));
    return true;
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

async function isPackageVersionAlreadyPublished(
    packageName: string,
    packageVersion: string,
    retries = 3,
    retryDelayMs = 5000
): Promise<boolean> {
    const npmPackageSpec = `${packageName}@${packageVersion}`;
    console.log(chalk.cyan(`INFO: Checking if ${npmPackageSpec} is already published...`));

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        // Use --json to get structured output and avoid parsing issues with npm view's human-readable output
        const versionCheck = CommandUtils.run(`npm view "${npmPackageSpec}" version --json`); // REMOVED await here
        const found = versionCheck.status === 0 && versionCheck.stdout.trim() !== '';

        if (found)
            return true;

        if (attempt <= retries) {
            console.log(chalk.yellow(`INFO: Package not found on attempt ${attempt}/${retries + 1}. Waiting ${retryDelayMs / 1000}s for NPM registry propagation...`));
            // This Promise for setTimeout still needs to be awaited to pause execution
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        }
    }

    return false;
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //


async function confirmPublishPromptAsync(packageName: string): Promise<boolean> {
    const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: `If everything looks correct, publish ${packageName} for real?`,
        initial: true
    });

    if (!response.value)
        console.log(chalk.yellow('Publish cancelled by user.'));

    return !!response.value;
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

export async function publishToNpmAsync(
    libraryData: LibraryData,
    confirmBeforePublish = true
): Promise<void> {
    const {
        packageName,
        packageDistPathAbsolute,
        nxBuildTarget,
        pkgVersion, // Version from source package.json
        dependencies, // Array of LibraryDependency
    } = libraryData;


    printStartInfo(libraryData); // Updated to use libraryData

    // --- Build Step ---
    console.log(chalk.cyan(`INFO: Building ${chalk.bold(packageName)} library for production...`));
    const buildResult = BuildUtils.buildLibraryForProduction(nxBuildTarget);
    if (buildResult.status !== 0)
        throw new Error(`Build failed for ${packageName}.\n${buildResult.stderr}`);

    console.log(chalk.green('INFO: Build successful.\n'));

    // --- Get Version from Dist ---
    // This ensures we use the version that was actually built into the dist package.json
    const versionToPublish = pkgVersion; // Directly use the version from the input LibraryData
    console.log(chalk.cyan(`INFO: Version to publish (from source package.json): ${chalk.bold(versionToPublish)}`));


    // --- Check Dependencies ---
    if (!(await confirmAllDependenciesPublished(dependencies, 'dependencies')))
        throw new Error('Dependency check failed. Please ensure all dependencies are published first.');
    console.log(chalk.green('INFO: Dependency check passed.\n'));


    // --- Check if Main Package Version Exists ---
    const npmPackageSpec = `${packageName}@${versionToPublish}`;

    const found = await isPackageVersionAlreadyPublished(packageName, versionToPublish, 3, 5000);

    if (found) {
        console.log(chalk.yellow(`INFO: ${npmPackageSpec} already published, skipping.`));
        return;
    }
    console.log(chalk.green(`INFO: Version ${versionToPublish} not found on npm. Proceeding with publish...\n`));


    // --- Publish Step ---
    // Dry run
    console.log(chalk.cyan(`INFO: Performing npm publish dry run from ${packageDistPathAbsolute}...`));
    const dryRun = CommandUtils.npmPublishPublic(packageDistPathAbsolute, true);
    if (dryRun.status !== 0)
        throw new Error(`npm publish dry run failed.\n${dryRun.stderr}`);

    console.log(chalk.green('INFO: Dry run complete. Review the files listed above.\n'));

    // Confirmation prompt
    if (confirmBeforePublish && !(await confirmPublishPromptAsync(packageName)))
        return;


    // Actual publish
    console.log(chalk.cyan(`INFO: Publishing ${npmPackageSpec} to npm from ${packageDistPathAbsolute}...`));
    const publishResult = CommandUtils.npmPublishPublic(packageDistPathAbsolute, false, true); // access public, no dry run
    if (publishResult.status !== 0)
        throw new Error(chalk.red(`!!! ERROR: npm publish failed !!!\n${publishResult.stderr}`));

    console.log(chalk.bgGreen.black.bold(` INFO: Successfully published ${npmPackageSpec}. `));
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //