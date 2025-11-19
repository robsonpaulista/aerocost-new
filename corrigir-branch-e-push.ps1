# Corrigir branch e fazer push
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Corrigindo Branch e Fazendo Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/6] Verificando branches locais..." -ForegroundColor Yellow
$branches = git branch
Write-Host $branches -ForegroundColor Gray

$currentBranch = git branch --show-current
if ([string]::IsNullOrEmpty($currentBranch)) {
    Write-Host "  ⚠ Nenhuma branch encontrada" -ForegroundColor Yellow
    Write-Host "  Criando branch main..." -ForegroundColor Yellow
    
    # Verificar se há commits
    $hasCommits = git log --oneline 2>$null
    if (-not $hasCommits) {
        Write-Host "  ⚠ Nenhum commit encontrado!" -ForegroundColor Red
        Write-Host "  Criando commit inicial..." -ForegroundColor Yellow
        
        # Garantir que há arquivos para commitar
        git add .
        $staged = git status --short
        if ($staged) {
            git commit -m "chore: commit inicial - migração para Next.js API Routes"
            Write-Host "  ✓ Commit criado" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Nenhum arquivo para commitar!" -ForegroundColor Red
            Write-Host "  Verifique se os arquivos estão no diretório" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Criar branch main
    git checkout -b main 2>$null
    Write-Host "  ✓ Branch main criada" -ForegroundColor Green
} else {
    Write-Host "  Branch atual: $currentBranch" -ForegroundColor Green
    
    # Se não for main, renomear ou criar main
    if ($currentBranch -ne "main") {
        Write-Host "`n[2/6] Renomeando branch para main..." -ForegroundColor Yellow
        git branch -m main 2>$null
        Write-Host "  ✓ Branch renomeada para main" -ForegroundColor Green
    }
}

Write-Host "`n[3/6] Verificando remotes..." -ForegroundColor Yellow
$remotes = git remote -v
Write-Host $remotes -ForegroundColor Gray

# Remover todos os remotes e adicionar apenas o novo
Write-Host "`n[4/6] Configurando remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/robsonpaulista/aerocost-new.git
Write-Host "  ✓ Remote configurado" -ForegroundColor Green

Write-Host "`n[5/6] Verificando commits..." -ForegroundColor Yellow
$commits = git log --oneline
if ($commits) {
    Write-Host "  Total de commits: $($commits.Count)" -ForegroundColor Gray
    Write-Host "  Último commit:" -ForegroundColor Gray
    Write-Host "  $($commits[0])" -ForegroundColor Gray
} else {
    Write-Host "  ⚠ Nenhum commit encontrado!" -ForegroundColor Red
    Write-Host "  Criando commit..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: commit inicial - migração para Next.js API Routes"
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
    Write-Host "1. O repositório aerocost-new existe no GitHub?" -ForegroundColor White
    Write-Host "2. Você tem permissão para fazer push?" -ForegroundColor White
    Write-Host "3. Há commits no repositório local?" -ForegroundColor White
}

