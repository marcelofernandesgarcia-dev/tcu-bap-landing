/**
 * Serviço de Análise de Prescrição
 * Integra análise determinística + IA (Gemini)
 */

import { sanitizeText } from '../middleware/dataMasking';
import { runFullAnalysis } from '../utils/prescriptionAnalyzer';
import { processAnalysis } from './geminiService';
import { ProcessData, EventType, FinalAnalysis } from '../../../shared/analyzer-types';

export interface AnalysisInput {
  text: string;
  documentType: 'pdf' | 'docx' | 'html' | 'txt';
  fileName: string;
}

/**
 * Analisar documento de TCE
 */
export async function analyzeDocument(input: AnalysisInput): Promise<FinalAnalysis> {
  try {
    // 1. Sanitizar texto (remover dados sensíveis)
    const sanitizedText = sanitizeText(input.text);

    // 2. Extrair dados estruturados do texto
    const processData = extractProcessData(sanitizedText, input.fileName);

    // 3. Executar análise determinística
    const deterministicAnalysis = runFullAnalysis(processData);

    // 4. Processar com IA (se Gemini estiver disponível)
    let aiAnalysis = null;
    if (process.env.GEMINI_API_KEY && process.env.OFFLINE_MODE !== 'true') {
      try {
        aiAnalysis = await processAnalysis(processData, deterministicAnalysis);
      } catch (error) {
        console.warn('Erro ao processar com Gemini, usando apenas análise determinística:', error);
      }
    }

    // 5. Combinar resultados
    const result: FinalAnalysis = {
      admissibility: deterministicAnalysis.admissibility,
      prescription: deterministicAnalysis.prescription,
      bapEligibility: deterministicAnalysis.bapEligibility,
      aiParecer: aiAnalysis?.aiParecer || generateDefaultParecer(deterministicAnalysis)
    };

    return result;
  } catch (error) {
    console.error('Erro ao analisar documento:', error);
    throw new Error(`Erro ao analisar documento: ${error instanceof Error ? error.message : 'desconhecido'}`);
  }
}

/**
 * Extrair dados estruturados do texto
 * (Implementação simplificada - pode ser melhorada com NLP)
 */
function extractProcessData(text: string, fileName: string): ProcessData {
  // Padrões para extração
  const processNumberPattern = /TCE?-?\d{4}-?\d{3,6}/i;
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g;
  const valuePattern = /R\$\s*[\d.,]+|valor[:\s]+[\d.,]+/gi;

  // Extrair número do processo
  const processNumberMatch = text.match(processNumberPattern);
  const processNumber = processNumberMatch ? processNumberMatch[0] : `TCE-${Date.now()}`;

  // Extrair datas
  const dates: string[] = [];
  let dateMatch;
  while ((dateMatch = datePattern.exec(text)) !== null) {
    dates.push(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
  }

  // Extrair valores
  let debtValue = 0;
  const valueMatch = text.match(valuePattern);
  if (valueMatch) {
    const valueStr = valueMatch[0].replace(/[^\d,]/g, '').replace(',', '.');
    debtValue = parseFloat(valueStr) || 0;
  }

  // Data do fato (primeira data encontrada ou data atual)
  const dateOfFact = dates.length > 0 ? dates[0] : new Date().toISOString().split('T')[0];

  // Criar eventos básicos
  const events = [
    {
      id: '1',
      date: dateOfFact,
      type: EventType.FATO_GERADOR,
      description: 'Fato gerador identificado no documento',
      isInterruptive: true,
      location: 'Órgão Setorial'
    }
  ];

  // Adicionar eventos adicionais se houver mais datas
  if (dates.length > 1) {
    events.push({
      id: '2',
      date: dates[1],
      type: EventType.CITACAO,
      description: 'Evento processual identificado',
      isInterruptive: true,
      location: 'Protocolo'
    });
  }

  return {
    processNumber,
    debtValue,
    dateOfFact,
    events,
    isTCE: true,
    isAnalysable: true,
    prescriptionStartDate: dateOfFact
  };
}

/**
 * Gerar parecer padrão quando Gemini não está disponível
 */
function generateDefaultParecer(analysis: FinalAnalysis): string {
  const { prescription, bapEligibility } = analysis;

  let parecer = '📋 PARECER DE ANÁLISE AUTOMÁTICA\n';
  parecer += '═══════════════════════════════════════\n\n';

  // Análise de prescrição
  parecer += `📌 PRESCRIÇÃO: ${prescription.passed ? 'NÃO PRESCRITO' : 'PRESCRITO'}\n`;
  parecer += `Status: ${prescription.status}\n`;
  parecer += `Detalhes: ${prescription.details.join('; ')}\n\n`;

  // Análise de elegibilidade BAP
  parecer += `📌 ELEGIBILIDADE BAP: ${bapEligibility.passed ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL'}\n`;
  parecer += `Status: ${bapEligibility.status}\n`;
  parecer += `Detalhes: ${bapEligibility.details.join('; ')}\n\n`;

  parecer += '📌 Observações:\n';
  parecer += '• Esta análise é automática e deve ser validada por especialista\n';
  parecer += '• Referências: Lei 9.873/1999, Resolução TCU 344/2022, IN TCU 98/2024\n';
  parecer += '• Conformidade LGPD: Dados sensíveis foram mascarados\n';

  return parecer;
}
