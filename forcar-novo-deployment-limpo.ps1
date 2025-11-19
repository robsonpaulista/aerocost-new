# Script para forçar um novo deployment limpo no Vercel
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Forçar Novo Deployment Limpo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Remover todos os arquivos de configuração do Vercel
Write-Host "`n[1/4] Removendo arquivos de configuração antigos..." -ForegroundColor Yellow
$arquivos = @(
    "vercel.json",
    "vercel-backend.json",
    "frontend/vercel.json"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        Remove-Item $arquivo -Force
        Write-Host "  ✓ Removido: $arquivo" -ForegroundColor Green
    }
}

# 2. Criar um commit vazio para forçar novo deployment
Write-Host "`n[2/4] Criando commit para forçar novo deployment..." -ForegroundColor Yellow
git add .
$hasChanges = git diff --cached --quiet
if (-not $hasChanges) {
    Write-Host "  ℹ Nenhuma mudança para commitar" -ForegroundColor Gray
} else {
    git commit -m "chore: remover configurações antigas do Vercel e forçar novo deployment"
    Write-Host "  ✓ Commit criado" -ForegroundColor Green
}

# 3. Criar um arquivo .vercelignore se não existir (opcional)
Write-Host "`n[3/4] Verificando estrutura..." -ForegroundColor Yellow
if (-not (Test-Path ".vercelignore")) {
    @"
node_modules
.next
.env.local
"@ | Out-File ".vercelignore" -Encoding UTF8
    Write-Host "  ✓ .vercelignore criado" -ForegroundColor Green
}

Write-Host "`n[4/4] Próximos passos:" -ForegroundColor Yellow
Write-Host "`n1. Faça push:" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor White

Write-Host "`n2. No Vercel Dashboard:" -ForegroundColor Cyan
Write-Host "   a) Vá em Deployments" -ForegroundColor White
Write-Host "   b) Encontre o deployment antigo (9asLxps7yP3NbSUFe4hDN3Wkioqq)" -ForegroundColor White
Write-Host "   c) Clique nos 3 pontos → 'Delete'" -ForegroundColor White
Write-Host "   d) OU simplesmente aguarde o novo deployment ser criado automaticamente" -ForegroundColor White

Write-Host "`n3. Configure no Settings → General:" -ForegroundColor Cyan
Write-Host "   - Root Directory: frontend" -ForegroundColor Yellow
Write-Host "   - Framework Preset: Next.js" -ForegroundColor Yellow
Write-Host "   - Deixe tudo mais como padrão" -ForegroundColor Yellow

Write-Host "`n4. O novo deployment será criado automaticamente com as configurações corretas!" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Pronto!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

