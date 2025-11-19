# Remover submodule frontend e adicionar como diretório normal
Write-Host "========================================" -ForegroundColor Red
Write-Host "Remover Submodule Frontend" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "PROBLEMA: frontend está configurado como submodule!" -ForegroundColor Yellow
Write-Host "SOLUÇÃO: Remover submodule e adicionar como diretório normal" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Digite 'SIM' para continuar"
if ($confirm -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n[1/6] Verificando submodules..." -ForegroundColor Yellow
$submodules = git submodule status
if ($submodules) {
    Write-Host "  Submodules encontrados:" -ForegroundColor Gray
    $submodules | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ Nenhum submodule encontrado" -ForegroundColor Gray
}

Write-Host "`n[2/6] Verificando .gitmodules..." -ForegroundColor Yellow
if (Test-Path ".gitmodules") {
    Write-Host "  .gitmodules encontrado:" -ForegroundColor Gray
    Get-Content ".gitmodules" | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ .gitmodules não encontrado" -ForegroundColor Gray
}

Write-Host "`n[3/6] Removendo submodule frontend..." -ForegroundColor Yellow
# Desinicializar submodule
git submodule deinit -f frontend 2>$null | Out-Null

# Remover do índice
git rm --cached frontend 2>$null | Out-Null

# Remover .gitmodules se existir
if (Test-Path ".gitmodules") {
    $gitmodules = Get-Content ".gitmodules" -Raw
    if ($gitmodules -match "\[submodule.*frontend") {
        # Remover entrada do frontend
        $newContent = $gitmodules -replace "(?s)\[submodule.*?frontend.*?\].*?path\s*=\s*frontend.*?\n", ""
        if ($newContent.Trim() -eq "") {
            Remove-Item ".gitmodules" -Force
            Write-Host "  ✓ .gitmodules removido" -ForegroundColor Green
        } else {
            Set-Content ".gitmodules" -Value $newContent -Encoding UTF8
            Write-Host "  ✓ Entrada do frontend removida do .gitmodules" -ForegroundColor Green
        }
    }
}

# Remover .git do frontend se existir
if (Test-Path "frontend/.git") {
    Write-Host "  Removendo frontend/.git..." -ForegroundColor Yellow
    Remove-Item "frontend/.git" -Recurse -Force
    Write-Host "  ✓ frontend/.git removido" -ForegroundColor Green
}

Write-Host "`n[4/6] Adicionando frontend como diretório normal..." -ForegroundColor Yellow
git add frontend/
Write-Host "  ✓ frontend/ adicionado" -ForegroundColor Green

Write-Host "`n[5/6] Verificando arquivos adicionados..." -ForegroundColor Yellow
$status = git status --short | Select-String "frontend/"
if ($status) {
    Write-Host "  Arquivos adicionados:" -ForegroundColor Gray
    $status | Select-Object -First 20 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ Nenhum arquivo adicionado" -ForegroundColor Yellow
}

Write-Host "`n[6/6] Fazendo commit..." -ForegroundColor Yellow
if ($status) {
    git commit -m "fix: remover submodule frontend e adicionar como diretório normal"
    Write-Host "  ✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "  ℹ Nenhuma mudança para commitar" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Verificação Final:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
$finalCheck = git ls-files | Select-String "^frontend/app/"
Write-Host "  Arquivos em frontend/app/ no Git: $($finalCheck.Count)" -ForegroundColor $(if ($finalCheck.Count -gt 0) { "Green" } else { "Red" })

if ($finalCheck.Count -eq 0) {
    Write-Host "`n  ⚠ Ainda não há arquivos. Tentando adicionar novamente..." -ForegroundColor Yellow
    git add frontend/app/ -f
    git commit -m "fix: adicionar diretório app ao Git"
}

Write-Host "`nPróximo passo:" -ForegroundColor Yellow
Write-Host "git push origin main" -ForegroundColor Cyan

