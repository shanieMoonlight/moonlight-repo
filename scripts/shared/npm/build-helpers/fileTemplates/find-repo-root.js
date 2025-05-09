module.exports = function findRepoRootPs1Generator() {
    const name = 'find-repo-root.ps1';
    const content = `
# --- Repository Root Finder ---
# This script provides a function to reliably find the repository root from any location

function Find-RepositoryRoot {
    param (
        [Parameter(Mandatory=$false)]
        [string]$StartPath = $PSScriptRoot
    )

    $currentDir = $StartPath
    $foundRoot = $false

    # Walk up the directory tree looking for tsconfig.base.json
    while ($currentDir -and -not $foundRoot) {
        if (Test-Path (Join-Path $currentDir "tsconfig.base.json") -PathType Leaf) {
            $foundRoot = $true
        }
        else {
            $parentDir = Split-Path -Parent $currentDir
            if ($parentDir -eq $currentDir) {
                # We've reached the drive root without finding the file
                break
            }
            $currentDir = $parentDir
        }
    }

    if (-not $foundRoot) {
        Write-Error "Could not find repository root. No tsconfig.base.json file found in parent directories."
        return $null
    }
    
    return $currentDir
}

# Only export if we're in a module context
if ($MyInvocation.Line -match '\\.psm1') {
    # This will only run if the script is being imported as a module
    Export-ModuleMember -Function Find-RepositoryRoot
} else {
    # For script usage, we don't need to do anything special
    # The function is already available when the script is dot-sourced
    Write-Verbose "Script dot-sourced, Find-RepositoryRoot function available."
}
`

return { name, content };
}