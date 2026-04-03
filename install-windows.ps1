# ============================================
# Script de Instalação Automatizada - SIACT
# Windows 10/11 - Tesseract OCR + PaddleOCR + Manus Desktop
# ============================================
# Executar como: powershell -ExecutionPolicy Bypass -File install-windows.ps1

param(
    [switch]$Admin
)

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERRO: Este script deve ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para executar como administrador:" -ForegroundColor Yellow
    Write-Host "1. Abra PowerShell como Administrador"
    Write-Host "2. Execute: powershell -ExecutionPolicy Bypass -File install-windows.ps1"
    Read-Host "Pressione ENTER para sair"
    exit 1
}

$ErrorActionPreference = "Continue"

# ============================================
# FASE 1: Verificar Python
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[FASE 1] Verificando Python..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Python nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale Python 3.8+ de https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "IMPORTANTE: Marque 'Add Python to PATH' durante a instalacao" -ForegroundColor Yellow
    Read-Host "Pressione ENTER para sair"
    exit 1
}
Write-Host "OK - $pythonVersion" -ForegroundColor Green

# ============================================
# FASE 2: Instalar Tesseract OCR
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[FASE 2] Verificando Tesseract OCR..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$tesseractVersion = tesseract --version 2>&1 | Select-Object -First 1
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Tesseract nao encontrado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Baixe o instalador de: https://github.com/UB-Mannheim/tesseract/wiki" -ForegroundColor Yellow
    Write-Host "Arquivo: tesseract-ocr-w64-setup-v5.x.x.exe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Abrindo navegador..." -ForegroundColor Yellow
    Start-Process "https://github.com/UB-Mannheim/tesseract/wiki"
    Write-Host ""
    Write-Host "Apos instalar Tesseract, execute este script novamente." -ForegroundColor Yellow
    Read-Host "Pressione ENTER para sair"
    exit 1
}
Write-Host "OK - $tesseractVersion" -ForegroundColor Green

# ============================================
# FASE 3: Instalar PaddleOCR
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[FASE 3] Instalando PaddleOCR..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Isso pode levar 10-15 minutos na primeira execucao..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Atualizando pip..." -ForegroundColor White
python -m pip install --upgrade pip --quiet 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao atualizar pip" -ForegroundColor Red
    Read-Host "Pressione ENTER para sair"
    exit 1
}

Write-Host "Instalando PaddleOCR..." -ForegroundColor White
python -m pip install paddleocr opencv-python pillow numpy --quiet 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Falha ao instalar PaddleOCR" -ForegroundColor Yellow
    Write-Host "Continuando com Tesseract como alternativa..." -ForegroundColor Yellow
} else {
    Write-Host "OK - PaddleOCR instalado" -ForegroundColor Green
}

# ============================================
# FASE 4: Criar Estrutura de Pastas
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[FASE 4] Criando estrutura de pastas..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$folders = @(
    "C:\SIACT",
    "C:\SIACT\PDFs",
    "C:\SIACT\Resultados",
    "C:\SIACT\Logs",
    "C:\SIACT\Cache"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "Criada: $folder" -ForegroundColor Green
    } else {
        Write-Host "Ja existe: $folder" -ForegroundColor Yellow
    }
}

# ============================================
# FASE 5: Verificar Manus Desktop
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[FASE 5] Verificando Manus Desktop..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$manusPath = "$env:APPDATA\Manus\Desktop"
if (Test-Path $manusPath) {
    Write-Host "OK - Manus Desktop encontrado" -ForegroundColor Green
} else {
    Write-Host "AVISO: Manus Desktop nao encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Baixe de: https://manus.im/desktop" -ForegroundColor Yellow
    Write-Host "Arquivo: Manus-Desktop-Setup.exe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Abrindo navegador..." -ForegroundColor Yellow
    Start-Process "https://manus.im/desktop"
    Write-Host ""
    Write-Host "Apos instalar Manus Desktop, execute este script novamente." -ForegroundColor Yellow
    Read-Host "Pressione ENTER para sair"
    exit 1
}

# ============================================
# FASE 6: Testes
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "[FASE 6] Executando testes..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Teste 1: Tesseract"
$tesseractTest = tesseract --version 2>&1 | Select-Object -First 1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Tesseract funcionando" -ForegroundColor Green
} else {
    Write-Host "  [ERRO] Tesseract nao funciona" -ForegroundColor Red
}

Write-Host ""
Write-Host "Teste 2: PaddleOCR"
$paddleTest = python -c "from paddleocr import PaddleOCR; print('OK')" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] PaddleOCR funcionando" -ForegroundColor Green
} else {
    Write-Host "  [AVISO] PaddleOCR nao disponivel - usando Tesseract" -ForegroundColor Yellow
}

# ============================================
# CONCLUSAO
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "INSTALACAO CONCLUIDA COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Coloque os PDFs em C:\SIACT\PDFs\" -ForegroundColor White
Write-Host "  2. Abra Manus Desktop" -ForegroundColor White
Write-Host "  3. Clique em 'My Computer'" -ForegroundColor White
Write-Host "  4. Selecione um PDF e clique 'Process'" -ForegroundColor White
Write-Host "  5. Aguarde o processamento (5-10 minutos)" -ForegroundColor White
Write-Host "  6. Verifique resultados em C:\SIACT\Resultados\" -ForegroundColor White
Write-Host ""
Write-Host "Documentacao:" -ForegroundColor Cyan
Write-Host "  - GUIA_INSTALACAO_WINDOWS_COMPLETO.md" -ForegroundColor White
Write-Host "  - CHECKLIST_INSTALACAO.md" -ForegroundColor White
Write-Host "  - GUIA_USO_MYCOMPUTER.md" -ForegroundColor White
Write-Host ""
Read-Host "Pressione ENTER para fechar"
