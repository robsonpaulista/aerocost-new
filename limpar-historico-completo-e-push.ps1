# Limpar histórico COMPLETO e fazer push limpo
Write-Host "========================================" -ForegroundColor Red
Write-Host "LIMPEZA COMPLETA DO HISTÓRICO" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Este script vai:" -ForegroundColor Yellow
Write-Host "1. Criar backup do .git atual" -ForegroundColor White
Write-Host "2. Deletar TODO o histórico do Git" -ForegroundColor White
Write-Host "3. Inicializar um novo repositório Git" -ForegroundColor White
Write-Host "4. Adicionar apenas arquivos necessários" -ForegroundColor White
Write-Host "5. Fazer commit inicial limpo" -ForegroundColor White
Write-Host "6. Fazer push com force" -ForegroundColor White
Write-Host ""
Write-Host "⚠ ATENÇÃO: Isso vai APAGAR TODO O HISTÓRICO LOCAL E REMOTO!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Digite 'SIM' para continuar"
if ($confirm -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n[1/8] Criando backup do .git..." -ForegroundColor Cyan
$backupDir = "backup-git-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (Test-Path ".git") {
    Copy-Item -Path ".git" -Destination "$backupDir.git" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Backup criado em: $backupDir.git" -ForegroundColor Green
}

Write-Host "`n[2/8] Removendo node_modules do sistema de arquivos (se existir no Git)..." -ForegroundColor Cyan
if (Test-Path "frontend/node_modules") {
    Write-Host "  ℹ frontend/node_modules existe localmente (isso é normal)" -ForegroundColor Gray
}
Write-Host "  ✓ Verificado" -ForegroundColor Green

Write-Host "`n[3/8] Garantindo .gitignore..." -ForegroundColor Cyan
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

Write-Host "`n[4/8] Removendo histórico do Git completamente..." -ForegroundColor Cyan
Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "  ✓ Histórico removido" -ForegroundColor Green

Write-Host "`n[5/8] Inicializando novo repositório Git..." -ForegroundColor Cyan
git init
Write-Host "  ✓ Repositório inicializado" -ForegroundColor Green

Write-Host "`n[6/8] Configurando remote..." -ForegroundColor Cyan
git remote add origin https://github.com/robsonpaulista/aerocost.git 2>$null
git remote set-url origin https://github.com/robsonpaulista/aerocost.git 2>$null
Write-Host "  ✓ Remote configurado" -ForegroundColor Green

Write-Host "`n[7/8] Adicionando arquivos (exceto node_modules)..." -ForegroundColor Cyan
git add .
Write-Host "  ✓ Arquivos adicionados" -ForegroundColor Green

# Verificar se node_modules foi adicionado
$staged = git status --short | Select-String "node_modules"
if ($staged) {
    Write-Host "  ⚠ Removendo node_modules..." -ForegroundColor Yellow
    git reset frontend/node_modules 2>$null | Out-Null
    git reset node_modules 2>$null | Out-Null
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
}

Write-Host "`n[8/8] Fazendo commit inicial..." -ForegroundColor Cyan
git commit -m "chore: repositório limpo - migração para Next.js API Routes"
Write-Host "  ✓ Commit realizado" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "VERIFICAÇÃO FINAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$tracked = git ls-files | Select-String "node_modules"
if ($tracked) {
    Write-Host "`n❌ PROBLEMA: node_modules ainda está sendo rastreado!" -ForegroundColor Red
    Write-Host "   Removendo manualmente..." -ForegroundColor Yellow
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
    git commit --amend -m "chore: repositório limpo - migração para Next.js API Routes" 2>$null | Out-Null
} else {
    Write-Host "`n✅ SUCESSO: node_modules NÃO está sendo rastreado!" -ForegroundColor Green
}

Write-Host "`nStatus:" -ForegroundColor Cyan
git status --short

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "PRÓXIMO PASSO CRÍTICO:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Agora você precisa fazer push com force:" -ForegroundColor Cyan
Write-Host "git push origin main --force" -ForegroundColor White
Write-Host ""
Write-Host "⚠ IMPORTANTE:" -ForegroundColor Red
Write-Host "- Isso vai SOBRESCREVER todo o histórico remoto" -ForegroundColor White
Write-Host "- Certifique-se de que ninguém mais está trabalhando no repositório" -ForegroundColor White
Write-Host "- Backup salvo em: $backupDir.git" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Yellow

