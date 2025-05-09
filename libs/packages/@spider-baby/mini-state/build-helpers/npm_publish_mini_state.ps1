# --- Configuration for @spider-baby/mini-state package NPM publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/mini-state"
$packageDistPath = "dist\libs\packages\@spider-baby\mini-state"
$nxBuildTarget = "sb-mini-state:build:production"

# Paths to locate before continuing
$repositoryRoot = $null
$sharedScriptsPath = $null
$sharedScriptsRelativePath = "scripts-ps1/shared/npm"
$findRepoScriptPath = "find-repository-root.ps1"
$npmPublishPackageScriptFile = "npm-publish-package.ps1"

Write-Host "Starting NPM publishing....."



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


$publisherScriptPath = Join-Path $sharedScriptsPath $npmPublishPackageScriptFile
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic NPM publisher script at '$publisherScriptPath'"
    exit 1
}
Write-Host "INFO: Using generic NPM publisher script at '$publisherScriptPath'"
& "$publisherScriptPath" `
    -PackageName $packageName `
    -PackageDistPath $packageDistPath `
    -NxBuildTarget $nxBuildTarget


Write-Host "NPM PUBLISHED!!!!!!!!!!!!!!"

exit $LASTEXITCODE
