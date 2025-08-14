Write-Host "Testando servidor..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (Test-Path "package.json") {
    Write-Host "✅ Package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Package.json não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não funciona" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM não funciona" -ForegroundColor Red
    exit 1
}

# Verificar dependências
if (Test-Path "node_modules") {
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Dependências não instaladas" -ForegroundColor Red
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Tentar iniciar servidor
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
npm run dev
