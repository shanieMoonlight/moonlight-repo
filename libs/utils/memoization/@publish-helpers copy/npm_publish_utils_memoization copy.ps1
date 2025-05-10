# --- Configuration for @spider-baby/utils-memoization package NPM publishing ---
    
# . "$PSScriptRoot\error-reporting.ps1"

$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/utils-memoization"
$packageDistRelativePath = "dist\libs\utils\memoization"
$nxBuildTarget = "sb-utils-memoization:build:production"
$findRepoScriptFilename = "find-repository-root.ps1"
$errorReportingScriptFilename = "error-reporting.ps1"
$publisherScriptRelativePath = "scripts-ps1\shared\npm\npm-publish-package.ps1"

# Paths to locate before continuing
$repositoryRoot = $null
$publisherScriptPath = $null
$packageDistPath = $null
$findRepoScript = $null
$errorReportingScript = $null
# $sharedScriptsRelativePath = "scripts-ps1/shared/npm"
# $findRepoScriptPath = "find-repository-root.ps1"
# $npmPublishPackageScriptFile = "npm-publish-package.ps1"

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
        Write-Host "Using packageDistRelativePath: $packageDistRelativePath  ??????" 
        $publisherScriptPath = Join-Path $repositoryRoot $publisherScriptRelativePath
        $packageDistPath = Join-Path $repositoryRoot $packageDistRelativePath
    }
    else {
        Write-Error "ERROR: '$findRepoScriptFilename' did not return a valid root."
        exit 1
    }

    Write-Host "Repository root: $repositoryRoot"
    Write-Host "Shared scripts absolute path: $publisherScriptPath"
    Write-Host "Dist dir absolute path: $packageDistPath"
    
    # --------------------------------- #

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


} catch {
    Write-Host "---" -BackgroundColor Red
    Write-Host "---" -BackgroundColor Red
    Write-Host "😱 ERROR: An error occurred during the publish processing! 👻" -BackgroundColor Red -ForegroundColor White
    Write-Host "---" -BackgroundColor Red
    Write-Host "---" -BackgroundColor Red
    Resolve-Error $_
    exit 1
}
