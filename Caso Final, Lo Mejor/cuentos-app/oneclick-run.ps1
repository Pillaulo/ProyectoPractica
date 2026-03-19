Set-Location $PSScriptRoot

if (!(Test-Path ".env")) {
  Write-Host "Falta .env en la raíz."
  exit 1
}

if (!(Test-Path "backend\.env")) {
  Write-Host "Falta backend\.env. Ejecuta primero oneclick-setup.bat"
  exit 1
}

Write-Host "Iniciando servicios (Prisma, Backend, Frontend)..."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; npx prisma dev"
Start-Sleep -Seconds 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; npm run dev"
Start-Sleep -Seconds 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; npm run dev"

Write-Host "Listo. Frontend en http://localhost:3000 y backend en http://localhost:4000"

