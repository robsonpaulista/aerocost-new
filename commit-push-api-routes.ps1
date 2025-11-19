# Script para fazer commit e push da migração para API Routes
Write-Host "Adicionando arquivos ao Git..." -ForegroundColor Cyan
git add .

Write-Host "Verificando status..." -ForegroundColor Cyan
git status

Write-Host "Fazendo commit..." -ForegroundColor Cyan
git commit -m "feat: migrar backend para Next.js API Routes - Remove dependência do Express separado e implementa API Routes diretamente no Next.js"

Write-Host "Fazendo push..." -ForegroundColor Cyan
git push origin main

Write-Host "Concluído!" -ForegroundColor Green

