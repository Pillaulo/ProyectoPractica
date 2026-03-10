@echo off
setlocal
cd /d "%~dp0..\backend"

echo ========================================
echo   Cuentos Magicos - Tests Backend
echo ========================================
echo.

call npm test
set EXITCODE=%errorlevel%

echo.
if %EXITCODE% equ 0 (
  echo Tests completados correctamente.
) else (
  echo Algunos tests fallaron.
)
exit /b %EXITCODE%
