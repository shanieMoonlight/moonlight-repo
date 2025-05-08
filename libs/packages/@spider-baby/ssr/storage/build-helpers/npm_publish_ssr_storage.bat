@echo off
echo =========================================
echo  Launching PowerShell Publisher Script
echo =========================================
echo.

REM Pass any arguments to the PowerShell script
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0npm_publish_ssr_storage.ps1" %*

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
