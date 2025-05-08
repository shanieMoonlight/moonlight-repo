module.exports = function localPublishPs1({packageName, packageDistPath, nxBuildTarget, localNpmDir, libraryRoot, sharedScriptsRelativePath}) {
  return  `# --- Configuration for ${packageName} package local publishing ---
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
}
