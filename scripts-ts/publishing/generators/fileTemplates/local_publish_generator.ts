/**
 * Generates a PowerShell script for locally publishing an npm package
 * 
 * @param {Object} options - Configuration options for the script generation
 * @param {string} options.packageName - The name of the package to publish
 * @param {string} options.packageDistRelativePath - The relative path to the package's distribution files
 * @param {string} options.nxBuildTarget - The Nx build target for the package
 * @param {string} options.localNpmDir - The directory where the package will be published locally
 * @param {string} options.localNpmPublisherScriptRelativePath - The relative path to the local npm publisher script
 * @param {string} options.findRepoScriptFilename - The filename of the script that finds the repository root
 * @param {string} options.errorReportingScriptFilename - The filename of the error reporting script
 * 
 * @returns {Object} An object containing the script's name and content
 * @returns {string} returns.name - The generated filename for the PowerShell script
 * @returns {string} returns.content - The content of the PowerShell script
 */

const utils = require('../utils/build-helper-utils');

//------------------------------------------//

/**
 * Ensures all required inputs for script generation are provided and truthy
 * @param {Object} inputs - Input parameters to validate
 * @throws {Error} If any required input is missing or falsy
 */
function ensureValidInputs(inputs) {
    for (const [key, value] of Object.entries(inputs)) {
        if (!value) 
            throw new Error(`localPublish_Ps1_Generator: Missing required parameter: ${key}`)
    }
}

//------------------------------------------//

 function localPublish_Ps1_Generator({
    packageName,
    packageDistRelativePath,
    nxBuildTarget,
    localNpmDir,
    localNpmPublisherScriptRelativePath,
    findRepoScriptFilename,
    errorReportingScriptFilename }) {

    ensureValidInputs({
        packageName,
        packageDistRelativePath,
        nxBuildTarget,
        localNpmDir,
        localNpmPublisherScriptRelativePath,
        findRepoScriptFilename,
        errorReportingScriptFilename
    });

    const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
    const name = `local_publish_${packageShortNameUnderscore}.ps1`;
    
    const content = `
    import * as path from 'path'
import { localNpmPublishPackage } from 'C:/Users/Shaneyboy/VsCode/moonlight-repo/scripts-ts/publishing/shared/npm/local-npm-publish-package';
import { findRepositoryRootPath } from 'C:/Users/Shaneyboy/VsCode/moonlight-repo/scripts-ts/shared/utils/find-repository-root';

const packageName = "@spider-baby/dev-console";
const packageDistRelativePath = "dist/libs/utils/dev-console";
const nxBuildTarget = "sb-dev-console:build:production";
const localNpmDir = "C:/Users/Shaneyboy/my-npm";

async function main() {
    try {
        console.log('Strarting local NPM publish process...');
        
        const repositoryRoot = findRepositoryRootPath();
        if (!repositoryRoot) {
            throw new Error("Could not find repository root (no tsconfig.base.json found).");
        }

        const packageDistPath = path.join(repositoryRoot, packageDistRelativePath);

        await localNpmPublishPackage(
            packageName,
            packageDistPath,
            nxBuildTarget,
            localNpmDir
        );

        console.log("PUBLISHED!!!!!!!!!!!!!!");
        process.exit(0);
    } catch (err) {
        console.error("😱 ERROR: An error occurred during the publish processing! 👻");
        console.error(err);
        process.exit(1);
    }
}

main();


`
    return { name, content };

}


//##########################################//


module.exports = localPublish_Ps1_Generator;

//##########################################//


