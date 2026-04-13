import { ConclusionData } from '@/components/AnalysisConclusions';

/**
 * Extrai conclusões estruturadas da resposta da análise
 */
export const extractConclusions = (analysisResponse: any): ConclusionData => {
  const now = new Date().toISOString();

  // Extrair parecer principal
  const parecer = generateParecer(analysisResponse);

  // Extrair recomendações
  const recomendacoes = extractRecommendations(analysisResponse);

  // Extrair status BAP
  const statusBAP = extractBAPStatus(analysisResponse);

  // Extrair alertas de prescrição
  const alertasPrescrição = extractPrescriptionAlerts(analysisResponse);

  return {
    parecer,
    recomendacoes,
    statusBAP,
    alertasPrescrição,
    dataAnalise: now,
    versaoSIACT: 'v7.9.4'
  };
};

/**
 * Gera parecer estruturado a partir dos dados da análise
 */
function generateParecer(data: any): string {
  const processNumber = data.processNumber || 'Não identificado';
  const debtValue = data.debtValue ? `R$ ${(data.debtValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado';
  const processPhase = data.processPhase || 'Não identificada';
  const dateOfFact = data.dateOfFact ? new Date(data.dateOfFact).toLocaleDateString('pt-BR') : 'Não informada';

  const prescriptionStatus = determinePrescriptionStatus(data);
  const bapEligibility = data.bapData?.isEligible ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL';

  return `## Parecer de Análise de Prescrição

**Processo:** ${processNumber}  
**Valor do Débito:** ${debtValue}  
**Data do Fato:** ${dateOfFact}  
**Fase Processual:** ${processPhase}

### Conclusão Principal

Com base na análise realizada conforme a **Instrução Normativa TCU nº 98/2024**, **Resolução TCU nº 344/2022** e **Lei nº 9.873/1999**, conclui-se que:

1. **Status de Prescrição:** ${prescriptionStatus}
2. **Elegibilidade para BAP:** ${bapEligibility}
3. **Conformidade com IN TCU 98/2024:** ${data.isAnalysable ? 'Conforme' : 'Não conforme'}

### Análise Detalhada

${generateDetailedAnalysis(data)}

### Fundamentação Legal

- **Lei nº 9.873/1999:** Estabelece os prazos para o exercício de ação punitiva
- **Resolução TCU nº 344/2022:** Regulamenta a prescrição principal e intercorrente
- **IN TCU nº 98/2024:** Define critérios de materialidade (R$ 120.000,00) e admissibilidade
- **Portaria TCU nº 121/2025:** Procedimentos para Banco de Arquivamento (BAP)

---
*Parecer gerado automaticamente pelo SIACT v7.9.4 - Analisador de Prescrição*`;
}

/**
 * Extrai recomendações da análise
 */
function extractRecommendations(data: any): string[] {
  const recommendations: string[] = [];

  // Recomendações baseadas em prescrição
  if (data.prescriptionAnalysis?.isPrescribed) {
    recommendations.push('Arquivar o processo por prescrição conforme Art. 17 da Res. TCU 344/2022');
  }

  if (data.prescriptionAnalysis?.isIntercurrentPrescribed) {
    recommendations.push('Aplicar prescrição intercorrente - 3 anos sem atos interruptivos');
  }

  // Recomendações baseadas em BAP
  if (data.bapData?.isEligible) {
    recommendations.push('Incluir no Banco de Arquivamentos por Prescrição (BAP) conforme Portaria TCU 121/2025');
    recommendations.push('Preparar documentação conforme Art. 30 da Portaria TCU 121/2025');
  }

  // Recomendações baseadas em materialidade
  if (data.debtValue && data.debtValue < 120000) {
    recommendations.push('Débito abaixo do limite de materialidade (R$ 120.000,00) - Dispensa de TCE');
  }

  // Recomendações gerais
  if (data.validationFlags?.requiresHumanReview) {
    recommendations.push('Recomenda-se análise complementar por auditor especializado');
  }

  if (data.humanSuggestions && Array.isArray(data.humanSuggestions)) {
    recommendations.push(...data.humanSuggestions);
  }

  // Se não houver recomendações, adicionar padrão
  if (recommendations.length === 0) {
    recommendations.push('Manter em análise conforme procedimentos padrão');
  }

  return recommendations;
}

/**
 * Extrai status BAP
 */
function extractBAPStatus(data: any): { elegivel: boolean; motivo: string; paralysisYears: number } {
  const bapData = data.bapData || {};
  const paralysisYears = bapData.paralysisYears || 0;

  let motivo = '';

  if (bapData.isEligible) {
    motivo = `Processo elegível para BAP. Paralisação: ${paralysisYears} anos. Atende aos critérios da Portaria TCU 121/2025.`;
  } else {
    const reasons: string[] = [];

    if (!bapData.debtBelowLimit && data.debtValue && data.debtValue >= 120000) {
      reasons.push('Débito acima do limite');
    }

    if (paralysisYears < 5) {
      reasons.push(`Paralisação insuficiente (${paralysisYears} anos, mínimo 5)`);
    }

    if (!bapData.noCGUCertification && data.hasCGUCertification) {
      reasons.push('Possui certificação CGU');
    }

    motivo = reasons.length > 0 
      ? `Processo não elegível para BAP. Motivos: ${reasons.join('; ')}.`
      : 'Processo não atende aos critérios de elegibilidade para BAP.';
  }

  return {
    elegivel: bapData.isEligible || false,
    motivo,
    paralysisYears
  };
}

/**
 * Extrai alertas de prescrição
 */
function extractPrescriptionAlerts(data: any): Array<{
  tipo: 'PRESCRITO' | 'RISCO_IMINENTE' | 'ATENCAO' | 'REGULAR';
  mensagem: string;
  diasRestantes?: number;
}> {
  const alerts: Array<{
    tipo: 'PRESCRITO' | 'RISCO_IMINENTE' | 'ATENCAO' | 'REGULAR';
    mensagem: string;
    diasRestantes?: number;
  }> = [];

  const prescriptionAnalysis = data.prescriptionAnalysis || {};

  // Alerta de prescrição principal
  if (prescriptionAnalysis.isPrescribed) {
    alerts.push({
      tipo: 'PRESCRITO',
      mensagem: '🔴 PRESCRIÇÃO PRINCIPAL CONFIGURADA - 5 anos sem atos interruptivos'
    });
  } else if (prescriptionAnalysis.daysUntilMainPrescription) {
    const days = prescriptionAnalysis.daysUntilMainPrescription;
    if (days < 180) {
      alerts.push({
        tipo: 'RISCO_IMINENTE',
        mensagem: '🟠 RISCO IMINENTE DE PRESCRIÇÃO PRINCIPAL',
        diasRestantes: days
      });
    } else if (days < 365) {
      alerts.push({
        tipo: 'ATENCAO',
        mensagem: '🟡 ATENÇÃO - Prescrição principal em prazo próximo',
        diasRestantes: days
      });
    }
  }

  // Alerta de prescrição intercorrente
  if (prescriptionAnalysis.isIntercurrentPrescribed) {
    alerts.push({
      tipo: 'PRESCRITO',
      mensagem: '🔴 PRESCRIÇÃO INTERCORRENTE CONFIGURADA - 3 anos sem atos interruptivos'
    });
  } else if (prescriptionAnalysis.daysUntilIntercurrentPrescription) {
    const days = prescriptionAnalysis.daysUntilIntercurrentPrescription;
    if (days < 90) {
      alerts.push({
        tipo: 'RISCO_IMINENTE',
        mensagem: '🟠 RISCO IMINENTE DE PRESCRIÇÃO INTERCORRENTE',
        diasRestantes: days
      });
    } else if (days < 180) {
      alerts.push({
        tipo: 'ATENCAO',
        mensagem: '🟡 ATENÇÃO - Prescrição intercorrente em prazo próximo',
        diasRestantes: days
      });
    }
  }

  // Se não houver alertas críticos, adicionar status regular
  if (alerts.length === 0) {
    alerts.push({
      tipo: 'REGULAR',
      mensagem: '🟢 Processo em situação regular - Sem riscos imediatos de prescrição'
    });
  }

  return alerts;
}

/**
 * Determina o status de prescrição
 */
function determinePrescriptionStatus(data: any): string {
  const prescriptionAnalysis = data.prescriptionAnalysis || {};

  if (prescriptionAnalysis.isPrescribed) {
    return 'PRESCRITO - Prescrição principal configurada (5 anos)';
  }

  if (prescriptionAnalysis.isIntercurrentPrescribed) {
    return 'PRESCRITO - Prescrição intercorrente configurada (3 anos)';
  }

  if (prescriptionAnalysis.daysUntilMainPrescription && prescriptionAnalysis.daysUntilMainPrescription < 180) {
    return `RISCO IMINENTE - ${prescriptionAnalysis.daysUntilMainPrescription} dias para prescrição principal`;
  }

  return 'EM ANÁLISE - Sem prescrição configurada';
}

/**
 * Gera análise detalhada
 */
function generateDetailedAnalysis(data: any): string {
  const sections: string[] = [];

  // Seção de Admissibilidade
  sections.push(`#### Admissibilidade

- **Materialidade:** ${data.debtValue && data.debtValue >= 120000 ? '✅ Acima de R$ 120.000,00' : '❌ Abaixo de R$ 120.000,00'}
- **Temporalidade:** ${data.dateOfFact ? '✅ Data do fato identificada' : '❌ Data do fato não identificada'}
- **Identificação de Responsáveis:** ${data.entities && data.entities.length > 0 ? '✅ Responsáveis identificados' : '❌ Responsáveis não identificados'}`);

  // Seção de Prescrição
  sections.push(`#### Análise de Prescrição

- **Prescrição Principal:** ${data.prescriptionAnalysis?.isPrescribed ? '🔴 CONFIGURADA' : '🟢 Não configurada'}
- **Prescrição Intercorrente:** ${data.prescriptionAnalysis?.isIntercurrentPrescribed ? '🔴 CONFIGURADA' : '🟢 Não configurada'}
- **Atos Interruptivos:** ${data.events && data.events.length > 0 ? `${data.events.length} evento(s) identificado(s)` : 'Nenhum evento identificado'}`);

  // Seção de BAP
  sections.push(`#### Elegibilidade para BAP (Portaria TCU 121/2025)

- **Status:** ${data.bapData?.isEligible ? '✅ ELEGÍVEL' : '❌ NÃO ELEGÍVEL'}
- **Paralisação:** ${data.bapData?.paralysisYears || 0} anos
- **Checklist Completo:** ${data.bapData?.checklist && data.bapData.checklist.length === 12 ? '✅ Sim' : '❌ Parcial'}`);

  return sections.join('\n\n');
}
