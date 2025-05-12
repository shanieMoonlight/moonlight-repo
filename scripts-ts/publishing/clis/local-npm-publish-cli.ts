import chalk from 'chalk'; // Assuming chalk@4
import { program } from 'commander';
import * as path from 'path';
import { extractLibraryData } from '../../shared/library-data/extract_data_from_library';
import { LibraryData, LibraryDependency } from '../../shared/library-data/models';
import { localNpmPublishPackage } from '../shared/npm/local-npm-publisher';
import { FsUtils } from '../../shared/utils/fs/fs-utils';
import { logErrorToConsole } from './utils/error-logger';

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
    .option('-d, --publishDeps', 'Also publish dependencies')


program.parse(process.argv);

const options = program.opts();
const libraryRootRelative = options.libraryRootRelative;
const shouldPublishDeps = !!options.publishDeps;
const localNpmDir = options.localNpmDir;
/**
 * Controls whether dependency publishing failures should cause the entire process to fail.
 * When true: Any dependency publish failure will throw an error and stop the process.
 * When false: Dependency failures will be logged as warnings and the main package will still be published.
 */
const dependencyPublishMustNotFail = false;

const installationCommands: string[] = []

console.log(chalk.blue(`Publish CLI options: `), options);

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Adds a command to the installation commands array.
 * @param command - The command to add
 */
const addInstallationCommand = (packagePath: string) =>
    installationCommands.push(`npm install ${packagePath}`);

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Prints all installation commands as a single consecutive command.
 * Uses the appropriate shell operator to run commands one after another:
 * - For Windows PowerShell: semicolon (;)
 * - For CMD: ampersand (&)
 * - For bash/sh: double ampersand (&&) for conditional execution
 * 
 * @returns A string containing all commands joined with the appropriate operator
 */
function printConsecutiveInstallCommand(): string {
    if (installationCommands.length === 0) 
        return '';    
    
    // Default to PowerShell syntax (semicolon) since we're on Windows
    const commandOperator = '; ';
    const consecutiveCommand = installationCommands.join(commandOperator);
    
    console.log(chalk.bgCyan.black('\r\n CONSECUTIVE INSTALL COMMAND: '));
    console.log(chalk.cyan(consecutiveCommand));
    console.log(chalk.gray('\r\nCopy and paste this command to install all packages in one go.\r\n'));
    
    return consecutiveCommand;
}

//= = = = = = = = = = = = = = = = = = = = = = = = = = //

/**
 * Saves the installation commands to a text file in the library's root directory.
 * This makes it easier to run the commands later without having to copy them from the console.
 * 
 * @param consecutiveCommand - The concatenated installation command string
 * @param libData - Library data containing the library's root path
 * @returns The path to the created file
 */
function saveInstallationCommandsToFile(consecutiveCommand: string, libData: LibraryData): string {
    if (!consecutiveCommand) {
        console.log(chalk.yellow('No installation commands to save.'));
        return '';
    }
    
    // Create filename with timestamp to avoid overwriting
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `installation_cmd_${timestamp}.txt`;
    const filePath = path.join(libData.libraryRootAbsolute, filename);
    
    try {
        // Write the installation commands to the file using FsUtils
        FsUtils.writeFile(filePath, consecutiveCommand, 'utf8');
        
        console.log(chalk.green(`\r\nInstallation commands saved to: ${chalk.bold(filePath)}`));
        return filePath;
    } catch (err) {
        logErrorToConsole(err)
        return '';
    }
}


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
        const packagePath = await localNpmPublishPackage(libraryData, localNpmDir)

        addInstallationCommand(packagePath);
        console.log(chalk.green(`   Dependency ${libraryData.packageName} published successfully!\r\n`));

    } catch (err) {
        logErrorToConsole(err, !dependencyPublishMustNotFail)
        if (dependencyPublishMustNotFail)
            throw err
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
        console.log(chalk.bgBlueBright(`Publish CLI: Extracted data from ${chalk.bold(libraryRootRelative)}:`));
        console.log(chalk.blueBright(`  libraryData`), mainLibraryData); // Using gray for less prominent data dump

        if (shouldPublishDeps)
            await publishDepsAsync(mainLibraryData.dependencies);
        else
            console.log(chalk.yellow(`Publish CLI: Skipping dependency publish...`))

        const packagePath = await localNpmPublishPackage(
            mainLibraryData,
            localNpmDir
        );        addInstallationCommand(packagePath);
        console.log(chalk.bgGreen.black.bold(" PUBLISHED!!!!!!!!!!!!!! ")); // Example with background and bold

        // Print and save the consecutive installation command
        const consecutiveCommand = printConsecutiveInstallCommand();
        if (consecutiveCommand) {
            saveInstallationCommandsToFile(consecutiveCommand, mainLibraryData);
        }

        process.exit(0)
    } catch (err) {
        logErrorToConsole(err)
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


//Call with npx ts-node -P tsconfig.scripts.json  C:\Users\Shaneyboy\VsCode\moonlight-repo\scripts-ts\publishing\clis\local-npm-publish-cli.ts   -l <libraryRootRelative> [other options]