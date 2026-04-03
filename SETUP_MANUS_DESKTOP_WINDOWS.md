# 🖥️ GUIA DE SETUP: Manus Desktop "My Computer" para Windows

**Objetivo:** Configurar Manus Desktop para processar PDFs TCE/BAP localmente sem upload  
**Tempo Estimado:** 30-45 minutos  
**Sistema Operacional:** Windows 10/11  
**Nível:** Iniciante

---

## 📋 CHECKLIST PRÉ-INSTALAÇÃO

Antes de começar, verifique se você tem:

- [ ] Windows 10 (Build 19041+) ou Windows 11
- [ ] Mínimo 8GB RAM (16GB recomendado)
- [ ] 10GB de espaço livre em disco
- [ ] Conexão de internet (para download inicial)
- [ ] Conta Manus ativa
- [ ] Privilégios de administrador no computador

---

## 🚀 PASSO 1: DOWNLOAD E INSTALAÇÃO DO MANUS DESKTOP

### 1.1 Download
1. Acesse https://manus.im/desktop
2. Clique em **"Download for Windows"**
3. Aguarde o download do instalador (arquivo `.exe`)

### 1.2 Instalação
1. Abra o arquivo `Manus-Setup-*.exe`
2. Clique em **"Install"**
3. Aguarde a instalação (2-3 minutos)
4. Clique em **"Launch"** ao final

### 1.3 Login
1. Abra o Manus Desktop
2. Clique em **"Sign In"**
3. Faça login com sua conta Manus
4. Autorize o acesso ao computador quando solicitado

**Status:** ✅ Manus Desktop instalado e logado

---

## 📁 PASSO 2: CONFIGURAR PASTA LOCAL PARA TCE/BAP

### 2.1 Criar Estrutura de Pastas

Abra o **Explorador de Arquivos** e crie a seguinte estrutura:

```
C:\Users\[SeuUsuário]\SIACT_Local\
├── TCE_PDFs\
│   ├── Entrada\          (PDFs para processar)
│   ├── Processados\      (PDFs já analisados)
│   └── Relatórios\       (Relatórios gerados)
├── Análises\
│   ├── JSON\             (Resultados estruturados)
│   ├── CSV\              (Dados tabulares)
│   └── PDF\              (Relatórios em PDF)
└── Backup\               (Backup automático)
```

### 2.2 Criar Pastas no Windows

```powershell
# Abra PowerShell como Administrador e execute:

$basePath = "C:\Users\$env:USERNAME\SIACT_Local"
mkdir "$basePath\TCE_PDFs\Entrada"
mkdir "$basePath\TCE_PDFs\Processados"
mkdir "$basePath\TCE_PDFs\Relatórios"
mkdir "$basePath\Análises\JSON"
mkdir "$basePath\Análises\CSV"
mkdir "$basePath\Análises\PDF"
mkdir "$basePath\Backup"

Write-Host "✅ Estrutura de pastas criada em: $basePath"
```

**Status:** ✅ Pastas criadas

---

## 🔐 PASSO 3: AUTORIZAR PASTAS NO MANUS DESKTOP

### 3.1 Abrir My Computer
1. Abra o **Manus Desktop**
2. No menu lateral, clique em **"My Computer"**
3. Clique em **"Add Folder"**

### 3.2 Autorizar Pasta Principal
1. Navegue até `C:\Users\[SeuUsuário]\SIACT_Local\`
2. Selecione a pasta **SIACT_Local**
3. Clique em **"Authorize"**
4. Escolha permissões:
   - ✅ **Read** (ler arquivos)
   - ✅ **Write** (escrever/modificar)
   - ✅ **Execute** (rodar comandos)
5. Modo de aprovação: **"Always Allow"** (para tarefas confiáveis)

### 3.3 Verificar Autorização
- Você deve ver a pasta listada em "Authorized Folders"
- Status deve mostrar **"Connected"** (verde)

**Status:** ✅ Pastas autorizadas

---

## 💻 PASSO 4: INSTALAR FERRAMENTAS LOCAIS NECESSÁRIAS

### 4.1 Instalar Node.js (para Tesseract.js)

```powershell
# Opção 1: Usando Chocolatey (recomendado)
choco install nodejs -y

# Opção 2: Download manual
# Acesse https://nodejs.org/ e baixe LTS version
```

### 4.2 Instalar Python (para PaddleOCR)

```powershell
# Opção 1: Usando Chocolatey
choco install python -y

# Opção 2: Download manual
# Acesse https://www.python.org/downloads/
# Certifique-se de marcar "Add Python to PATH"
```

### 4.3 Instalar Dependências Python

```powershell
# Abra PowerShell e execute:
pip install paddleocr pillow pdf2image opencv-python

# Verificar instalação
python -c "import paddleocr; print('✅ PaddleOCR instalado')"
```

### 4.4 Instalar Tesseract OCR

```powershell
# Opção 1: Usando Chocolatey
choco install tesseract -y

# Opção 2: Download manual
# Acesse: https://github.com/UB-Mannheim/tesseract/wiki
# Baixe: tesseract-ocr-w64-setup-v5.x.exe
# Execute o instalador
```

### 4.5 Verificar Instalações

```powershell
# Verificar Node.js
node --version
npm --version

# Verificar Python
python --version
pip --version

# Verificar Tesseract
tesseract --version
```

**Status:** ✅ Todas as ferramentas instaladas

---

## 🤖 PASSO 5: CONFIGURAR GEMINI DESKTOP (Opcional - Futuro)

### 5.1 Solicitar Acesso Beta
1. Acesse https://gemini.google.com/desktop
2. Clique em **"Join Waitlist"**
3. Aguarde convite (pode levar 1-2 semanas)

### 5.2 Quando Receber Acesso
1. Faça download do Gemini Desktop
2. Instale seguindo as instruções
3. Configure API key local
4. Teste conexão com SIACT

**Status:** ⏳ Aguardando acesso beta

---

## 📝 PASSO 6: CRIAR SCRIPT DE AUTOMAÇÃO

### 6.1 Criar Script de Monitoramento

Crie arquivo `C:\Users\[SeuUsuário]\SIACT_Local\monitor.ps1`:

```powershell
# Monitor de PDFs para processamento automático

param(
    [string]$InputFolder = "C:\Users\$env:USERNAME\SIACT_Local\TCE_PDFs\Entrada",
    [string]$OutputFolder = "C:\Users\$env:USERNAME\SIACT_Local\Análises\JSON",
    [int]$CheckIntervalSeconds = 60
)

Write-Host "🔍 Iniciando monitor de PDFs..."
Write-Host "Pasta de entrada: $InputFolder"
Write-Host "Pasta de saída: $OutputFolder"

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $InputFolder
$watcher.Filter = "*.pdf"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = Split-Path $path -Leaf
    
    Write-Host "📄 Novo PDF detectado: $name"
    Write-Host "⏳ Aguardando 5 segundos para garantir que o arquivo foi completamente copiado..."
    Start-Sleep -Seconds 5
    
    # Aqui será chamado o processamento
    Write-Host "🔄 Processando: $name"
    
    # TODO: Chamar OCR + Análise + Gemini
}

Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null

Write-Host "✅ Monitor ativo. Pressione Ctrl+C para parar."
while ($true) { Start-Sleep -Seconds 1 }
```

### 6.2 Executar Script Automaticamente

1. Abra **Agendador de Tarefas** do Windows
2. Clique em **"Criar Tarefa Básica"**
3. Nome: `SIACT_Monitor_PDFs`
4. Gatilho: **"Ao iniciar o computador"**
5. Ação: **"Iniciar um programa"**
   - Programa: `powershell.exe`
   - Argumentos: `-ExecutionPolicy Bypass -File "C:\Users\[SeuUsuário]\SIACT_Local\monitor.ps1"`
6. Clique em **"Criar"**

**Status:** ✅ Script de monitoramento configurado

---

## 🧪 PASSO 7: TESTE INICIAL

### 7.1 Teste Simples de OCR

```powershell
# Criar arquivo de teste
$testPDF = "C:\Users\$env:USERNAME\SIACT_Local\TCE_PDFs\Entrada\test.pdf"

# Copiar um PDF real para teste
Copy-Item "C:\Users\$env:USERNAME\Downloads\SEI_72031.008744_2024_00.pdf" $testPDF

Write-Host "📄 PDF de teste copiado para: $testPDF"
Write-Host "⏳ Aguarde o processamento automático..."
```

### 7.2 Verificar Resultados

```powershell
# Verificar se análise foi gerada
$outputFolder = "C:\Users\$env:USERNAME\SIACT_Local\Análises\JSON"
Get-ChildItem $outputFolder -Filter "*.json" | Select-Object Name, CreationTime
```

**Status:** ✅ Teste inicial concluído

---

## 🔗 PASSO 8: CONECTAR COM SIACT WEB APP

### 8.1 Configurar Sincronização

No arquivo `C:\Users\[SeuUsuário]\SIACT_Local\config.json`:

```json
{
  "manus_desktop": {
    "enabled": true,
    "local_folder": "C:\\Users\\[SeuUsuário]\\SIACT_Local",
    "watch_interval_ms": 60000
  },
  "siact_web": {
    "api_url": "https://baplanding-4wdv8y7a.manus.space/api/trpc",
    "sync_enabled": true,
    "sync_interval_ms": 300000,
    "auto_upload_results": true
  },
  "ocr": {
    "method": "tesseract+paddle",
    "confidence_threshold": 0.8,
    "language": "pt-BR"
  },
  "gemini": {
    "enabled": false,
    "api_key": "YOUR_GEMINI_API_KEY",
    "model": "gemini-2.0-flash-local"
  }
}
```

### 8.2 Testar Sincronização

```powershell
# Verificar conexão com SIACT Web
$testPayload = @{
    processNumber = "TCE-2024-00001"
    status = "ADMISSIBLE"
    daysRemaining = 652
} | ConvertTo-Json

# Enviar para SIACT Web App
Invoke-WebRequest -Uri "https://baplanding-4wdv8y7a.manus.space/api/trpc/analysis.create" `
  -Method POST `
  -Body $testPayload `
  -ContentType "application/json"

Write-Host "✅ Sincronização testada"
```

**Status:** ✅ Sincronização configurada

---

## ✅ CHECKLIST FINAL DE SETUP

- [ ] Manus Desktop instalado e logado
- [ ] Pastas locais criadas (`C:\Users\...\SIACT_Local\`)
- [ ] Pastas autorizadas no Manus Desktop
- [ ] Node.js instalado e verificado
- [ ] Python instalado com PaddleOCR
- [ ] Tesseract OCR instalado
- [ ] Script de monitoramento criado
- [ ] Agendador de Tarefas configurado
- [ ] Teste inicial executado com sucesso
- [ ] Sincronização com SIACT Web testada

---

## 🆘 TROUBLESHOOTING

### Problema: "Pasta não autorizada"
**Solução:**
1. Abra Manus Desktop
2. Vá para "My Computer"
3. Clique em "Authorize" novamente
4. Selecione a pasta
5. Confirme permissões

### Problema: "Tesseract não encontrado"
**Solução:**
```powershell
# Adicionar Tesseract ao PATH
$env:Path += ";C:\Program Files\Tesseract-OCR"
[Environment]::SetEnvironmentVariable("Path", $env:Path, "Machine")
```

### Problema: "PaddleOCR muito lento"
**Solução:**
- Use GPU se disponível: `pip install paddleocr[gpu]`
- Reduza resolução de entrada
- Use apenas Tesseract para testes rápidos

### Problema: "Sincronização falhando"
**Solução:**
1. Verifique conexão de internet
2. Confirme URL do SIACT Web App
3. Verifique credenciais de autenticação
4. Veja logs em `C:\Users\...\SIACT_Local\logs\`

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Setup concluído
2. ➡️ Ir para: **FASE 2 - Integração de OCR Local**
3. ➡️ Depois: **FASE 3 - Integração com Gemini Desktop**
4. ➡️ Finalmente: **FASE 4 - Sincronização Automática**

---

**Tempo Total de Setup:** ~45 minutos  
**Suporte:** Consulte https://help.manus.im ou contate support@manus.im
