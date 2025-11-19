# Script para remover node_modules do Git
Write-Host "Removendo node_modules do Git..." -ForegroundColor Cyan

# Remove node_modules do índice do Git (mas mantém os arquivos localmente)
git rm -r --cached frontend/node_modules
git rm -r --cached node_modules

Write-Host "Verificando .gitignore..." -ForegroundColor Cyan
if (Test-Path ".gitignore") {
    $content = Get-Content ".gitignore" -Raw
    if ($content -notmatch "node_modules") {
        Write-Host "Adicionando node_modules ao .gitignore..." -ForegroundColor Yellow
        Add-Content ".gitignore" "`nnode_modules/"
    } else {
        Write-Host "node_modules já está no .gitignore" -ForegroundColor Green
    }
} else {
    Write-Host "Criando .gitignore..." -ForegroundColor Yellow
    "node_modules/" | Out-File ".gitignore" -Encoding UTF8
}

if (Test-Path "frontend/.gitignore") {
    $content = Get-Content "frontend/.gitignore" -Raw
    if ($content -notmatch "node_modules") {
        Write-Host "Adicionando node_modules ao frontend/.gitignore..." -ForegroundColor Yellow
        Add-Content "frontend/.gitignore" "`nnode_modules/"
    }
}

Write-Host "`nFazendo commit da remoção..." -ForegroundColor Cyan
git add .gitignore frontend/.gitignore
git commit -m "chore: remover node_modules do Git"

Write-Host "`nStatus atual:" -ForegroundColor Cyan
git status

Write-Host "`nPronto! Agora você pode fazer push normalmente." -ForegroundColor Green
Write-Host "Execute: git push origin main" -ForegroundColor Yellow

