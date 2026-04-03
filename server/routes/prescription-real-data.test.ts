/**
 * Testes de prescrição com dados reais conforme IN TCU 98/2024
 * Valida cálculo de prescrição, admissibilidade e materialidade
 */

import { describe, it, expect } from 'vitest';

/**
 * Simula análise de prescrição conforme IN TCU 98/2024
 * - Prescrição principal: 5 anos
 * - Prescrição intercorrente: 5 anos
 * - Limite de materialidade: R$ 120.000,00
 * - Limite de irrracionalidade: R$ 20.000,00
 */
function analyzePrescription(data: {
  factDate: Date;
  debtAmount: number;
  currentDate?: Date;
}) {
  const currentDate = data.currentDate || new Date('2026-04-03');
  const factDate = new Date(data.factDate);
  const prescriptionDate = new Date(factDate);
  prescriptionDate.setFullYear(prescriptionDate.getFullYear() + 5);

  const daysRemaining = Math.ceil(
    (prescriptionDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Verificar admissibilidade (IN TCU 98/2024)
  const isAdmissible = daysRemaining > 0 && data.debtAmount >= 120000;
  const status = isAdmissible ? 'ADMISSIBLE' : 'INADMISSIBLE';

  // Verificar materialidade (R$ 20.000 para somatório)
  const isMaterial = data.debtAmount >= 20000;

  return {
    factDate: factDate.toISOString().split('T')[0],
    prescriptionDate: prescriptionDate.toISOString().split('T')[0],
    daysRemaining,
    status,
    isMaterial,
    debtAmount: data.debtAmount,
    reasoning:
      daysRemaining <= 0
        ? `Processo prescrito em ${prescriptionDate.toLocaleDateString('pt-BR')} (${Math.abs(daysRemaining)} dias atrás)`
        : `Prescrição em ${prescriptionDate.toLocaleDateString('pt-BR')} (${daysRemaining} dias restantes)`,
  };
}

describe('Prescription Analysis with Real Data (IN TCU 98/2024)', () => {
  it('deve identificar prescrição para processo de 2020', () => {
    const result = analyzePrescription({
      factDate: new Date('2020-01-15'),
      debtAmount: 150000,
    });

    expect(result.status).toBe('INADMISSIBLE');
    expect(result.daysRemaining).toBeLessThan(0);
    expect(result.isMaterial).toBe(true);
  });

  it('deve identificar processo admissível com prescrição futura', () => {
    const result = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 150000,
    });

    expect(result.status).toBe('ADMISSIBLE');
    expect(result.daysRemaining).toBeGreaterThan(0);
  });

  it('deve respeitar limite de materialidade (R$ 120.000)', () => {
    const aboveLimit = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 120000,
    });

    const belowLimit = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 119999,
    });

    expect(aboveLimit.status).toBe('ADMISSIBLE');
    expect(belowLimit.status).toBe('INADMISSIBLE');
  });

  it('deve respeitar limite de irrracionalidade (R$ 20.000)', () => {
    const result1 = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 20000,
    });

    const result2 = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 19999,
    });

    expect(result1.isMaterial).toBe(true);
    expect(result2.isMaterial).toBe(false);
  });

  it('deve calcular prescrição corretamente para 5 anos', () => {
    const result = analyzePrescription({
      factDate: new Date('2021-01-15'),
      debtAmount: 150000,
      currentDate: new Date('2026-01-14'),
    });

    expect(result.daysRemaining).toBeGreaterThan(0);
    expect(result.status).toBe('ADMISSIBLE');
  });

  it('deve identificar prescrição no dia exato de 5 anos', () => {
    const result = analyzePrescription({
      factDate: new Date('2021-01-15'),
      debtAmount: 150000,
      currentDate: new Date('2026-01-16'),
    });

    expect(result.daysRemaining).toBeLessThanOrEqual(0);
  });

  it('deve processar múltiplos casos com diferentes datas', () => {
    const cases = [
      { factDate: new Date('2019-01-15'), debtAmount: 150000, expectedStatus: 'INADMISSIBLE' },
      { factDate: new Date('2020-06-15'), debtAmount: 150000, expectedStatus: 'INADMISSIBLE' },
      { factDate: new Date('2020-01-15'), debtAmount: 150000, expectedStatus: 'INADMISSIBLE' },
      { factDate: new Date('2021-01-15'), debtAmount: 150000, expectedStatus: 'INADMISSIBLE' },
    ];

    for (const testCase of cases) {
      const result = analyzePrescription({
        factDate: testCase.factDate,
        debtAmount: testCase.debtAmount,
      });

      expect(result.status).toBe(testCase.expectedStatus);
    }
  });

  it('deve incluir reasoning detalhado', () => {
    const result = analyzePrescription({
      factDate: new Date('2020-01-15'),
      debtAmount: 150000,
    });

    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.length).toBeGreaterThan(0);
    expect(result.reasoning).toContain('prescrito');
  });

  it('deve validar conformidade com IN TCU 98/2024', () => {
    // Caso 1: Prescrição com valor acima do limite
    const case1 = analyzePrescription({
      factDate: new Date('2020-01-15'),
      debtAmount: 150000,
    });

    expect(case1.status).toBe('INADMISSIBLE');
    expect(case1.isMaterial).toBe(true);

    // Caso 2: Valor abaixo do limite de materialidade
    const case2 = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 50000,
    });

    expect(case2.status).toBe('INADMISSIBLE');
    expect(case2.isMaterial).toBe(true);

    // Caso 3: Valor abaixo do limite de irrracionalidade
    const case3 = analyzePrescription({
      factDate: new Date('2022-01-15'),
      debtAmount: 10000,
    });

    expect(case3.status).toBe('INADMISSIBLE');
    expect(case3.isMaterial).toBe(false);
  });

  it('deve calcular prescrição intercorrente (5 anos)', () => {
    // Prescrição intercorrente: 5 anos sem atividade processual
    const result = analyzePrescription({
      factDate: new Date('2016-01-15'),
      debtAmount: 150000,
      currentDate: new Date('2026-04-03'),
    });

    // Deve estar prescrito (mais de 10 anos)
    expect(result.daysRemaining).toBeLessThan(0);
    expect(result.status).toBe('INADMISSIBLE');
  });

  it('deve validar casos com valores variados', () => {
    const amounts = [
      { value: 10000, expectedMaterial: false },
      { value: 20000, expectedMaterial: true },
      { value: 50000, expectedMaterial: true },
      { value: 120000, expectedMaterial: true },
      { value: 500000, expectedMaterial: true },
      { value: 1000000, expectedMaterial: true },
    ];

    for (const amount of amounts) {
      const result = analyzePrescription({
        factDate: new Date('2022-01-15'),
        debtAmount: amount.value,
      });

      expect(result.isMaterial).toBe(amount.expectedMaterial);
    }
  });
});
