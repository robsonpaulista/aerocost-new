# Script PowerShell para definir role de admin para um usuario
# Execute: .\definir-admin-usuario.ps1

$API_URL = "https://aerocost.gmconsultoriathe.com.br/api/users/update-role"
$EMAIL = "robsonpaulista@hotmail.com"

$body = @{
    email = $EMAIL
    role = "admin"
    secret = "UPDATE_ROLE_2024"
} | ConvertTo-Json

Write-Host "Definindo role admin para: $EMAIL" -ForegroundColor Yellow
Write-Host "URL: $API_URL" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "Role definido com sucesso!" -ForegroundColor Green
    Write-Host "Mensagem: $($response.message)" -ForegroundColor Green
    Write-Host "Usuario: $($response.user.email)" -ForegroundColor Green
    Write-Host "Role: $($response.user.role)" -ForegroundColor Green
} catch {
    Write-Host "Erro ao definir role:" -ForegroundColor Red
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
