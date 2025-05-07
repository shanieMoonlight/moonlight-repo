@echo off
REM Set your local npm directory
set NPM_DIR=C:\Users\Shaneyboy\my-npm

REM Ensure the npm directory exists
if not exist "%NPM_DIR%" mkdir "%NPM_DIR%"

REM Build all libraries (in dependency order)
call npx nx run sb-material-theming:build --configuration=production

REM Pack each library and move the tarball to the npm directory

cd dist\libs\utils\download
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..

cd dist\libs\utils\memoization
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..

cd dist\libs\utils\oinw
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..

cd dist\libs\utils\rxjs
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..

cd dist\libs\utils\share
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..

cd dist\libs\utils\testing
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..

cd dist\libs\packages\@spider-baby\ssr\storage
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..\..\..

cd dist\libs\packages\@spider-baby\theming
call npm pack
move *.tgz "%NPM_DIR%"
cd ..\..\..\..\..\..

echo All packages built and packed to %NPM_DIR%
pause