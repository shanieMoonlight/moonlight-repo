# --- Configuration for @spider-baby/ssr-storage package local publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/ssr-storage"
$packageDistPath = "dist\libs\packages\@spider-baby\ssr\storage"
$nxBuildTarget = "spider-baby-ssr-local-storage:build:production"
$localNpmDir = "C:/Users/Shaneyboy/my-npm"
$findRepoScriptPath = "find-repository-root.ps1"
$localNpmPublishPackageScriptFile = "local-npm-publish-package.ps1"

# Paths to locate before continuing
$repositoryRoot = $null
$sharedScriptsPath = $null
$sharedScriptsRelativePath = "scripts-ps1/shared/npm"

Write-Host "Starting local publishing....."


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
& "$publisherScriptPath" `
    -PackageName $packageName `
    -PackageDistPath $packageDistPath `
    -NxBuildTarget $nxBuildTarget `
    -LocalNpmDir $localNpmDir


Write-Host "PUBLISHED!!!!!!!!!!!!!!"
exit $LASTEXITCODE
