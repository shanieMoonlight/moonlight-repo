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
    
    const content = `# --- Configuration for ${packageName} package local publishing ---


$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistRelativePath = "${packageDistRelativePath}"
$nxBuildTarget = "${nxBuildTarget}"
$localNpmDir = "${localNpmDir}"
$findRepoScriptFilename = "${findRepoScriptFilename}"
$errorReportingScriptFilename = "${errorReportingScriptFilename}"
$publisherScriptRelativePath = "${localNpmPublisherScriptRelativePath}"

# Paths to locate before continuing
$repositoryRoot = $null
$publisherScriptPath = $null
$packageDistPath = $null
$findRepoScript = $null
$errorReportingScript = $null

Write-Host "Starting local publishing....."

try {

    # Locate helper scripts
    $errorReportingScript = Join-Path $PSScriptRoot $errorReportingScriptFilename
    if (Test-Path $errorReportingScript -PathType Leaf) {
        . $errorReportingScript
    }
    else {
        Write-Error "ERROR: Cannot find error reporting script at '$errorReportingScript'"
        exit 1
    }

    $findRepoScript = Join-Path $PSScriptRoot $findRepoScriptFilename
    if (Test-Path $findRepoScript -PathType Leaf) {
        . $findRepoScript
    }
    else {
        Write-Error "ERROR: Cannot find Repository Root finder script at '$findRepoScript'"
        exit 1
    }

    # --------------------------------- #
    
    $repositoryRoot = Find-RepositoryRoot
    if ($repositoryRoot) {
        $publisherScriptPath = Join-Path $repositoryRoot $publisherScriptRelativePath
        $packageDistPath = Join-Path $repositoryRoot $packageDistRelativePath
    }
    else {
        Write-Error "ERROR: '$findRepoScriptFilename' did not return a valid root."
        exit 1
    }

    Write-Host "Repository root: $repositoryRoot"
    Write-Host "Shared scripts absolute path: $publisherScriptPath"
    Write-Host "Dist dir absolute path: $packageDistPath"
    
    # --------------------------------- #

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


