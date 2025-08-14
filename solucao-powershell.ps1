# Solução Definitiva para o Servidor da Holding Promotora
# Executar como: .\solucao-powershell.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SOLUÇÃO DEFINITIVA" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar diretório
Write-Host "1. 📁 Verificando diretório..." -ForegroundColor Green
if (-not (Test-Path "package.json")) {
    Write-Host "   ❌ ERRO: package.json não encontrado!" -ForegroundColor Red
    Write-Host "   Execute este script no diretório do projeto." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host "   ✅ Diretório correto: $PWD" -ForegroundColor Green
Write-Host ""

# 2. Parar processos existentes
Write-Host "2. 🔄 Parando processos existentes..." -ForegroundColor Green
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
if ($nodeProcesses) {
    Write-Host "   Parando $($nodeProcesses.Count) processo(s) Node.js..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "   ✅ Processos parados" -ForegroundColor Green
} else {
    Write-Host "   ✅ Nenhum processo Node.js ativo" -ForegroundColor Green
}
Write-Host ""

# 3. Liberar porta 3000
Write-Host "3. 🔌 Liberando porta 3000..." -ForegroundColor Green
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "   Porta 3000 em uso. Liberando..." -ForegroundColor Yellow
    foreach ($connection in $portInUse) {
        try {
            Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "   ⚠️  Não foi possível parar processo $($connection.OwningProcess)" -ForegroundColor Yellow
        }
    }
    Start-Sleep -Seconds 2
    Write-Host "   ✅ Porta liberada" -ForegroundColor Green
} else {
    Write-Host "   ✅ Porta 3000 livre" -ForegroundColor Green
}
Write-Host ""

# 4. Verificar dependências
Write-Host "4. 📦 Verificando dependências..." -ForegroundColor Green
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependências..." -ForegroundColor Yellow
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Dependências instaladas" -ForegroundColor Green
        } else {
            Write-Host "   ❌ ERRO: Falha ao instalar dependências!" -ForegroundColor Red
            Read-Host "Pressione Enter para sair"
            exit 1
        }
    } catch {
        Write-Host "   ❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-Host "   ✅ Dependências já instaladas" -ForegroundColor Green
}
Write-Host ""

# 5. Iniciar servidor
Write-Host "5. 🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SERVIDOR INICIANDO" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔑 Login: grupoarmandogomes@gmail.com" -ForegroundColor Cyan
Write-Host "🔐 Senha: @252980Hol" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "❌ ERRO: Falha ao iniciar servidor!" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 SOLUÇÕES:" -ForegroundColor Yellow
    Write-Host "1. Reinicie o computador" -ForegroundColor White
    Write-Host "2. Execute este script novamente" -ForegroundColor White
    Write-Host "3. Verifique se o Node.js está instalado" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione Enter para sair"
}
