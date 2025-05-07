@echo off
REM Set your local npm directory
set NPM_DIR=C:\Users\Shaneyboy\my-npm
set PROJECT_NAME=sb-mat-notifications
set PACKAGE_SCOPE=spider-baby
set PACKAGE_NAME=mat-notifications
set DIST_PATH=dist\libs\ui\notifications\mat-notifications
set ROOT_PATH=..\..\..\..\..

REM Ensure the npm directory exists
echo Ensuring local npm directory exists at %NPM_DIR%...
if not exist "%NPM_DIR%" mkdir "%NPM_DIR%"

REM Build the mat-notifications library (Nx should handle building secondaries)
echo Building %PROJECT_NAME% library...
call npx nx run %PROJECT_NAME%:build --configuration=production
if errorlevel 1 (
    echo Build failed for %PROJECT_NAME%. Exiting.
    pause
    exit /b %errorlevel%
)
echo Build successful.

REM Pack the main library and move the tarball
echo Packing %PROJECT_NAME%...
cd %DIST_PATH%
if errorlevel 1 (
    echo Failed to change directory to %DIST_PATH%. Exiting.
    pause
    exit /b %errorlevel%
)

REM Delete any old tarball for this package in the target directory first
echo Deleting old tarballs in %NPM_DIR% for %PACKAGE_SCOPE%-%PACKAGE_NAME%-*.tgz...
del /q "%NPM_DIR%\%PACKAGE_SCOPE%-%PACKAGE_NAME%-*.tgz"

echo Running npm pack...
call npm pack
if errorlevel 1 (
    echo npm pack failed for %PROJECT_NAME%. Exiting.
    cd %ROOT_PATH%
    pause
    exit /b %errorlevel%
)

echo Moving packed file to %NPM_DIR%...
move *.tgz "%NPM_DIR%"
if errorlevel 1 (
    echo Failed to move *.tgz to %NPM_DIR%.
    cd %ROOT_PATH%
    pause
    exit /b %errorlevel%
)

echo Successfully packed %PROJECT_NAME% to %NPM_DIR%
cd %ROOT_PATH%

echo.
echo Script finished.
pause