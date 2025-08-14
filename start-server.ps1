# Script para iniciar o servidor da Holding Promotora
# Executar como: .\start-server.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    HOLDING PROMOTORA - SERVIDOR" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERRO: package.json não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script no diretório do projeto." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se as dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Falha ao instalar dependências!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
}

# Verificar se o porto 3000 está em uso
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Porta 3000 já está em uso!" -ForegroundColor Yellow
    Write-Host "Tentando liberar a porta..." -ForegroundColor Yellow
    
    # Tentar parar processos na porta 3000
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔑 Login: grupoarmandogomes@gmail.com" -ForegroundColor Cyan
Write-Host "🔐 Senha: @252980Hol" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar o servidor
try {
    npm run dev
} catch {
    Write-Host "❌ ERRO: Falha ao iniciar o servidor!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
}
