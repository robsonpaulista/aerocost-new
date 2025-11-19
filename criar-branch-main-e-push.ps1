# Criar branch main e fazer push
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Criar Branch Main e Fazer Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/6] Verificando status do Git..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "  Arquivos para adicionar:" -ForegroundColor Gray
    $status | Select-Object -First 10 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ Nenhuma mudança pendente" -ForegroundColor Gray
}

Write-Host "`n[2/6] Verificando branches..." -ForegroundColor Yellow
$branches = git branch
if ($branches) {
    Write-Host "  Branches encontradas:" -ForegroundColor Gray
    $branches | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ Nenhuma branch encontrada" -ForegroundColor Yellow
}

Write-Host "`n[3/6] Verificando commits..." -ForegroundColor Yellow
$commits = git log --oneline 2>$null
if ($commits) {
    Write-Host "  Total de commits: $($commits.Count)" -ForegroundColor Gray
} else {
    Write-Host "  ⚠ Nenhum commit encontrado" -ForegroundColor Yellow
    Write-Host "  Criando commit inicial..." -ForegroundColor Yellow
    
    # Garantir que há arquivos para commitar
    git add .
    
    $staged = git status --short
    if ($staged) {
        git commit -m "chore: commit inicial - projeto appaeronave"
        Write-Host "  ✓ Commit criado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Nenhum arquivo para commitar!" -ForegroundColor Red
        Write-Host "  Verifique se os arquivos estão no diretório" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`n[4/6] Verificando branch atual..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ([string]::IsNullOrEmpty($currentBranch)) {
    Write-Host "  ⚠ Nenhuma branch ativa" -ForegroundColor Yellow
    Write-Host "  Criando branch main..." -ForegroundColor Yellow
    git checkout -b main 2>$null
    Write-Host "  ✓ Branch main criada" -ForegroundColor Green
} elseif ($currentBranch -ne "main") {
    Write-Host "  Branch atual: $currentBranch" -ForegroundColor Gray
    Write-Host "  Renomeando para main..." -ForegroundColor Yellow
    git branch -m main
    Write-Host "  ✓ Branch renomeada para main" -ForegroundColor Green
} else {
    Write-Host "  ✓ Branch atual: main" -ForegroundColor Green
}

Write-Host "`n[5/6] Verificando remote..." -ForegroundColor Yellow
$remotes = git remote -v
if ($remotes) {
    Write-Host "  Remotes configurados:" -ForegroundColor Gray
    $remotes | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ Nenhum remote configurado" -ForegroundColor Yellow
    Write-Host "  Adicionando remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/robsonpaulista/aerocost-new.git
    Write-Host "  ✓ Remote adicionado" -ForegroundColor Green
}

# Verificar se há múltiplos remotes
$remoteCount = (git remote).Count
if ($remoteCount -gt 1) {
    Write-Host "  ⚠ Múltiplos remotes encontrados" -ForegroundColor Yellow
    Write-Host "  Removendo remotes antigos..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin https://github.com/robsonpaulista/aerocost-new.git
    Write-Host "  ✓ Remote configurado corretamente" -ForegroundColor Green
}

Write-Host "`n[6/6] Fazendo push..." -ForegroundColor Yellow
Write-Host "  git push -u origin main" -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nPush realizado com sucesso!" -ForegroundColor Green
    Write-Host "Repositório: https://github.com/robsonpaulista/aerocost-new" -ForegroundColor Cyan
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "❌ ERRO NO PUSH" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    
    Write-Host "`nVerifique:" -ForegroundColor Yellow
    Write-Host "1. Há commits no repositório? (git log)" -ForegroundColor White
    Write-Host "2. A branch main existe? (git branch)" -ForegroundColor White
    Write-Host "3. O repositório aerocost-new existe no GitHub?" -ForegroundColor White
    Write-Host "4. Você tem permissão para fazer push?" -ForegroundColor White
    
    Write-Host "`nTente novamente:" -ForegroundColor Yellow
    Write-Host "git add ." -ForegroundColor Cyan
    Write-Host "git commit -m 'chore: commit inicial'" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
}

