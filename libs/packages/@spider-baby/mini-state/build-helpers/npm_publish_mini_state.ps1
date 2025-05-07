# --- Configuration for mini-state package ---
# This script calls the generic NPM package publisher with parameters specific to the mini-state package

$ErrorActionPreference = "Stop" # Exit script on terminating errors

# Package details and paths
$packageName = "@spider-baby/mini-state"
$distPackageJsonPath = "./dist/libs/packages/@spider-baby/mini-state/package.json" # Relative to repo root
$packageDistPath = "./dist/libs/packages/@spider-baby/mini-state" # Relative to repo root
$nxBuildTarget = "sb-mini-state:build:production" # Adjusted target syntax if needed

# Initial repository root using path replacement (fallback method)
$repositoryRoot = $PSScriptRoot -replace '\\libs\\packages\\@spider-baby\\mini-state\\build-helpers$', ''
$sharedScriptsPath = Join-Path $repositoryRoot 'scripts\shared\npm'
Write-Host "Initial repository root: $repositoryRoot"

# Try to import more robust finder script if available
$findRepoScript = Join-Path $sharedScriptsPath "find-repository-root.ps1"
if (Test-Path $findRepoScript -PathType Leaf) {
    # Import the function
    . $findRepoScript
    
    # Get more reliable repository root
    $robustRoot = Find-RepositoryRoot -StartPath $PSScriptRoot
    if ($robustRoot) {
        $repositoryRoot = $robustRoot
        # Update shared scripts path to match new repository root
        $sharedScriptsPath = Join-Path $repositoryRoot 'scripts\shared\npm'
        Write-Host "Using robust repository root: $repositoryRoot"
    }
}

Write-Host "Final shared scripts path: $sharedScriptsPath"

# Verify path to generic publisher script
$publisherScriptPath = Join-Path $sharedScriptsPath "npm-publish-package.ps1"
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic publisher script at '$publisherScriptPath'."
    exit 1
}

Write-Host "INFO: Using generic publisher script at '$publisherScriptPath'"
Write-Host ""

# Call the generic publisher script with our package-specific parameters
& "$publisherScriptPath" `
    -PackageName $packageName `
    -DistPackageJsonPath $distPackageJsonPath `
    -PackageDistPath $packageDistPath `
    -NxBuildTarget $nxBuildTarget

# Exit with the same exit code as the called script
exit $LASTEXITCODE