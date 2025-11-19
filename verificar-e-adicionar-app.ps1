# Verificar e adicionar diretório app ao Git
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificar e Adicionar Diretório App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/5] Verificando se frontend/app existe..." -ForegroundColor Yellow
if (Test-Path "frontend/app") {
    $fileCount = (Get-ChildItem -Path "frontend/app" -Recurse -File).Count
    Write-Host "  ✓ frontend/app existe ($fileCount arquivos)" -ForegroundColor Green
} else {
    Write-Host "  ❌ frontend/app NÃO existe!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/5] Verificando arquivos no Git..." -ForegroundColor Yellow
$gitFiles = git ls-files | Select-String "^frontend/app/"
$gitCount = $gitFiles.Count

if ($gitCount -gt 0) {
    Write-Host "  ✓ frontend/app/ está no Git ($gitCount arquivos)" -ForegroundColor Green
    Write-Host "  Primeiros arquivos:" -ForegroundColor Gray
    $gitFiles | Select-Object -First 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ❌ PROBLEMA: frontend/app/ NÃO está no Git!" -ForegroundColor Red
    Write-Host "  Adicionando agora..." -ForegroundColor Yellow
}

Write-Host "`n[3/5] Contando arquivos físicos em frontend/app/..." -ForegroundColor Yellow
$physicalFiles = Get-ChildItem -Path "frontend/app" -Recurse -File
$physicalCount = $physicalFiles.Count
Write-Host "  Total de arquivos físicos: $physicalCount" -ForegroundColor Gray

if ($gitCount -lt $physicalCount) {
    Write-Host "  ⚠ Alguns arquivos não estão no Git!" -ForegroundColor Yellow
    Write-Host "  Diferença: $($physicalCount - $gitCount) arquivos" -ForegroundColor Yellow
}

Write-Host "`n[4/5] Adicionando frontend/app/ ao Git..." -ForegroundColor Yellow
git add frontend/app/
Write-Host "  ✓ Adicionado" -ForegroundColor Green

Write-Host "`n[5/5] Verificando status..." -ForegroundColor Yellow
$status = git status --short | Select-String "frontend/app/"
if ($status) {
    Write-Host "  Mudanças detectadas:" -ForegroundColor Gray
    $status | Select-Object -First 10 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
    
    Write-Host "`n  Fazendo commit..." -ForegroundColor Yellow
    git commit -m "fix: adicionar diretório app completo ao Git"
    Write-Host "  ✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "  ℹ Nenhuma mudança (já estava no Git)" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Verificação Final:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
$finalCheck = git ls-files | Select-String "^frontend/app/"
Write-Host "  Arquivos em frontend/app/ no Git: $($finalCheck.Count)" -ForegroundColor $(if ($finalCheck.Count -gt 0) { "Green" } else { "Red" })

Write-Host "`nPróximo passo:" -ForegroundColor Yellow
Write-Host "git push origin main" -ForegroundColor Cyan

