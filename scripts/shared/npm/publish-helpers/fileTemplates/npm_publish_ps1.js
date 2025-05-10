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

/**
 * Generates a PowerShell script for NPM package publishing
 * 
 * @param {Object} options - Configuration options for the script generator
 * @param {string} options.packageName - The full name of the package to publish
 * @param {string} options.packageDistRelativePath - The distribution path for the package
 * @param {string} options.nxBuildTarget - The Nx build target for the package
 * @param {string} options.sharedScriptsRelativePath - The relative path to shared scripts from repository root
 * @returns {Object} An object containing the script name and content
 * @returns {string} returns.name - The generated PowerShell script filename
 * @returns {string} returns.content - The PowerShell script content
 */
function npmPublish_Ps1_Generator({
    packageName,
    packageDistRelativePath,
    nxBuildTarget,
    npmPublisherScriptRelativePath,
    findRepoScriptFilename,
    errorReportingScriptFilename }) {

    ensureValidInputs({
        packageName,
        packageDistRelativePath,
        nxBuildTarget,
        npmPublisherScriptRelativePath,
        findRepoScriptFilename,
        errorReportingScriptFilename
    });

    const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
    const name = `npm_publish_${packageShortNameUnderscore}.ps1`;


    const content = `# --- Configuration for ${packageName} package NPM publishing ---
    

$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistRelativePath = "${packageDistRelativePath}"
$nxBuildTarget = "${nxBuildTarget}"
$publisherScriptRelativePath = "${npmPublisherScriptRelativePath}"
$findRepoScriptFilename = "${findRepoScriptFilename}"
$errorReportingScriptFilename = "${errorReportingScriptFilename}"

# Paths to locate before continuing
$repositoryRoot = $null
$publisherScriptPath = $null
$packageDistRelativePath = $null
$findRepoScript = $null
$errorReportingScript = $null

Write-Host "Starting NPM publishing....."



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
        Write-Host "Using packageDistRelativePath: $packageDistRelativePath" 
        $publisherScriptPath = Join-Path $repositoryRoot $publisherScriptRelativePath
        $packageDistRelativePath = Join-Path $repositoryRoot $packageDistRelativePath
    }
    else {
        Write-Error "ERROR: '$findRepoScriptFilename' did not return a valid root."
        exit 1
    }

    Write-Host "Repository root: $repositoryRoot"
    Write-Host "Shared scripts absolute path: $publisherScriptPath"
    Write-Host "Dist dir absolute path: $packageDistRelativePath"
    
    # --------------------------------- #

    if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
        Write-Error "ERROR: Cannot find generic NPM publisher script at '$publisherScriptPath'"
        exit 1
    }

    Write-Host "INFO: Using generic NPM publisher script at '$publisherScriptPath'"
    & "$publisherScriptPath" \`
        -PackageName $packageName \`
        -PackageDistPath $packageDistRelativePath \`
        -NxBuildTarget $nxBuildTarget


    Write-Host "NPM PUBLISHED!!!!!!!!!!!!!!"

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


module.exports = npmPublish_Ps1_Generator;

//##########################################//


