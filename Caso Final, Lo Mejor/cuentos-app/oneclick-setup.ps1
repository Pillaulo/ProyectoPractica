Set-Location $PSScriptRoot

Write-Host "== Instalando frontend =="
npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "== Instalando backend =="
npm install --prefix backend
if ($LASTEXITCODE -ne 0) { exit 1 }

if (!(Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Host "Se creó .env desde .env.example"
  } else {
    Write-Host "No existe .env ni .env.example"
    exit 1
  }
}

if (!(Test-Path "backend\.env")) {
  if (Test-Path "backend\.env.example") {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Se creó backend\.env desde backend\.env.example"
  } else {
    Write-Host "No existe backend\.env ni backend\.env.example"
    exit 1
  }
}

Write-Host "== Generando cliente Prisma =="
npx prisma generate
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "== Intentando migraciones =="
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
  Write-Host "Aviso: no se pudo aplicar migrate automáticamente. Revisa que prisma dev esté activo."
}

Write-Host "== Creando/actualizando admin por defecto =="
node scripts/create-admin.js

Write-Host "Setup finalizado."
Write-Host "Revisa backend\.env y define GROQ_API_KEY para generación real con Groq."

