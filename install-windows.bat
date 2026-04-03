@echo off
REM ============================================
REM Script de Instalação Automatizada - SIACT
REM Windows 10/11 - Tesseract OCR + PaddleOCR + Manus Desktop
REM ============================================

setlocal enabledelayedexpansion
color 0A
title SIACT - Instalacao Automatizada

echo.
echo ============================================
echo SIACT - Instalacao Automatizada
echo Windows 10/11
echo ============================================
echo.

REM Verificar se está rodando como administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Este script deve ser executado como Administrador!
    echo.
    echo Clique com botao direito no arquivo e selecione "Executar como administrador"
    pause
    exit /b 1
)

REM ============================================
REM FASE 1: Verificar Python
REM ============================================
echo.
echo [FASE 1] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado!
    echo.
    echo Por favor, instale Python 3.8+ de https://www.python.org/downloads/
    echo IMPORTANTE: Marque "Add Python to PATH" durante a instalacao
    pause
    exit /b 1
)
python --version
echo OK - Python encontrado

REM ============================================
REM FASE 2: Instalar Tesseract OCR
REM ============================================
echo.
echo [FASE 2] Verificando Tesseract OCR...
tesseract --version >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: Tesseract nao encontrado!
    echo.
    echo Baixe o instalador de: https://github.com/UB-Mannheim/tesseract/wiki
    echo Arquivo: tesseract-ocr-w64-setup-v5.x.x.exe
    echo.
    echo Pressione qualquer tecla para abrir o navegador...
    pause
    start https://github.com/UB-Mannheim/tesseract/wiki
    echo.
    echo Apos instalar Tesseract, execute este script novamente.
    pause
    exit /b 1
)
tesseract --version | findstr /R "tesseract"
echo OK - Tesseract encontrado

REM ============================================
REM FASE 3: Instalar PaddleOCR
REM ============================================
echo.
echo [FASE 3] Instalando PaddleOCR...
echo Isso pode levar 10-15 minutos na primeira execucao...
echo.
python -m pip install --upgrade pip --quiet
if %errorlevel% neq 0 (
    echo ERRO: Falha ao atualizar pip
    pause
    exit /b 1
)
python -m pip install paddleocr opencv-python pillow numpy --quiet
if %errorlevel% neq 0 (
    echo AVISO: Falha ao instalar PaddleOCR
    echo Continuando com Tesseract como alternativa...
) else (
    echo OK - PaddleOCR instalado
)

REM ============================================
REM FASE 4: Criar Estrutura de Pastas
REM ============================================
echo.
echo [FASE 4] Criando estrutura de pastas...
if not exist "C:\SIACT" mkdir C:\SIACT
if not exist "C:\SIACT\PDFs" mkdir C:\SIACT\PDFs
if not exist "C:\SIACT\Resultados" mkdir C:\SIACT\Resultados
if not exist "C:\SIACT\Logs" mkdir C:\SIACT\Logs
if not exist "C:\SIACT\Cache" mkdir C:\SIACT\Cache
echo OK - Pastas criadas em C:\SIACT\

REM ============================================
REM FASE 5: Verificar Manus Desktop
REM ============================================
echo.
echo [FASE 5] Verificando Manus Desktop...
if exist "%APPDATA%\Manus\Desktop" (
    echo OK - Manus Desktop encontrado
) else (
    echo AVISO: Manus Desktop nao encontrado
    echo.
    echo Baixe de: https://manus.im/desktop
    echo Arquivo: Manus-Desktop-Setup.exe
    echo.
    echo Pressione qualquer tecla para abrir o navegador...
    pause
    start https://manus.im/desktop
    echo.
    echo Apos instalar Manus Desktop, execute este script novamente.
    pause
    exit /b 1
)

REM ============================================
REM FASE 6: Testes
REM ============================================
echo.
echo [FASE 6] Executando testes...
echo.
echo Teste 1: Tesseract
tesseract --version | findstr /R "tesseract" >nul
if %errorlevel% equ 0 (
    echo   [OK] Tesseract funcionando
) else (
    echo   [ERRO] Tesseract nao funciona
)

echo.
echo Teste 2: PaddleOCR
python -c "from paddleocr import PaddleOCR; print('  [OK] PaddleOCR funcionando')" 2>nul
if %errorlevel% neq 0 (
    echo   [AVISO] PaddleOCR nao disponivel - usando Tesseract
)

REM ============================================
REM CONCLUSAO
REM ============================================
echo.
echo ============================================
echo INSTALACAO CONCLUIDA COM SUCESSO!
echo ============================================
echo.
echo Proximos passos:
echo   1. Coloque os PDFs em C:\SIACT\PDFs\
echo   2. Abra Manus Desktop
echo   3. Clique em "My Computer"
echo   4. Selecione um PDF e clique "Process"
echo   5. Aguarde o processamento (5-10 minutos)
echo   6. Verifique resultados em C:\SIACT\Resultados\
echo.
echo Documentacao:
echo   - GUIA_INSTALACAO_WINDOWS_COMPLETO.md
echo   - CHECKLIST_INSTALACAO.md
echo   - GUIA_USO_MYCOMPUTER.md
echo.
pause
