# Script para commitar e fazer push das correcoes do build
# Uso: .\commit-correcao-build.ps1

Write-Host "Corrigindo erro de TypeScript no build..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Adicionando arquivos corrigidos..." -ForegroundColor Yellow
git add frontend/app/aircraft/[id]/flights/page.tsx
git add frontend/app/aircraft/[id]/routes/page.tsx
git add frontend/app/aircraft/[id]/variable-costs/page.tsx

Write-Host ""
Write-Host "Criando commit..." -ForegroundColor Yellow
git commit -m "fix: remover prop selectedAircraftId do AppLayout"

Write-Host ""
Write-Host "Fazendo push..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCESSO! Correcoes enviadas." -ForegroundColor Green
    Write-Host ""
    Write-Host "O Vercel vai fazer deploy automatico." -ForegroundColor Cyan
    Write-Host "Aguarde alguns minutos e verifique o deploy." -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "ERRO ao fazer push." -ForegroundColor Red
    Write-Host "Execute manualmente: git push origin main" -ForegroundColor Yellow
}

