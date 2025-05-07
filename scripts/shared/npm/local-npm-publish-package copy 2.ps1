# --- Generic Local NPM Package Publisher Script ---
# This script provides a reusable function to build and publish an NPM package locally

param (
    [Parameter(Mandatory = $true, HelpMessage = "Name of the NPM package (e.g. '@spider-baby/mini-state')")]
    [string]$PackageName,
    
    [Parameter(Mandatory = $true, HelpMessage = "Path to the package dist folder (relative to repo root)")]
    [string]$PackageDistPath,
    
    [Parameter(Mandatory = $true, HelpMessage = "Nx build target for the package (e.g. 'sb-mini-state:build:production')")]
    [string]$NxBuildTarget,
    
    [Parameter(Mandatory = $false, HelpMessage = "Local npm directory to store the package tarball")]
    [string]$LocalNpmDir = "C:\Users\Shaneyboy\my-npm"
)

$ErrorActionPreference = "Stop" # Exit script on terminating errors

Write-Host "=================================================="
Write-Host " Locally Publishing $PackageName (PowerShell)"
Write-Host "=================================================="
Write-Host "Package Dist Path: $PackageDistPath"
Write-Host "Nx Build Target: $NxBuildTarget"
Write-Host "Local NPM Directory: $LocalNpmDir"
Write-Host "=================================================="
Write-Host ""

# Ensure the local npm directory exists
if (-not (Test-Path $LocalNpmDir -PathType Container)) {
    Write-Host "Creating local npm directory at $LocalNpmDir..."
    New-Item -Path $LocalNpmDir -ItemType Directory -Force | Out-Null
}

# Store the original directory to return to it after publishing
$originalLocation = Get-Location

# --- Build Step ---
# Build the package using Nx before attempting to publish
Write-Host "INFO: Building $PackageName library for production..."
try {
    npx nx run $NxBuildTarget
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: Build failed for $PackageName. Exiting."
        exit 1
    }
    Write-Host "INFO: Build successful."
    Write-Host ""
}
catch {
    Write-Error "ERROR: Build command failed unexpectedly."
    Write-Error $_.Exception.Message
    exit 1
}

# Main publishing logic in a try-catch-finally block
try {
    # Verify the dist directory exists
    if (-not (Test-Path $PackageDistPath -PathType Container)) {
        Write-Error "ERROR: Distribution directory '$PackageDistPath' does not exist or is not accessible."
        exit 1
    }
    
    # Navigate to the dist directory
    Write-Host "INFO: Navigating to $PackageDistPath"
    Set-Location $PackageDistPath

    # try {
    # Pack the package
    Write-Host "INFO: Packing $PackageName..."
    Write-Host "Current directory: $(Get-Location)"

    # Try running npm version to ensure npm is working
    Write-Host "DEBUG: Checking npm version:"
    npm --version

    # Execute npm pack with verbose output
    Write-Host "DEBUG: Executing npm pack command..."
    $npmPackOutput = & npm pack --verbose  
    Write-Host "DEBUG: npm pack output: $npmPackOutput"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: npm pack failed with exit code $LASTEXITCODE"
        Write-Error "npm pack output: $npmPackOutput"
        exit 1
    }

    # Debug: List files after npm pack
    Write-Host "DEBUG: Files after npm pack:"
    Get-ChildItem -Path "." | Select-Object Name, Length | Format-Table

    # Check if any .tgz files were created
    Write-Host "INFO: Check if any .tgz files were created"
    $tgzFiles = Get-ChildItem -Path "." -Filter "*.tgz"
    if (-not $tgzFiles -or $tgzFiles.Count -eq 0) {
        Write-Error "ERROR: npm pack did not create any .tgz files. Output: $npmPackOutput"
        exit 1
    }
    else {
        Write-Host "INFO: Found .tgz files: $($tgzFiles.Name -join ', ')"
    }

    # Verify the local npm directory still exists (could have been deleted since we checked earlier)
    if (-not (Test-Path $LocalNpmDir -PathType Container)) {
        Write-Host "Local npm directory disappeared, recreating at $LocalNpmDir..."
        New-Item -Path $LocalNpmDir -ItemType Directory -Force | Out-Null
    }

    # Move the tarball to the local npm directory
    Write-Host "INFO: Moving tarball to $LocalNpmDir..."
    try {
        Move-Item -Path "*.tgz" -Destination $LocalNpmDir -Force
        Write-Host "MOVED??????????????"
    }
    catch {
        Write-Error "ERROR: Failed to move tarball to $LocalNpmDir."
        Write-Error "Details: $($_.Exception.Message)"
        exit 1
    }

    # Get the tarball filename for the instructions
    $packageNameClean = $PackageName -replace '@', '' -replace '/', '-'
    Write-Host "DEBUG: Cleaned package name: $packageNameClean"
    Write-Host "LocalNpmDir: $LocalNpmDir"
    Write-Host "packageNameClean-: $packageNameClean"
    $tarballPath = Get-ChildItem -Path $LocalNpmDir -Filter "$packageNameClean-*.tgz" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 1 -ExpandProperty FullName

    if (-not $tarballPath) {
        Write-Error "ERROR: Could not find the moved tarball in $LocalNpmDir"
        exit 1
    }

    Write-Host "INFO: Successfully packed $PackageName to $tarballPath"
    Write-Host ""
    Write-Host "To install this package in a project, run:"
    Write-Host "npm install $tarballPath"
    Write-Host ""
}
catch {
    Write-Error "ERROR: An error occurred during the local publish process. 000"
    Write-Error "Stack Trace: $($_.ScriptStackTrace)"
    Write-Error "Details: $($_.Exception)"
    Write-Error "Details: $($_.Exception.Message)"
    Write-Error "ERROR: An error occurred during the local publish process?????????????????."
    exit 1
}
finally {
    # Always return to the original directory, even if there was an error
    Write-Host "Finally 0 Current directory: $(Get-Location)"
    Write-Host "INFO: Returning to original directory."
    Set-Location $originalLocation
    Write-Host "Finally 1 Current directory: $(Get-Location)"
    Write-Host "Finally - DEBUG: LASTEXITCODE at end of try block: $LASTEXITCODE"
}

Write-Host "INFO: Local publish script finished. : $LASTEXITCODE"
exit 0
