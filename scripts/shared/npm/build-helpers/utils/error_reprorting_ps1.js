module.exports = function errorReporting_Ps1_Generator() {
    const name = 'error-reporting.ps1';
    const content = `
# --- Repository Root Finder ---
# This script contains functions to help with error reporting

function Resolve-Error ($ErrorRecord=$Error[0])
{
    Write-Host "============Resolving-Error===================="
    $ErrorRecord | Format-List * -Force
    if ($ErrorRecord.InvocationInfo) {
        Write-Host "Script: $($ErrorRecord.InvocationInfo.ScriptName)"
        Write-Host "Line:   $($ErrorRecord.InvocationInfo.ScriptLineNumber)"
        Write-Host "Code:   $($ErrorRecord.InvocationInfo.Line)"
    }
    $Exception = $ErrorRecord.Exception
    for ($i = 0; $Exception; $i++, ($Exception = $Exception.InnerException))
    {   "$i" * 80
        $Exception |Format-List * -Force
    }
}
`

    return { name, content }

}