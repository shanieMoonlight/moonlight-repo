
import chalk from 'chalk'; // Assuming chalk@4
import { program } from 'commander';
import { extractLibraryData } from '../../shared/library-data/extract_data_from_library';
import { LibraryDependency } from '../../shared/library-data/models';
import { localNpmPublishPackage } from '../shared/npm/local-npm-publisher';

//####################################################//
//DEFAULTS

const defaultLocalNpmDir = "C:/Users/Shaneyboy/my-npm";

//####################################################//
//CONFIGURABLE VARIABLES

/**
 * Configures the CLI options using Commander.
 * -l, --libraryRootRelative: Relative path to the library root (required)
 * -n, --localNpmDir: Local npm directory (optional, default: defaultLocalNpmDir)
 * -d, --publishDeps: Whether to also publish dependencies (optional, default: false)
 */
program
    .requiredOption('-l, --libraryRootRelative <path>', 'Relative path to the library root')
    .option('-n, --localNpmDir <dir>', 'Local npm directory', defaultLocalNpmDir)
    .option('-d, --publishDeps', 'Also publish dependencies', true)


program.parse(process.argv);

const options = program.opts();
const libraryRootRelative = options.libraryRootRelative;
const shouldPublishDeps = options.publishDeps;
const localNpmDir = options.localNpmDir;

console.log(chalk.blue(`Publish CLI options: `), options);

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Publishes a single dependency library to the local npm directory.
 * @param dependencyRootRelative - Relative path to the dependency library root
 * @param localNpmDir - Local npm directory (optional)
 */
async function localNpm_Dependency_PublishAsync(dependencyRootRelative: string, localNpmDir: string = defaultLocalNpmDir) {
    console.log(chalk.cyan(`\r\nPublish CLI: publishing dependency from ${dependencyRootRelative}\r\n`));
    try {
        const libraryData = extractLibraryData(dependencyRootRelative);
        await localNpmPublishPackage(
            libraryData,
            localNpmDir
        )
        console.log(chalk.green(`   Dependency ${libraryData.packageName} published successfully!\r\n`));

    } catch (err) {
        console.warn(chalk.yellow(`Publish CLI: ERROR publishing dependency from ${dependencyRootRelative}.  Skipping...`));
        if (err instanceof Error) {
            console.warn(chalk.red(err.message));
            if (err.stack) {
                console.warn(chalk.gray(err.stack));
            }
        } else {
            console.warn(chalk.red(String(err)));
        }
    }
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Publishes all dependencies in the provided array to the local npm directory.
 * @param deps - Array of LibraryDependency objects
 */
async function publishDepsAsync(deps: LibraryDependency[]) {
    for (const dep of deps) {
        const dependencyRootRelative = dep.relativePath;
        if (!dependencyRootRelative) {
            console.warn(chalk.yellow(`Publish CLI: No dependency root relative path found for ${chalk.bold(dep.name)}. Skipping...`));
            continue;
        }
        await localNpm_Dependency_PublishAsync(dependencyRootRelative, localNpmDir);
    }
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Main CLI entry point for publishing a library (and optionally its dependencies) to a local npm directory.
 * Extracts library data, optionally publishes dependencies, then publishes the main library.
 */
async function localNpmPublishCliAsync() {
    try {
        console.log(chalk.blue('Publish CLI: Starting local NPM publish process...'));
        // EXTRACT DATA FROM LIBRARY
        const mainLibraryData = extractLibraryData(libraryRootRelative);
        console.log(chalk.blue(`Publish CLI: Extracted data from ${chalk.bold(libraryRootRelative)}:`));
        console.log(chalk.gray(`  libraryData`), mainLibraryData); // Using gray for less prominent data dump

        if (shouldPublishDeps)
            await publishDepsAsync(mainLibraryData.dependencies);
        else
            console.log(chalk.yellow(`Publish CLI: Skipping dependency publish...`))

        await localNpmPublishPackage(
            mainLibraryData,
            localNpmDir
        );
        console.log(chalk.bgGreen.black.bold(" PUBLISHED!!!!!!!!!!!!!! ")); // Example with background and bold
        process.exit(0)
    } catch (err) {
        console.error(chalk.red.bold("😱 ERROR: An error occurred during the publish processing! 👻"));
        if (err instanceof Error) {
            console.error(chalk.red(err.message));
            if (err.stack) {
                console.error(chalk.gray(err.stack));
            }
        } else {
            console.error(chalk.red(String(err)));
        }
        process.exit(1);
    }
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //
// RUN THE CLI

/**
 * Top-level runner for the local npm publish CLI. Catches and logs any unhandled errors.
 */
localNpmPublishCliAsync().catch(err => {
    console.error(chalk.bgRed.white.bold(" Top-level error: "), err);
    process.exit(1);
});

//= = = = = = = = = = = = = = = = = = = = = = = = = = //


//Call with npm run local-npm-publish -- -l <libraryRootRelative> [other options]