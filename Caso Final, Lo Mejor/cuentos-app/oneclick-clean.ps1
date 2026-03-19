Set-Location $PSScriptRoot

Write-Host "Limpiando archivos/pesas de build para Git..."

Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "backend\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "src\generated\prisma" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "out","build","coverage" -ErrorAction SilentlyContinue
Get-ChildItem -Recurse -File -Filter *.log | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "Limpieza terminada."
