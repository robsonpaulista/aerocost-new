# CORRIGIR: Repositório Git inicializado em nível errado
Write-Host "========================================" -ForegroundColor Red
Write-Host "CORRIGIR REPOSITÓRIO GIT ERRADO" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "PROBLEMA: O Git está rastreando TODOS os seus documentos!" -ForegroundColor Yellow
Write-Host "SOLUÇÃO: Remover .git e criar novo APENAS no projeto appaeronave" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Digite 'SIM' para corrigir"
if ($confirm -ne "SIM") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n[1/5] Verificando localização do .git..." -ForegroundColor Cyan
$gitPath = git rev-parse --show-toplevel 2>$null
if ($gitPath) {
    Write-Host "  .git encontrado em: $gitPath" -ForegroundColor Yellow
    
    $currentDir = Get-Location
    Write-Host "  Diretório atual: $currentDir" -ForegroundColor Gray
    
    if ($gitPath -ne $currentDir -and $gitPath.Length -lt $currentDir.Length) {
        Write-Host "  ⚠ PROBLEMA: .git está em nível superior!" -ForegroundColor Red
        Write-Host "  Isso está rastreando TODOS os seus documentos!" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ Nenhum .git encontrado" -ForegroundColor Gray
}

Write-Host "`n[2/5] Navegando para o diretório correto..." -ForegroundColor Cyan
# Garantir que estamos no diretório appaeronave
if (-not (Test-Path "frontend")) {
    Write-Host "  ⚠ Não encontrado diretório 'frontend'" -ForegroundColor Yellow
    Write-Host "  Procurando diretório appaeronave..." -ForegroundColor Yellow
    
    # Tentar encontrar o diretório correto
    if (Test-Path "appaeronave") {
        Set-Location "appaeronave"
        Write-Host "  ✓ Entrando em appaeronave" -ForegroundColor Green
    } elseif (Test-Path "OneDrive\Documentos\Coorporativo\appaeronave") {
        Set-Location "OneDrive\Documentos\Coorporativo\appaeronave"
        Write-Host "  ✓ Entrando em OneDrive\Documentos\Coorporativo\appaeronave" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Não encontrado diretório do projeto!" -ForegroundColor Red
        Write-Host "  Execute este script dentro do diretório appaeronave" -ForegroundColor Yellow
        exit 1
    }
}

$projectRoot = Get-Location
Write-Host "  Diretório do projeto: $projectRoot" -ForegroundColor Green

Write-Host "`n[3/5] Removendo .git se existir em nível errado..." -ForegroundColor Cyan
# Verificar se há .git no diretório atual
if (Test-Path ".git") {
    Write-Host "  .git encontrado no diretório do projeto (correto)" -ForegroundColor Green
} else {
    # Procurar .git em diretórios superiores
    $parent = Split-Path $projectRoot -Parent
    while ($parent -and $parent -ne (Split-Path $parent -Parent)) {
        if (Test-Path (Join-Path $parent ".git")) {
            Write-Host "  ⚠ .git encontrado em: $parent" -ForegroundColor Red
            Write-Host "  Isso está ERRADO! Removendo..." -ForegroundColor Yellow
            
            # Perguntar antes de remover
            $removeConfirm = Read-Host "  Remover .git de $parent? (SIM/NÃO)"
            if ($removeConfirm -eq "SIM") {
                Remove-Item -Path (Join-Path $parent ".git") -Recurse -Force
                Write-Host "  ✓ .git removido" -ForegroundColor Green
            }
            break
        }
        $parent = Split-Path $parent -Parent
    }
}

Write-Host "`n[4/5] Inicializando novo repositório Git APENAS no projeto..." -ForegroundColor Cyan
# Remover .git local se existir
if (Test-Path ".git") {
    Write-Host "  Removendo .git local..." -ForegroundColor Yellow
    Remove-Item -Path ".git" -Recurse -Force
}

# Inicializar novo repositório
git init
Write-Host "  ✓ Novo repositório Git inicializado" -ForegroundColor Green

Write-Host "`n[5/5] Configurando .gitignore..." -ForegroundColor Cyan
$gitignore = @"
# Dependencies
node_modules/
**/node_modules/

# Environment
.env
.env.local
.env*.local

# Build outputs
.next/
dist/
build/
out/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Vercel
.vercel

# Outros projetos (NÃO rastrear)
OneDrive/
JArchive/
55dynamics/
Cursor/
"@
Set-Content -Path ".gitignore" -Value $gitignore -Encoding UTF8
Write-Host "  ✓ .gitignore criado" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "CORREÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. git remote add origin https://github.com/robsonpaulista/aerocost-new.git" -ForegroundColor Cyan
Write-Host "2. git add ." -ForegroundColor Cyan
Write-Host "3. git commit -m 'chore: repositório Git corrigido - apenas projeto appaeronave'" -ForegroundColor Cyan
Write-Host "4. git push origin main --force" -ForegroundColor Cyan

Write-Host "`nVerificar que apenas arquivos do projeto estão sendo rastreados:" -ForegroundColor Yellow
Write-Host "git status" -ForegroundColor Cyan

