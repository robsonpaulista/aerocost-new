# Solução DEFINITIVA para remover node_modules do Git
Write-Host "========================================" -ForegroundColor Red
Write-Host "SOLUÇÃO DEFINITIVA - Remover node_modules" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Este script vai:" -ForegroundColor Yellow
Write-Host "1. Criar um novo branch SEM histórico" -ForegroundColor White
Write-Host "2. Adicionar apenas arquivos necessários" -ForegroundColor White
Write-Host "3. Substituir a branch main" -ForegroundColor White
Write-Host ""
Write-Host "⚠ ATENÇÃO: Isso vai APAGAR TODO O HISTÓRICO DO GIT!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Digite 'SIM' para continuar"
if ($confirm -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n[1/7] Verificando arquivos rastreados..." -ForegroundColor Cyan
$tracked = git ls-files | Select-String "node_modules"
if ($tracked) {
    Write-Host "  ⚠ node_modules está sendo rastreado!" -ForegroundColor Red
    Write-Host "  Total de arquivos: $($tracked.Count)" -ForegroundColor Red
} else {
    Write-Host "  ✓ node_modules não está sendo rastreado" -ForegroundColor Green
}

Write-Host "`n[2/7] Removendo node_modules do índice..." -ForegroundColor Cyan
git rm -rf --cached frontend/node_modules 2>$null | Out-Null
git rm -rf --cached node_modules 2>$null | Out-Null
Write-Host "  ✓ Removido do índice" -ForegroundColor Green

Write-Host "`n[3/7] Garantindo .gitignore..." -ForegroundColor Cyan
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
Write-Host "  ✓ .gitignore atualizado" -ForegroundColor Green

Write-Host "`n[4/7] Criando novo branch sem histórico..." -ForegroundColor Cyan
git checkout --orphan main-limpo 2>$null | Out-Null
Write-Host "  ✓ Branch criado" -ForegroundColor Green

Write-Host "`n[5/7] Removendo tudo do staging..." -ForegroundColor Cyan
git reset 2>$null | Out-Null
Write-Host "  ✓ Staging limpo" -ForegroundColor Green

Write-Host "`n[6/7] Adicionando arquivos (exceto node_modules)..." -ForegroundColor Cyan
git add . 2>$null | Out-Null

# Verificar e remover node_modules se foi adicionado
$staged = git diff --cached --name-only | Select-String "node_modules"
if ($staged) {
    Write-Host "  ⚠ Removendo node_modules que foi adicionado..." -ForegroundColor Yellow
    git reset frontend/node_modules 2>$null | Out-Null
    git reset node_modules 2>$null | Out-Null
}

# Verificar novamente
$finalCheck = git diff --cached --name-only | Select-String "node_modules"
if ($finalCheck) {
    Write-Host "  ❌ ERRO: node_modules ainda está sendo adicionado!" -ForegroundColor Red
    Write-Host "  Removendo manualmente..." -ForegroundColor Yellow
    git reset frontend/node_modules 2>$null | Out-Null
    git reset node_modules 2>$null | Out-Null
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
} else {
    Write-Host "  ✓ Arquivos adicionados (sem node_modules)" -ForegroundColor Green
}

Write-Host "`n[7/7] Fazendo commit inicial limpo..." -ForegroundColor Cyan
git commit -m "chore: repositório limpo - migração para Next.js API Routes" 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Nenhuma mudança para commitar" -ForegroundColor Yellow
}

Write-Host "`n[8/8] Substituindo branch main..." -ForegroundColor Cyan
git branch -D main 2>$null | Out-Null
git branch -m main 2>$null | Out-Null
Write-Host "  ✓ Branch main substituída" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "VERIFICAÇÃO FINAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$finalTracked = git ls-files | Select-String "node_modules"
if ($finalTracked) {
    Write-Host "`n❌ PROBLEMA: node_modules AINDA está sendo rastreado!" -ForegroundColor Red
    Write-Host "   Arquivos encontrados: $($finalTracked.Count)" -ForegroundColor Red
    Write-Host "`nTente remover manualmente:" -ForegroundColor Yellow
    Write-Host "   git rm -rf --cached frontend/node_modules" -ForegroundColor Cyan
    Write-Host "   git rm -rf --cached node_modules" -ForegroundColor Cyan
    Write-Host "   git commit -m 'chore: remover node_modules'" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ SUCESSO: node_modules NÃO está mais sendo rastreado!" -ForegroundColor Green
}

Write-Host "`nStatus:" -ForegroundColor Cyan
git status --short

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Próximo passo:" -ForegroundColor Green
Write-Host "git push origin main --force" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

