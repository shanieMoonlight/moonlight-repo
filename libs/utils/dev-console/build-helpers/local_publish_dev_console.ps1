# --- Configuration for dev-console package local publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/dev-console"
$packageDistPath = "./dist/libs/utils/dev-console"
$nxBuildTarget = "sb-dev-console:build:production"
$localNpmDir = "C:\Users\Shaneyboy\my-npm"

# Initial repository root using path replacement (fallback method)
$repositoryRoot = $PSScriptRoot -replace '\\libs\\utils\\dev-console\\build-helpers$', ''
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
# try {
    # Call the generic local publisher script
    & "$publisherScriptPath" `
        -PackageName $packageName `
        -PackageDistPath $packageDistPath `
        -NxBuildTarget $nxBuildTarget `
        -LocalNpmDir $localNpmDir
# }
# catch {
#     Write-Error "ERROR: Exception during npm pack operation???"
#     Write-Error "Exception Message: $($_.Exception)"
#     Write-Error "Exception Message: $($_.Exception.Message)"
#     Write-Error "Exception Type: $($_.Exception.GetType())"
#     Write-Error "Exception Type: $($_.Exception.GetType().FullName)"
#     Write-Error "Stack Trace: $($_.ScriptStackTrace)"
#     exit 1
# }


exit $LASTEXITCODE