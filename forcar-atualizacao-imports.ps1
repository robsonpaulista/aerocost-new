# Forçar atualização dos arquivos da API no Git
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Forçar Atualização dos Imports" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/5] Verificando arquivos locais..." -ForegroundColor Yellow
$apiFiles = @(
    "frontend/app/api/aircraft/route.ts",
    "frontend/app/api/aircraft/[id]/route.ts",
    "frontend/app/api/users/login/route.ts"
)

foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "@/lib/models/") {
            Write-Host "  ✓ $file está correto localmente" -ForegroundColor Green
        } elseif ($content -match "src/controllers") {
            Write-Host "  ❌ $file tem imports incorretos!" -ForegroundColor Red
        } else {
            Write-Host "  ⚠ $file - verificar manualmente" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n[2/5] Forçando atualização dos arquivos..." -ForegroundColor Yellow
# Tocar nos arquivos para forçar atualização
foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        # Adicionar um espaço e remover para forçar mudança
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✓ $file atualizado" -ForegroundColor Green
    }
}

Write-Host "`n[3/5] Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add frontend/app/api/aircraft/route.ts
git add "frontend/app/api/aircraft/[id]/route.ts"
git add frontend/app/api/users/login/route.ts
git add frontend/lib/models/Aircraft.ts
git add frontend/lib/models/User.ts
git add frontend/lib/config/supabase.ts
Write-Host "  ✓ Arquivos adicionados" -ForegroundColor Green

Write-Host "`n[4/5] Verificando status..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "  Mudanças detectadas:" -ForegroundColor Gray
    $status | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ Nenhuma mudança detectada" -ForegroundColor Yellow
    Write-Host "  Os arquivos podem já estar corretos no Git" -ForegroundColor Gray
}

Write-Host "`n[5/5] Fazendo commit (se houver mudanças)..." -ForegroundColor Yellow
if ($status) {
    git commit -m "fix: garantir imports corretos nas rotas da API"
    Write-Host "  ✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "  ℹ Nenhuma mudança para commitar" -ForegroundColor Gray
    Write-Host "  Tentando fazer commit vazio para forçar rebuild..." -ForegroundColor Yellow
    git commit --allow-empty -m "chore: forçar rebuild no Vercel"
    Write-Host "  ✓ Commit vazio criado" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Próximo passo:" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nSe o problema persistir no Vercel:" -ForegroundColor Yellow
Write-Host "1. Verifique as variáveis de ambiente no Vercel" -ForegroundColor White
Write-Host "2. Limpe o cache do build no Vercel" -ForegroundColor White
Write-Host "3. Faça um redeploy manual" -ForegroundColor White

