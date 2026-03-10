@echo off
setlocal
cd /d "%~dp0.."

echo ========================================
echo   Cuentos Magicos - Setup
echo ========================================
echo.

echo [1/3] Instalando dependencias del backend...
cd backend
call npm install
if errorlevel 1 (
  echo ERROR: Fallo al instalar backend
  exit /b 1
)
cd ..
echo OK Backend
echo.

echo [2/3] Instalando dependencias del frontend...
cd frontend
call npm install
if errorlevel 1 (
  echo ERROR: Fallo al instalar frontend
  exit /b 1
)
cd ..
echo OK Frontend
echo.

echo [3/3] Verificando archivos .env...
if not exist "backend\.env" (
  if exist "backend\.env.example" (
    copy "backend\.env.example" "backend\.env"
    echo Creado backend\.env desde .env.example
  )
)
if not exist "frontend\.env" (
  if exist "frontend\.env.example" (
    copy "frontend\.env.example" "frontend\.env"
    echo Creado frontend\.env desde .env.example
  )
)
echo.

echo ========================================
echo   Setup completado.
echo   Ejecuta: scripts\dev.bat
echo ========================================
