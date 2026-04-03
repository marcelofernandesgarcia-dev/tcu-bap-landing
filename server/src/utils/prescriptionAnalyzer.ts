/**
 * SIACT - Motor de Análise de Prescrição
 * Lógica determinística para cálculo de prescrição conforme IN TCU 98/2024
 * Lei 9.873/1999 - Prescrição Administrativa
 * Resolução TCU 344/2022 - Prescrição Principal e Intercorrente
 */

import { ProcessData, ProcessEvent, AnalysisStepResult, AnalysisStatus, EventType, FinalAnalysis } from '../../../shared/analyzer-types';

// Configuração TCU
export const TCU_CONFIG = {
  MATERIALITY_THRESHOLD: 120000, // R$ 120 mil - IN TCU 98/2024
  MATERIALITY_THRESHOLD_BAP: 20000, // R$ 20 mil - Portaria 121/2025
  TEMPORALITY_LIMIT_YEARS: 5, // Lei 9.873/1999
  INTERCURRENT_LIMIT_YEARS: 3, // Resolução TCU 344/2022
  BAP_DEADLINE: '2024-12-31', // Portaria 121/2025
};

// Helper functions
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return isNaN(d.getTime()) ? new Date() : d;
};

const daysBetween = (d1: Date, d2: Date): number => {
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const yearsBetween = (d1: Date, d2: Date): number => {
  return daysBetween(d1, d2) / 365.25;
};

const monthsBetween = (d1: Date, d2: Date): number => {
  return daysBetween(d1, d2) / 30.44;
};

const formatTimeGap = (d1: Date, d2: Date): string => {
  let start = new Date(d1);
  let end = new Date(d2);
  
  if (start > end) {
    [start, end] = [end, start];
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  
  if (parts.length === 0) return "0 dias";
  if (parts.length === 1) return parts[0];
  const last = parts.pop();
  return `${parts.join(', ')} e ${last}`;
};

/**
 * Verificar Admissibilidade
 * Critérios: Materialidade (R$ 120k) e Temporalidade (5 anos)
 */
export const checkAdmissibility = (data: ProcessData): AnalysisStepResult => {
  const details: string[] = [];
  let passed = true;

  // 1. Materialidade
  if (data.debtValue < TCU_CONFIG.MATERIALITY_THRESHOLD) {
    passed = false;
    details.push(`❌ Materialidade não atendida: R$ ${data.debtValue.toLocaleString('pt-BR')} < R$ ${TCU_CONFIG.MATERIALITY_THRESHOLD.toLocaleString('pt-BR')} (IN TCU 98/2024)`);
  } else {
    details.push(`✅ Materialidade atendida: R$ ${data.debtValue.toLocaleString('pt-BR')} (IN TCU 98/2024)`);
  }

  // 2. Temporalidade
  const factDate = parseDate(data.dateOfFact);
  const prescriptionStartDate = data.prescriptionStartDate ? parseDate(data.prescriptionStartDate) : factDate;
  const now = new Date();
  
  const yearsElapsed = yearsBetween(prescriptionStartDate, now);

  if (yearsElapsed > TCU_CONFIG.TEMPORALITY_LIMIT_YEARS) {
    passed = false;
    details.push(`❌ Temporalidade excedida: ${formatTimeGap(prescriptionStartDate, now)} desde o marco inicial (Lei 9.873/1999)`);
  } else {
    details.push(`✅ Temporalidade OK: ${formatTimeGap(prescriptionStartDate, now)} desde o marco inicial`);
  }

  if (data.isTCE) {
    details.push(`📋 Processo em fase de Tomada de Contas Especial (TCE)`);
  }

  return {
    stepName: 'Admissibilidade',
    passed,
    details,
    status: passed ? AnalysisStatus.APPROVED : AnalysisStatus.REJECTED
  };
};

/**
 * Verificar Prescrição
 * Critérios: Principal (5 anos) e Intercorrente (3 anos)
 */
export const checkPrescription = (data: ProcessData): AnalysisStepResult => {
  const details: string[] = [];
  let passed = true;

  const prescriptionStartDate = data.prescriptionStartDate ? parseDate(data.prescriptionStartDate) : parseDate(data.dateOfFact);
  const now = new Date();
  const yearsElapsed = yearsBetween(prescriptionStartDate, now);
  const monthsElapsed = monthsBetween(prescriptionStartDate, now);

  // Prescrição Principal (5 anos)
  if (yearsElapsed >= TCU_CONFIG.TEMPORALITY_LIMIT_YEARS) {
    passed = false;
    details.push(`🔴 PRESCRIÇÃO PRINCIPAL: ${formatTimeGap(prescriptionStartDate, now)} decorridos (Lei 9.873/1999)`);
    details.push(`Data de prescrição: ${new Date(prescriptionStartDate.getTime() + 5 * 365.25 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`);
  } else {
    const remainingYears = TCU_CONFIG.TEMPORALITY_LIMIT_YEARS - yearsElapsed;
    details.push(`✅ Prescrição principal não ocorreu: ${formatTimeGap(prescriptionStartDate, now)} decorridos`);
    details.push(`⏰ Tempo restante: ${remainingYears.toFixed(1)} anos (Lei 9.873/1999)`);
    
    if (remainingYears < 0.5) {
      details.push(`⚠️ ALERTA: Faltam menos de 6 meses para prescrição principal!`);
    }
  }

  // Prescrição Intercorrente (3 anos sem atos inequívocos)
  if (data.events && data.events.length > 0) {
    const sortedEvents = [...data.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastInterruptiveEvent = sortedEvents.reverse().find(e => e.isInterruptive);
    
    if (lastInterruptiveEvent) {
      const lastEventDate = parseDate(lastInterruptiveEvent.date);
      const yearsSinceLastEvent = yearsBetween(lastEventDate, now);
      
      if (yearsSinceLastEvent >= TCU_CONFIG.INTERCURRENT_LIMIT_YEARS) {
        passed = false;
        details.push(`🔴 PRESCRIÇÃO INTERCORRENTE: ${formatTimeGap(lastEventDate, now)} sem atos inequívocos (Resolução TCU 344/2022)`);
      } else {
        details.push(`✅ Prescrição intercorrente não ocorreu: ${formatTimeGap(lastEventDate, now)} desde último ato inequívoco`);
        const remainingMonths = (TCU_CONFIG.INTERCURRENT_LIMIT_YEARS * 12) - (yearsSinceLastEvent * 12);
        details.push(`⏰ Tempo restante: ${remainingMonths.toFixed(0)} meses (Resolução TCU 344/2022)`);
        
        if (remainingMonths < 6) {
          details.push(`⚠️ ALERTA: Faltam menos de 6 meses para prescrição intercorrente!`);
        }
      }
    }
  }

  return {
    stepName: 'Prescrição',
    passed,
    details,
    status: passed ? AnalysisStatus.NOT_PRESCRIBED : AnalysisStatus.PRESCRIBED
  };
};

/**
 * Verificar Elegibilidade BAP
 * Critérios: Portaria TCU 121/2025
 */
export const checkBAPEligibility = (data: ProcessData): AnalysisStepResult => {
  const details: string[] = [];
  let passed = true;

  // 1. Valor do débito (R$ 20 mil)
  if (data.debtValue < TCU_CONFIG.MATERIALITY_THRESHOLD_BAP) {
    passed = false;
    details.push(`❌ Valor abaixo do limite BAP: R$ ${data.debtValue.toLocaleString('pt-BR')} < R$ ${TCU_CONFIG.MATERIALITY_THRESHOLD_BAP.toLocaleString('pt-BR')}`);
  } else {
    details.push(`✅ Valor elegível para BAP: R$ ${data.debtValue.toLocaleString('pt-BR')}`);
  }

  // 2. Prazo limite (31/12/2024)
  const factDate = parseDate(data.dateOfFact);
  const bapDeadline = parseDate(TCU_CONFIG.BAP_DEADLINE);
  
  if (factDate > bapDeadline) {
    passed = false;
    details.push(`❌ Fato gerador após prazo limite: ${factDate.toLocaleDateString('pt-BR')} > 31/12/2024`);
  } else {
    details.push(`✅ Fato gerador dentro do prazo: ${factDate.toLocaleDateString('pt-BR')} (Portaria 121/2025)`);
  }

  // 3. Certificação CGU
  if (data.bapData?.noCGUCertification) {
    passed = false;
    details.push(`❌ Sem certificação da CGU`);
  } else {
    details.push(`✅ Certificação CGU: Presente ou em andamento`);
  }

  // 4. Solução Consensual
  if (data.hasConsensualSolution) {
    details.push(`✅ Histórico de solução consensual: Sim`);
  }

  return {
    stepName: 'Elegibilidade BAP',
    passed,
    details,
    status: passed ? AnalysisStatus.BAP_ELIGIBLE : AnalysisStatus.REJECTED
  };
};

/**
 * Executar análise completa
 */
export const runFullAnalysis = (data: ProcessData): FinalAnalysis => {
  return {
    admissibility: checkAdmissibility(data),
    prescription: checkPrescription(data),
    bapEligibility: checkBAPEligibility(data)
  };
};

/**
 * Gerar resumo executivo
 */
export const generateExecutiveSummary = (analysis: FinalAnalysis): string => {
  const lines: string[] = [];
  
  lines.push('📊 RESUMO EXECUTIVO DA ANÁLISE');
  lines.push('═'.repeat(50));
  
  lines.push(`\n1. ADMISSIBILIDADE: ${analysis.admissibility.passed ? '✅ APROVADO' : '❌ REJEITADO'}`);
  analysis.admissibility.details.forEach(d => lines.push(`   ${d}`));
  
  lines.push(`\n2. PRESCRIÇÃO: ${analysis.prescription.passed ? '✅ NÃO PRESCRITO' : '❌ PRESCRITO'}`);
  analysis.prescription.details.forEach(d => lines.push(`   ${d}`));
  
  lines.push(`\n3. ELEGIBILIDADE BAP: ${analysis.bapEligibility.passed ? '✅ ELEGÍVEL' : '❌ NÃO ELEGÍVEL'}`);
  analysis.bapEligibility.details.forEach(d => lines.push(`   ${d}`));
  
  lines.push('\n' + '═'.repeat(50));
  
  return lines.join('\n');
};
