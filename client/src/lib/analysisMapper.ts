/**
 * Mapeador de Análise - Converte resposta do backend para estrutura do frontend
 * Backend retorna: { success, processNumber, dates, values, entities, prescriptionAnalysis, maskedText }
 * Frontend espera: { admissibility, prescription, bapEligibility, aiParecer }
 */

export interface AnalysisStep {
  stepName: string;
  passed: boolean;
  details: string[];
  status: string;
}

export interface MappedAnalysis {
  admissibility: AnalysisStep;
  prescription: AnalysisStep;
  bapEligibility: AnalysisStep;
  aiParecer?: string;
  rawData?: any; // Dados brutos do backend para referência
}

/**
 * Mapeia resposta do backend para estrutura esperada pelo frontend
 */
export function mapBackendAnalysisToFrontend(backendData: any): MappedAnalysis {
  if (!backendData || !backendData.success) {
    throw new Error('Análise falhou no backend');
  }

  const { prescriptionAnalysis, dates, values, entities, processNumber, maskedText } = backendData;

  // Etapa 1: Admissibilidade
  // Verifica se o processo tem dados básicos necessários
  const admissibilityDetails: string[] = [];
  let admissibilityPassed = true;

  if (processNumber) {
    admissibilityDetails.push(`✓ Número do processo identificado: ${processNumber}`);
  } else {
    admissibilityDetails.push('⚠ Número do processo não identificado');
    admissibilityPassed = false;
  }

  if (dates && dates.length > 0) {
    admissibilityDetails.push(`✓ ${dates.length} data(s) importante(s) extraída(s)`);
    dates.forEach((d: any) => {
      admissibilityDetails.push(`  • ${d.label}: ${d.value}`);
    });
  } else {
    admissibilityDetails.push('⚠ Nenhuma data importante encontrada');
    admissibilityPassed = false;
  }

  if (values && values.length > 0) {
    admissibilityDetails.push(`✓ ${values.length} valor(es) identificado(s)`);
    values.forEach((v: any) => {
      admissibilityDetails.push(`  • ${v.label}: ${v.currency} ${v.amount.toLocaleString('pt-BR')}`);
    });
  } else {
    admissibilityDetails.push('⚠ Nenhum valor identificado');
  }

  if (entities && entities.length > 0) {
    admissibilityDetails.push(`✓ ${entities.length} entidade(s) identificada(s)`);
    entities.slice(0, 3).forEach((e: any) => {
      admissibilityDetails.push(`  • ${e.type}: ${e.value} (confiança: ${(e.confidence * 100).toFixed(0)}%)`);
    });
  }

  // Etapa 2: Prescrição
  const prescriptionDetails: string[] = [];
  let prescriptionPassed = false;
  let prescriptionStatus = 'REQUIRES_REVIEW';

  if (prescriptionAnalysis) {
    prescriptionStatus = prescriptionAnalysis.status || 'REQUIRES_REVIEW';
    prescriptionDetails.push(prescriptionAnalysis.reasoning);

    if (prescriptionAnalysis.prescriptionDate) {
      prescriptionDetails.push(`Data de prescrição: ${prescriptionAnalysis.prescriptionDate}`);
    }

    if (prescriptionAnalysis.daysRemaining !== undefined) {
      const days = prescriptionAnalysis.daysRemaining;
      if (days > 0) {
        prescriptionDetails.push(`⏰ Dias restantes: ${days} dias`);
      } else {
        prescriptionDetails.push(`✓ Prescrição já ocorreu (${Math.abs(days)} dias atrás)`);
        prescriptionPassed = true;
      }
    }

    prescriptionPassed = prescriptionStatus === 'INADMISSIBLE' || prescriptionStatus === 'ADMISSIBLE';
  } else {
    prescriptionDetails.push('Análise de prescrição não disponível');
  }

  // Etapa 3: Elegibilidade BAP
  // Verifica se o processo é elegível para inclusão no Banco de Arquivamentos por Prescrição
  const bapEligibilityDetails: string[] = [];
  let bapEligibilityPassed = false;

  // Critérios BAP: valor >= R$ 120.000 e prescrição ocorreu
  if (values && values.length > 0) {
    const totalValue = values.reduce((sum: number, v: any) => sum + v.amount, 0);
    if (totalValue >= 120000) {
      bapEligibilityDetails.push(`✓ Valor total (${totalValue.toLocaleString('pt-BR')}) >= R$ 120.000`);
      bapEligibilityPassed = true;
    } else {
      bapEligibilityDetails.push(`⚠ Valor total (${totalValue.toLocaleString('pt-BR')}) < R$ 120.000`);
      bapEligibilityPassed = false;
    }
  } else {
    bapEligibilityDetails.push('⚠ Valor não identificado - não é possível avaliar elegibilidade BAP');
  }

  if (prescriptionPassed) {
    bapEligibilityDetails.push('✓ Prescrição confirmada - elegível para BAP');
  } else {
    bapEligibilityDetails.push('⚠ Prescrição não confirmada - pode não ser elegível para BAP');
    bapEligibilityPassed = false;
  }

  // Parecer de IA (resumo executivo)
  const aiParecer = generateAIParecer({
    admissibilityPassed,
    prescriptionPassed,
    bapEligibilityPassed,
    prescriptionStatus,
    processNumber,
    totalValue: values?.reduce((sum: number, v: any) => sum + v.amount, 0) || 0,
  });

  return {
    admissibility: {
      stepName: '1️⃣ Admissibilidade do Processo',
      passed: admissibilityPassed,
      details: admissibilityDetails,
      status: admissibilityPassed ? 'ADMISSÍVEL' : 'REQUER REVISÃO',
    },
    prescription: {
      stepName: '2️⃣ Análise de Prescrição',
      passed: prescriptionPassed,
      details: prescriptionDetails,
      status: prescriptionStatus,
    },
    bapEligibility: {
      stepName: '3️⃣ Elegibilidade para BAP',
      passed: bapEligibilityPassed,
      details: bapEligibilityDetails,
      status: bapEligibilityPassed ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL',
    },
    aiParecer,
    rawData: backendData,
  };
}

/**
 * Gera parecer de IA baseado nos resultados da análise
 */
function generateAIParecer(analysis: {
  admissibilityPassed: boolean;
  prescriptionPassed: boolean;
  bapEligibilityPassed: boolean;
  prescriptionStatus: string;
  processNumber?: string;
  totalValue: number;
}): string {
  const { admissibilityPassed, prescriptionPassed, bapEligibilityPassed, prescriptionStatus, processNumber, totalValue } = analysis;

  let parecer = '';

  if (admissibilityPassed && prescriptionPassed && bapEligibilityPassed) {
    parecer = `✅ **RECOMENDAÇÃO: ARQUIVAMENTO NO BAP**\n\n`;
    parecer += `O processo ${processNumber || 'analisado'} atende todos os critérios para inclusão no Banco de Arquivamentos por Prescrição (BAP):\n`;
    parecer += `• Dados do processo estão completos e admissíveis\n`;
    parecer += `• Prescrição foi confirmada (${prescriptionStatus})\n`;
    parecer += `• Valor total (R$ ${totalValue.toLocaleString('pt-BR')}) atende o limite mínimo de R$ 120.000\n\n`;
    parecer += `**Próximas Ações:**\n1. Preparar documentação para CGU\n2. Incluir no BAP conforme IN TCU 98/2024\n3. Notificar responsáveis\n4. Arquivar processo`;
  } else if (admissibilityPassed && prescriptionPassed) {
    parecer = `⚠️ **RECOMENDAÇÃO: ANÁLISE COMPLEMENTAR**\n\n`;
    parecer += `O processo ${processNumber || 'analisado'} tem prescrição confirmada, mas não atende todos os critérios BAP.\n`;
    parecer += `Valor total (R$ ${totalValue.toLocaleString('pt-BR')}) pode estar abaixo do limite mínimo.\n\n`;
    parecer += `**Próximas Ações:**\n1. Revisar critérios de elegibilidade\n2. Considerar outras modalidades de resolução\n3. Consultar CGU se necessário`;
  } else if (admissibilityPassed) {
    parecer = `📋 **RECOMENDAÇÃO: ANÁLISE DETALHADA NECESSÁRIA**\n\n`;
    parecer += `O processo ${processNumber || 'analisado'} tem dados admissíveis, mas a prescrição não foi confirmada.\n`;
    parecer += `Status de prescrição: ${prescriptionStatus}\n\n`;
    parecer += `**Próximas Ações:**\n1. Verificar marcos processuais interruptivos\n2. Consultar histórico de solução consensual\n3. Revisar datas críticas manualmente`;
  } else {
    parecer = `❌ **RECOMENDAÇÃO: REJEIÇÃO OU COMPLEMENTAÇÃO**\n\n`;
    parecer += `O processo ${processNumber || 'analisado'} não atende aos critérios mínimos de admissibilidade.\n`;
    parecer += `Dados insuficientes para análise de prescrição.\n\n`;
    parecer += `**Próximas Ações:**\n1. Solicitar documentação complementar\n2. Revisar processo com responsável\n3. Reenviar após complementação`;
  }

  return parecer;
}
