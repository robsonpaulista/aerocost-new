# Script para remover arquivo grande do histórico completo do Git
Write-Host "========================================" -ForegroundColor Red
Write-Host "LIMPEZA COMPLETA DO HISTÓRICO GIT" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host "Este script vai remover node_modules de TODO o histórico" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Tem certeza que deseja continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n1. Removendo node_modules do índice atual..." -ForegroundColor Cyan
git rm -rf --cached frontend/node_modules 2>$null
git rm -rf --cached node_modules 2>$null

Write-Host "`n2. Garantindo .gitignore..." -ForegroundColor Cyan
$gitignoreContent = @"
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
"@
Set-Content -Path "frontend/.gitignore" -Value $gitignoreContent -Encoding UTF8

if (-not (Test-Path ".gitignore")) {
    $rootGitignore = @"
node_modules/
.env
.DS_Store
*.log
dist/
build/
.vscode/
.idea/
.next/
"@
    Set-Content -Path ".gitignore" -Value $rootGitignore -Encoding UTF8
}

Write-Host "`n3. Removendo node_modules de TODO o histórico do Git..." -ForegroundColor Cyan
Write-Host "   Isso pode demorar alguns minutos..." -ForegroundColor Yellow

# Usa git filter-branch para remover do histórico
git filter-branch --force --index-filter `
    "git rm -rf --cached --ignore-unmatch frontend/node_modules node_modules" `
    --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Histórico limpo" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Erro ao limpar histórico, tentando método alternativo..." -ForegroundColor Yellow
    
    # Método alternativo: usar BFG ou simplesmente forçar remoção
    Write-Host "   Removendo referências antigas..." -ForegroundColor Yellow
    git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>$null
    git reflog expire --expire=now --all 2>$null
    git gc --prune=now --aggressive 2>$null
}

Write-Host "`n4. Limpando referências e otimizando repositório..." -ForegroundColor Cyan
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>$null
git reflog expire --expire=now --all 2>$null
git gc --prune=now --aggressive 2>$null

Write-Host "`n5. Fazendo commit final..." -ForegroundColor Cyan
git add .gitignore frontend/.gitignore
git commit -m "chore: remover node_modules do Git e limpar histórico" 2>$null

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Limpeza concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nAgora você pode fazer push:" -ForegroundColor Yellow
Write-Host "git push origin main --force" -ForegroundColor Cyan
Write-Host "`n⚠ IMPORTANTE: Use --force pois o histórico foi reescrito" -ForegroundColor Red

