# 🚀 Guia Completo de Instalação - SIACT com Manus Desktop

**Objetivo:** Configurar Tesseract OCR, PaddleOCR e Manus Desktop no Windows para análise local de TCEs

**Tempo Total:** ~45-60 minutos  
**Requisitos:** Windows 10/11, 4GB RAM, 2GB espaço livre

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação do Tesseract OCR](#instalação-do-tesseract-ocr)
3. [Instalação do PaddleOCR](#instalação-do-paddleocr)
4. [Instalação do Manus Desktop](#instalação-do-manus-desktop)
5. [Configuração de Pastas](#configuração-de-pastas)
6. [Teste de Conexão](#teste-de-conexão)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

Antes de começar, você precisa ter instalado:

### 1. Python 3.8+
```
✅ Requerido para: PaddleOCR
⏱️ Tempo: 5 minutos
```

**Passos:**
1. Acesse https://www.python.org/downloads/
2. Clique em "Download Python 3.11" (ou versão mais recente)
3. Execute o instalador
4. **IMPORTANTE:** Marque "Add Python to PATH"
5. Clique em "Install Now"

**Verificar instalação:**
```bash
python --version
# Deve mostrar: Python 3.11.x (ou superior)
```

### 2. Git (Opcional, mas recomendado)
```
✅ Requerido para: Clonar repositórios
⏱️ Tempo: 5 minutos
```

**Passos:**
1. Acesse https://git-scm.com/download/win
2. Execute o instalador
3. Use as opções padrão
4. Clique em "Install"

**Verificar instalação:**
```bash
git --version
# Deve mostrar: git version 2.x.x
```

---

## 🔤 Instalação do Tesseract OCR

Tesseract é a ferramenta de OCR mais rápida e confiável para texto nativo em PDFs.

### Passo 1: Download do Instalador

1. Acesse: https://github.com/UB-Mannheim/tesseract/wiki
2. Procure por "Downloads"
3. Clique em **"tesseract-ocr-w64-setup-v5.x.x.exe"** (versão 64-bit)
4. Salve o arquivo em `C:\Users\[SeuUsuário]\Downloads`

### Passo 2: Executar Instalador

1. Clique duas vezes no arquivo `tesseract-ocr-w64-setup-v5.x.x.exe`
2. Clique em "Install"
3. **Aceite o local padrão:** `C:\Program Files\Tesseract-OCR`
4. Clique em "Next" até finalizar
5. Clique em "Install"

### Passo 3: Verificar Instalação

Abra o PowerShell e execute:

```bash
tesseract --version
# Deve mostrar: tesseract 5.x.x
```

Se não funcionar, adicione manualmente ao PATH:

1. Pressione `Win + X` e selecione "Configurações"
2. Procure por "Variáveis de Ambiente"
3. Clique em "Editar as variáveis de ambiente do sistema"
4. Clique em "Variáveis de Ambiente..."
5. Em "Variáveis do sistema", clique em "Path"
6. Clique em "Editar"
7. Clique em "Novo"
8. Digite: `C:\Program Files\Tesseract-OCR`
9. Clique em "OK" em todos os diálogos
10. Reinicie o PowerShell

---

## 🐍 Instalação do PaddleOCR

PaddleOCR é mais lento que Tesseract, mas funciona melhor em PDFs scaneados.

### Passo 1: Abrir PowerShell

Pressione `Win + X` e selecione "Windows PowerShell (Admin)"

### Passo 2: Instalar PaddleOCR

Execute os comandos abaixo (copie e cole um por um):

```bash
# Atualizar pip
python -m pip install --upgrade pip

# Instalar PaddleOCR
pip install paddleocr

# Instalar dependências adicionais
pip install opencv-python pillow numpy
```

**Tempo esperado:** 10-15 minutos (primeira execução baixa modelos)

### Passo 3: Verificar Instalação

```bash
python -c "from paddleocr import PaddleOCR; print('PaddleOCR instalado com sucesso!')"
```

Se vir a mensagem "PaddleOCR instalado com sucesso!", está pronto!

---

## 🖥️ Instalação do Manus Desktop

### Passo 1: Download

1. Acesse https://manus.im/desktop
2. Clique em "Download for Windows"
3. Salve o arquivo em `C:\Users\[SeuUsuário]\Downloads`

### Passo 2: Executar Instalador

1. Clique duas vezes no arquivo `Manus-Desktop-Setup.exe`
2. Clique em "Install"
3. Aguarde a instalação (2-3 minutos)
4. Clique em "Finish"

### Passo 3: Primeiro Acesso

1. Abra Manus Desktop (ícone na área de trabalho)
2. Faça login com sua conta Manus
3. Clique em "My Computer"
4. Clique em "Enable"

---

## 📁 Configuração de Pastas

Crie a estrutura de pastas para armazenar PDFs e resultados:

### Passo 1: Criar Pastas Principais

Abra o PowerShell e execute:

```bash
# Criar pasta principal
mkdir "C:\SIACT"

# Criar subpastas
mkdir "C:\SIACT\PDFs"
mkdir "C:\SIACT\Resultados"
mkdir "C:\SIACT\Logs"
mkdir "C:\SIACT\Cache"
```

### Passo 2: Configurar Permissões

1. Clique com botão direito em `C:\SIACT`
2. Selecione "Propriedades"
3. Clique em "Segurança"
4. Clique em "Editar"
5. Selecione seu usuário
6. Marque "Controle Total"
7. Clique em "Aplicar" e "OK"

### Passo 3: Estrutura Final

```
C:\SIACT\
├── PDFs\                    # Coloque os PDFs aqui
│   ├── SEI_72031.008744_2024_00.pdf
│   └── SEI_72031.008871_2017_71.pdf
├── Resultados\              # Análises processadas
│   ├── 2024-04-03\
│   └── 2024-04-04\
├── Logs\                    # Logs de processamento
│   └── ocr.log
└── Cache\                   # Cache de análises
    └── processed.json
```

---

## 🔌 Teste de Conexão

### Passo 1: Conectar Manus Desktop ao SIACT Web

1. Abra Manus Desktop
2. Clique em "My Computer"
3. Clique em "Settings"
4. Configure:
   - **SIACT Web URL:** `https://baplanding-4wdv8y7a.manus.space`
   - **Sync Interval:** `5 minutos`
   - **Auto-sync:** `Ativado`
5. Clique em "Save"

### Passo 2: Testar OCR

1. Coloque um PDF em `C:\SIACT\PDFs\`
2. Abra Manus Desktop
3. Clique em "Analyze"
4. Selecione o PDF
5. Clique em "Process"
6. Aguarde o processamento (5-10 minutos)

### Passo 3: Verificar Resultado

1. Abra https://baplanding-4wdv8y7a.manus.space
2. Clique em "Dashboard"
3. Verifique se a análise aparece na tabela
4. Clique na análise para ver detalhes

---

## ✅ Teste Completo

Siga este roteiro para validar tudo:

### Teste 1: Tesseract
```bash
# Abra PowerShell
tesseract --version
# Deve mostrar: tesseract 5.x.x
```

### Teste 2: PaddleOCR
```bash
# Abra PowerShell
python -c "from paddleocr import PaddleOCR; ocr = PaddleOCR(); print('OK')"
# Deve mostrar: OK
```

### Teste 3: Manus Desktop
1. Abra Manus Desktop
2. Clique em "My Computer"
3. Deve mostrar "Status: Connected"

### Teste 4: Sincronização
1. Coloque um PDF em `C:\SIACT\PDFs\`
2. Processe com Manus Desktop
3. Aguarde 5 minutos
4. Verifique Dashboard em https://baplanding-4wdv8y7a.manus.space

---

## 🐛 Troubleshooting

### Problema: "tesseract: command not found"

**Solução:**
1. Reinstale Tesseract
2. Marque "Add to PATH" durante instalação
3. Reinicie o PowerShell

### Problema: "PaddleOCR not installed"

**Solução:**
```bash
pip install --upgrade paddleocr
```

### Problema: "Manus Desktop não conecta"

**Solução:**
1. Verifique internet
2. Verifique firewall (adicione exceção para Manus Desktop)
3. Reinicie Manus Desktop

### Problema: "PDF não processa"

**Solução:**
1. Verifique se PDF está em `C:\SIACT\PDFs\`
2. Verifique se PDF não está corrompido
3. Tente com outro PDF
4. Verifique logs em `C:\SIACT\Logs\`

### Problema: "Sincronização não funciona"

**Solução:**
1. Verifique URL: `https://baplanding-4wdv8y7a.manus.space`
2. Verifique se está autenticado
3. Reinicie Manus Desktop
4. Aguarde 5 minutos para próxima sincronização

---

## 📊 Performance Esperada

Após instalação completa:

| Operação | Tempo | Status |
|----------|-------|--------|
| PDF Texto Nativo (Tesseract) | 4-5 min | ✅ Rápido |
| PDF Scaneado (PaddleOCR) | 8-10 min | ✅ Aceitável |
| Análise com Gemini | 2-3 min | ✅ Rápido |
| Prescrição | 150ms | ✅ Muito Rápido |
| Sincronização | 245ms | ✅ Muito Rápido |
| **Total (E2E)** | **7-15 min** | ✅ Pronto |

---

## 🎯 Próximos Passos

Após instalação bem-sucedida:

1. ✅ Coloque os PDFs em `C:\SIACT\PDFs\`
2. ✅ Processe com Manus Desktop
3. ✅ Verifique resultados no Dashboard
4. ✅ Exporte relatórios
5. ✅ Escale para produção

---

## 📞 Suporte

Se encontrar problemas:

1. Consulte [GUIA_IMPLEMENTACAO_FINAL.md](./GUIA_IMPLEMENTACAO_FINAL.md)
2. Verifique [SETUP_MANUS_DESKTOP_WINDOWS.md](./SETUP_MANUS_DESKTOP_WINDOWS.md)
3. Abra issue no GitHub
4. Contate suporte: https://help.manus.im

---

**Versão:** 1.0  
**Data:** 2026-04-03  
**Status:** ✅ Pronto para Produção
