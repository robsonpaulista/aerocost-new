# Verificar estrutura do frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificando Estrutura do Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/5] Verificando diretórios essenciais..." -ForegroundColor Yellow

$dirs = @(
    "frontend/app",
    "frontend/components",
    "frontend/lib",
    "frontend/public"
)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        $fileCount = (Get-ChildItem -Path $dir -Recurse -File).Count
        Write-Host "  ✓ $dir existe ($fileCount arquivos)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $dir NÃO existe!" -ForegroundColor Red
    }
}

Write-Host "`n[2/5] Verificando arquivos essenciais..." -ForegroundColor Yellow
$files = @(
    "frontend/app/layout.tsx",
    "frontend/app/page.tsx",
    "frontend/package.json",
    "frontend/next.config.js",
    "frontend/tsconfig.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NÃO existe!" -ForegroundColor Red
    }
}

Write-Host "`n[3/5] Verificando se está sendo rastreado pelo Git..." -ForegroundColor Yellow
$gitFiles = git ls-files | Select-String "^frontend/app/"
if ($gitFiles) {
    Write-Host "  ✓ frontend/app/ está sendo rastreado ($($gitFiles.Count) arquivos)" -ForegroundColor Green
    Write-Host "  Primeiros arquivos:" -ForegroundColor Gray
    $gitFiles | Select-Object -First 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Gray
    }
} else {
    Write-Host "  ❌ frontend/app/ NÃO está sendo rastreado pelo Git!" -ForegroundColor Red
    Write-Host "  Isso é o problema!" -ForegroundColor Red
}

Write-Host "`n[4/5] Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    $packageJson = Get-Content "frontend/package.json" | ConvertFrom-Json
    
    if ($packageJson.scripts.'vercel-build') {
        Write-Host "  ⚠ Script vercel-build encontrado: $($packageJson.scripts.'vercel-build')" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Sem script vercel-build (usará padrão)" -ForegroundColor Green
    }
    
    if ($packageJson.scripts.build) {
        Write-Host "  ✓ Script build: $($packageJson.scripts.build)" -ForegroundColor Green
    }
}

Write-Host "`n[5/5] Status do Git..." -ForegroundColor Yellow
git status --short | Select-Object -First 20

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Diagnóstico:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not $gitFiles) {
    Write-Host "`n❌ PROBLEMA ENCONTRADO:" -ForegroundColor Red
    Write-Host "O diretório frontend/app/ não está sendo rastreado pelo Git!" -ForegroundColor Red
    Write-Host "`nSolução:" -ForegroundColor Yellow
    Write-Host "git add frontend/app/" -ForegroundColor Cyan
    Write-Host "git commit -m 'fix: adicionar diretório app ao Git'" -ForegroundColor Cyan
    Write-Host "git push origin main" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ Estrutura parece correta" -ForegroundColor Green
    Write-Host "Verifique a configuração do Root Directory no Vercel" -ForegroundColor Yellow
}

