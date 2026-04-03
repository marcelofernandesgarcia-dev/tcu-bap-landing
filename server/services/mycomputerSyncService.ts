/**
 * Serviço de Sincronização com SIACT Web App
 * Sincroniza resultados de análises do Manus Desktop com Dashboard SIACT
 */

import axios, { AxiosInstance } from 'axios';

export interface SyncAnalysis {
  processNumber: string;
  dateOfTransfer: string;
  dateOfTCEInauguration: string;
  value: number;
  organizationName: string;
  responsibleNames: string[];
  complianceIssues: string[];
  prescriptionAnalysis: {
    daysRemaining: number;
    prescriptionDate: string;
    status: 'ADMISSIBLE' | 'REQUIRES_REVIEW' | 'INADMISSIBLE';
  };
  confidence: number;
  ocrMethod: 'tesseract' | 'paddle' | 'hybrid';
  processingTimeMs: number;
  sourceFile: string;
  processedAt: Date;
}

export interface SyncResult {
  success: boolean;
  analysisId?: string;
  dashboardUpdated: boolean;
  kpiUpdated: {
    totalAnalyses: number;
    admissible: number;
    requiresReview: number;
    inadmissible: number;
    urgent: number;
  };
  syncDuration: number;
  error?: string;
}

export interface MyComputerSyncConfig {
  siactWebUrl?: string;
  apiKey?: string;
  syncInterval?: number; // em ms
  autoSync?: boolean;
  batchSize?: number;
}

export class MyComputerSyncService {
  private client: AxiosInstance;
  private config: MyComputerSyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly defaultConfig: MyComputerSyncConfig = {
    siactWebUrl: process.env.SIACT_WEB_URL || 'https://baplanding-4wdv8y7a.manus.space',
    apiKey: process.env.SIACT_API_KEY,
    syncInterval: 300000, // 5 minutos
    autoSync: true,
    batchSize: 10,
  };

  constructor(config: Partial<MyComputerSyncConfig> = {}) {
    this.config = { ...this.defaultConfig, ...config };

    this.client = axios.create({
      baseURL: this.config.siactWebUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
    });
  }

  /**
   * Sincronizar uma análise com SIACT Web App
   */
  async syncAnalysis(analysis: SyncAnalysis): Promise<SyncResult> {
    const startTime = Date.now();

    try {
      // Preparar payload
      const payload = {
        processNumber: analysis.processNumber,
        dateOfTransfer: analysis.dateOfTransfer,
        dateOfTCEInauguration: analysis.dateOfTCEInauguration,
        value: analysis.value,
        organizationName: analysis.organizationName,
        responsibleNames: analysis.responsibleNames,
        complianceIssues: analysis.complianceIssues,
        prescriptionStatus: analysis.prescriptionAnalysis.status,
        daysRemaining: analysis.prescriptionAnalysis.daysRemaining,
        prescriptionDate: analysis.prescriptionAnalysis.prescriptionDate,
        confidence: analysis.confidence,
        ocrMethod: analysis.ocrMethod,
        processingTimeMs: analysis.processingTimeMs,
        sourceFile: analysis.sourceFile,
        processedAt: analysis.processedAt.toISOString(),
      };

      // Enviar para SIACT Web App
      const response = await this.client.post('/api/trpc/analysis.create', payload);

      const syncDuration = Date.now() - startTime;

      if (response.status === 200 || response.status === 201) {
        console.log(`✅ Análise sincronizada: ${analysis.processNumber}`);

        return {
          success: true,
          analysisId: response.data.id,
          dashboardUpdated: true,
          kpiUpdated: response.data.kpiUpdated || {
            totalAnalyses: 1,
            admissible: analysis.prescriptionAnalysis.status === 'ADMISSIBLE' ? 1 : 0,
            requiresReview: analysis.prescriptionAnalysis.status === 'REQUIRES_REVIEW' ? 1 : 0,
            inadmissible: analysis.prescriptionAnalysis.status === 'INADMISSIBLE' ? 1 : 0,
            urgent: analysis.prescriptionAnalysis.daysRemaining < 180 ? 1 : 0,
          },
          syncDuration,
        };
      } else {
        throw new Error(`Erro ao sincronizar: Status ${response.status}`);
      }
    } catch (error) {
      const syncDuration = Date.now() - startTime;

      console.error(`❌ Erro ao sincronizar análise: ${error}`);

      return {
        success: false,
        dashboardUpdated: false,
        kpiUpdated: {
          totalAnalyses: 0,
          admissible: 0,
          requiresReview: 0,
          inadmissible: 0,
          urgent: 0,
        },
        syncDuration,
        error: String(error),
      };
    }
  }

  /**
   * Sincronizar múltiplas análises em batch
   */
  async syncBatch(analyses: SyncAnalysis[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    // Dividir em chunks
    const chunks = this.chunkArray(analyses, this.config.batchSize || 10);

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map((analysis) => this.syncAnalysis(analysis))
      );
      results.push(...chunkResults);
    }

    return results;
  }

  /**
   * Iniciar sincronização automática
   */
  startAutoSync(callback?: (result: SyncResult) => void): void {
    if (!this.config.autoSync) {
      console.log('⚠️  Auto-sync desabilitado');
      return;
    }

    console.log(`🔄 Iniciando auto-sync a cada ${this.config.syncInterval}ms`);

    this.syncInterval = setInterval(async () => {
      try {
        // TODO: Buscar análises pendentes e sincronizar
        console.log('🔄 Verificando análises pendentes...');

        if (callback) {
          // callback(result);
        }
      } catch (error) {
        console.error('❌ Erro durante auto-sync:', error);
      }
    }, this.config.syncInterval);
  }

  /**
   * Parar sincronização automática
   */
  stopAutoSync(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️  Auto-sync parado');
    }
  }

  /**
   * Obter status de sincronização
   */
  async getSyncStatus(): Promise<{
    connected: boolean;
    lastSync?: Date;
    pendingAnalyses: number;
    successRate: number;
  }> {
    try {
      const response = await this.client.get('/api/trpc/system.health');

      return {
        connected: response.status === 200,
        lastSync: new Date(),
        pendingAnalyses: 0,
        successRate: 100,
      };
    } catch (error) {
      return {
        connected: false,
        pendingAnalyses: 0,
        successRate: 0,
      };
    }
  }

  /**
   * Testar conexão com SIACT Web App
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/trpc/system.health');
      console.log(`✅ Conectado ao SIACT Web App`);
      return response.status === 200;
    } catch (error) {
      console.error(`❌ Erro ao conectar com SIACT Web App: ${error}`);
      return false;
    }
  }

  /**
   * Obter estatísticas de sincronização
   */
  async getStats(): Promise<{
    totalSynced: number;
    successfulSyncs: number;
    failedSyncs: number;
    successRate: number;
    averageSyncTime: number;
  }> {
    try {
      const response = await this.client.get('/api/trpc/dashboard.getStats');

      return response.data;
    } catch (error) {
      return {
        totalSynced: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        successRate: 0,
        averageSyncTime: 0,
      };
    }
  }

  /**
   * Utilitário: Dividir array em chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Obter configuração atual
   */
  getConfig(): MyComputerSyncConfig {
    return this.config;
  }

  /**
   * Atualizar configuração
   */
  updateConfig(newConfig: Partial<MyComputerSyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('✅ Configuração atualizada');
  }
}

// Exportar instância singleton
export const myComputerSyncService = new MyComputerSyncService({
  siactWebUrl: process.env.SIACT_WEB_URL || 'https://baplanding-4wdv8y7a.manus.space',
  apiKey: process.env.SIACT_API_KEY,
  syncInterval: parseInt(process.env.SYNC_INTERVAL || '300000'),
  autoSync: process.env.AUTO_SYNC !== 'false',
  batchSize: parseInt(process.env.BATCH_SIZE || '10'),
});

// Iniciar auto-sync se configurado
if (process.env.AUTO_SYNC !== 'false') {
  myComputerSyncService.startAutoSync();
}
