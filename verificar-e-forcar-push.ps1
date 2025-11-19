# Verificar o que está sendo enviado e forçar push
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificando e Forçando Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/5] Verificando arquivos rastreados..." -ForegroundColor Yellow
$tracked = git ls-files | Select-String "node_modules"
if ($tracked) {
    Write-Host "  ❌ PROBLEMA: node_modules está sendo rastreado!" -ForegroundColor Red
    Write-Host "  Total: $($tracked.Count) arquivos" -ForegroundColor Red
    Write-Host "`n  Removendo..." -ForegroundColor Yellow
    git rm -rf --cached frontend/node_modules 2>$null | Out-Null
    git rm -rf --cached node_modules 2>$null | Out-Null
    git commit -m "chore: remover node_modules do Git" 2>$null | Out-Null
} else {
    Write-Host "  ✓ node_modules não está sendo rastreado" -ForegroundColor Green
}

Write-Host "`n[2/5] Verificando tamanho dos arquivos..." -ForegroundColor Yellow
$largeFiles = git ls-files | ForEach-Object {
    $file = $_
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        if ($size -gt 100MB) {
            Write-Host "  ⚠ Arquivo grande encontrado: $file ($([math]::Round($size/1MB, 2)) MB)" -ForegroundColor Yellow
            $file
        }
    }
}

if ($largeFiles) {
    Write-Host "`n  ❌ Arquivos grandes encontrados!" -ForegroundColor Red
    Write-Host "  Removendo do Git..." -ForegroundColor Yellow
    $largeFiles | ForEach-Object {
        git rm --cached $_ 2>$null | Out-Null
    }
    git commit -m "chore: remover arquivos grandes do Git" 2>$null | Out-Null
} else {
    Write-Host "  ✓ Nenhum arquivo grande encontrado" -ForegroundColor Green
}

Write-Host "`n[3/5] Verificando histórico local..." -ForegroundColor Yellow
$history = git log --oneline --all
Write-Host "  Total de commits: $($history.Count)" -ForegroundColor Gray

Write-Host "`n[4/5] Verificando branch atual..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "  Branch atual: $currentBranch" -ForegroundColor Gray

Write-Host "`n[5/5] Tentando push com diferentes estratégias..." -ForegroundColor Yellow

# Estratégia 1: Push normal com force
Write-Host "`n  Tentativa 1: git push origin $currentBranch --force" -ForegroundColor Cyan
git push origin $currentBranch --force 2>&1 | Tee-Object -Variable pushOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Push realizado com sucesso!" -ForegroundColor Green
    exit 0
}

# Se falhou, verificar o erro
if ($pushOutput -match "Large files detected" -or $pushOutput -match "exceeds.*limit") {
    Write-Host "`n  ❌ Arquivo grande ainda no histórico remoto!" -ForegroundColor Red
    Write-Host "`n  SOLUÇÃO: Precisa limpar o histórico remoto também" -ForegroundColor Yellow
    Write-Host "`n  Opções:" -ForegroundColor Cyan
    Write-Host "  1. Criar um NOVO repositório no GitHub" -ForegroundColor White
    Write-Host "  2. Ou usar: git push origin $currentBranch --force --no-verify" -ForegroundColor White
    Write-Host "     (pode não funcionar se o GitHub bloquear)" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Red
Write-Host "ERRO NO PUSH" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host $pushOutput -ForegroundColor Yellow

