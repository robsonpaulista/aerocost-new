# Script para limpar todas as configurações antigas do Vercel
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Limpando configurações antigas do Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Remover arquivos de configuração antigos
$arquivosParaRemover = @(
    "vercel.json",
    "vercel-backend.json",
    "frontend/vercel.json"
)

Write-Host "`nRemovendo arquivos de configuração antigos..." -ForegroundColor Yellow
foreach ($arquivo in $arquivosParaRemover) {
    if (Test-Path $arquivo) {
        Remove-Item $arquivo -Force
        Write-Host "  ✓ Removido: $arquivo" -ForegroundColor Green
    } else {
        Write-Host "  ℹ Não encontrado: $arquivo" -ForegroundColor Gray
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Limpeza concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nAgora você pode:" -ForegroundColor Cyan
Write-Host "1. Fazer commit: git add . && git commit -m 'chore: remover configurações antigas do Vercel'" -ForegroundColor White
Write-Host "2. Push: git push origin main" -ForegroundColor White
Write-Host "3. No Vercel Dashboard, configure apenas:" -ForegroundColor White
Write-Host "   - Root Directory: frontend" -ForegroundColor Yellow
Write-Host "   - Framework Preset: Next.js" -ForegroundColor Yellow
Write-Host "   - Clique em 'Use Project Settings' quando aparecer o aviso" -ForegroundColor Yellow

