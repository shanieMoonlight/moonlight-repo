/**
 * Generates a Windows batch file (.bat) for publishing an npm package.
 * The batch file will execute a PowerShell script and handle error reporting.
 * 
 * @function npmPublish_Bat_Generator
 * @param {Object} options - The options for generating the batch file
 * @param {string} options.packageName - The name of the npm package to publish
 * @param {string} options.ps1Filename - The filename of the PowerShell script to execute
 * @returns {Object} An object containing the generated filename and content
 * @returns {string} returns.name - The name of the generated batch file
 * @returns {string} returns.content - The content of the generated batch file
 */
const utils = require('../utils/build-helper-utils.js');



module.exports = function npmPublish_Bat_Generator({packageName, ps1Filename}) {

  const  packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const name = `npm_publish_${packageShortNameUnderscore}.bat`
  
  const content =  `@echo off
echo =========================================
echo  Launching PowerShell Publisher Script
echo =========================================
echo.

REM Pass any arguments to the PowerShell script
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0${ps1Filename}" %*

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

  return { name, content };
}
