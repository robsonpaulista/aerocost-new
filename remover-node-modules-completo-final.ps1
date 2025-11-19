# Solução FINAL - Remover node_modules completamente
Write-Host "========================================" -ForegroundColor Red
Write-Host "SOLUÇÃO FINAL - Remover node_modules" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red

Write-Host "`n[1/8] Verificando arquivos rastreados pelo Git..." -ForegroundColor Yellow
$allTracked = git ls-files
$nodeModulesFiles = $allTracked | Select-String "node_modules"

if ($nodeModulesFiles) {
    Write-Host "  ❌ PROBLEMA: node_modules está sendo rastreado!" -ForegroundColor Red
    Write-Host "  Total: $($nodeModulesFiles.Count) arquivos" -ForegroundColor Red
    Write-Host "  Primeiros arquivos:" -ForegroundColor Yellow
    $nodeModulesFiles | Select-Object -First 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ✓ node_modules não está sendo rastreado" -ForegroundColor Green
}

Write-Host "`n[2/8] Removendo node_modules do Git (todas as localizações)..." -ForegroundColor Yellow
git rm -rf --cached node_modules 2>$null | Out-Null
git rm -rf --cached frontend/node_modules 2>$null | Out-Null
git rm -rf --cached "*/node_modules" 2>$null | Out-Null
Write-Host "  ✓ Removido do índice" -ForegroundColor Green

Write-Host "`n[3/8] Garantindo .gitignore na raiz..." -ForegroundColor Yellow
$rootGitignore = @"
# Dependencies
node_modules/
**/node_modules/

# Environment
.env
.env.local
.env*.local

# Build outputs
.next/
dist/
build/
out/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
"@
Set-Content -Path ".gitignore" -Value $rootGitignore -Encoding UTF8
Write-Host "  ✓ .gitignore criado/atualizado na raiz" -ForegroundColor Green

Write-Host "`n[4/8] Garantindo frontend/.gitignore..." -ForegroundColor Yellow
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
Write-Host "  ✓ frontend/.gitignore atualizado" -ForegroundColor Green

Write-Host "`n[5/8] Verificando se node_modules existe fisicamente..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ℹ node_modules existe na raiz (isso é normal, mas não deve estar no Git)" -ForegroundColor Gray
}
if (Test-Path "frontend/node_modules") {
    Write-Host "  ℹ frontend/node_modules existe (isso é normal, mas não deve estar no Git)" -ForegroundColor Gray
}

Write-Host "`n[6/8] Adicionando apenas .gitignore ao staging..." -ForegroundColor Yellow
git add .gitignore frontend/.gitignore
Write-Host "  ✓ .gitignore adicionado" -ForegroundColor Green

Write-Host "`n[7/8] Verificando o que está no staging..." -ForegroundColor Yellow
$staged = git diff --cached --name-only
Write-Host "  Arquivos no staging:" -ForegroundColor Gray
$staged | ForEach-Object {
    Write-Host "    $_" -ForegroundColor Gray
}

$nodeModulesInStaging = $staged | Select-String "node_modules"
if ($nodeModulesInStaging) {
    Write-Host "`n  ❌ ERRO: node_modules ainda está no staging!" -ForegroundColor Red
    Write-Host "  Removendo..." -ForegroundColor Yellow
    git reset node_modules 2>$null | Out-Null
    git reset frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
}

Write-Host "`n[8/8] Adicionando TODOS os arquivos (exceto node_modules)..." -ForegroundColor Yellow
git add .

# Verificar novamente
$finalStaged = git diff --cached --name-only | Select-String "node_modules"
if ($finalStaged) {
    Write-Host "  ⚠ Removendo node_modules que foi adicionado..." -ForegroundColor Yellow
    git reset node_modules 2>$null | Out-Null
    git reset frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
    git reset "*/node_modules" 2>$null | Out-Null
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "VERIFICAÇÃO FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$finalTracked = git ls-files | Select-String "node_modules"
if ($finalTracked) {
    Write-Host "`n❌ PROBLEMA: node_modules AINDA está sendo rastreado!" -ForegroundColor Red
    Write-Host "  Arquivos encontrados:" -ForegroundColor Red
    $finalTracked | Select-Object -First 10 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
    Write-Host "`n  Tentando remover manualmente de TODOS os lugares..." -ForegroundColor Yellow
    
    # Remover de forma mais agressiva
    git ls-files | Select-String "node_modules" | ForEach-Object {
        git rm --cached $_ 2>$null | Out-Null
    }
    
    Write-Host "  ✓ Removido manualmente" -ForegroundColor Green
} else {
    Write-Host "`n✅ SUCESSO: node_modules NÃO está sendo rastreado!" -ForegroundColor Green
}

Write-Host "`nStatus:" -ForegroundColor Cyan
git status --short | Select-Object -First 20

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "1. git commit -m 'chore: remover node_modules do Git'" -ForegroundColor Cyan
Write-Host "2. git push origin main --force" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Yellow

