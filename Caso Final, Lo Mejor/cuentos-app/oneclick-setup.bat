@echo off
echo [SETUP] Ejecutando instalacion completa...
echo Comandos que ejecuta: npm install, npm install --prefix backend, prisma generate/migrate, seed admin
powershell -ExecutionPolicy Bypass -File "%~dp0oneclick-setup.ps1"
