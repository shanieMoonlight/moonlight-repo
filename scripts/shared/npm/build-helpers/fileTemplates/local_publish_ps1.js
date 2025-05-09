/**
 * Generates a PowerShell script for locally publishing an npm package
 * 
 * @param {Object} options - Configuration options for the script generation
 * @param {string} options.packageName - The name of the package to publish
 * @param {string} options.packageDistPath - The path to the package's distribution files
 * @param {string} options.nxBuildTarget - The Nx build target for the package
 * @param {string} options.localNpmDir - The directory where the package will be published locally
 * @param {string} options.sharedScriptsRelativePath - The relative path to shared scripts from repository root
 * @param {string} options.findRepoScriptPath - The path to the script that finds the repository root
 * 
 * @returns {Object} An object containing the script's name and content
 * @returns {string} returns.name - The generated filename for the PowerShell script
 * @returns {string} returns.content - The content of the PowerShell script
 */
const e = require('express');
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
    packageDistPath,
    nxBuildTarget,
    localNpmDir,
    sharedScriptsRelativePath,
    findRepoScriptPath,
    errorReportingScriptRelativePath }) {

    ensureValidInputs({
        packageName,
        packageDistPath,
        nxBuildTarget,
        localNpmDir,
        sharedScriptsRelativePath,
        findRepoScriptPath,
        errorReportingScriptRelativePath
    });

    const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
    const name = `local_publish_${packageShortNameUnderscore}.ps1`;

    const content = `# --- Configuration for ${packageName} package local publishing ---

. "$PSScriptRoot\\${errorReportingScriptRelativePath}"

$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistPath = "${packageDistPath}"
$nxBuildTarget = "${nxBuildTarget}"
$localNpmDir = "${localNpmDir}"
$findRepoScriptPath = "${findRepoScriptPath}"
$localNpmPublishPackageScriptFile = "local-npm-publish-package.ps1"

# Paths to locate before continuing
$repositoryRoot = $null
$sharedScriptsPath = $null
$sharedScriptsRelativePath = "${sharedScriptsRelativePath}"

Write-Host "Starting local publishing....."

try {
    # Try to import more robust finder script if available
    $findRepoScript = Join-Path $PSScriptRoot $findRepoScriptPath
    if (Test-Path $findRepoScript -PathType Leaf) {
        . $findRepoScript
        $robustRoot = Find-RepositoryRoot
        if ($robustRoot) {
            $repositoryRoot = $robustRoot
            $sharedScriptsPath = Join-Path $repositoryRoot $sharedScriptsRelativePath
            Write-Host "Using robust repository root: $repositoryRoot"
        } else {
            Write-Error "ERROR: '$findRepoScriptPath' did not return a valid root."
            exit 1
        }
    } else {
        Write-Error "ERROR: Cannot find Repository Root"
        exit 1
    }

    Write-Host "Repository root: $repositoryRoot"
    Write-Host "Shared scripts path: $sharedScriptsPath"


    $publisherScriptPath = Join-Path $sharedScriptsPath $localNpmPublishPackageScriptFile
    if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
        Write-Error "ERROR: Cannot find generic local publisher script at '$publisherScriptPath'"
        exit 1
    }

    Write-Host "INFO: Using generic local publisher script at '$publisherScriptPath'"
    & "$publisherScriptPath" \`
        -PackageName $packageName \`
        -PackageDistPath $packageDistPath \`
        -NxBuildTarget $nxBuildTarget \`
        -LocalNpmDir $localNpmDir


    Write-Host "PUBLISHED!!!!!!!!!!!!!!"
    exit $LASTEXITCODE


} catch {
    Write-Host "---" -BackgroundColor Red
    Write-Host "---" -BackgroundColor Red
    Write-Host "😱 ERROR: An error occurred during the publish processing! 👻" -BackgroundColor Red -ForegroundColor White
    Write-Host "---" -BackgroundColor Red
    Write-Host "---" -BackgroundColor Red
    Resolve-Error $_
    exit 1
}


`
    return { name, content };

}


//##########################################//


module.exports = localPublish_Ps1_Generator;

//##########################################//


