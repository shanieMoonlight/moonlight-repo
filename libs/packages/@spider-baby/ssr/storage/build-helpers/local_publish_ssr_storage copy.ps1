# --- Configuration for @spider-baby/ssr-storage package local publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/ssr-storage"
$packageDistPath = "./dist/libs/packages/@spider-baby/ssr/storage"
$nxBuildTarget = "spider-baby-ssr-local-storage:build:production"
$localNpmDir = "C:/Users/Shaneyboy/my-npm"

# Paths to locate before continuing
$repositoryRoot = $null
$sharedScriptsPath = $null
$sharedScriptsRelativePath ="scripts/shared/npm"


Write-Host "Starting local publishing..."


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

$publisherScriptPath = Join-Path $sharedScriptsPath "local-npm-publish-package.ps1"
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic local publisher script at '$publisherScriptPath'"
    exit 1
}

Write-Host "INFO: Using generic local publisher script at '$publisherScriptPath'"
& "$publisherScriptPath" `
    -PackageName $packageName `
    -PackageDistPath $packageDistPath `
    -NxBuildTarget $nxBuildTarget `
    -LocalNpmDir $localNpmDir


Write-Host "PUBLISHED!!!!!!!!!!!!!!"
exit $LASTEXITCODE
