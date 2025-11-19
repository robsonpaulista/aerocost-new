# Commit das novas rotas da API
Write-Host "Adicionando novas rotas da API ao Git..." -ForegroundColor Cyan

git add frontend/app/api/
git add frontend/lib/models/
git add frontend/lib/services/

Write-Host "`nStatus:" -ForegroundColor Yellow
git status --short | Select-Object -First 20

Write-Host "`nFazendo commit..." -ForegroundColor Yellow
git commit -m "feat: adicionar rotas da API para users, routes e dashboard"

Write-Host "`nPróximo passo:" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor Cyan

