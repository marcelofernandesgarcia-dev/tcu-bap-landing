# ✅ Checklist de Instalação - SIACT com Manus Desktop

Use este checklist para acompanhar o progresso da instalação.

---

## 📋 Fase 1: Pré-requisitos (5-10 minutos)

### Python 3.8+
- [ ] Acesse https://www.python.org/downloads/
- [ ] Baixe Python 3.11 (ou superior)
- [ ] Execute o instalador
- [ ] **IMPORTANTE:** Marque "Add Python to PATH"
- [ ] Clique em "Install Now"
- [ ] Verifique: `python --version` (deve mostrar Python 3.11+)

### Git (Opcional)
- [ ] Acesse https://git-scm.com/download/win
- [ ] Baixe e execute o instalador
- [ ] Use opções padrão
- [ ] Verifique: `git --version`

---

## 🔤 Fase 2: Tesseract OCR (10-15 minutos)

### Download
- [ ] Acesse https://github.com/UB-Mannheim/tesseract/wiki
- [ ] Procure por "Downloads"
- [ ] Baixe **tesseract-ocr-w64-setup-v5.x.x.exe** (64-bit)
- [ ] Salve em `C:\Users\[SeuUsuário]\Downloads`

### Instalação
- [ ] Clique duas vezes no arquivo
- [ ] Clique em "Install"
- [ ] Aceite local padrão: `C:\Program Files\Tesseract-OCR`
- [ ] Clique em "Next" até finalizar
- [ ] Clique em "Install"

### Verificação
- [ ] Abra PowerShell
- [ ] Execute: `tesseract --version`
- [ ] Deve mostrar: `tesseract 5.x.x`
- [ ] Se não funcionar, adicione ao PATH manualmente

### Adicionar ao PATH (se necessário)
- [ ] Pressione `Win + X` → "Configurações"
- [ ] Procure "Variáveis de Ambiente"
- [ ] Clique "Editar as variáveis de ambiente do sistema"
- [ ] Clique "Variáveis de Ambiente..."
- [ ] Em "Variáveis do sistema", clique "Path"
- [ ] Clique "Editar"
- [ ] Clique "Novo"
- [ ] Digite: `C:\Program Files\Tesseract-OCR`
- [ ] Clique "OK" em todos os diálogos
- [ ] Reinicie PowerShell

---

## 🐍 Fase 3: PaddleOCR (15-20 minutos)

### Preparação
- [ ] Abra PowerShell como Administrador
- [ ] Pressione `Win + X` → "Windows PowerShell (Admin)"

### Instalação
- [ ] Execute: `python -m pip install --upgrade pip`
- [ ] Aguarde conclusão (2-3 minutos)
- [ ] Execute: `pip install paddleocr`
- [ ] Aguarde conclusão (10-15 minutos - primeira execução baixa modelos)
- [ ] Execute: `pip install opencv-python pillow numpy`
- [ ] Aguarde conclusão (2-3 minutos)

### Verificação
- [ ] Execute: `python -c "from paddleocr import PaddleOCR; print('PaddleOCR instalado com sucesso!')"`
- [ ] Deve mostrar: `PaddleOCR instalado com sucesso!`

---

## 🖥️ Fase 4: Manus Desktop (5-10 minutos)

### Download
- [ ] Acesse https://manus.im/desktop
- [ ] Clique "Download for Windows"
- [ ] Salve em `C:\Users\[SeuUsuário]\Downloads`

### Instalação
- [ ] Clique duas vezes em `Manus-Desktop-Setup.exe`
- [ ] Clique "Install"
- [ ] Aguarde instalação (2-3 minutos)
- [ ] Clique "Finish"

### Primeiro Acesso
- [ ] Abra Manus Desktop (ícone na área de trabalho)
- [ ] Faça login com sua conta Manus
- [ ] Clique em "My Computer"
- [ ] Clique em "Enable"
- [ ] Deve mostrar "Status: Connected"

---

## 📁 Fase 5: Configuração de Pastas (5 minutos)

### Criar Estrutura
- [ ] Abra PowerShell
- [ ] Execute: `mkdir "C:\SIACT"`
- [ ] Execute: `mkdir "C:\SIACT\PDFs"`
- [ ] Execute: `mkdir "C:\SIACT\Resultados"`
- [ ] Execute: `mkdir "C:\SIACT\Logs"`
- [ ] Execute: `mkdir "C:\SIACT\Cache"`

### Configurar Permissões
- [ ] Clique direito em `C:\SIACT`
- [ ] Selecione "Propriedades"
- [ ] Clique "Segurança"
- [ ] Clique "Editar"
- [ ] Selecione seu usuário
- [ ] Marque "Controle Total"
- [ ] Clique "Aplicar" e "OK"

### Copiar PDFs
- [ ] Copie `SEI_72031.008744_2024_00.pdf` para `C:\SIACT\PDFs\`
- [ ] Copie `SEI_72031.008871_2017_71.pdf` para `C:\SIACT\PDFs\`

---

## 🔌 Fase 6: Configuração de Sincronização (5 minutos)

### Conectar ao SIACT Web
- [ ] Abra Manus Desktop
- [ ] Clique "My Computer"
- [ ] Clique "Settings"
- [ ] Configure:
  - [ ] SIACT Web URL: `https://baplanding-4wdv8y7a.manus.space`
  - [ ] Sync Interval: `5 minutos`
  - [ ] Auto-sync: `Ativado`
- [ ] Clique "Save"

---

## ✅ Fase 7: Testes de Conexão (10-15 minutos)

### Teste 1: Tesseract
- [ ] Abra PowerShell
- [ ] Execute: `tesseract --version`
- [ ] Resultado esperado: `tesseract 5.x.x`
- [ ] Status: ✅ PASSOU / ❌ FALHOU

### Teste 2: PaddleOCR
- [ ] Abra PowerShell
- [ ] Execute: `python -c "from paddleocr import PaddleOCR; ocr = PaddleOCR(); print('OK')"`
- [ ] Resultado esperado: `OK`
- [ ] Status: ✅ PASSOU / ❌ FALHOU

### Teste 3: Manus Desktop
- [ ] Abra Manus Desktop
- [ ] Clique "My Computer"
- [ ] Deve mostrar "Status: Connected"
- [ ] Status: ✅ PASSOU / ❌ FALHOU

### Teste 4: Processar PDF
- [ ] Abra Manus Desktop
- [ ] Clique "Analyze"
- [ ] Selecione um PDF de `C:\SIACT\PDFs\`
- [ ] Clique "Process"
- [ ] Aguarde processamento (5-10 minutos)
- [ ] Verifique resultado em `C:\SIACT\Resultados\`
- [ ] Status: ✅ PASSOU / ❌ FALHOU

### Teste 5: Sincronização
- [ ] Abra https://baplanding-4wdv8y7a.manus.space
- [ ] Clique "Dashboard"
- [ ] Verifique se análise aparece na tabela
- [ ] Clique na análise para ver detalhes
- [ ] Status: ✅ PASSOU / ❌ FALHOU

---

## 📊 Resumo de Testes

| Teste | Status | Tempo |
|-------|--------|-------|
| Tesseract | ✅ / ❌ | __ min |
| PaddleOCR | ✅ / ❌ | __ min |
| Manus Desktop | ✅ / ❌ | __ min |
| Processar PDF | ✅ / ❌ | __ min |
| Sincronização | ✅ / ❌ | __ min |

**Taxa de Sucesso:** __ / 5 (__ %)

---

## 🎯 Próximos Passos

Após todos os testes passarem:

- [ ] Processar SEI_72031.008744_2024_00.pdf (1.2MB, 34 páginas)
- [ ] Processar SEI_72031.008871_2017_71.pdf (27MB, 449 páginas)
- [ ] Verificar resultados no Dashboard
- [ ] Exportar relatórios
- [ ] Escalar para produção

---

## 🐛 Troubleshooting

Se algum teste falhar:

1. Consulte [GUIA_INSTALACAO_WINDOWS_COMPLETO.md](./GUIA_INSTALACAO_WINDOWS_COMPLETO.md)
2. Seção "Troubleshooting"
3. Siga as soluções propostas
4. Execute teste novamente

---

## 📝 Notas

Use este espaço para anotações:

```
Data de início: ___________
Data de conclusão: ___________
Problemas encontrados: ___________
Soluções aplicadas: ___________
Observações: ___________
```

---

**Versão:** 1.0  
**Data:** 2026-04-03  
**Status:** ✅ Pronto para Uso
