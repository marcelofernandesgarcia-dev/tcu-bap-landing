/**
 * SIACT - Serviço Gemini com Proteção de API Key
 * Backend proxy para proteger chave de API
 * Conformidade LGPD - Dados mascarados antes de enviar
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProcessData, MaskedProcessData, FinalAnalysis } from '../../../shared/analyzer-types';
import { maskProcessData } from '../middleware/dataMasking';

// Inicializar Gemini com API Key do backend (nunca expor no frontend)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY não configurada. Modo offline.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Gerar parecer jurídico com Gemini
 * Dados são mascarados antes de enviar
 */
export async function generateLegalOpinion(
  analysis: FinalAnalysis,
  maskedData: MaskedProcessData
): Promise<string> {
  if (!genAI) {
    return generateOfflineOpinion(analysis, maskedData);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Você é um especialista em direito administrativo e prescrição de dívidas públicas.

Analise o seguinte processo de Tomada de Contas Especial e forneça um parecer jurídico fundamentado.

DADOS DO PROCESSO (mascarados conforme LGPD):
- Número: ${maskedData.processNumber}
- Valor: ${maskedData.debtRange}
- Data do fato: ${maskedData.dateOfFact}
- Eventos: ${maskedData.events.length} marcos processuais registrados

ANÁLISE DETERMINÍSTICA:
- Admissibilidade: ${analysis.admissibility.passed ? 'APROVADA' : 'REJEITADA'}
- Prescrição: ${analysis.prescription.passed ? 'NÃO PRESCRITO' : 'PRESCRITO'}
- Elegibilidade BAP: ${analysis.bapEligibility.passed ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL'}

DETALHES DA ANÁLISE:
${analysis.admissibility.details.join('\n')}
${analysis.prescription.details.join('\n')}
${analysis.bapEligibility.details.join('\n')}

REFERÊNCIAS NORMATIVAS:
- IN TCU nº 98/2024 - Instauração de Tomada de Contas Especial
- Lei nº 9.873/1999 - Prescrição Administrativa
- Resolução TCU nº 344/2022 - Prescrição Principal e Intercorrente
- Portaria TCU nº 121/2025 - Banco de Arquivamentos por Prescrição (BAP)

Com base na análise acima, forneça:
1. Resumo executivo (máx 3 parágrafos)
2. Fundamentação jurídica
3. Recomendação de ação
4. Ressalvas importantes

IMPORTANTE: Este parecer é baseado em dados mascarados e requer validação humana antes de qualquer decisão.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar parecer com Gemini:', error);
    return generateOfflineOpinion(analysis, maskedData);
  }
}

/**
 * Gerar parecer offline (quando Gemini não está disponível)
 */
function generateOfflineOpinion(analysis: FinalAnalysis, maskedData: MaskedProcessData): string {
  const lines: string[] = [];

  lines.push('📋 PARECER DE ANÁLISE (Modo Offline - Sem IA)');
  lines.push('═'.repeat(60));

  lines.push('\n1. RESUMO EXECUTIVO');
  lines.push('-'.repeat(60));

  if (!analysis.admissibility.passed) {
    lines.push('❌ Processo NÃO ADMISSÍVEL:');
    analysis.admissibility.details.forEach(d => lines.push(`   ${d}`));
    lines.push('\n⚠️ RECOMENDAÇÃO: Rejeitar processo por falta de admissibilidade.');
    return lines.join('\n');
  }

  if (!analysis.prescription.passed) {
    lines.push('❌ Processo PRESCRITO:');
    analysis.prescription.details.forEach(d => lines.push(`   ${d}`));
    lines.push('\n⚠️ RECOMENDAÇÃO: Arquivar processo por prescrição.');
    lines.push('   Conforme Lei 9.873/1999 e Resolução TCU 344/2022.');
    return lines.join('\n');
  }

  lines.push('✅ Processo ADMISSÍVEL e NÃO PRESCRITO');
  lines.push(`   Valor: ${maskedData.debtRange}`);
  lines.push(`   Data do fato: ${maskedData.dateOfFact}`);
  lines.push(`   Marcos processuais: ${maskedData.events.length}`);

  lines.push('\n2. ANÁLISE JURÍDICA');
  lines.push('-'.repeat(60));

  lines.push('\nADMISSIBILIDADE:');
  analysis.admissibility.details.forEach(d => lines.push(`  ${d}`));

  lines.push('\nPRESCRIÇÃO:');
  analysis.prescription.details.forEach(d => lines.push(`  ${d}`));

  lines.push('\nELEGIBILIDADE BAP:');
  analysis.bapEligibility.details.forEach(d => lines.push(`  ${d}`));

  lines.push('\n3. RECOMENDAÇÃO');
  lines.push('-'.repeat(60));

  if (analysis.bapEligibility.passed) {
    lines.push('✅ RECOMENDAÇÃO: Incluir no Banco de Arquivamentos por Prescrição (BAP)');
    lines.push('   Conforme Portaria TCU nº 121/2025');
  } else {
    lines.push('⚠️ RECOMENDAÇÃO: Prosseguir com Tomada de Contas Especial');
    lines.push('   Processo não atende critérios para BAP');
  }

  lines.push('\n4. RESSALVAS IMPORTANTES');
  lines.push('-'.repeat(60));
  lines.push('⚠️ Este parecer foi gerado automaticamente e requer validação humana.');
  lines.push('⚠️ Dados foram mascarados conforme LGPD antes do processamento.');
  lines.push('⚠️ Responsabilidade final é do órgão setorial.');
  lines.push('⚠️ Consulte especialista jurídico para decisões críticas.');

  lines.push('\n' + '═'.repeat(60));

  return lines.join('\n');
}

/**
 * Validar resposta da IA
 */
export function validateAIResponse(response: string): boolean {
  if (!response || response.length < 50) {
    return false;
  }

  // Verificar se contém informações sensíveis (CPF, CNPJ, etc)
  const sensitivePatterns = [
    /\d{3}\.\d{3}\.\d{3}-\d{2}/, // CPF
    /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/, // CNPJ
    /[\w\.-]+@[\w\.-]+\.\w+/, // Email
  ];

  for (const pattern of sensitivePatterns) {
    if (pattern.test(response)) {
      console.warn('⚠️ Resposta da IA contém dados sensíveis!');
      return false;
    }
  }

  return true;
}

/**
 * Processar análise completa
 */
export async function processAnalysis(
  processData: ProcessData,
  analysis: FinalAnalysis
): Promise<{
  analysis: FinalAnalysis;
  aiParecer?: string;
  maskedData: MaskedProcessData;
}> {
  // Mascarar dados antes de enviar
  const maskedData = maskProcessData(processData);

  // Gerar parecer (com ou sem IA)
  let aiParecer: string | undefined;
  try {
    aiParecer = await generateLegalOpinion(analysis, maskedData);

    // Validar resposta
    if (!validateAIResponse(aiParecer)) {
      console.warn('⚠️ Resposta da IA falhou na validação');
      aiParecer = undefined;
    }
  } catch (error) {
    console.error('Erro ao gerar parecer:', error);
    aiParecer = undefined;
  }

  return {
    analysis,
    aiParecer,
    maskedData
  };
}
