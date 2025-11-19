# Corrigir problema do diretório app não encontrado
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Corrigir Diretório App Não Encontrado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Verificando se frontend/app existe..." -ForegroundColor Yellow
if (Test-Path "frontend/app") {
    $fileCount = (Get-ChildItem -Path "frontend/app" -Recurse -File).Count
    Write-Host "  ✓ frontend/app existe ($fileCount arquivos)" -ForegroundColor Green
} else {
    Write-Host "  ❌ frontend/app NÃO existe!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/4] Verificando se está sendo rastreado pelo Git..." -ForegroundColor Yellow
$gitFiles = git ls-files | Select-String "^frontend/app/"
if ($gitFiles) {
    Write-Host "  ✓ frontend/app/ está sendo rastreado ($($gitFiles.Count) arquivos)" -ForegroundColor Green
} else {
    Write-Host "  ❌ PROBLEMA: frontend/app/ NÃO está sendo rastreado!" -ForegroundColor Red
    Write-Host "  Adicionando ao Git..." -ForegroundColor Yellow
    
    git add frontend/app/
    Write-Host "  ✓ Adicionado ao Git" -ForegroundColor Green
}

Write-Host "`n[3/4] Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    $packageJson = Get-Content "frontend/package.json" -Raw | ConvertFrom-Json
    
    # Remover vercel-build se existir (não é necessário)
    if ($packageJson.scripts.'vercel-build') {
        Write-Host "  ⚠ Script vercel-build encontrado, removendo..." -ForegroundColor Yellow
        $packageJson.scripts.PSObject.Properties.Remove('vercel-build')
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "frontend/package.json" -Encoding UTF8
        Write-Host "  ✓ Script removido" -ForegroundColor Green
    }
    
    # Garantir que build existe
    if (-not $packageJson.scripts.build) {
        Write-Host "  ⚠ Script build não encontrado, adicionando..." -ForegroundColor Yellow
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "build" -Value "next build" -Force
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "frontend/package.json" -Encoding UTF8
        Write-Host "  ✓ Script build adicionado" -ForegroundColor Green
    }
}

Write-Host "`n[4/4] Adicionando tudo ao Git..." -ForegroundColor Yellow
git add frontend/app/
git add frontend/package.json
git add frontend/

$status = git status --short
if ($status) {
    Write-Host "  Mudanças detectadas:" -ForegroundColor Gray
    $status | Select-Object -First 10 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
    
    Write-Host "`n  Fazendo commit..." -ForegroundColor Yellow
    git commit -m "fix: adicionar diretório app ao Git e corrigir package.json"
    Write-Host "  ✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "  ℹ Nenhuma mudança para commitar" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Próximo passo:" -ForegroundColor Green
Write-Host "git push origin main" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nVerificação final:" -ForegroundColor Yellow
Write-Host "git ls-files | Select-String '^frontend/app/' | Measure-Object" -ForegroundColor Cyan
$count = (git ls-files | Select-String '^frontend/app/').Count
Write-Host "  Total de arquivos em frontend/app/: $count" -ForegroundColor $(if ($count -gt 0) { "Green" } else { "Red" })

