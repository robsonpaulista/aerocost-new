# Script para remover node_modules do Git e garantir que está no .gitignore
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Removendo node_modules do Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Remove node_modules do índice do Git (mas mantém os arquivos localmente)
Write-Host "`n1. Removendo frontend/node_modules do Git..." -ForegroundColor Yellow
git rm -r --cached frontend/node_modules 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ Não estava no Git ou já foi removido" -ForegroundColor Gray
}

Write-Host "`n2. Removendo node_modules da raiz do Git..." -ForegroundColor Yellow
git rm -r --cached node_modules 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ Não estava no Git ou já foi removido" -ForegroundColor Gray
}

# Garante que node_modules está no .gitignore da raiz
Write-Host "`n3. Verificando .gitignore da raiz..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    if ($gitignoreContent -notmatch "node_modules") {
        Write-Host "   Adicionando node_modules ao .gitignore..." -ForegroundColor Yellow
        Add-Content ".gitignore" "`nnode_modules/"
        Write-Host "   ✓ Adicionado" -ForegroundColor Green
    } else {
        Write-Host "   ✓ node_modules já está no .gitignore" -ForegroundColor Green
    }
} else {
    Write-Host "   Criando .gitignore..." -ForegroundColor Yellow
    "node_modules/`n.env`n.DS_Store`n*.log`ndist/`nbuild/" | Out-File ".gitignore" -Encoding UTF8
    Write-Host "   ✓ Criado" -ForegroundColor Green
}

# Garante que node_modules está no .gitignore do frontend
Write-Host "`n4. Verificando frontend/.gitignore..." -ForegroundColor Yellow
if (Test-Path "frontend/.gitignore") {
    $frontendGitignore = Get-Content "frontend/.gitignore" -Raw
    if ($frontendGitignore -notmatch "node_modules") {
        Write-Host "   Adicionando node_modules ao frontend/.gitignore..." -ForegroundColor Yellow
        Add-Content "frontend/.gitignore" "`nnode_modules/"
        Write-Host "   ✓ Adicionado" -ForegroundColor Green
    } else {
        Write-Host "   ✓ node_modules já está no frontend/.gitignore" -ForegroundColor Green
    }
}

Write-Host "`n5. Adicionando mudanças ao Git..." -ForegroundColor Yellow
git add .gitignore frontend/.gitignore
Write-Host "   ✓ Adicionado" -ForegroundColor Green

Write-Host "`n6. Fazendo commit..." -ForegroundColor Yellow
git commit -m "chore: remover node_modules do Git e garantir .gitignore"
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "   ℹ Nenhuma mudança para commitar" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Status atual do Git:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
git status --short

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Pronto! Agora você pode fazer push:" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

