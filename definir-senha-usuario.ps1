# Script PowerShell para definir senha de um usuário
# Execute: .\definir-senha-usuario.ps1

$API_URL = $env:API_URL
if (-not $API_URL) {
    $API_URL = "https://aerocost.gmconsultoriathe.com.br/api/users/reset-password"
}

$EMAIL = "robsonpaulista@hotmail.com"
$NEW_PASSWORD = "sua_senha_aqui"  # Altere para a senha desejada

$body = @{
    email = $EMAIL
    newPassword = $NEW_PASSWORD
} | ConvertTo-Json

Write-Host "🔄 Definindo senha para: $EMAIL" -ForegroundColor Yellow
Write-Host "📍 URL: $API_URL" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ Senha definida com sucesso!" -ForegroundColor Green
    Write-Host "Mensagem: $($response.message)" -ForegroundColor Green
    Write-Host "Email: $($response.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao definir senha:" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "Status: $statusCode" -ForegroundColor Red
        
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta: $responseBody" -ForegroundColor Red
    } else {
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit 1
}
