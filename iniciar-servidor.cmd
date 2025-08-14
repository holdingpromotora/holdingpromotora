@echo off
echo ========================================
echo    HOLDING PROMOTORA - SERVIDOR
echo ========================================
echo.
echo Iniciando servidor...
echo.

cd /d "%~dp0"

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

echo.
echo Iniciando servidor na porta 3000...
echo URL: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar
echo.

npm run dev

pause
