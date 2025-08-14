# Script de monitoramento do servidor da Holding Promotora
# Executar como: .\monitor-server.ps1

param(
    [switch]$AutoRestart
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    MONITORAMENTO DO SERVIDOR" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Server {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Start-ServerIfNeeded {
    Write-Host "🔍 Verificando servidor..." -ForegroundColor Yellow
    
    if (Test-Server) {
        Write-Host "✅ Servidor está funcionando em http://localhost:3000" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Servidor não está funcionando!" -ForegroundColor Red
        
        if ($AutoRestart) {
            Write-Host "🔄 Reiniciando servidor automaticamente..." -ForegroundColor Yellow
            
            # Parar processos existentes
            Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            
            # Iniciar servidor
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal
            Start-Sleep -Seconds 10
            
            if (Test-Server) {
                Write-Host "✅ Servidor reiniciado com sucesso!" -ForegroundColor Green
                return $true
            } else {
                Write-Host "❌ Falha ao reiniciar servidor!" -ForegroundColor Red
                return $false
            }
        } else {
            Write-Host "💡 Use -AutoRestart para reiniciar automaticamente" -ForegroundColor Cyan
            return $false
        }
    }
}

# Loop de monitoramento
Write-Host "🚀 Iniciando monitoramento..." -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
    
    Start-ServerIfNeeded | Out-Null
    
    if ($AutoRestart) {
        Start-Sleep -Seconds 30  # Verificar a cada 30 segundos
    } else {
        Start-Sleep -Seconds 10  # Verificar a cada 10 segundos
    }
}
