@echo off
set PROJECT_NAME=sb-dev-console
set DIST_PATH=dist\libs\utils\dev-console
set ROOT_PATH=..\..\..\..

echo ==================================================
echo  Publishing %PROJECT_NAME% to NPM
echo ==================================================
echo.

REM Build the dev-console library
echo Building %PROJECT_NAME% library for production...
call npx nx run %PROJECT_NAME%:build --configuration=production
if errorlevel 1 (
    echo Build failed for %PROJECT_NAME%. Exiting.
    pause
    exit /b %errorlevel%
)
echo Build successful.
echo.

REM Navigate to the distribution directory
echo Navigating to distribution directory: %DIST_PATH%
cd %DIST_PATH%
if errorlevel 1 (
    echo Failed to change directory to %DIST_PATH%. Exiting.
    pause
    exit /b %errorlevel%
)
echo Current directory: %cd%
echo.

REM Perform a dry run first
echo Performing NPM publish dry run...
call npm publish --dry-run
if errorlevel 1 (
    echo npm publish dry run failed for %PROJECT_NAME%. Check output above.
    cd %ROOT_PATH%
    pause
    exit /b %errorlevel%
)
echo.
echo Dry run complete. Review the files listed above.
echo If everything looks correct, press Enter to publish for real.
echo Press Ctrl+C to cancel.
pause
echo.

REM Publish to NPM
echo Publishing %PROJECT_NAME% to NPM...
call npm publish --access public
if errorlevel 1 (
    echo !!! NPM publish failed for %PROJECT_NAME% !!! Check output above.
    cd %ROOT_PATH%
    pause
    exit /b %errorlevel%
)
echo.
echo Successfully published %PROJECT_NAME% to NPM.
echo.

REM Navigate back to the root directory
echo Returning to root directory...
cd %ROOT_PATH%

echo.
echo Publish script finished.
pause