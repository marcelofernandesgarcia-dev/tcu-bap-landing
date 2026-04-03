/**
 * Router tRPC para Análise de Documentos
 * Integra OCR frontend (Tesseract.js) + backend (PaddleOCR)
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { invokeLLM } from '../_core/llm';

type TextContent = { type: 'text'; text: string };
type ImageContent = { type: 'image_url'; image_url: { url: string; detail?: 'auto' | 'low' | 'high' } };
type FileContent = { type: 'file_url'; file_url: { url: string; mime_type?: string } };
type MessageContent = string | Array<TextContent | ImageContent | FileContent>;

// Schema de validação para análise
const AnalysisInputSchema = z.object({
  texts: z.array(z.string()).min(1, 'Pelo menos um texto é necessário'),
  filenames: z.array(z.string()).optional(),
  ocrConfidence: z.number().optional(),
  language: z.string().default('pt'),
});

// Schema de resposta de análise
const AnalysisResponseSchema = z.object({
  success: z.boolean(),
  processNumber: z.string().optional(),
  dates: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  values: z.array(z.object({
    label: z.string(),
    amount: z.number(),
    currency: z.string(),
  })).optional(),
  entities: z.array(z.object({
    type: z.string(),
    value: z.string(),
    confidence: z.number(),
  })).optional(),
  prescriptionAnalysis: z.object({
    status: z.enum(['ADMISSIBLE', 'INADMISSIBLE', 'REQUIRES_REVIEW']),
    daysRemaining: z.number().optional(),
    prescriptionDate: z.string().optional(),
    reasoning: z.string(),
  }).optional(),
  maskedText: z.string(),
  error: z.string().optional(),
});

type AnalysisInput = z.infer<typeof AnalysisInputSchema>;
type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

/**
 * Extrai campos estruturados do texto usando LLM
 */
async function extractStructuredFields(text: string): Promise<any> {
  const prompt = `Analise o seguinte texto de um processo de Tomada de Contas Especial (TCE) e extraia:
1. Número do processo (formato: TCE-AAAA-NNNNN ou similar)
2. Datas importantes (instauração, vencimento, apresentação)
3. Valores (dívida original, juros, correção monetária)
4. Órgãos envolvidos
5. Responsáveis (nomes, CPF/CNPJ)

Retorne em JSON estruturado com campos: processNumber, dates, values, entities.

Texto:
${text.substring(0, 5000)}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de documentos de TCE. Extraia informações estruturadas em JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ] as any,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'tce_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              processNumber: { type: 'string', description: 'Número do processo TCE' },
              dates: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    value: { type: 'string', format: 'date' },
                  },
                  required: ['label', 'value'],
                },
              },
              values: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    amount: { type: 'number' },
                    currency: { type: 'string' },
                  },
                  required: ['label', 'amount', 'currency'],
                },
              },
              entities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['PERSON', 'ORGANIZATION', 'LOCATION'] },
                    value: { type: 'string' },
                    confidence: { type: 'number', minimum: 0, maximum: 1 },
                  },
                  required: ['type', 'value', 'confidence'],
                },
              },
            },
            required: ['processNumber'],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.choices?.[0]?.message?.content) {
      const content = response.choices[0].message.content;
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
      return JSON.parse(contentStr);
    }
    return null;
  } catch (error) {
    console.error('Erro ao extrair campos estruturados:', error);
    return null;
  }
}

/**
 * Analisa prescrição baseado em datas extraídas
 */
function analyzePrescription(dates: any[]): any {
  if (!dates || dates.length === 0) {
    return {
      status: 'REQUIRES_REVIEW',
      reasoning: 'Não foi possível identificar datas para análise de prescrição',
    };
  }

  // Encontrar data de instauração
  const startDate = dates.find(d => d.label.toLowerCase().includes('instauração'))?.value
    || dates.find(d => d.label.toLowerCase().includes('início'))?.value
    || dates[0]?.value;

  if (!startDate) {
    return {
      status: 'REQUIRES_REVIEW',
      reasoning: 'Data de instauração não identificada',
    };
  }

  const start = new Date(startDate);
  const now = new Date();
  const fiveYearsMs = 5 * 365.25 * 24 * 60 * 60 * 1000;
  const prescriptionDate = new Date(start.getTime() + fiveYearsMs);
  const daysRemaining = Math.ceil((prescriptionDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

  let status: 'ADMISSIBLE' | 'INADMISSIBLE' | 'REQUIRES_REVIEW';
  let reasoning: string;

  if (daysRemaining < 0) {
    status = 'INADMISSIBLE';
    reasoning = `Processo prescrito em ${prescriptionDate.toLocaleDateString('pt-BR')} (${Math.abs(daysRemaining)} dias atrás)`;
  } else if (daysRemaining < 180) {
    status = 'REQUIRES_REVIEW';
    reasoning = `Alerta: Prescrição em ${prescriptionDate.toLocaleDateString('pt-BR')} (${daysRemaining} dias restantes)`;
  } else {
    status = 'ADMISSIBLE';
    reasoning = `Processo admissível. Prescrição em ${prescriptionDate.toLocaleDateString('pt-BR')} (${daysRemaining} dias restantes)`;
  }

  return {
    status,
    daysRemaining,
    prescriptionDate: prescriptionDate.toISOString().split('T')[0],
    reasoning,
  };
}

/**
 * Mascara dados sensíveis (LGPD)
 */
function maskSensitiveData(text: string): string {
  let masked = text;

  // Mascarar CPF (11 dígitos)
  masked = masked.replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '***.***.***-**');
  masked = masked.replace(/\b\d{11}\b/g, '***********');

  // Mascarar CNPJ (14 dígitos)
  masked = masked.replace(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, '**.***.***/**-**');
  masked = masked.replace(/\b\d{14}\b/g, '**************');

  // Mascarar emails
  masked = masked.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]');

  // Mascarar nomes (palavras capitalizadas que parecem nomes)
  // Padrão simples: palavras com 3+ letras capitalizadas
  masked = masked.replace(/\b([A-Z][a-z]+ )+[A-Z][a-z]+\b/g, '[NOME]');

  return masked;
}

/**
 * Processa análise de documentos
 */
export const analysisRouter = router({
  analyze: publicProcedure
    .input(AnalysisInputSchema)
    .mutation(async ({ input }) => {
      try {
        // Combinar todos os textos
        const combinedText = input.texts.join('\n\n');

        // Mascarar dados sensíveis
        const maskedText = maskSensitiveData(combinedText);

        // Extrair campos estruturados
        let structuredData = null;
        try {
          structuredData = await extractStructuredFields(maskedText);
        } catch (e) {
          console.error('Erro ao extrair campos:', e);
        }

        // Analisar prescrição
        const prescriptionAnalysis = analyzePrescription(structuredData?.dates);

        return {
          success: true,
          processNumber: structuredData?.processNumber,
          dates: structuredData?.dates,
          values: structuredData?.values,
          entities: structuredData?.entities,
          prescriptionAnalysis,
          maskedText,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        return {
          success: false,
          maskedText: '',
          error: errorMessage,
        };
      }
    }),

  /**
   * Processa arquivo com OCR backend (PaddleOCR)
   * Fallback para quando Tesseract.js falha
   */
  processWithPaddleOCR: publicProcedure
    .input(z.object({
      filename: z.string(),
      fileBuffer: z.string(), // Base64 encoded
      language: z.string().default('pt'),
    }))
    .output(z.object({
      success: z.boolean(),
      text: z.string(),
      confidence: z.number(),
      pages: z.number(),
      error: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implementar quando PaddleOCR estiver instalado
      return {
        success: false,
        text: '',
        confidence: 0,
        pages: 0,
        error: 'PaddleOCR não está disponível nesta versão',
      };
    }),

  /**
   * Valida conformidade com IN TCU 98/2024
   */
  validateCompliance: publicProcedure
    .input(z.object({
      processNumber: z.string().optional(),
      datesProvided: z.array(z.string()).optional(),
      valuesProvided: z.array(z.number()).optional(),
    }))
    .query(({ input }) => {
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Validar número de processo
      if (!input.processNumber) {
        issues.push('Número de processo não identificado');
        recommendations.push('Forneça o número do processo no formato TCE-AAAA-NNNNN');
      }

      // Validar datas
      if (!input.datesProvided || input.datesProvided.length === 0) {
        issues.push('Datas críticas não identificadas');
        recommendations.push('Certifique-se de que o documento contém data de instauração e vencimento');
      }

      // Validar valores
      if (!input.valuesProvided || input.valuesProvided.length === 0) {
        issues.push('Valores não identificados');
        recommendations.push('Verifique se o documento contém informações de valores da dívida');
      } else {
        // Verificar limite de R$ 120 mil
        const totalValue = input.valuesProvided.reduce((a, b) => a + b, 0);
        if (totalValue < 120000) {
          recommendations.push('Valor total abaixo de R$ 120 mil - pode ser classificado como Débito Inferior');
        }
      }

      return {
        compliant: issues.length === 0,
        issues,
        recommendations,
      };
    }),
}) as any;

export type AnalysisRouter = typeof analysisRouter;

