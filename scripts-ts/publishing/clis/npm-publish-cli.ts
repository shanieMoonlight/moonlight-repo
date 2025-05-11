
import chalk from 'chalk'; // Assuming chalk@4
import { program } from 'commander';
import { extractLibraryData } from '../../shared/library-data/extract_data_from_library';
import { LibraryDependency } from '../../shared/library-data/models';
import { publishToNpmAsync } from '../shared/npm/npm-publisher';
import { logErrorToConsole } from './utils/error-logger';

//####################################################//

//CONFIGURABLE VARIABLES

/**
 * Configures the CLI options using Commander.
 * -l, --libraryRootRelative: Relative path to the library root (required)
 * -d, --publishDeps: Whether to also publish dependencies (optional, default: false)
 * --skip-confirm: Skips the confirmation prompt before publishing (optional, default: false)
 */
program
    .requiredOption('-l, --libraryRootRelative <path>', 'Relative path to the library root')
    .option('-d, --publishDeps', 'Also publish dependencies')
    .option('--skip-confirm', 'Skips the confirmation prompt before publishing')
    .option('--no-strict-deps', 'Continue publishing even if dependencies fail (default: strict mode enabled)')


program.parse(process.argv);

const options = program.opts();
const libraryRootRelative = options.libraryRootRelative;
const shouldPublishDeps = !!options.publishDeps;
const confirmBeforePublish = !options.skipConfirm;
const dependencyPublishMustNotFail = !!options.strictDeps

console.log(chalk.blue(`Publish CLI options: `), options);

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Publishes a single dependency library to npm.
 * 
 * @param dependencyRootRelative - Relative path to the dependency library root
 * @param confirmBeforePublish - Whether to prompt for confirmation before publishing
 */
async function publishDependencyToNpmAsync(dependencyRootRelative: string, confirmBeforePublish: boolean) {
    console.log(chalk.cyan(`/= = = = = = = = = = = = = = = = = = = = = = = = = = `));
    console.log(chalk.cyan(`Publish CLI: publishing dependency from ${dependencyRootRelative}\r\n`));
    try {
        const libraryData = extractLibraryData(dependencyRootRelative);
        await publishToNpmAsync(
            libraryData,
            confirmBeforePublish
        )
        console.log(chalk.green(`       Dependency ${libraryData.packageName} published successfully!\r\n`));
        console.log(chalk.cyan(`/= = = = = = = = = = = = = = = = = = = = = = = = = = `));

    } catch (err) {
        logErrorToConsole(err, !dependencyPublishMustNotFail)
        if (dependencyPublishMustNotFail)
            throw err
    }
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Publishes all dependencies in the provided array to npm.
 * 
 * @param deps - Array of LibraryDependency objects
 * @param confirmBeforePublish - Whether to prompt for confirmation before publishing each dependency
 */
async function publishDepsAsync(deps: LibraryDependency[], confirmBeforePublish: boolean) {
    for (const dep of deps) {
        const dependencyRootRelative = dep.relativePath;
        if (!dependencyRootRelative) {
            console.warn(chalk.yellow(`Publish CLI: No dependency root relative path found for ${chalk.bold(dep.name)}. Skipping...`));
            continue;
        }
        await publishDependencyToNpmAsync(dependencyRootRelative, confirmBeforePublish);
    }
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Main CLI entry point for publishing a library (and optionally its dependencies) to npm.
 * 
 * Extracts library data, optionally publishes dependencies, then publishes the main library.
 * Handles errors with proper formatting and exit codes.
 */
async function npmPublishCliAsync() {
    try {
        console.log(chalk.blue('Publish CLI: Starting NPM publish process...'));
        // EXTRACT DATA FROM LIBRARY
        const mainLibraryData = extractLibraryData(libraryRootRelative);
        console.log(chalk.bgBlueBright(`Publish CLI: Extracted data from ${chalk.bold(libraryRootRelative)}:`));
        console.log(chalk.blueBright(`  libraryData`), mainLibraryData); // Using gray for less prominent data dump

        if (shouldPublishDeps)
            await publishDepsAsync(mainLibraryData.dependencies, confirmBeforePublish);
        else
            console.log(chalk.yellow(`Publish CLI: Skipping dependency publish...`))

        await publishToNpmAsync(
            mainLibraryData,
            confirmBeforePublish
        )

        console.log(chalk.bgGreen.black.bold(" PUBLISHED!!!!!!!!!!!!!! ")); // Example with background and bold
        process.exit(0)

    } catch (err) {
        logErrorToConsole(err)
        process.exit(1);
    }
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //
// RUN THE CLI

/**
 * Top-level runner for the npm publish CLI. Catches and logs any unhandled errors.
 * 
 * Available options:
 * -l, --libraryRootRelative <path>: Relative path to the library root (required)
 * -d, --publishDeps: Also publish dependencies (optional, default: false)
 * --skip-confirm: Skips the confirmation prompt before publishing (optional, default: false)
 */
npmPublishCliAsync().catch(err => {
    console.error(chalk.bgRed.white.bold(" Top-level error: "), err);
    process.exit(1);
});

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

// Usage examples:
//From Root
// npx ts-node -P tsconfig.scripts.json scripts-ts/publishing/clis/npm-publish-cli.ts -l <libraryRootRelative>
// npx ts-node -P tsconfig.scripts.json scripts-ts/publishing/clis/npm-publish-cli.ts -l <libraryRootRelative> -d --skip-confirm

//From anywhere
//npx ts-node -P tsconfig.scripts.json  C:\Users\Shaneyboy\VsCode\moonlight-repo\scripts-ts\publishing\clis\npm-publish-cli.ts   -l <libraryRootRelative>
//npx ts-node -P tsconfig.scripts.json  C:\Users\Shaneyboy\VsCode\moonlight-repo\scripts-ts\publishing\clis\npm-publish-cli.ts   -l <libraryRootRelative> -d --skip-confirm