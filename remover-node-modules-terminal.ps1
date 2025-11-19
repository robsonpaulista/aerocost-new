# Script para executar na raiz do projeto
# Execute: cd .. && powershell -ExecutionPolicy Bypass -File remover-node-modules-terminal.ps1

Write-Host "========================================" -ForegroundColor Red
Write-Host "Remover node_modules do Git" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red

# Voltar para raiz se estiver em frontend
if ($PWD.Path -match "frontend$") {
    Write-Host "`nVoltando para raiz do projeto..." -ForegroundColor Yellow
    Set-Location ..
}

Write-Host "`n[1/6] Verificando arquivos rastreados..." -ForegroundColor Yellow
$tracked = git ls-files | Select-String "node_modules"
if ($tracked) {
    Write-Host "  ❌ node_modules está sendo rastreado! ($($tracked.Count) arquivos)" -ForegroundColor Red
} else {
    Write-Host "  ✓ node_modules não está sendo rastreado" -ForegroundColor Green
}

Write-Host "`n[2/6] Removendo node_modules do Git..." -ForegroundColor Yellow
git rm -rf --cached node_modules 2>$null | Out-Null
git rm -rf --cached frontend/node_modules 2>$null | Out-Null
Write-Host "  ✓ Removido" -ForegroundColor Green

Write-Host "`n[3/6] Garantindo .gitignore..." -ForegroundColor Yellow
$rootGitignore = @"
node_modules/
**/node_modules/
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
Write-Host "  ✓ .gitignore atualizado" -ForegroundColor Green

Write-Host "`n[4/6] Adicionando arquivos..." -ForegroundColor Yellow
git add .

Write-Host "`n[5/6] Verificando staging..." -ForegroundColor Yellow
$staged = git diff --cached --name-only | Select-String "node_modules"
if ($staged) {
    Write-Host "  ❌ node_modules ainda está no staging!" -ForegroundColor Red
    Write-Host "  Removendo..." -ForegroundColor Yellow
    git reset node_modules 2>$null | Out-Null
    git reset frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
} else {
    Write-Host "  ✓ node_modules não está no staging" -ForegroundColor Green
}

Write-Host "`n[6/6] Status final:" -ForegroundColor Yellow
git status --short | Select-Object -First 20

$finalCheck = git ls-files | Select-String "node_modules"
if ($finalCheck) {
    Write-Host "`n❌ PROBLEMA: node_modules ainda está sendo rastreado!" -ForegroundColor Red
    Write-Host "  Execute manualmente:" -ForegroundColor Yellow
    Write-Host "  git ls-files | Select-String 'node_modules' | ForEach-Object { git rm --cached `$_ }" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ SUCESSO: node_modules não está sendo rastreado!" -ForegroundColor Green
    Write-Host "`nPróximos passos:" -ForegroundColor Yellow
    Write-Host "  git commit -m 'chore: remover node_modules do Git'" -ForegroundColor Cyan
    Write-Host "  git push origin main --force" -ForegroundColor Cyan
}

