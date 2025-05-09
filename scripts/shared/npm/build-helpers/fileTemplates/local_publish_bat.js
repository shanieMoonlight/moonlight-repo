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
