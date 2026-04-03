/**
 * Serviço de Integração com Gemini Desktop
 * Análise local de documentos TCE/BAP sem envio de dados para cloud
 * Suporta extração de campos estruturados e análise de conformidade
 */

import axios, { AxiosInstance } from 'axios';

export interface GeminiAnalysisRequest {
  text: string;
  prompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ExtractedFields {
  processNumber?: string;
  dateOfTransfer?: string;
  dateOfTCEInauguration?: string;
  value?: number;
  organizationName?: string;
  responsibleNames?: string[];
  complianceIssues?: string[];
}

export interface GeminiAnalysisResult {
  rawAnalysis: string;
  extractedFields: ExtractedFields;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'REQUIRES_REVIEW';
  prescriptionAnalysis: {
    daysRemaining: number;
    prescriptionDate: string;
    status: 'ADMISSIBLE' | 'REQUIRES_REVIEW' | 'INADMISSIBLE';
  };
  confidence: number;
  processingTimeMs: number;
}

export interface GeminiDesktopConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export class GeminiDesktopService {
  private client: AxiosInstance;
  private config: GeminiDesktopConfig;
  private readonly defaultConfig: GeminiDesktopConfig = {
    apiUrl: 'http://localhost:8000/api/gemini',
    model: 'gemini-2.0-flash-local',
    temperature: 0.1, // Determinístico para análise
    maxTokens: 2000,
    timeout: 30000,
  };

  constructor(config: Partial<GeminiDesktopConfig> = {}) {
    this.config = { ...this.defaultConfig, ...config };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
    });
  }

  /**
   * Analisar texto OCR e extrair campos estruturados
   */
  async analyzeOCRText(ocrText: string): Promise<GeminiAnalysisResult> {
    const startTime = Date.now();

    try {
      // Prompt específico para análise TCE/BAP conforme IN TCU 98/2024
      const prompt = `
Você é um especialista em análise de Tomadas de Contas Especial (TCE) e Banco de Arquivamentos por Prescrição (BAP) conforme IN TCU nº 98/2024.

Analise o seguinte texto extraído de um documento TCE/BAP e extraia as seguintes informações:

TEXTO DO DOCUMENTO:
${ocrText}

INSTRUÇÕES DE ANÁLISE:
1. Extraia o número do processo (formato: TCE-AAAA-NNNNN)
2. Identifique a data de transferência do recurso
3. Identifique a data de instauração da TCE
4. Extraia o valor do dano/prejuízo em reais
5. Identifique o nome da organização responsável
6. Liste os nomes dos responsáveis (mascare CPF/CNPJ)
7. Identifique problemas de conformidade com IN TCU 98/2024
8. Calcule dias restantes até prescrição (5 anos após instauração)
9. Determine status de admissibilidade:
   - INADMISSÍVEL: valor < R$ 120.000 ou prescrito (>5 anos)
   - REQUER REVISÃO: < 180 dias para prescrição
   - ADMISSÍVEL: caso contrário

RESPONDA EM JSON COM ESTA ESTRUTURA:
{
  "processNumber": "TCE-AAAA-NNNNN",
  "dateOfTransfer": "YYYY-MM-DD",
  "dateOfTCEInauguration": "YYYY-MM-DD",
  "value": 123456.78,
  "organizationName": "Nome da Organização",
  "responsibleNames": ["Nome 1", "Nome 2"],
  "complianceIssues": ["Problema 1", "Problema 2"],
  "prescriptionAnalysis": {
    "daysRemaining": 652,
    "prescriptionDate": "YYYY-MM-DD",
    "status": "ADMISSIBLE"
  },
  "confidence": 0.95,
  "analysis_summary": "Resumo da análise"
}

Seja preciso e determinístico. Se não conseguir extrair um campo, use null.
`;

      const response = await this.client.post('/analyze', {
        text: ocrText,
        prompt,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
        model: this.config.model,
      });

      const analysisData = response.data;

      // Parsear resposta JSON
      let extractedFields: ExtractedFields = {};
      let prescriptionAnalysis = {
        daysRemaining: 0,
        prescriptionDate: new Date().toISOString().split('T')[0],
        status: 'REQUIRES_REVIEW' as const,
      };
      let confidence = 0.8;

      try {
        const jsonMatch = analysisData.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          extractedFields = {
            processNumber: parsed.processNumber,
            dateOfTransfer: parsed.dateOfTransfer,
            dateOfTCEInauguration: parsed.dateOfTCEInauguration,
            value: parsed.value,
            organizationName: parsed.organizationName,
            responsibleNames: parsed.responsibleNames,
            complianceIssues: parsed.complianceIssues,
          };
          prescriptionAnalysis = parsed.prescriptionAnalysis;
          confidence = parsed.confidence || 0.8;
        }
      } catch (e) {
        console.error('Erro ao parsear resposta JSON:', e);
        extractedFields = {};
        prescriptionAnalysis = {
          daysRemaining: 0,
          prescriptionDate: new Date().toISOString().split('T')[0],
          status: 'REQUIRES_REVIEW',
        };
      }

      // Determinar status de conformidade
      const complianceStatus = this.determineComplianceStatus(
        extractedFields,
        prescriptionAnalysis
      );

      const processingTime = Date.now() - startTime;

      return {
        rawAnalysis: analysisData.content,
        extractedFields,
        complianceStatus,
        prescriptionAnalysis,
        confidence,
        processingTimeMs: processingTime,
      };
    } catch (error) {
      throw new Error(`Erro ao analisar com Gemini Desktop: ${error}`);
    }
  }

  /**
   * Analisar conformidade com IN TCU 98/2024
   */
  async analyzeCompliance(ocrText: string): Promise<{
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `
Analise o seguinte documento TCE/BAP quanto à conformidade com IN TCU nº 98/2024:

${ocrText}

Identifique:
1. Problemas de conformidade
2. Recomendações para correção
3. Risco de prescrição

Responda em JSON:
{
  "compliant": true/false,
  "issues": ["Problema 1", "Problema 2"],
  "recommendations": ["Recomendação 1", "Recomendação 2"]
}
`;

      const response = await this.client.post('/analyze', {
        text: ocrText,
        prompt,
        temperature: 0.1,
        maxTokens: 1000,
      });

      const jsonMatch = response.data.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        compliant: false,
        issues: ['Não foi possível analisar o documento'],
        recommendations: ['Verifique o formato do documento'],
      };
    } catch (error) {
      throw new Error(`Erro ao analisar conformidade: ${error}`);
    }
  }

  /**
   * Extrair apenas campos estruturados
   */
  async extractStructuredFields(ocrText: string): Promise<ExtractedFields> {
    try {
      const prompt = `
Extraia os seguintes campos do documento TCE/BAP:
- Número do processo
- Data de transferência
- Data de instauração da TCE
- Valor do dano
- Nome da organização
- Nomes dos responsáveis

Texto:
${ocrText}

Responda APENAS em JSON, sem explicações.
`;

      const response = await this.client.post('/analyze', {
        text: ocrText,
        prompt,
        temperature: 0.05,
        maxTokens: 500,
      });

      const jsonMatch = response.data.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {};
    } catch (error) {
      console.error('Erro ao extrair campos:', error);
      return {};
    }
  }

  /**
   * Calcular prescrição baseado em datas extraídas
   */
  async calculatePrescription(
    dateOfTCEInauguration: string
  ): Promise<{
    prescriptionDate: string;
    daysRemaining: number;
    status: 'ADMISSIBLE' | 'REQUIRES_REVIEW' | 'INADMISSIBLE';
  }> {
    try {
      const inaugurDate = new Date(dateOfTCEInauguration);
      const prescriptionDate = new Date(inaugurDate);
      prescriptionDate.setFullYear(prescriptionDate.getFullYear() + 5); // 5 anos

      const today = new Date();
      const diffTime = prescriptionDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status: 'ADMISSIBLE' | 'REQUIRES_REVIEW' | 'INADMISSIBLE';
      if (daysRemaining < 0) {
        status = 'INADMISSIBLE'; // Prescrito
      } else if (daysRemaining < 180) {
        status = 'REQUIRES_REVIEW'; // Urgente
      } else {
        status = 'ADMISSIBLE'; // Normal
      }

      return {
        prescriptionDate: prescriptionDate.toISOString().split('T')[0],
        daysRemaining,
        status,
      };
    } catch (error) {
      throw new Error(`Erro ao calcular prescrição: ${error}`);
    }
  }

  /**
   * Determinar status de conformidade
   */
  private determineComplianceStatus(
    fields: ExtractedFields,
    prescription: any
  ): 'COMPLIANT' | 'NON_COMPLIANT' | 'REQUIRES_REVIEW' {
    // Verificar se valor está abaixo do limite
    if (fields.value && fields.value < 120000) {
      return 'NON_COMPLIANT'; // Abaixo do limite de materialidade
    }

    // Verificar prescrição
    if (prescription?.status === 'INADMISSIBLE') {
      return 'NON_COMPLIANT'; // Prescrito
    }

    if (prescription?.status === 'REQUIRES_REVIEW') {
      return 'REQUIRES_REVIEW'; // Próximo de prescrever
    }

    // Verificar problemas de conformidade
    if (fields.complianceIssues && fields.complianceIssues.length > 0) {
      return 'REQUIRES_REVIEW';
    }

    return 'COMPLIANT';
  }

  /**
   * Testar conexão com Gemini Desktop
   */
  async testConnection(): Promise<{
    connected: boolean;
    version?: string;
    model?: string;
  }> {
    try {
      const response = await this.client.get('/health');
      return {
        connected: true,
        version: response.data.version,
        model: response.data.model,
      };
    } catch (error) {
      return {
        connected: false,
      };
    }
  }

  /**
   * Processar lote de textos OCR
   */
  async processBatch(
    ocrTexts: string[]
  ): Promise<GeminiAnalysisResult[]> {
    const results: GeminiAnalysisResult[] = [];

    for (let i = 0; i < ocrTexts.length; i++) {
      try {
        console.log(`📊 Analisando documento ${i + 1}/${ocrTexts.length}...`);
        const result = await this.analyzeOCRText(ocrTexts[i]);
        results.push(result);
      } catch (error) {
        console.error(`❌ Erro ao analisar documento ${i + 1}:`, error);
      }
    }

    return results;
  }
}

// Exportar instância singleton
export const geminiDesktopService = new GeminiDesktopService({
  apiUrl: process.env.GEMINI_DESKTOP_API_URL || 'http://localhost:8000/api/gemini',
  apiKey: process.env.GEMINI_DESKTOP_API_KEY,
  model: 'gemini-2.0-flash-local',
  temperature: 0.1,
});
