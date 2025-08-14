@echo off
echo ========================================
echo    HOLDING PROMOTORA - SERVIDOR
echo ========================================
echo.
echo Iniciando servidor de desenvolvimento...
echo.
echo URL: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

pause
