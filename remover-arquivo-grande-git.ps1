# Script para remover arquivo grande do histórico do Git
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Removendo arquivo grande do Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Remover do índice atual
Write-Host "`n1. Removendo node_modules do índice do Git..." -ForegroundColor Yellow
git rm -r --cached frontend/node_modules 2>$null
git rm -r --cached node_modules 2>$null

# 2. Garantir que está no .gitignore
Write-Host "`n2. Garantindo que node_modules está no .gitignore..." -ForegroundColor Yellow
if (-not (Test-Path ".gitignore")) {
    "node_modules/`n.env`n.DS_Store`n*.log`ndist/`nbuild/`n.next/" | Out-File ".gitignore" -Encoding UTF8
    Write-Host "   ✓ Criado .gitignore" -ForegroundColor Green
} else {
    $content = Get-Content ".gitignore" -Raw
    if ($content -notmatch "node_modules") {
        Add-Content ".gitignore" "`nnode_modules/"
        Write-Host "   ✓ Adicionado node_modules ao .gitignore" -ForegroundColor Green
    } else {
        Write-Host "   ✓ node_modules já está no .gitignore" -ForegroundColor Green
    }
}

# 3. Verificar se frontend/.gitignore existe e tem node_modules
Write-Host "`n3. Verificando frontend/.gitignore..." -ForegroundColor Yellow
if (Test-Path "frontend/.gitignore") {
    $frontendContent = Get-Content "frontend/.gitignore" -Raw
    if ($frontendContent -notmatch "node_modules") {
        Add-Content "frontend/.gitignore" "`nnode_modules/"
        Write-Host "   ✓ Adicionado node_modules ao frontend/.gitignore" -ForegroundColor Green
    } else {
        Write-Host "   ✓ node_modules já está no frontend/.gitignore" -ForegroundColor Green
    }
} else {
    "node_modules/`n.next/`n.env*.local" | Out-File "frontend/.gitignore" -Encoding UTF8
    Write-Host "   ✓ Criado frontend/.gitignore" -ForegroundColor Green
}

# 4. Adicionar .gitignore ao commit
Write-Host "`n4. Adicionando mudanças..." -ForegroundColor Yellow
git add .gitignore frontend/.gitignore

# 5. Fazer commit
Write-Host "`n5. Fazendo commit..." -ForegroundColor Yellow
git commit -m "chore: remover node_modules do Git e atualizar .gitignore"

# 6. Tentar remover do histórico usando filter-branch (se necessário)
Write-Host "`n6. Verificando se precisa limpar histórico..." -ForegroundColor Yellow
Write-Host "   Tentando remover do histórico usando git filter-branch..." -ForegroundColor Yellow

# Remove o arquivo específico do histórico
git filter-branch --force --index-filter `
    "git rm --cached --ignore-unmatch -r frontend/node_modules" `
    --prune-empty --tag-name-filter cat -- --all 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Histórico limpo" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Não foi possível limpar histórico (pode não ser necessário)" -ForegroundColor Yellow
}

# 7. Limpar referências
Write-Host "`n7. Limpando referências..." -ForegroundColor Yellow
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>$null
git reflog expire --expire=now --all 2>$null
git gc --prune=now --aggressive 2>$null

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Status:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
git status --short

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Pronto! Agora tente fazer push:" -ForegroundColor Green
Write-Host "git push origin main --force" -ForegroundColor Yellow
Write-Host "`n⚠ ATENÇÃO: Use --force apenas se tiver certeza!" -ForegroundColor Red
Write-Host "Ou tente primeiro sem --force:" -ForegroundColor Yellow
Write-Host "git push origin main" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

