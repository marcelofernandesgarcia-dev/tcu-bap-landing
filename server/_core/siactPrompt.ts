/**
 * SIACT v7.9.4 - Prompt Master Consolidado e Corrigido
 * Alinhamento com Lei nº 9.873/1999, Resolução TCU nº 344/2022, IN TCU nº 98/2024
 * Portaria TCU nº 121/2025 (Banco de Arquivamento - BAP)
 */

export const SYSTEM_INSTRUCTIONS_SIACT = `
# SIACT v7.9.4 - HIGH SPEED (RIGOR TOTAL)

O SIACT - Analisador de Prescrição foi desenvolvido para atuar como um assistente jurídico especializado e auditor sênior, com foco exclusivo na análise da ocorrência de PRESCRIÇÃO (Principal e Intercorrente) e na ADMISSIBILIDADE em processos de Tomada de Contas Especial (TCE) ou processos administrativos de apuração de dano ao erário.

## Base Normativa Estrita

- **Lei nº 9.873/1999**: Prazos para o exercício de ação punitiva.
- **Resolução TCU nº 344/2022**: Regulamentação da prescrição principal e intercorrente.
- **IN TCU nº 98/2024**: Critérios de materialidade e admissibilidade.
- **Portaria TCU nº 121/2025**: Procedimentos para o Banco de Arquivamento (BAP).

## Algoritmo de Ordenação Multi-Nível

1. **1º Nível**: Número do Processo (Ordem Crescente)
2. **2º Nível**: Ano do Volume (Ordem Cronológica)
3. **3º Nível**: Número da Página/Fólio Real do PDF (Ordem Crescente)

**CRITICAL**: O campo 'location' DEVE seguir: "Doc. SEI [Nº] | Pág. [Nº] | [Tipo de Documento]"

## Sentinela de Prazos

- Aplicar alerta **VERMELHO** para hiatos > 3 anos (intercorrente) e 5 anos (principal)
- **MERO EXPEDIENTE**: Vistas e certidões NÃO interrompem a prescrição (FAQ TCU 2026)
- Calcular dias exatos entre marcos interruptivos

## Extração de BAP Checklist (Art. 30 - Portaria 121/2025)

Extrair obrigatoriamente os 12 itens:
- **I**: UG (Unidade Gestora)
- **II**: Beneficiário (Nome/CPF/CNPJ)
- **III**: Responsáveis (Nome/CPF/CNPJ)
- **IV**: Datas e Valor Original do Débito
- **V**: Registro no Siconv/Siafi (Nº Convênio/Termo)
- **VI**: Hiatos de Paralisação Identificados
- **VII**: Nº Processo no Órgão de Origem
- **VIII**: Nº TCE (se houver)
- **IX**: Nº 1ª OB (Ordem Bancária)
- **X**: Estágio Processual Atual
- **XI**: Data do Prazo Original para Prestação de Contas
- **XII**: Ato da Autoridade que determinou a instauração/arquivamento

## Validação de Admissibilidade (IN TCU 98/2024)

- **Materialidade**: Valor mínimo de R$ 120.000,00 (atualizado)
- **Temporalidade**: Máximo de 10 anos desde o fato gerador
- **Prescrição Principal**: 5 anos
- **Prescrição Intercorrente**: 3 anos (sem atos interruptivos)

## Diretriz de Velocidade e Memória

- Foque exclusivamente em extrair dados estruturados
- Ignore textos repetitivos ou logomarcas que aumentam o consumo de tokens
- Processe em chunks de 200KB para otimizar performance

## Selo de Transparência

"🤖 DOCUMENTO ELABORADO POR IA (SIACT v7.9.4). Dados e fólios extraídos conforme ordem lógica e cronológica dos autos."
`;

/**
 * Função para calcular alerta de prazo
 */
export const getAlertaPrazo = (meses: number) => {
  if (meses >= 60) return { label: "🔴 CRÍTICO: PRESCRIÇÃO PRINCIPAL", color: "red", status: "PRESCRITO" };
  if (meses >= 36) return { label: "🔴 CRÍTICO: PRESCRIÇÃO INTERCORRENTE", color: "red", status: "PRESCRITO" };
  if (meses >= 30) return { label: "🟠 RISCO IMINENTE", color: "orange", status: "RISCO_IMINENTE" };
  if (meses >= 20) return { label: "🟡 ATENÇÃO", color: "yellow", status: "ATENCAO" };
  return { label: "🟢 Regular", color: "gray", status: "REGULAR" };
};

/**
 * Schema de Resposta para Eventos (Chunks)
 */
export const chunkEventSchema = {
  type: "object",
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "Data do evento no formato ISO (YYYY-MM-DD)"
          },
          type: {
            type: "string",
            enum: [
              "INSTRUCAO_TECNICA",
              "CITACAO",
              "DECISAO_CONDENATORIA",
              "MERO_EXPEDIENTE",
              "OUTRO_MARCO"
            ]
          },
          description: { type: "string" },
          isInterruptive: { type: "boolean" },
          location: {
            type: "string",
            description: "Formato: Doc. SEI 1234567 | Pág. 45 | [Tipo]"
          },
          seiNumber: {
            type: "string",
            description: "Número SEI do documento (apenas dígitos)"
          },
          pageNumber: {
            type: "integer",
            description: "Número da página no PDF"
          }
        },
        required: ["date", "type", "description", "isInterruptive", "location"]
      }
    }
  },
  required: ["events"]
};

/**
 * Schema de Resposta Final (Síntese)
 */
export const finalResponseSchema = {
  type: "object",
  properties: {
    processNumber: { type: "string" },
    debtValue: { type: "number" },
    dateOfFact: { type: "string" },
    processPhase: { type: "string" },
    prescriptionStartPremise: { type: "string" },
    prescriptionStartDate: { type: "string" },
    originalDeadline: { type: "string" },
    hasCGUCertification: { type: "boolean" },
    hasConsensualSolution: { type: "boolean" },
    isTCE: { type: "boolean" },
    eTceNumber: { type: "string" },
    pageNumber: { type: "string" },
    isAnalysable: { type: "boolean" },
    validationFlags: {
      type: "object",
      properties: {
        pageRepetition: { type: "boolean" },
        materialityMismatch: { type: "boolean" },
        borderlineIntercurrent: { type: "boolean" },
        requiresHumanReview: { type: "boolean" }
      },
      required: ["pageRepetition", "materialityMismatch", "borderlineIntercurrent", "requiresHumanReview"]
    },
    humanSuggestions: {
      type: "array",
      items: { type: "string" }
    },
    documentSummary: { type: "string" },
    bapData: {
      type: "object",
      properties: {
        isEligible: { type: "boolean" },
        paralysisYears: { type: "number" },
        debtBelowLimit: { type: "boolean" },
        noCGUCertification: { type: "boolean" },
        checklist: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Item do Art. 30 (I a XII)" },
              itemDescription: { type: "string" },
              location: { type: "string" },
              status: { type: "string", enum: ["✅ Extraído", "⚠️ Manual", "❌ Não localizado"] }
            },
            required: ["id", "itemDescription", "location", "status"]
          }
        }
      },
      required: ["isEligible", "paralysisYears", "debtBelowLimit", "noCGUCertification", "checklist"]
    }
  },
  required: ["processNumber", "debtValue", "dateOfFact", "processPhase", "documentSummary", "bapData"]
};

/**
 * Prompt para consolidação final com BAP Checklist
 */
export const getConsolidationPrompt = (contextSample: string, chunkCount: number, currentChunk: number) => {
  return `[CONSOLIDAR] Analise o seguinte texto extraído de um processo administrativo e extraia os dados estruturados conforme o esquema.

IMPORTANTE PARA BAP (Portaria 121/2025):
Extraia os 12 itens do Art. 30 para o checklist:
I. UG (Unidade Gestora)
II. Beneficiário (Nome/CPF/CNPJ)
III. Responsáveis (Nome/CPF/CNPJ)
IV. Datas e Valor Original do Débito
V. Registro no Siconv/Siafi (Nº Convênio/Termo)
VI. Hiatos de Paralisação Identificados
VII. Nº Processo no Órgão de Origem
VIII. Nº TCE (se houver)
IX. Nº 1ª OB (Ordem Bancária)
X. Estágio Processual Atual
XI. Data do Prazo Original para Prestação de Contas
XII. Ato da Autoridade que determinou a instauração/arquivamento

DETALHAMENTO TCE:
- Se isTCE for verdadeiro, você DEVE extrair obrigatoriamente:
  * eTceNumber: O número da TCE (ex: 123/2024).
  * pageNumber: A página/folha do ato de instauração no PDF.

REGRA DE COMPACTAÇÃO (UI_COMPACT_OUTPUT):
- Se uma data não for localizada, use "null".
- No checklist, use nomes curtos (ex: UG, OB).
- Formato de localização: Doc. SEI [Nº] | Pág. [Nº] | [Tipo de Documento].
- Descrições curtas e objetivas.

Se um item não for encontrado, marque o status como "⚠️ Manual" e a localização como "Não localizado".

Processando Lote ${currentChunk}/${chunkCount}.

Texto do Processo:
${contextSample}`;
};
