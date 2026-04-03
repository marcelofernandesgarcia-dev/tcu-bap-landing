# SIACT Analisador - Integração de OCR e Análise de Documentos

## Visão Geral

O SIACT Analisador é um sistema completo de análise de documentos de Tomada de Contas Especial (TCE) que integra:

1. **OCR Frontend** (Tesseract.js) - Processamento de PDFs/imagens no navegador
2. **OCR Backend** (PaddleOCR) - Fallback para documentos complexos
3. **Análise Inteligente** - Extração de campos estruturados com LLM
4. **Conformidade LGPD** - Mascaramento automático de dados sensíveis
5. **Análise de Prescrição** - Cálculo automático de datas de prescrição

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  MultiFileUploader → useOCR Hook → Tesseract.js            │
│                         ↓                                   │
│                   Extração de Texto                         │
│                         ↓                                   │
│              Enviar para Backend (tRPC)                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                        │
├─────────────────────────────────────────────────────────────┤
│  Router tRPC: analysis.analyze()                           │
│       ↓                                                     │
│  1. Mascarar dados sensíveis (LGPD)                        │
│  2. Extrair campos estruturados (LLM)                      │
│  3. Analisar prescrição                                    │
│  4. Validar conformidade IN TCU 98/2024                    │
│       ↓                                                     │
│  Retornar análise completa                                 │
└─────────────────────────────────────────────────────────────┘
```

## Como Usar

### 1. Upload de Documentos

```typescript
// client/src/pages/Analyzer.tsx
import { MultiFileUploader } from '@/components/MultiFileUploader';

<MultiFileUploader 
  onFilesProcessed={handleFilesProcessed}
  maxFiles={10}
  maxSizeMB={100}
/>
```

**Suportados:**
- PDF (texto nativo ou scaneado)
- Imagens (PNG, JPG, JPEG, BMP, TIFF)
- Limite: 10 arquivos, 100MB total

### 2. Processamento de OCR

```typescript
// Automático via useOCR hook
const { results, isProcessing, error } = useOCR();

// Tesseract.js processa no navegador
// Se falhar, fallback para PaddleOCR backend
```

### 3. Análise de Documentos

```typescript
// Via tRPC
const analyzeResult = await trpc.analysis.analyze.mutate({
  texts: ['Texto extraído do PDF'],
  filenames: ['documento.pdf'],
  ocrConfidence: 0.95,
  language: 'pt'
});

// Retorna:
{
  success: true,
  processNumber: 'TCE-2024-00001',
  dates: [
    { label: 'Data de Instauração', value: '2024-03-15' },
    { label: 'Data de Vencimento', value: '2024-06-15' }
  ],
  values: [
    { label: 'Dívida Original', amount: 250000, currency: 'BRL' },
    { label: 'Juros', amount: 50000, currency: 'BRL' }
  ],
  prescriptionAnalysis: {
    status: 'ADMISSIBLE',
    daysRemaining: 1200,
    prescriptionDate: '2029-03-15',
    reasoning: 'Processo admissível. Prescrição em 15/03/2029 (1200 dias restantes)'
  },
  maskedText: '[TEXTO COM DADOS SENSÍVEIS MASCARADOS]'
}
```

## Conformidade LGPD

Todos os dados sensíveis são automaticamente mascarados:

| Tipo | Padrão | Mascarado |
|------|--------|-----------|
| CPF | 123.456.789-00 | ***.***.***-** |
| CNPJ | 12.345.678/0001-90 | **.***.***/**-** |
| Email | user@example.com | [email] |
| Nomes | João Silva Santos | [NOME] |

## Análise de Prescrição

O sistema calcula automaticamente:

1. **Data de Prescrição**: Data de Instauração + 5 anos
2. **Dias Restantes**: Diferença entre hoje e data de prescrição
3. **Status**:
   - `ADMISSIBLE`: > 180 dias restantes
   - `REQUIRES_REVIEW`: 0-180 dias restantes (alerta)
   - `INADMISSIBLE`: Prescrito (dias negativos)

## Validação de Conformidade

```typescript
const compliance = await trpc.analysis.validateCompliance.query({
  processNumber: 'TCE-2024-00001',
  datesProvided: ['2024-03-15', '2024-06-15'],
  valuesProvided: [250000, 50000]
});

// Retorna:
{
  compliant: true,
  issues: [],
  recommendations: []
}
```

**Validações:**
- ✓ Número de processo identificado
- ✓ Datas críticas presentes
- ✓ Valores informados
- ✓ Valor total ≥ R$ 120 mil (Débito Inferior)

## Testes

```bash
# Executar testes
pnpm test

# Modo watch
pnpm test:watch

# Resultado esperado
# Test Files  2 passed (2)
#      Tests  21 passed (21)
```

## Configuração de Produção

### Variáveis de Ambiente

```env
# Backend
DATABASE_URL=mysql://user:password@host/db
JWT_SECRET=seu-secret-aqui
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://oauth.manus.space

# Frontend
VITE_OAUTH_PORTAL_URL=https://portal.manus.space
VITE_FRONTEND_FORGE_API_URL=https://api.manus.space
VITE_FRONTEND_FORGE_API_KEY=seu-api-key
```

### Build e Deploy

```bash
# Build
pnpm build

# Start produção
pnpm start

# Ou via Docker
docker build -t siact-analyzer .
docker run -p 3000:3000 siact-analyzer
```

## Próximos Passos

### 1. Integração com PaddleOCR
- [ ] Instalar dependências Python: `paddleocr`, `pdf2image`, `opencv-python`
- [ ] Testar com documentos complexos (scans de 449 páginas)
- [ ] Otimizar performance com processamento paralelo

### 2. Extração de Campos Avançada
- [ ] Identificar automaticamente tipo de documento (ofício, convênio, relatório)
- [ ] Extrair campos específicos por tipo
- [ ] Validar formatos esperados (datas, valores, CPF/CNPJ)

### 3. Integração com Sistemas Externos
- [ ] Conectar com e-TCE para validação de processos
- [ ] Sincronizar com SIAFI para valores
- [ ] Integrar com CGU para histórico de responsáveis

### 4. Dashboard de Análises
- [ ] Histórico de análises realizadas
- [ ] Estatísticas de prescrição por órgão
- [ ] Alertas automáticos para processos próximos de prescrever
- [ ] Exportar relatórios em PDF/Excel

## Troubleshooting

### Tesseract.js não carrega
```typescript
// Verificar se o worker está disponível
import { createWorker } from 'tesseract.js';
const worker = await createWorker();
```

### PaddleOCR não funciona
```bash
# Instalar dependências Python
pip install paddleocr pdf2image opencv-python

# Testar
python3 -c "from paddleocr import PaddleOCR; ocr = PaddleOCR()"
```

### Erro de mascaramento LGPD
- Verificar regex patterns em `maskSensitiveData()`
- Adicionar novos padrões conforme necessário
- Testar com dados reais

## Referências

- [IN TCU nº 98/2024](https://www.tcu.gov.br/in-98-2024)
- [Portaria TCU nº 121/2025](https://www.tcu.gov.br/portaria-121-2025)
- [Resolução TCU nº 344/2022](https://www.tcu.gov.br/resolucao-344-2022)
- [Tesseract.js Docs](https://github.com/naptha/tesseract.js)
- [PaddleOCR Docs](https://github.com/PaddlePaddle/PaddleOCR)

## Suporte

Para dúvidas ou problemas:
- Email: stce@tcu.gov.br
- Portal: https://www.tcu.gov.br
- Sistema e-TCE: https://www.etce.tcu.gov.br
