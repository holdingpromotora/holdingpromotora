@echo off
title HOLDING PROMOTORA - SERVIDOR
color 0A

echo.
echo ========================================
echo    HOLDING PROMOTORA - SERVIDOR
echo ========================================
echo.

:: Mudar para o diretório do script
cd /d "%~dp0"

:: Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado!
    echo Execute este script no diretório do projeto.
    pause
    exit /b 1
)

echo ✅ Diretório correto: %CD%
echo.

:: Parar todos os processos Node.js existentes
echo 🔄 Parando processos existentes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: Verificar se a porta 3000 está livre
echo 🔍 Verificando porta 3000...
netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3000 em uso. Tentando liberar...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

:: Verificar dependências
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ ERRO: Falha ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas!
) else (
    echo ✅ Dependências já instaladas
)

echo.
echo 🚀 Iniciando servidor...
echo.
echo 📱 URL: http://localhost:3000
echo 🔑 Login: grupoarmandogomes@gmail.com
echo 🔐 Senha: @252980Hol
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

:: Iniciar servidor
npm run dev

:: Se chegou aqui, houve erro
echo.
echo ❌ Servidor parou ou ocorreu erro!
echo.
pause
