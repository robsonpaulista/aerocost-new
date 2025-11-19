# Verificar e corrigir imports nas rotas da API
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificando Imports nas Rotas da API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$apiRoutes = @(
    "frontend/app/api/aircraft/route.ts",
    "frontend/app/api/aircraft/[id]/route.ts",
    "frontend/app/api/users/login/route.ts"
)

Write-Host "`nVerificando arquivos..." -ForegroundColor Yellow
foreach ($file in $apiRoutes) {
    if (Test-Path $file) {
        Write-Host "`n  Arquivo: $file" -ForegroundColor Cyan
        $content = Get-Content $file -Raw
        
        # Verificar imports incorretos
        if ($content -match "src/controllers" -or $content -match "\.\.\/.*src") {
            Write-Host "    ❌ IMPORTS INCORRETOS ENCONTRADOS!" -ForegroundColor Red
            Write-Host "    Conteúdo atual:" -ForegroundColor Yellow
            Get-Content $file | Select-String "import" | ForEach-Object {
                Write-Host "      $_" -ForegroundColor Gray
            }
        } else {
            Write-Host "    ✓ Imports corretos" -ForegroundColor Green
        }
    } else {
        Write-Host "`n  ⚠ Arquivo não encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nVerificando se os modelos existem..." -ForegroundColor Yellow
$models = @(
    "frontend/lib/models/Aircraft.ts",
    "frontend/lib/models/User.ts",
    "frontend/lib/config/supabase.ts"
)

foreach ($model in $models) {
    if (Test-Path $model) {
        Write-Host "  ✓ $model existe" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $model NÃO existe!" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Verificar que os arquivos estão corretos" -ForegroundColor White
Write-Host "2. git add frontend/app/api/" -ForegroundColor Cyan
Write-Host "3. git commit -m 'fix: corrigir imports nas rotas da API'" -ForegroundColor Cyan
Write-Host "4. git push origin main" -ForegroundColor Cyan

