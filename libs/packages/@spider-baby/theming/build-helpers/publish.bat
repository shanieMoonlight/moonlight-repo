@echo off


REM Build all libraries (in dependency order)
@REM call npx nx run sb-material-theming:build --configuration=production

REM ---- Publish utils-download ----
set PKG_NAME=@spider-baby\utils-download
set PKG_PATH=dist\libs\utils\download
for /f %%V in ('node -p "require('./dist/libs/utils/download/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

pause

REM ---- Publish utils-memoization ----
set PKG_NAME=@spider-baby\utils-memoization
set PKG_PATH=dist\libs\utils\memoization
for /f %%V in ('node -p "require('./dist/libs/utils/memoization/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

REM ---- Publish utils-oinw ----
set PKG_NAME=@spider-baby\utils-oinw
set PKG_PATH=dist\libs\utils\oinw
for /f %%V in ('node -p "require('./dist/libs/utils/oinw/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

REM ---- Publish utils-rxjs ----
set PKG_NAME=@spider-baby\utils-rxjs
set PKG_PATH=dist\libs\utils\rxjs
for /f %%V in ('node -p "require('./dist/libs/utils/rxjs/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

REM ---- Publish utils-share ----
set PKG_NAME=@spider-baby\utils-share
set PKG_PATH=dist\libs\utils\share
for /f %%V in ('node -p "require('./dist/libs/utils/share/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

REM ---- Publish utils-testing ----
set PKG_NAME=@spider-baby\utils-testing
set PKG_PATH=dist\libs\utils\testing
for /f %%V in ('node -p "require('./dist/libs/utils/testing/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

REM ---- Publish ssr-storage ----
set PKG_NAME=@spider-baby\ssr-storage
set PKG_PATH=dist\libs\packages\@spider-baby\ssr\storage
for /f %%V in ('node -p "require('./dist/libs/packages/@spider-baby/ssr/storage/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

REM ---- Publish main theming package ----
set PKG_NAME=@spider-baby\material-theming
set PKG_PATH=dist\libs\packages\@spider-baby\theming
for /f %%V in ('node -p "require('./dist/libs/packages/@spider-baby/theming/package.json').version"') do (
  npm view %PKG_NAME%@%%V version >nul 2>&1
  if errorlevel 1 (
    cd %PKG_PATH%
    npm publish --access public
    cd ..\..\..\..\..\..
  ) else (
    echo %PKG_NAME%@%%V already published, skipping.
  )
)

echo All packages published!
pause