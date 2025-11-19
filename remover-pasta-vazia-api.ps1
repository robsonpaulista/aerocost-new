# Remover pasta vazia [...path] que pode estar causando problemas
Write-Host "Removendo pasta vazia da API..." -ForegroundColor Cyan

if (Test-Path "frontend/app/api/[...path]") {
    Remove-Item -Path "frontend/app/api/[...path]" -Recurse -Force
    Write-Host "✓ Pasta removida" -ForegroundColor Green
} else {
    Write-Host "ℹ Pasta não existe" -ForegroundColor Gray
}

Write-Host "`nEstrutura atual da API:" -ForegroundColor Cyan
Get-ChildItem -Path "frontend/app/api" -Recurse -Directory | ForEach-Object {
    Write-Host "  $($_.FullName.Replace((Get-Location).Path + '\', ''))" -ForegroundColor Gray
}

