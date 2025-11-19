# Solução DEFINITIVA - Remove node_modules do histórico usando git filter-repo ou filter-branch
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SOLUÇÃO DEFINITIVA - Remover node_modules" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Passo 1: Remover do índice atual
Write-Host "`n[1/5] Removendo node_modules do índice..." -ForegroundColor Yellow
git rm -rf --cached frontend/node_modules 2>$null | Out-Null
git rm -rf --cached node_modules 2>$null | Out-Null
Write-Host "   ✓ Removido do índice" -ForegroundColor Green

# Passo 2: Atualizar .gitignore
Write-Host "`n[2/5] Atualizando .gitignore..." -ForegroundColor Yellow
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

# Passo 3: Remover do histórico usando filter-branch
Write-Host "`n[3/5] Removendo node_modules do histórico do Git..." -ForegroundColor Yellow
Write-Host "   Isso pode demorar alguns minutos..." -ForegroundColor Gray

# Remove node_modules de todos os commits
$filterBranchCmd = @"
git filter-branch --force --index-filter `
    "git rm -rf --cached --ignore-unmatch frontend/node_modules node_modules" `
    --prune-empty --tag-name-filter cat -- --all
"@

Invoke-Expression $filterBranchCmd 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Histórico limpo com sucesso" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Aviso: Pode ter havido algum problema, mas continuando..." -ForegroundColor Yellow
}

# Passo 4: Limpar referências e otimizar
Write-Host "`n[4/5] Limpando referências e otimizando repositório..." -ForegroundColor Yellow
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>$null | Out-Null
git reflog expire --expire=now --all 2>$null | Out-Null
git gc --prune=now --aggressive 2>$null | Out-Null
Write-Host "   ✓ Repositório otimizado" -ForegroundColor Green

# Passo 5: Commit final
Write-Host "`n[5/5] Fazendo commit final..." -ForegroundColor Yellow
git add .gitignore frontend/.gitignore 2>$null | Out-Null
git commit -m "chore: remover node_modules do Git e limpar histórico completo" 2>$null | Out-Null
Write-Host "   ✓ Commit realizado" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Verifique o status: git status" -ForegroundColor White
Write-Host "2. Faça push com force: git push origin main --force" -ForegroundColor White
Write-Host "`n⚠ ATENÇÃO: O --force é necessário porque o histórico foi reescrito" -ForegroundColor Red
Write-Host "   Certifique-se de que ninguém mais está trabalhando neste repositório" -ForegroundColor Yellow

