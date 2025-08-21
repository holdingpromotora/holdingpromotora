# Script para obter o hash do commit atual
# Uso: .\get-commit-hash.ps1

try {
    $hash = git rev-parse --short HEAD
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Hash do commit atual: $hash" -ForegroundColor Green
        Write-Host "Copie este hash para usar no template de commit" -ForegroundColor Yellow
        # Copiar para clipboard automaticamente
        Set-Clipboard -Value $hash
        Write-Host "Hash copiado para clipboard!" -ForegroundColor Cyan
    } else {
        Write-Host "Erro ao obter hash do commit" -ForegroundColor Red
    }
} catch {
    Write-Host "Erro: $_" -ForegroundColor Red
    Write-Host "Certifique-se de estar em um repositório Git válido" -ForegroundColor Yellow
}
