@echo off
setlocal
set "ROOT=%~dp0.."
cd /d "%ROOT%"

echo ========================================
echo   Cuentos Magicos - Modo desarrollo
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Cerrando las ventanas se detienen los servidores.
echo ========================================
echo.

start "Backend" cmd /k "cd /d "%ROOT%\backend" && npm run dev"
timeout /t 3 /nobreak >nul

start "Frontend" cmd /k "cd /d "%ROOT%\frontend" && npm run dev"

echo Servidores iniciados en ventanas separadas.
