# Solução SIMPLES: Remover node_modules e fazer commit limpo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Solução Simples - Remover node_modules" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Remover completamente do Git
Write-Host "`n1. Removendo node_modules do Git..." -ForegroundColor Yellow
git rm -rf --cached frontend/node_modules 2>$null
git rm -rf --cached node_modules 2>$null

# 2. Garantir .gitignore
Write-Host "`n2. Atualizando .gitignore..." -ForegroundColor Yellow
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
Write-Host "   ✓ frontend/.gitignore atualizado" -ForegroundColor Green

# 3. Criar .gitignore na raiz se não existir
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
    Write-Host "   ✓ .gitignore criado na raiz" -ForegroundColor Green
}

# 4. Adicionar e commitar
Write-Host "`n3. Adicionando mudanças..." -ForegroundColor Yellow
git add .gitignore frontend/.gitignore

Write-Host "`n4. Fazendo commit..." -ForegroundColor Yellow
git commit -m "chore: remover node_modules do Git e atualizar .gitignore"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Status:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
git status --short

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "Se o erro persistir, o arquivo está no histórico antigo." -ForegroundColor Yellow
Write-Host "Nesse caso, você pode:" -ForegroundColor Yellow
Write-Host "1. Tentar push normal: git push origin main" -ForegroundColor Cyan
Write-Host "2. Se falhar, usar: git push origin main --force" -ForegroundColor Cyan
Write-Host "   (⚠ Cuidado: force push sobrescreve histórico remoto)" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Yellow

