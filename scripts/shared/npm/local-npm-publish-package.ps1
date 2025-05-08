# --- Generic Local NPM Package Publisher Script ---

param (
    [Parameter(Mandatory = $true, HelpMessage = "Name of the NPM package (e.g. '@spider-baby/mini-state')")]
    [string]$PackageName,

    [Parameter(Mandatory = $false, HelpMessage = "Path to the package dist folder (relative to repo root)")]
    [string]$PackageDistPath,

    [Parameter(Mandatory = $true, HelpMessage = "Nx build target for the package (e.g. 'sb-mini-state:build:production')")]
    [string]$NxBuildTarget,

    [Parameter(Mandatory = $false, HelpMessage = "Local npm directory to store the package tarball")]
    [string]$LocalNpmDir = "C:\Users\Shaneyboy\my-npm"
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================="
Write-Host " Locally Publishing $PackageName (PowerShell)"
Write-Host "=================================================="
Write-Host "Package Dist Path: $PackageDistPath"
Write-Host "Nx Build Target: $NxBuildTarget"
Write-Host "Local NPM Directory: $LocalNpmDir"
Write-Host "=================================================="
Write-Host ""

# # Ensure the local npm directory exists
# if (-not (Test-Path $LocalNpmDir -PathType Container)) {
#     Write-Host "Creating local npm directory at $LocalNpmDir..."
#     New-Item -Path $LocalNpmDir -ItemType Directory -Force | Out-Null
# }

# $originalLocation = Get-Location

# # --- Build Step ---
# Write-Host "INFO: Building $PackageName library for production..."
# try {
#     npx nx run $NxBuildTarget
#     if ($LASTEXITCODE -ne 0) {
#         Write-Error "ERROR: Build failed for $PackageName. Exiting."
#         exit 1
#     }
#     Write-Host "INFO: Build successful."
#     Write-Host ""
# } catch {
#     Write-Error "ERROR: Build command failed unexpectedly."
#     Write-Error $_.Exception.Message
#     exit 1
# }

# # --- Packaging and Moving ---
# try {
#     if (-not (Test-Path $PackageDistPath -PathType Container)) {
#         Write-Error "ERROR: Distribution directory '$PackageDistPath' does not exist or is not accessible."
#         exit 1
#     }

#     Write-Host "INFO: Navigating to $PackageDistPath"
#     Set-Location $PackageDistPath

#     Write-Host "INFO: Packing $PackageName..."
#     $npmPackOutput = & npm pack --verbose
#     Write-Host "DEBUG: npm pack output: $npmPackOutput"

#     if ($LASTEXITCODE -ne 0) {
#         Write-Error "ERROR: npm pack failed with exit code $LASTEXITCODE"
#         Write-Error "npm pack output: $npmPackOutput"
#         exit 1
#     }

#     $tgzFiles = Get-ChildItem -Path "." -Filter "*.tgz"
#     if (-not $tgzFiles -or $tgzFiles.Count -eq 0) {
#         Write-Error "ERROR: npm pack did not create any .tgz files."
#         exit 1
#     }
#     Write-Host "INFO: Found .tgz files: $($tgzFiles.Name -join ', ')"

#     if (-not (Test-Path $LocalNpmDir -PathType Container)) {
#         Write-Host "Local npm directory disappeared, recreating at $LocalNpmDir..."
#         New-Item -Path $LocalNpmDir -ItemType Directory -Force | Out-Null
#     }

#     Write-Host "INFO: Moving tarball to $LocalNpmDir..."
#     try {
#         Move-Item -Path "*.tgz" -Destination $LocalNpmDir -Force
#     } catch {
#         Write-Error "ERROR: Failed to move tarball to $LocalNpmDir."
#         Write-Error "Details: $($_.Exception.Message)"
#         exit 1
#     }

#     $packageNameClean = $PackageName -replace '@', '' -replace '/', '-'
#     $tarballPath = Get-ChildItem -Path $LocalNpmDir -Filter "$packageNameClean-*.tgz" |
#         Sort-Object LastWriteTime -Descending |
#         Select-Object -First 1 -ExpandProperty FullName

#     if (-not $tarballPath) {
#         Write-Error "ERROR: Could not find the moved tarball in $LocalNpmDir"
#         exit 1
#     }

#     Write-Host "INFO: Successfully packed $PackageName to $tarballPath"
#     Write-Host ""
#     Write-Host "To install this package in a project, run:"
#     Write-Host "npm install $tarballPath"
#     Write-Host ""
# } catch {
#     Write-Error "ERROR: An error occurred during the local publish process."
#     Write-Error "Details: $($_.Exception.Message)"
#     exit 1
# } finally {
#     Set-Location $originalLocation
# }

Write-Host "INFO: Local publish script finished."
exit 0