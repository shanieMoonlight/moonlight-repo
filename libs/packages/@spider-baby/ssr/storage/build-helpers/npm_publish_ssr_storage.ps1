# --- Configuration for @spider-baby/ssr-storage package NPM publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/ssr-storage"
$packageDistPath = "./dist/libs/packages/@spider-baby/ssr/storage"
$nxBuildTarget = "spider-baby-ssr-local-storage:build:production"

# Initial repository root using path replacement (fallback method)
$repositoryRoot = $PSScriptRoot -replace '/libs/packages/@spider-baby/ssr/storage/build-helpers$', ''
$sharedScriptsPath = Join-Path $repositoryRoot 'scripts/shared/npm'
Write-Host "Initial repository root: $repositoryRoot"

# Try to import more robust finder script if available
$findRepoScript = Join-Path $sharedScriptsPath "find-repository-root.ps1"
if (Test-Path $findRepoScript -PathType Leaf) {
    . $findRepoScript
    $robustRoot = Find-RepositoryRoot -StartPath $PSScriptRoot
    if ($robustRoot) {
        $repositoryRoot = $robustRoot
        $sharedScriptsPath = Join-Path $repositoryRoot 'scripts/shared/npm'
        Write-Host "Using robust repository root: $repositoryRoot"
    }
}
Write-Host "Final shared scripts path: $sharedScriptsPath"

$publisherScriptPath = Join-Path $sharedScriptsPath "npm-publish-package.ps1"
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic NPM publisher script at '$publisherScriptPath'"
    exit 1
}
Write-Host "INFO: Using generic NPM publisher script at '$publisherScriptPath'"
& "$publisherScriptPath" \
    -PackageName $packageName \
    -PackageDistPath $packageDistPath \
    -NxBuildTarget $nxBuildTarget

exit $LASTEXITCODE
