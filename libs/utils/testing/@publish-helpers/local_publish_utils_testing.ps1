# --- Configuration for @spider-baby/utils-testing package local publishing ---


$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "@spider-baby/utils-testing"
$packageDistRelativePath = "dist\libs\utils\testing"
$nxBuildTarget = "spider-baby-utils-testing:build:production"
$localNpmDir = "C:/Users/Shaneyboy/my-npm"
$findRepoScriptFilename = "find-repository-root.ps1"
$errorReportingScriptFilename = "error-reporting.ps1"
$publisherScriptRelativePath = "scripts-ps1\shared\npm\local-npm-publish-package.ps1"

# Paths to locate before continuing
$repositoryRoot = $null
$publisherScriptPath = $null
$packageDistPath = $null
$findRepoScript = $null
$errorReportingScript = $null

Write-Host "Starting local publishing....."

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


} catch {
    Write-Host "---" -BackgroundColor Red
    Write-Host "---" -BackgroundColor Red
    Write-Host "😱 ERROR: An error occurred during the publish processing! 👻" -BackgroundColor Red -ForegroundColor White
    Write-Host "---" -BackgroundColor Red
    Write-Host "---" -BackgroundColor Red
    Resolve-Error $_
    exit 1
}


