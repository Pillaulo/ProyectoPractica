@echo off
echo [RUN] Levantando prisma + backend + frontend...
echo Comandos: npx prisma dev, npm --prefix backend run dev, npm run dev
powershell -ExecutionPolicy Bypass -File "%~dp0oneclick-run.ps1"
