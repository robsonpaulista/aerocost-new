# Remover todos os arquivos de configuração do Vercel
Write-Host "Removendo arquivos de configuração antigos do Vercel..." -ForegroundColor Cyan

$arquivos = @(
    "vercel.json",
    "vercel-backend.json",
    "frontend/vercel.json"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        Remove-Item $arquivo -Force
        Write-Host "✓ Removido: $arquivo" -ForegroundColor Green
    } else {
        Write-Host "ℹ Não encontrado: $arquivo" -ForegroundColor Gray
    }
}

Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'chore: remover configurações antigas do Vercel'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
Write-Host "4. No Vercel Dashboard:" -ForegroundColor White
Write-Host "   - Root Directory: frontend" -ForegroundColor Cyan
Write-Host "   - Framework Preset: Next.js" -ForegroundColor Cyan
Write-Host "   - Clique em 'Use Project Settings' quando aparecer o aviso" -ForegroundColor Cyan

