/**
 * Generates a .bat file for local publishing of a package.
 * 
 * @param {Object} options - The options for generating the bat file
 * @param {string} options.packageName - The name of the package to be published
 * @param {string} options.ps1Filename - The filename of the PowerShell script to be executed
 * @returns {Object} An object containing the generated file name and content
 * @returns {string} returns.name - The generated bat file name
 * @returns {string} returns.content - The content of the bat file
 */
const utils = require('../utils/build-helper-utils.js');



module.exports = function localPublish_Bat_Generator({ packageName, ps1Filename }) {

  const packageShortNameUnderscore = utils.toShortUnderscoredPackageName(packageName);
  const name = `local_publish_${packageShortNameUnderscore}.bat`

  const content = `@echo off
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
