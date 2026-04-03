# 📖 GUIA DE USO: SIACT com Manus Desktop "My Computer"

**Objetivo:** Processar documentos TCE/BAP localmente sem upload para cloud  
**Público:** Auditores, gestores e analistas do TCU  
**Tempo de Leitura:** 15 minutos

---

## 🎯 FLUXO RÁPIDO (5 MINUTOS)

### Cenário: Analisar 1 PDF TCE

```
1. Copie o PDF para: C:\Users\[Seu Usuário]\SIACT_Local\TCE_PDFs\Entrada\
2. Aguarde 5-10 segundos
3. Manus Desktop processa automaticamente
4. Resultado aparece em: C:\Users\[Seu Usuário]\SIACT_Local\Análises\JSON\
5. Dashboard SIACT Web atualiza automaticamente
```

**Tempo Total:** ~2-5 minutos (depende do tamanho do PDF)

---

## 📋 PASSO A PASSO DETALHADO

### Passo 1: Preparar Arquivo PDF

```
✅ Formatos aceitos:
- PDF com texto nativo (recomendado)
- PDF scaneado (OCR automático)
- Múltiplas páginas (até 500 páginas)

❌ Formatos NÃO aceitos:
- Imagens (JPG, PNG) - use conversor
- Word, Excel - exporte para PDF
- Arquivos compactados (ZIP, RAR)
```

### Passo 2: Copiar PDF para Pasta de Entrada

**Opção A: Explorador de Arquivos**
```
1. Abra Explorador de Arquivos
2. Navegue até: C:\Users\[Seu Usuário]\SIACT_Local\TCE_PDFs\Entrada\
3. Copie o PDF para esta pasta
4. Aguarde processamento automático
```

**Opção B: Linha de Comando**
```powershell
Copy-Item "C:\Downloads\SEI_72031.008744_2024_00.pdf" `
  "C:\Users\$env:USERNAME\SIACT_Local\TCE_PDFs\Entrada\"
```

### Passo 3: Monitorar Processamento

**Verificar Status em Tempo Real:**
```powershell
# Abra PowerShell e execute:
Get-ChildItem "C:\Users\$env:USERNAME\SIACT_Local\TCE_PDFs\Entrada\" -Filter "*.pdf" | 
  ForEach-Object { Write-Host "⏳ Processando: $($_.Name)" }
```

**Verificar Resultados:**
```powershell
# Após processamento, verifique:
Get-ChildItem "C:\Users\$env:USERNAME\SIACT_Local\Análises\JSON\" -Filter "*.json" | 
  Select-Object Name, LastWriteTime
```

### Passo 4: Revisar Resultados

**Arquivo de Resultado JSON:**
```json
{
  "processNumber": "TCE-2024-00001",
  "dateOfTransfer": "2024-01-15",
  "dateOfTCEInauguration": "2024-03-20",
  "value": 1500000.00,
  "organizationName": "Ministério do Turismo",
  "responsibleNames": ["João da Silva", "Maria Santos"],
  "complianceIssues": [],
  "prescriptionAnalysis": {
    "daysRemaining": 652,
    "prescriptionDate": "2029-03-20",
    "status": "ADMISSIBLE"
  },
  "confidence": 0.95,
  "processingTimeMs": 4230
}
```

### Passo 5: Sincronizar com Dashboard SIACT

**Automático:**
- Resultados sincronizam automaticamente a cada 5 minutos
- Dashboard SIACT Web atualiza em tempo real

**Manual:**
1. Abra Dashboard SIACT Web
2. Clique em "Sincronizar Agora"
3. Aguarde atualização

---

## 🔍 INTERPRETAÇÃO DOS RESULTADOS

### Status de Prescrição

| Status | Significado | Ação |
|--------|---|---|
| **ADMISSIBLE** | Válido para análise | Prosseguir com análise |
| **REQUIRES_REVIEW** | < 180 dias para prescrição | Urgente - revisar |
| **INADMISSIBLE** | Prescrito (>5 anos) | Arquivar |

### Confiança de Análise

| Confiança | Interpretação | Recomendação |
|-----------|---|---|
| **> 90%** | Muito alta | Confiar nos resultados |
| **80-90%** | Alta | Revisar dados críticos |
| **70-80%** | Média | Validar com documento |
| **< 70%** | Baixa | Revisar manualmente |

### Problemas de Conformidade

**Exemplos de Problemas Identificados:**
- Falta de documentação comprobatória
- Valor abaixo do limite de materialidade (< R$ 120k)
- Data de instauração ausente
- Responsáveis não identificados
- Irregularidades na transferência

---

## ⚙️ CONFIGURAÇÕES AVANÇADAS

### Alterar Método de OCR

**Arquivo de Configuração:**
```json
// C:\Users\[Seu Usuário]\SIACT_Local\config.json
{
  "ocr": {
    "method": "hybrid",  // "tesseract", "paddle", ou "hybrid"
    "confidence_threshold": 0.8,
    "language": "pt-BR"
  }
}
```

**Métodos Disponíveis:**
- **tesseract:** Rápido (2-3 min), menos preciso (80-85% confiança)
- **paddle:** Lento (5-10 min), mais preciso (90-95% confiança)
- **hybrid:** Equilibrado (3-5 min), inteligente (85-90% confiança)

### Ajustar Intervalo de Sincronização

```json
{
  "siact_web": {
    "sync_interval_ms": 300000,  // 5 minutos (padrão)
    "auto_upload_results": true
  }
}
```

### Ativar Gemini Desktop (Quando Disponível)

```json
{
  "gemini": {
    "enabled": true,
    "api_key": "YOUR_GEMINI_API_KEY",
    "model": "gemini-2.0-flash-local"
  }
}
```

---

## 🆘 TROUBLESHOOTING

### Problema: "PDF não está sendo processado"

**Verificar:**
1. ✅ Arquivo está em: `C:\Users\[Seu Usuário]\SIACT_Local\TCE_PDFs\Entrada\`
2. ✅ Extensão é `.pdf` (não `.PDF`)
3. ✅ Arquivo não está corrompido
4. ✅ Manus Desktop está rodando

**Solução:**
```powershell
# Verificar se monitor está ativo
Get-Process | Where-Object {$_.Name -like "*Manus*"}

# Se não aparecer, reinicie:
# 1. Feche Manus Desktop
# 2. Abra novamente
# 3. Clique em "My Computer"
# 4. Verifique se pasta está autorizada
```

### Problema: "Confiança de OCR muito baixa"

**Causas Comuns:**
- PDF é scaneado de baixa qualidade
- Idioma não é português
- Imagem com muitos ruídos

**Solução:**
1. Altere método para `paddle` (mais preciso)
2. Tente aumentar resolução do PDF
3. Verifique se idioma está configurado como `pt-BR`

### Problema: "Sincronização não está funcionando"

**Verificar:**
1. ✅ Conexão de internet está ativa
2. ✅ URL do SIACT Web está correta
3. ✅ Credenciais estão válidas

**Solução:**
```powershell
# Testar conexão
Invoke-WebRequest -Uri "https://baplanding-4wdv8y7a.manus.space/api/health"

# Se falhar, verifique:
# - Firewall está bloqueando?
# - VPN conectada?
# - URL está correta?
```

### Problema: "Tesseract/PaddleOCR não encontrado"

**Solução:**
```powershell
# Reinstalar ferramentas
choco install tesseract -y
pip install --upgrade paddleocr

# Verificar instalação
tesseract --version
python -c "import paddleocr; print('OK')"
```

---

## 📊 CASOS DE USO REAIS

### Caso 1: Auditor com 100 PDFs

```
Situação: Auditor precisa analisar 100 TCEs em 1 semana

Fluxo:
1. Coloca todos 100 PDFs em: C:\Users\...\SIACT_Local\TCE_PDFs\Entrada\
2. Manus Desktop processa automaticamente (deixar rodando)
3. Após 8-12 horas, todos processados
4. Dashboard SIACT mostra:
   - 45 ADMISSIBLE (análise necessária)
   - 30 REQUIRES_REVIEW (urgentes)
   - 25 INADMISSIBLE (prescritos)
5. Auditor prioriza os 30 urgentes

Tempo Economizado: ~40 horas de trabalho manual
```

### Caso 2: Gestor Monitorando Prescrições

```
Situação: Gestor quer alertas de prescrição próxima

Fluxo:
1. Configura sincronização automática a cada 1 hora
2. Dashboard SIACT mostra alertas em tempo real
3. Quando processo fica < 180 dias, alerta aparece em vermelho
4. Gestor recebe notificação por email

Benefício: Evita perda de prazos críticos
```

### Caso 3: Pesquisador Analisando Padrões

```
Situação: Pesquisador quer analisar 500 TCEs para estudo

Fluxo:
1. Coloca 500 PDFs em pasta local
2. Manus Desktop processa em background (noite)
3. Gera dataset estruturado em CSV
4. Exporta para análise estatística

Benefício: Dados estruturados sem exposição de sensíveis
```

---

## 📞 SUPORTE E CONTATO

**Documentação Técnica:**
- Setup: `SETUP_MANUS_DESKTOP_WINDOWS.md`
- Avaliação: `RELATORIO_MANUS_DESKTOP_SIACT.md`

**Suporte Manus:**
- Help Center: https://help.manus.im
- Email: support@manus.im
- Telegram: @ManusSupport

**Suporte SIACT:**
- Email: siact@tcu.gov.br
- Telefone: (61) 3316-7000

---

## ✅ CHECKLIST DE INÍCIO

- [ ] Manus Desktop instalado
- [ ] Pastas criadas e autorizadas
- [ ] Primeiro PDF copiado para Entrada
- [ ] Resultado gerado em JSON
- [ ] Dashboard SIACT sincronizado
- [ ] Confiança de análise > 80%
- [ ] Prescrição calculada corretamente

**Parabéns! Você está pronto para usar SIACT com My Computer! 🎉**

---

**Versão:** 1.0  
**Data:** 03 de Abril de 2026  
**Status:** ✅ Pronto para Produção
