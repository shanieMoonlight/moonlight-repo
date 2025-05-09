const utils = require('../utils/build-helper-utils');

module.exports = function localPublish_Ps1_Generator({ packageName, packageDistPath, nxBuildTarget, localNpmDir, sharedScriptsRelativePath }) {

    const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
    const name = `local_publish_${packageShortNameUnderscore}.ps1`;

    const content = `# --- Configuration for ${packageName} package local publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistPath = "${packageDistPath}"
$nxBuildTarget = "${nxBuildTarget}"
$localNpmDir = "${localNpmDir}"
$localNpmPublishPackageScriptFile = "local-npm-publish-package.ps1"

# Paths to locate before continuing
$repositoryRoot = $null
$sharedScriptsPath = $null
$sharedScriptsRelativePath = "${sharedScriptsRelativePath}"

Write-Host "Starting local publishing....."


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
`
    return { name, content };

}
