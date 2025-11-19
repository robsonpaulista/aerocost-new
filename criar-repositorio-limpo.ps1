# Solução DEFINITIVA: Criar novo repositório limpo sem histórico antigo
Write-Host "========================================" -ForegroundColor Red
Write-Host "CRIAR REPOSITÓRIO LIMPO (SEM HISTÓRICO)" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Este script vai:" -ForegroundColor Yellow
Write-Host "1. Criar um backup do repositório atual" -ForegroundColor White
Write-Host "2. Criar um novo branch limpo sem histórico" -ForegroundColor White
Write-Host "3. Adicionar todos os arquivos exceto node_modules" -ForegroundColor White
Write-Host "4. Substituir a branch main" -ForegroundColor White
Write-Host ""
Write-Host "⚠ ATENÇÃO: Isso vai APAGAR TODO O HISTÓRICO DO GIT!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Tem certeza absoluta? Digite 'SIM' para continuar"
if ($confirm -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n[1/6] Criando backup do repositório atual..." -ForegroundColor Cyan
$backupDir = "backup-git-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item -Path ".git" -Destination "$backupDir.git" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Backup criado em: $backupDir.git" -ForegroundColor Green

Write-Host "`n[2/6] Removendo node_modules do índice..." -ForegroundColor Cyan
git rm -rf --cached frontend/node_modules 2>$null | Out-Null
git rm -rf --cached node_modules 2>$null | Out-Null
Write-Host "   ✓ Removido" -ForegroundColor Green

Write-Host "`n[3/6] Garantindo .gitignore..." -ForegroundColor Cyan
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

Write-Host "`n[4/6] Criando novo branch órfão (sem histórico)..." -ForegroundColor Cyan
git checkout --orphan main-limpo 2>$null | Out-Null
Write-Host "   ✓ Branch criado" -ForegroundColor Green

Write-Host "`n[5/6] Adicionando todos os arquivos (exceto node_modules)..." -ForegroundColor Cyan
git add . 2>$null | Out-Null

# Verificar se node_modules foi adicionado acidentalmente
$status = git status --short
if ($status -match "node_modules") {
    Write-Host "   ⚠ Removendo node_modules que foi adicionado..." -ForegroundColor Yellow
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
}

Write-Host "   ✓ Arquivos adicionados" -ForegroundColor Green

Write-Host "`n[6/6] Fazendo commit inicial limpo..." -ForegroundColor Cyan
git commit -m "chore: repositório limpo - migração para Next.js API Routes" 2>$null | Out-Null
Write-Host "   ✓ Commit realizado" -ForegroundColor Green

Write-Host "`n[7/7] Substituindo branch main..." -ForegroundColor Cyan
git branch -D main 2>$null | Out-Null
git branch -m main 2>$null | Out-Null
Write-Host "   ✓ Branch main substituída" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nStatus do repositório:" -ForegroundColor Cyan
git status --short

Write-Host "`nPróximo passo:" -ForegroundColor Yellow
Write-Host "git push origin main --force" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠ IMPORTANTE:" -ForegroundColor Red
Write-Host "- O histórico antigo foi APAGADO" -ForegroundColor White
Write-Host "- Você precisa usar --force no push" -ForegroundColor White
Write-Host "- Backup salvo em: $backupDir.git" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green

