# --- Generic NPM Package Publisher Script ---
# This script provides a reusable function to build and publish an NPM package with Nx integration
# Usage: .\publish-npm-package.ps1 -PackageName "@your-scope/package-name" -DistPackageJsonPath "path/to/dist/package.json" -PackageDistPath "path/to/dist" -NxBuildTarget "project:build:production"

param (
    [Parameter(Mandatory=$true, HelpMessage="Name of the NPM package (e.g. '@spider-baby/mini-state')")]
    [string]$PackageName,
        
    [Parameter(Mandatory=$true, HelpMessage="Path to the package dist folder (relative to repo root)")]
    [string]$PackageDistPath,
    
    [Parameter(Mandatory=$true, HelpMessage="Nx build target for the package (e.g. 'sb-mini-state:build:production')")]
    [string]$NxBuildTarget,
    
    [Parameter(Mandatory=$false, HelpMessage="Skip confirmation prompts (use for automated publishing)")]
    [switch]$NoConfirm = $false
)

$ErrorActionPreference = "Stop" # Exit script on terminating errors

# Derive $DistPackageJsonPath from $PackageDistPath
$DistPackageJsonPath = Join-Path $PackageDistPath "package.json"

Write-Host "=================================================="
Write-Host " Publishing $PackageName to NPM (PowerShell)!!!"
Write-Host "=================================================="
Write-Host "Package JSON Path: $DistPackageJsonPath"  
Write-Host "Package Dist Path: $PackageDistPath"
Write-Host "Nx Build Target: $NxBuildTarget"
Write-Host "=================================================="
Write-Host ""

# --- Function for Dependency Check ---
# This function verifies that all dependencies listed in the package.json 
# are already published to NPM before attempting to publish this package.
function Confirm-AllDependenciesPublished {
    param(
        [Parameter(Mandatory=$true)]
        [string]$PackageJsonToCheckPath
    )

    Write-Host "INFO [Check-AllDependencies]: Checking all dependencies listed in '$PackageJsonToCheckPath'..."

    if (-not (Test-Path $PackageJsonToCheckPath -PathType Leaf)) {
        Write-Error "ERROR [Check-AllDependencies]: Cannot find package.json at '$PackageJsonToCheckPath'."
        return $false # Indicate failure
    }

    # Parse the package.json file to extract dependencies
    $packageJsonContent = Get-Content $PackageJsonToCheckPath -Raw | ConvertFrom-Json
    $dependencies = $packageJsonContent.dependencies

    if (-not $dependencies) {
        Write-Host "INFO [Check-AllDependencies]: No 'dependencies' section found. Assuming OK."
        return $true # Indicate success (no dependencies to check)
    }

    $allDepsFound = $true # Assume success initially

    # Iterate through all properties (dependencies) in the dependencies object
    foreach ($depName in $dependencies.PSObject.Properties.Name) {
        $dependencyVersionRange = $dependencies.$depName
        
        # --- Added Debug Line ---
        Write-Host "DEBUG [Check-AllDependencies]: Found dependency '$depName' with range '$dependencyVersionRange'. Preparing to check NPM..." 
        
        $npmPackageSpec = "$depName@$dependencyVersionRange"

        try {
            # Check if the dependency exists in NPM registry with the specified version range
            npm view $npmPackageSpec version --json > $null 2>&1
            $exitCode = $LASTEXITCODE
            if ($exitCode -ne 0) {
                Write-Error "ERROR [Check-AllDependencies]: Required dependency version '$npmPackageSpec' not found on NPM!"
                $allDepsFound = $false # Mark as failed
                # Optionally, break here if you want to stop on the first failure
                # break
            } else {
                Write-Host "INFO [Check-AllDependencies]: Found suitable version for '$npmPackageSpec' on NPM."
            }
        } catch {
            Write-Error "ERROR [Check-AllDependencies]: An unexpected error occurred during npm view execution for '$depName'."
            Write-Error $_.Exception.Message
            $allDepsFound = $false # Mark as failed
            # Optionally, break here
            # break
        }
    } # End foreach dependency

    if (-not $allDepsFound) {
         Write-Error "ERROR [Check-AllDependencies]: One or more dependencies were not found on NPM."
    } else {
         Write-Host "INFO [Check-AllDependencies]: All dependencies found successfully."
    }

    return $allDepsFound # Return the overall result
}

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
} catch {
    Write-Error "ERROR: Build command failed unexpectedly."
    Write-Error $_.Exception.Message
    exit 1
}

# --- Check Dependency ---
# Ensure all dependencies are published to NPM before publishing this package
Write-Host "INFO: Checking required dependencies... $DistPackageJsonPath"
if (-not (Confirm-AllDependenciesPublished -PackageJsonToCheckPath $DistPackageJsonPath)) { 
    Write-Error "ERROR: Dependency check failed. Please ensure all dependencies are published first."
    exit 1
}
Write-Host "INFO: All dependencies check successful."
Write-Host ""

# --- Check if Main Package Version Exists ---
# This section prevents re-publishing an existing version to NPM
Write-Host "INFO: Checking NPM registry for existing version of $PackageName..."
if (-not (Test-Path $DistPackageJsonPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find built package.json at '$DistPackageJsonPath'."
    exit 1
}

# Extract version from the built package.json
$packageJsonContent = Get-Content $DistPackageJsonPath -Raw | ConvertFrom-Json
$packageVersion = $packageJsonContent.version
if (-not $packageVersion) {
    Write-Error "ERROR: Could not extract version from '$DistPackageJsonPath'."
    exit 1
}

$npmPackageSpec = "$PackageName@$packageVersion"
Write-Host "INFO: Checking for $npmPackageSpec..."

# Improved error handling for NPM version check
$versionExists = $false
try {
    # Try to view the specific version in NPM registry
    $npmViewOutput = npm view $npmPackageSpec version 2>&1
    $exitCode = $LASTEXITCODE
    
    # If exit code is 0, the version exists
    if ($exitCode -eq 0) {
        Write-Host "INFO: Found version $packageVersion in NPM registry."
        $versionExists = $true
    }
    # If exit code is not 0, the version doesn't exist (expected for new versions)
    else {
        Write-Host "INFO: Version $packageVersion not found in NPM registry (exit code: $exitCode)."
        $versionExists = $false
    }
} 
catch {
    # Handle any unexpected exceptions during npm view command
    Write-Host "INFO: Exception during npm view: $($_.Exception.Message)"
    
    # Check error message to determine if it's because the package doesn't exist
    if ($_.Exception.Message -like "*404*" -or $npmViewOutput -like "*404*") {
        Write-Host "INFO: Package or version does not exist in NPM registry (404 error)."
        $versionExists = $false
    }
    else {
        # For other unexpected errors, log the details but proceed with caution
        Write-Host "WARN: Unexpected error checking NPM registry. Assuming version doesn't exist, but proceed with caution."
        Write-Host "WARN: Error details: $($_.Exception.Message)"
        $versionExists = $false
    }
}

# Publishing workflow based on version check
if ($versionExists) {
    Write-Host "INFO: $npmPackageSpec already published, skipping."
} else {
    Write-Host "INFO: Version $packageVersion not found on NPM. Proceeding with publish..."
    Write-Host ""

    # Store the original directory to return to it after publishing
    $originalLocation = Get-Location
    try {
        Write-Host "INFO: Navigating to $PackageDistPath"
        Set-Location $PackageDistPath

        # Perform a dry run first to validate the package before actual publishing
        Write-Host "INFO: Performing NPM publish dry run..."
        npm publish --dry-run
        if ($LASTEXITCODE -ne 0) {
            Write-Error "ERROR: npm publish dry run failed. Check output above."
            exit 1
        }
        Write-Host ""
        Write-Host "INFO: Dry run complete. Review the files listed above."

        # Confirmation Prompt - gives the user a chance to cancel before actual publishing
        # Skip confirmation if NoConfirm switch is used
        if (-not $NoConfirm) {
            try {
                Read-Host -Prompt "INFO: If everything looks correct, press Enter to publish for real. Press Ctrl+C to cancel."
            } catch [System.Management.Automation.PipelineStoppedException] {
                Write-Host "`nWARN: Publish cancelled by user (Ctrl+C)."
                exit 1 # Exit cleanly if user cancels
            }
        } else {
            Write-Host "INFO: Skipping confirmation (NoConfirm mode enabled)."
        }

        Write-Host ""
        Write-Host "INFO: Publishing $npmPackageSpec to NPM..."
        npm publish --access public
        if ($LASTEXITCODE -ne 0) {
            Write-Error "!!! ERROR: NPM publish failed !!! Check output above."
            exit 1
        }
        Write-Host "INFO: Successfully published $npmPackageSpec."

    } catch {
        Write-Error "ERROR: An error occurred during the publish process."
        Write-Error $_.Exception.Message
        exit 1
    } finally {
        # Always return to the original directory, even if there was an error
        Write-Host "INFO: Returning to original directory."
        Set-Location $originalLocation
    }
}

Write-Host ""
Write-Host "INFO: Publish script finished."
exit 0