import { describe, it, expect } from 'vitest';
import { extractConclusions } from './conclusionExtractor';

describe('conclusionExtractor', () => {
  describe('extractConclusions', () => {
    it('deve extrair conclusões de uma análise válida', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2020-01-15',
        processPhase: 'Em Julgamento',
        prescriptionAnalysis: {
          isPrescribed: false,
          isIntercurrentPrescribed: false,
          daysUntilMainPrescription: 300
        },
        bapData: {
          isEligible: true,
          paralysisYears: 5,
          debtBelowLimit: false,
          noCGUCertification: true,
          checklist: []
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.parecer).toBeDefined();
      expect(result.parecer).toContain('72000.123456/2023-45');
      expect(result.parecer).toContain('R$ 150.000,00');
      expect(result.recomendacoes).toBeDefined();
      expect(Array.isArray(result.recomendacoes)).toBe(true);
      expect(result.statusBAP).toBeDefined();
      expect(result.statusBAP.elegivel).toBe(true);
      expect(result.alertasPrescrição).toBeDefined();
      expect(Array.isArray(result.alertasPrescrição)).toBe(true);
    });

    it('deve gerar alerta PRESCRITO quando prescrição principal é configurada', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2015-01-15',
        processPhase: 'Arquivado',
        prescriptionAnalysis: {
          isPrescribed: true,
          isIntercurrentPrescribed: false,
          daysUntilMainPrescription: 0
        },
        bapData: {
          isEligible: false,
          paralysisYears: 8,
          debtBelowLimit: false,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.alertasPrescrição).toContainEqual(
        expect.objectContaining({
          tipo: 'PRESCRITO',
          mensagem: expect.stringContaining('PRESCRIÇÃO PRINCIPAL')
        })
      );
    });

    it('deve gerar alerta RISCO_IMINENTE quando prescrição está próxima', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2020-01-15',
        processPhase: 'Em Julgamento',
        prescriptionAnalysis: {
          isPrescribed: false,
          isIntercurrentPrescribed: false,
          daysUntilMainPrescription: 100
        },
        bapData: {
          isEligible: false,
          paralysisYears: 4,
          debtBelowLimit: false,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.alertasPrescrição).toContainEqual(
        expect.objectContaining({
          tipo: 'RISCO_IMINENTE',
          diasRestantes: 100
        })
      );
    });

    it('deve incluir recomendação de BAP quando elegível', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2015-01-15',
        processPhase: 'Arquivado',
        prescriptionAnalysis: {
          isPrescribed: false,
          isIntercurrentPrescribed: false
        },
        bapData: {
          isEligible: true,
          paralysisYears: 8,
          debtBelowLimit: false,
          noCGUCertification: true,
          checklist: Array(12).fill({ status: '✅ Extraído' })
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.recomendacoes).toContainEqual(
        expect.stringContaining('Banco de Arquivamentos por Prescrição')
      );
    });

    it('deve incluir recomendação de dispensa de TCE para débito abaixo de 120mil', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 50000,
        dateOfFact: '2020-01-15',
        processPhase: 'Em Análise',
        prescriptionAnalysis: {
          isPrescribed: false,
          isIntercurrentPrescribed: false
        },
        bapData: {
          isEligible: false,
          paralysisYears: 3,
          debtBelowLimit: true,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.recomendacoes).toContainEqual(
        expect.stringContaining('R$ 120.000,00')
      );
    });

    it('deve extrair status BAP corretamente', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2015-01-15',
        processPhase: 'Arquivado',
        prescriptionAnalysis: {},
        bapData: {
          isEligible: true,
          paralysisYears: 8,
          debtBelowLimit: false,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.statusBAP.elegivel).toBe(true);
      expect(result.statusBAP.paralysisYears).toBe(8);
      expect(result.statusBAP.motivo).toContain('elegível');
    });

    it('deve incluir selo de transparência no parecer', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2020-01-15',
        processPhase: 'Em Análise',
        prescriptionAnalysis: {},
        bapData: {
          isEligible: false,
          paralysisYears: 3,
          debtBelowLimit: true,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.versaoSIACT).toBe('v7.9.4');
      expect(result.dataAnalise).toBeDefined();
    });

    it('deve lidar com dados undefined graciosamente', () => {
      const analysisResponse = {
        processNumber: undefined,
        debtValue: undefined,
        dateOfFact: undefined,
        processPhase: undefined,
        prescriptionAnalysis: {},
        bapData: {},
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.parecer).toBeDefined();
      expect(result.parecer).toContain('Não identificado');
      expect(result.recomendacoes).toBeDefined();
      expect(result.statusBAP).toBeDefined();
    });

    it('deve incluir humanSuggestions nas recomendações', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2020-01-15',
        processPhase: 'Em Análise',
        prescriptionAnalysis: {},
        bapData: {
          isEligible: false,
          paralysisYears: 3,
          debtBelowLimit: true,
          noCGUCertification: true
        },
        humanSuggestions: [
          'Sugestão de análise complementar',
          'Verificar documentação adicional'
        ],
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.recomendacoes).toContainEqual('Sugestão de análise complementar');
      expect(result.recomendacoes).toContainEqual('Verificar documentação adicional');
    });

    it('deve gerar alerta REGULAR quando sem riscos', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2023-01-15',
        processPhase: 'Em Análise',
        prescriptionAnalysis: {
          isPrescribed: false,
          isIntercurrentPrescribed: false,
          daysUntilMainPrescription: 1000
        },
        bapData: {
          isEligible: false,
          paralysisYears: 1,
          debtBelowLimit: false,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.alertasPrescrição).toContainEqual(
        expect.objectContaining({
          tipo: 'REGULAR',
          mensagem: expect.stringContaining('situação regular')
        })
      );
    });

    it('deve incluir fundamentação legal no parecer', () => {
      const analysisResponse = {
        processNumber: '72000.123456/2023-45',
        debtValue: 150000,
        dateOfFact: '2020-01-15',
        processPhase: 'Em Análise',
        prescriptionAnalysis: {},
        bapData: {
          isEligible: false,
          paralysisYears: 3,
          debtBelowLimit: true,
          noCGUCertification: true
        },
        isAnalysable: true
      };

      const result = extractConclusions(analysisResponse);

      expect(result.parecer).toContain('Lei nº 9.873/1999');
      expect(result.parecer).toContain('Resolução TCU nº 344/2022');
      expect(result.parecer).toContain('IN TCU nº 98/2024');
      expect(result.parecer).toContain('Portaria TCU nº 121/2025');
    });
  });
});
