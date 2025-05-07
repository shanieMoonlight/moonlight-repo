# --- Configuration for mini-state package local publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/mini-state"
$packageDistPath = "./dist/libs/packages/@spider-baby/mini-state"
$nxBuildTarget = "sb-mini-state:build:production"
$localNpmDir = "C:\Users\Shaneyboy\my-npm"

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

# Verify path to generic local publisher script
$publisherScriptPath = Join-Path $sharedScriptsPath "local-npm-publish-package.ps1"
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic local publisher script at '$publisherScriptPath'"
    exit 1
}

Write-Host "INFO: Using generic local publisher script at '$publisherScriptPath'"

# Call the generic local publisher script
& "$publisherScriptPath" `
    -PackageName $packageName `
    -PackageDistPath $packageDistPath `
    -NxBuildTarget $nxBuildTarget `
    -LocalNpmDir $localNpmDir

exit $LASTEXITCODE