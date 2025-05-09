const fs = require('fs');
const path = require('path');

// ---- CONFIGURABLE VARIABLES ----
const packageName = "@spider-baby/ssr-storage";
const packageDistPath = "./dist/libs/packages/@spider-baby/ssr/storage";
const nxBuildTarget = "spider-baby-ssr-local-storage:build:production";
const libraryRoot = "libs/packages/@spider-baby/ssr/storage";
const localNpmDir = "C:/Users/Shaneyboy/my-npm";
const sharedScriptsRelativePath ='scripts/shared/npm'
const repoRoot = 'C:/Users/Shaneyboy/VsCode/moonlight-repo'

const packageShortName = packageName.split('/').pop();
const packageShortNameUnderscore = packageShortName.replace(/-/g, '_');

// ---- FILE CONTENTS ----
const files = [
  {
    name: `local_publish_${packageShortNameUnderscore}.ps1`,
    content: `# --- Configuration for ${packageName} package local publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistPath = "${packageDistPath}"
$nxBuildTarget = "${nxBuildTarget}"
$localNpmDir = "${localNpmDir}"

# Initial repository root using path replacement (fallback method)
$repositoryRoot = $PSScriptRoot -replace '/${libraryRoot}/build-helpers$', ''
$sharedScriptsPath = Join-Path $repositoryRoot '${sharedScriptsRelativePath}'
Write-Host "Initial repository root: $repositoryRoot"

# Try to import more robust finder script if available
$findRepoScript = Join-Path $sharedScriptsPath "find-repository-root.ps1"
if (Test-Path $findRepoScript -PathType Leaf) {
    . $findRepoScript
    $robustRoot = Find-RepositoryRoot -StartPath $PSScriptRoot
    if ($robustRoot) {
        $repositoryRoot = $robustRoot
        $sharedScriptsPath = Join-Path $repositoryRoot '${sharedScriptsRelativePath}'
        Write-Host "Using robust repository root: $repositoryRoot"
    }
}
Write-Host "Final shared scripts path: $sharedScriptsPath"

$publisherScriptPath = Join-Path $sharedScriptsPath "local-npm-publish-package.ps1"
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic local publisher script at '$publisherScriptPath'"
    exit 1
}
Write-Host "INFO: Using generic local publisher script at '$publisherScriptPath'"
& "$publisherScriptPath" \`
    -PackageName $packageName \`
    -PackageDistPath $packageDistPath \`
    -NxBuildTarget $nxBuildTarget \`
    -LocalNpmDir $localNpmDir

exit $LASTEXITCODE
`
  },
  {
    name: `local_publish_${packageShortNameUnderscore}.bat`,
    content: `@echo off
echo =========================================
echo  Launching PowerShell Publisher Script
echo =========================================
echo.

REM Pass any arguments to the PowerShell script
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0local_publish_${packageShortNameUnderscore}.ps1" %*

REM Check for errors
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Execution failed with error code: %ERRORLEVEL%
    echo.
    pause
    exit /b %ERRORLEVEL%
) else (
    echo.
    echo Script completed successfully.
    echo.
    pause
)
`
  },
  {
    name: `local_publish_${packageShortNameUnderscore}_command.txt`,
    content: `powershell -ExecutionPolicy Bypass -File build-helpers/local_publish_${packageShortNameUnderscore}.ps1`
  },
  {
    name: `npm_publish_${packageShortNameUnderscore}.ps1`,
    content: `# --- Configuration for ${packageName} package NPM publishing ---
$ErrorActionPreference = "Stop"

# Package details and paths
$packageName = "${packageName}"
$packageDistPath = "${packageDistPath}"
$nxBuildTarget = "${nxBuildTarget}"

# Initial repository root using path replacement (fallback method)
$repositoryRoot = $PSScriptRoot -replace '/${libraryRoot}/build-helpers$', ''
$sharedScriptsPath = Join-Path $repositoryRoot '${sharedScriptsRelativePath}'
Write-Host "Initial repository root: $repositoryRoot"

# Try to import more robust finder script if available
$findRepoScript = Join-Path $sharedScriptsPath "find-repository-root.ps1"
if (Test-Path $findRepoScript -PathType Leaf) {
    . $findRepoScript
    $robustRoot = Find-RepositoryRoot -StartPath $PSScriptRoot
    if ($robustRoot) {
        $repositoryRoot = $robustRoot
        $sharedScriptsPath = Join-Path $repositoryRoot '${sharedScriptsRelativePath}'
        Write-Host "Using robust repository root: $repositoryRoot"
    }
}
Write-Host "Final shared scripts path: $sharedScriptsPath"

$publisherScriptPath = Join-Path $sharedScriptsPath "npm-publish-package.ps1"
if (-not (Test-Path $publisherScriptPath -PathType Leaf)) {
    Write-Error "ERROR: Cannot find generic NPM publisher script at '$publisherScriptPath'"
    exit 1
}
Write-Host "INFO: Using generic NPM publisher script at '$publisherScriptPath'"
& "$publisherScriptPath" \\
    -PackageName $packageName \\
    -PackageDistPath $packageDistPath \\
    -NxBuildTarget $nxBuildTarget

exit $LASTEXITCODE
`
  },
  {
    name: `npm_publish_${packageShortNameUnderscore}.bat`,
    content: `@echo off
echo =========================================
echo  Launching PowerShell Publisher Script
echo =========================================
echo.

REM Pass any arguments to the PowerShell script
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0npm_publish_${packageShortNameUnderscore}.ps1" %*

REM Check for errors
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Execution failed with error code: %ERRORLEVEL%
    echo.
    pause
    exit /b %ERRORLEVEL%
) else (
    echo.
    echo Script completed successfully.
    echo.
    pause
)
`
  },
  {
    name: `npm_publish_${packageShortNameUnderscore}_command.txt`,
    content: `powershell -ExecutionPolicy Bypass -File build-helpers/npm_publish_${packageShortNameUnderscore}.ps1`
  },
  {
    name: "local_install_command_local.txt",
    content: `npm install --registry file:///${localNpmDir.replace(/\\/g, "/")}/${packageName}`
  },
  {
    name: "README.md",
    content: `# Build & Publish Helpers for ${packageName}

This folder contains scripts to build, locally publish, and publish to NPM.

## Scripts

- **local_publish_${packageShortNameUnderscore}.ps1**: Build and publish to local npm dir (${localNpmDir})
- **npm_publish_${packageShortNameUnderscore}.ps1**: Build and publish to NPM registry

## Usage

\`\`\`sh
# Local publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/local_publish_${packageShortNameUnderscore}.ps1

# NPM publish (PowerShell)
powershell -ExecutionPolicy Bypass -File build-helpers/npm_publish_${packageShortNameUnderscore}.ps1
\`\`\`

## Local Install

\`\`\`sh
npm install --registry file:///${localNpmDir.replace(/\\/g, "/")}/${packageName}
\`\`\`
`
  }
];


//####################################################//

// ---- CREATE FOLDER AND FILES ----
const buildHelpersDir = path.join(repoRoot, libraryRoot, 'build-helpers');
console.log(`Creating build helpers directory: ${buildHelpersDir}`);
if (!fs.existsSync(buildHelpersDir)) {
  fs.mkdirSync(buildHelpersDir, { recursive: true });
}

files.forEach(file => {
  if (!file || !file.name || !file.content)
    throw new Error(`Invalid file data: ${JSON.stringify(file)}`);

  const filePath = path.join(buildHelpersDir, file.name);
  fs.writeFileSync(filePath, file.content, 'utf8');

  console.log(`Created: ${filePath}`);

});

//####################################################//