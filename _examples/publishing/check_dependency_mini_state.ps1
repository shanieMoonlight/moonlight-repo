param(
    [Parameter(Mandatory=$true)]
    [string]$DistPackageJsonPath,

    [Parameter(Mandatory=$true)]
    [string]$DependencyName
)

Write-Host "DEBUG [check_dependency.ps1]: Script started." # Added Debug Line

Write-Host "INFO [check_dependency.ps1]: Received PackageJsonPath: $DistPackageJsonPath"
Write-Host "INFO [check_dependency.ps1]: Received DependencyName: $DependencyName"

# --- Use path directly relative to CWD ---
# Assuming the script is called from the repository root
$packageJsonFullPath = $DistPackageJsonPath
Write-Host "DEBUG [check_dependency.ps1]: Using PackageJsonPath directly: $packageJsonFullPath" # Added Debug Line

# --- Test Path ---
Write-Host "DEBUG [check_dependency.ps1]: Testing path existence..." # Added Debug Line
if (-not (Test-Path $packageJsonFullPath -PathType Leaf)) {
    Write-Error "ERROR [check_dependency.ps1]: Cannot find package.json at '$packageJsonFullPath'. Build might be needed."
    exit 1
}
Write-Host "DEBUG [check_dependency.ps1]: Path exists." # Added Debug Line

# --- Read Content ---
Write-Host "INFO [check_dependency.ps1]: Reading package.json from '$packageJsonFullPath'"
try {
    $packageJsonContent = Get-Content $packageJsonFullPath -Raw | ConvertFrom-Json
} catch {
    Write-Error "ERROR [check_dependency.ps1]: Failed to read or parse JSON from '$packageJsonFullPath'."
    Write-Error $_.Exception.Message
    exit 1
}
Write-Host "DEBUG [check_dependency.ps1]: JSON parsed." # Added Debug Line

# --- Check Dependency ---
$dependencyVersionRange = $packageJsonContent.dependencies.$DependencyName

if (-not $dependencyVersionRange) {
    Write-Host "WARN [check_dependency.ps1]: Dependency '$DependencyName' not found in dependencies section of '$packageJsonFullPath'. Assuming OK."
    exit 0 # Exit successfully if dependency isn't listed
}

Write-Host "DEBUG [check_dependency.ps1]: Extracted dependency version range: '$dependencyVersionRange'"
$npmPackageSpec = "$DependencyName@$dependencyVersionRange"
Write-Host "INFO [check_dependency.ps1]: Checking if any version matching '$npmPackageSpec' exists..."

# Execute npm view and capture output/errors
try {
    # Use Invoke-Expression or call npm directly. Redirect stderr to prevent script termination on npm error.
    # Check $LASTEXITCODE afterwards.
    Write-Host "DEBUG [check_dependency.ps1]: Executing npm view..." # Added Debug Line
    npm view $npmPackageSpec version --json > $null 2>&1 # Suppress stdout, capture stderr implicitly via $LASTEXITCODE
    $exitCode = $LASTEXITCODE
    Write-Host "DEBUG [check_dependency.ps1]: npm view finished with exit code: $exitCode" # Added Debug Line

    if ($exitCode -ne 0) {
        Write-Error "ERROR [check_dependency.ps1]: Required dependency version '$npmPackageSpec' not found on NPM!"
        exit 1 # Exit with errorlevel 1 if not found
    } else {
        Write-Host "INFO [check_dependency.ps1]: Found suitable version for '$npmPackageSpec' on NPM."
        exit 0 # Exit successfully
    }
} catch {
    # Catch unexpected script errors
    Write-Error "ERROR [check_dependency.ps1]: An unexpected error occurred during npm view execution."
    Write-Error $_.Exception.Message
    exit 1
}

Write-Host "DEBUG [check_dependency.ps1]: Script end reached (should not happen if exit occurred)." # Added Debug Line