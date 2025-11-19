# Script para verificar e corrigir node_modules no Git
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO E CORRIGINDO node_modules" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Verificar o que está sendo rastreado
Write-Host "`n[1/7] Verificando arquivos rastreados pelo Git..." -ForegroundColor Yellow
$trackedFiles = git ls-files | Select-String "node_modules"
if ($trackedFiles) {
    Write-Host "   ⚠ PROBLEMA ENCONTRADO: node_modules está sendo rastreado!" -ForegroundColor Red
    Write-Host "   Arquivos encontrados:" -ForegroundColor Red
    $trackedFiles | Select-Object -First 10 | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    if ($trackedFiles.Count -gt 10) {
        Write-Host "     ... e mais $($trackedFiles.Count - 10) arquivos" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✓ node_modules não está sendo rastreado" -ForegroundColor Green
}

# 2. Verificar staging area
Write-Host "`n[2/7] Verificando staging area..." -ForegroundColor Yellow
$stagedFiles = git diff --cached --name-only | Select-String "node_modules"
if ($stagedFiles) {
    Write-Host "   ⚠ PROBLEMA: node_modules está no staging area!" -ForegroundColor Red
} else {
    Write-Host "   ✓ Staging area limpa" -ForegroundColor Green
}

# 3. Remover completamente do Git
Write-Host "`n[3/7] Removendo node_modules do Git..." -ForegroundColor Yellow
git rm -rf --cached frontend/node_modules 2>$null | Out-Null
git rm -rf --cached node_modules 2>$null | Out-Null
Write-Host "   ✓ Removido do índice" -ForegroundColor Green

# 4. Garantir .gitignore
Write-Host "`n[4/7] Garantindo .gitignore..." -ForegroundColor Yellow
$frontendGitignore = @"
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
Set-Content -Path "frontend/.gitignore" -Value $frontendGitignore -Encoding UTF8

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
Write-Host "   ✓ .gitignore atualizado" -ForegroundColor Green

# 5. Verificar se ainda está sendo rastreado após remoção
Write-Host "`n[5/7] Verificando novamente após remoção..." -ForegroundColor Yellow
$stillTracked = git ls-files | Select-String "node_modules"
if ($stillTracked) {
    Write-Host "   ⚠ AINDA está sendo rastreado! Tentando remover do histórico..." -ForegroundColor Red
    
    # Tentar remover do histórico atual
    Write-Host "   Removendo de commits recentes..." -ForegroundColor Yellow
    git filter-branch --force --index-filter "git rm -rf --cached --ignore-unmatch frontend/node_modules node_modules" --prune-empty HEAD 2>$null | Out-Null
    
    # Limpar referências
    git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>$null | Out-Null
    git reflog expire --expire=now --all 2>$null | Out-Null
    git gc --prune=now --aggressive 2>$null | Out-Null
} else {
    Write-Host "   ✓ Não está mais sendo rastreado" -ForegroundColor Green
}

# 6. Verificar tamanho do repositório
Write-Host "`n[6/7] Verificando tamanho do repositório..." -ForegroundColor Yellow
$repoSize = (git count-objects -vH).Split("`n") | Where-Object { $_ -match "size-pack" }
Write-Host "   $repoSize" -ForegroundColor Gray

# 7. Preparar commit
Write-Host "`n[7/7] Preparando commit..." -ForegroundColor Yellow
git add .gitignore frontend/.gitignore 2>$null | Out-Null

# Verificar o que será commitado
$toCommit = git diff --cached --name-only
if ($toCommit) {
    Write-Host "   Arquivos para commit:" -ForegroundColor Cyan
    $toCommit | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
} else {
    Write-Host "   ℹ Nenhuma mudança para commitar" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "VERIFICAÇÃO FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verificação final
$finalCheck = git ls-files | Select-String "node_modules"
if ($finalCheck) {
    Write-Host "`n❌ PROBLEMA: node_modules AINDA está sendo rastreado!" -ForegroundColor Red
    Write-Host "   Você precisa criar um repositório completamente novo:" -ForegroundColor Yellow
    Write-Host "   Execute: criar-repositorio-limpo.ps1" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ SUCESSO: node_modules não está mais sendo rastreado!" -ForegroundColor Green
    Write-Host "`nPróximos passos:" -ForegroundColor Yellow
    Write-Host "1. git commit -m 'chore: remover node_modules do Git'" -ForegroundColor Cyan
    Write-Host "2. git push origin main --force" -ForegroundColor Cyan
}

Write-Host "`nStatus atual:" -ForegroundColor Cyan
git status --short

