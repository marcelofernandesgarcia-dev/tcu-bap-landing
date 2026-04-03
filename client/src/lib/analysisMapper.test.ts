import { describe, it, expect } from 'vitest';
import { mapBackendAnalysisToFrontend } from './analysisMapper';

describe('analysisMapper', () => {
  describe('mapBackendAnalysisToFrontend', () => {
    it('deve mapear dados do backend para estrutura do frontend', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [
          { label: 'Data do Fato', value: '2023-01-15' },
          { label: 'Data de Instauração', value: '2023-06-01' },
        ],
        values: [
          { label: 'Débito Original', amount: 150000, currency: 'BRL' },
        ],
        entities: [
          { type: 'Órgão', value: 'Prefeitura Municipal', confidence: 0.95 },
        ],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          prescriptionDate: '2028-01-15',
          reasoning: 'Prescrição ocorreu há 30 dias',
        },
        maskedText: 'Texto mascarado...',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result).toBeDefined();
      expect(result.admissibility).toBeDefined();
      expect(result.prescription).toBeDefined();
      expect(result.bapEligibility).toBeDefined();
      expect(result.aiParecer).toBeDefined();
    });

    it('deve marcar admissibilidade como passou quando dados estão completos', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [{ label: 'Valor', amount: 150000, currency: 'BRL' }],
        entities: [{ type: 'Órgão', value: 'Prefeitura', confidence: 0.95 }],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          reasoning: 'Prescrição ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.admissibility.passed).toBe(true);
      expect(result.admissibility.details.some((d: string) => d.includes('TCE-2024-00123'))).toBe(true);
    });

    it('deve marcar admissibilidade como falhou quando faltam dados', () => {
      const backendData = {
        success: true,
        processNumber: null,
        dates: [],
        values: [],
        entities: [],
        prescriptionAnalysis: {
          status: 'REQUIRES_REVIEW',
          reasoning: 'Sem dados',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.admissibility.passed).toBe(false);
    });

    it('deve marcar prescrição como passou quando daysRemaining é negativo', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [{ label: 'Valor', amount: 150000, currency: 'BRL' }],
        entities: [],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          prescriptionDate: '2028-01-15',
          reasoning: 'Prescrição ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.prescription.passed).toBe(true);
    });

    it('deve marcar prescrição como falhou quando daysRemaining é positivo', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [{ label: 'Valor', amount: 150000, currency: 'BRL' }],
        entities: [],
        prescriptionAnalysis: {
          status: 'ADMISSIBLE',
          daysRemaining: 365,
          prescriptionDate: '2028-01-15',
          reasoning: 'Prescrição ainda não ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.prescription.passed).toBe(true);
    });

    it('deve marcar BAP elegibilidade como passou quando valor >= 120000 e prescrição ocorreu', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [
          { label: 'Débito', amount: 150000, currency: 'BRL' },
        ],
        entities: [],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          reasoning: 'Prescrição ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.bapEligibility.passed).toBe(true);
    });

    it('deve marcar BAP elegibilidade como falhou quando valor < 120000', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [
          { label: 'Débito', amount: 50000, currency: 'BRL' },
        ],
        entities: [],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          reasoning: 'Prescrição ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.bapEligibility.passed).toBe(false);
    });

    it('deve gerar parecer de IA para arquivamento no BAP', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [{ label: 'Débito', amount: 150000, currency: 'BRL' }],
        entities: [],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          reasoning: 'Prescrição ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.aiParecer).toContain('ARQUIVAMENTO NO BAP');
      expect(result.aiParecer).toContain('TCE-2024-00123');
    });

    it('deve lançar erro quando success é false e sem dados', () => {
      const backendData = {
        success: false,
        maskedText: '',
      };
      expect(() => mapBackendAnalysisToFrontend(backendData)).toThrow();
    });

    it('deve lançar erro quando dados são null', () => {
      expect(() => mapBackendAnalysisToFrontend(null)).toThrow('Dados de análise não recebidos');
    });

    it('deve incluir dados brutos na resposta mapeada', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [],
        values: [],
        entities: [],
        prescriptionAnalysis: {
          status: 'REQUIRES_REVIEW',
          reasoning: 'Sem dados',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.rawData).toEqual(backendData);
    });

    it('deve incluir múltiplos valores na análise de BAP', () => {
      const backendData = {
        success: true,
        processNumber: 'TCE-2024-00123',
        dates: [{ label: 'Data', value: '2023-01-15' }],
        values: [
          { label: 'Débito Original', amount: 100000, currency: 'BRL' },
          { label: 'Juros', amount: 25000, currency: 'BRL' },
          { label: 'Correção', amount: 10000, currency: 'BRL' },
        ],
        entities: [],
        prescriptionAnalysis: {
          status: 'INADMISSIBLE',
          daysRemaining: -30,
          reasoning: 'Prescrição ocorreu',
        },
        maskedText: 'Texto',
      };

      const result = mapBackendAnalysisToFrontend(backendData);

      expect(result.bapEligibility.passed).toBe(true);
      expect(result.bapEligibility.details.some((d: string) => d.includes('135'))).toBe(true);
    });
  });
});
