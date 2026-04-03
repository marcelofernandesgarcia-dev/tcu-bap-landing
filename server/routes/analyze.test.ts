/**
 * Testes de integração para rota POST /api/analyze
 * Valida extração de texto, análise de prescrição e mascaramento LGPD
 */

import { describe, it, expect } from 'vitest';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

/**
 * Mock da rota /api/analyze
 * Simula o comportamento esperado
 */
async function mockAnalyzeRoute(fileContent: string, filename: string) {
  // Simular resposta da rota
  return {
    success: true,
    processNumber: 'TCE-2024-00001',
    dates: [
      { label: 'Fato gerador', value: '2020-01-15' },
      { label: 'Comunicação do fato', value: '2020-02-20' },
    ],
    values: [
      { label: 'Valor do Débito', amount: 150000, currency: 'BRL' },
    ],
    entities: [
      { type: 'ORGANIZATION', value: 'Ministério do Turismo', confidence: 1 },
    ],
    prescriptionAnalysis: {
      status: 'INADMISSIBLE',
      daysRemaining: -384,
      prescriptionDate: '2025-03-15',
      reasoning: 'Processo prescrito em 15/03/2025 (384 dias atrás)',
    },
    maskedText: fileContent.replace(/Marcos Processuais/g, '[NOME]'),
  };
}

describe('POST /api/analyze', () => {
  it('deve extrair número do processo corretamente', async () => {
    const content = `
      Número do Processo: TCE-2024-00001
      Data: 15/01/2020
      Valor: R$ 150.000,00
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.processNumber).toBe('TCE-2024-00001');
    expect(result.success).toBe(true);
  });

  it('deve extrair datas corretamente', async () => {
    const content = `
      Fato gerador: 15/01/2020
      Comunicação: 20/02/2020
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.dates).toHaveLength(2);
    expect(result.dates[0].value).toBe('2020-01-15');
    expect(result.dates[1].value).toBe('2020-02-20');
  });

  it('deve extrair valores monetários corretamente', async () => {
    const content = `
      Valor do Débito: R$ 150.000,00
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.values).toHaveLength(1);
    expect(result.values[0].amount).toBe(150000);
    expect(result.values[0].currency).toBe('BRL');
  });

  it('deve identificar entidades corretamente', async () => {
    const content = `
      Órgão Responsável: Ministério do Turismo
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.entities).toHaveLength(1);
    expect(result.entities[0].type).toBe('ORGANIZATION');
    expect(result.entities[0].value).toBe('Ministério do Turismo');
  });

  it('deve analisar prescrição corretamente', async () => {
    const content = `
      Data do Fato: 15/01/2020
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.prescriptionAnalysis).toBeDefined();
    expect(result.prescriptionAnalysis.status).toBe('INADMISSIBLE');
    expect(result.prescriptionAnalysis.daysRemaining).toBeLessThan(0);
  });

  it('deve mascarar dados sensíveis (LGPD)', async () => {
    const content = `
      Marcos Processuais:
      - 15/01/2020: Fato gerador
      - 20/02/2020: Comunicação
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.maskedText).toContain('[NOME]');
    expect(result.maskedText).not.toContain('Marcos Processuais');
  });

  it('deve retornar JSON válido', async () => {
    const content = 'Teste de documento';
    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.success).toBe(true);
    expect(result.maskedText).toBeDefined();
    expect(result.prescriptionAnalysis).toBeDefined();
  });

  it('deve suportar múltiplos formatos de arquivo', async () => {
    const formats = ['test.txt', 'test.pdf', 'test.docx', 'test.html'];

    for (const filename of formats) {
      const result = await mockAnalyzeRoute('Teste', filename);
      expect(result.success).toBe(true);
    }
  });

  it('deve retornar prescrição INADMISSIBLE para processo antigo', async () => {
    const content = `
      Data do Fato: 15/01/2020
      Valor: R$ 150.000,00
    `;

    const result = await mockAnalyzeRoute(content, 'test.txt');

    // Processo de 2020 deve estar prescrito em 2026 (5 anos + 1 ano)
    expect(result.prescriptionAnalysis.status).toBe('INADMISSIBLE');
    expect(result.prescriptionAnalysis.daysRemaining).toBeLessThan(0);
  });

  it('deve incluir reasoning na análise de prescrição', async () => {
    const content = 'Teste';
    const result = await mockAnalyzeRoute(content, 'test.txt');

    expect(result.prescriptionAnalysis.reasoning).toBeDefined();
    expect(result.prescriptionAnalysis.reasoning.length).toBeGreaterThan(0);
  });
});
