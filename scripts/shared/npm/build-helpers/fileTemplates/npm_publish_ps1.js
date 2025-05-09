const utils = require('../utils/build-helper-utils');


/**
 * Generates a PowerShell script for NPM package publishing
 * 
 * @param {Object} options - Configuration options for the script generator
 * @param {string} options.packageName - The full name of the package to publish
 * @param {string} options.packageDistPath - The distribution path for the package
 * @param {string} options.nxBuildTarget - The Nx build target for the package
 * @param {string} options.sharedScriptsRelativePath - The relative path to shared scripts from repository root
 * @returns {Object} An object containing the script name and content
 * @returns {string} returns.name - The generated PowerShell script filename
 * @returns {string} returns.content - The PowerShell script content
 */
module.exports = function npmPublish_Ps1_Generator({ packageName, packageDistPath, nxBuildTarget, sharedScriptsRelativePath }) {

    const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
    const name = `npm_publish_${packageShortNameUnderscore}.ps1`;


    const content = `# --- Configuration for ${packageName} package NPM publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistPath = "${packageDistPath}"
$nxBuildTarget = "${nxBuildTarget}"

# Paths to locate before continuing
$repositoryRoot = $null
$sharedScriptsPath = $null
$sharedScriptsRelativePath = "${sharedScriptsRelativePath}"
$npmPublishPackageScriptFile = "npm-publish-package.ps1"

Write-Host "Starting NPM publishing....."



# Try to import more robust finder script if available
$findRepoScript = Join-Path $PSScriptRoot "find-repository-root.ps1"
if (Test-Path $findRepoScript -PathType Leaf) {
    . $findRepoScript
    $robustRoot = Find-RepositoryRoot
    if ($robustRoot) {
        $repositoryRoot = $robustRoot
        $sharedScriptsPath = Join-Path $repositoryRoot $sharedScriptsRelativePath
        Write-Host "Using robust repository root: $repositoryRoot"
    } else {
        Write-Error "ERROR: find-repository-root.ps1 did not return a valid root."
        exit 1
    }
} else {
    Write-Error "ERROR: Cannot find Repository Root"
    exit 1
}

Write-Host "Repository root: $repositoryRoot"
Write-Host "Shared scripts path: $sharedScriptsPath"


$publisherScriptPath = Join-Path $sharedScriptsPath $npmPublishPackageScriptFile
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic NPM publisher script at '$publisherScriptPath'"
    exit 1
}
Write-Host "INFO: Using generic NPM publisher script at '$publisherScriptPath'"
& "$publisherScriptPath" \`
    -PackageName $packageName \`
    -PackageDistPath $packageDistPath \`
    -NxBuildTarget $nxBuildTarget


Write-Host "NPM PUBLISHED!!!!!!!!!!!!!!"

exit $LASTEXITCODE
`
    return { name, content };

}
