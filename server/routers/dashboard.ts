/**
 * Router tRPC para Dashboard de Análises
 * Queries para histórico, alertas e estatísticas
 */

import { z } from 'zod';
import { protectedProcedure, publicProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';

export const dashboardRouter = {
  /**
   * Obter análises com paginação e filtros
   */
  getAnalyses: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
        dateRange: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
        status: z.enum(['all', 'ADMISSIBLE', 'REQUIRES_REVIEW', 'INADMISSIBLE']).default('all'),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Calcular data inicial baseado no dateRange
        const now = new Date();
        let startDate = new Date();
        
        switch (input.dateRange) {
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
          case 'all':
            startDate = new Date('2000-01-01');
            break;
        }

        // Mock data - em produção, seria uma query ao banco de dados
        const mockAnalyses = [
          {
            id: '1',
            userId: ctx.user.id,
            processNumber: 'TCE-2024-00001',
            documentName: 'SEI_72031.008744_2024_00.pdf',
            documentSize: 1200000,
            ocrMethod: 'native' as const,
            ocrConfidence: 0.95,
            extractedText: 'Texto extraído do documento...',
            maskedText: '[DADOS SENSÍVEIS MASCARADOS]',
            extractedDates: JSON.stringify(['15/03/2024', '30/06/2024']),
            extractedValues: JSON.stringify(['R$ 250.000,00', 'R$ 50.000,00']),
            extractedEntities: JSON.stringify([{ type: 'CPF', count: 2 }, { type: 'CNPJ', count: 1 }]),
            prescriptionStatus: 'ADMISSIBLE' as const,
            prescriptionDate: new Date(Date.now() + 1200 * 24 * 60 * 60 * 1000), // 1200 dias no futuro
            daysRemaining: 1200,
            compliant: 1,
            complianceIssues: JSON.stringify([]),
            complianceRecommendations: JSON.stringify([]),
            createdAt: new Date(),
            updatedAt: new Date(),
            processingTimeMs: 2500,
            status: 'completed' as const,
            errorMessage: null,
          },
          {
            id: '2',
            userId: ctx.user.id,
            processNumber: 'TCE-2024-00002',
            documentName: 'SEI_72031.008871_2017_71.pdf',
            documentSize: 27000000,
            ocrMethod: 'native' as const,
            ocrConfidence: 0.88,
            extractedText: 'Texto extraído do documento...',
            maskedText: '[DADOS SENSÍVEIS MASCARADOS]',
            extractedDates: JSON.stringify(['10/01/2017', '31/12/2017']),
            extractedValues: JSON.stringify(['R$ 500.000,00']),
            extractedEntities: JSON.stringify([{ type: 'CPF', count: 1 }, { type: 'CNPJ', count: 2 }]),
            prescriptionStatus: 'REQUIRES_REVIEW' as const,
            prescriptionDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), // 150 dias no futuro
            daysRemaining: 150,
            compliant: 0,
            complianceIssues: JSON.stringify(['Faltam datas críticas']),
            complianceRecommendations: JSON.stringify(['Verificar datas de instauração']),
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            processingTimeMs: 8500,
            status: 'completed' as const,
            errorMessage: null,
          },
        ];

        // Filtrar por status
        let filtered = mockAnalyses;
        if (input.status !== 'all') {
          filtered = filtered.filter((a) => a.prescriptionStatus === input.status);
        }

        // Filtrar por data
        filtered = filtered.filter((a) => a.createdAt >= startDate);

        // Aplicar paginação
        const total = filtered.length;
        const items = filtered.slice(input.offset, input.offset + input.limit);

        return {
          items,
          total,
          limit: input.limit,
          offset: input.offset,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar análises',
          cause: error,
        });
      }
    }),

  /**
   * Obter alertas de prescrição
   */
  getPrescriptionAlerts: protectedProcedure
    .input(
      z.object({
        dismissed: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Mock data
        const mockAlerts = [
          {
            id: '1',
            userId: ctx.user.id,
            analysisId: '2',
            processNumber: 'TCE-2024-00002',
            prescriptionDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
            daysRemaining: 150,
            alertType: 'WARNING' as const,
            dismissed: false,
            dismissedAt: null,
            createdAt: new Date(),
          },
        ];

        return mockAlerts.filter((a) => a.dismissed === input.dismissed);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar alertas',
          cause: error,
        });
      }
    }),

  /**
   * Obter estatísticas por órgão
   */
  getOrganizationStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Mock data
      const mockStats = [
        {
          id: '1',
          userId: ctx.user.id,
          organizationName: 'Ministério do Turismo',
          totalAnalyses: 2,
          totalProcesses: 2,
          totalValue: 750000,
          admissibleCount: 1,
          requiresReviewCount: 1,
          prescribedCount: 0,
          lastAnalysisAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: ctx.user.id,
          organizationName: 'Secretaria de Educação',
          totalAnalyses: 5,
          totalProcesses: 5,
          totalValue: 2500000,
          admissibleCount: 3,
          requiresReviewCount: 1,
          prescribedCount: 1,
          lastAnalysisAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ];

      return mockStats;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar estatísticas',
        cause: error,
      });
    }
  }),

  /**
   * Descartar alerta de prescrição
   */
  dismissAlert: protectedProcedure
    .input(z.object({ alertId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Em produção, atualizar no banco de dados
        return { success: true, message: 'Alerta descartado' };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao descartar alerta',
          cause: error,
        });
      }
    }),

  /**
   * Exportar relatório
   */
  exportReport: protectedProcedure
    .input(
      z.object({
        analysisIds: z.array(z.string()),
        format: z.enum(['PDF', 'EXCEL', 'CSV']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Em produção, gerar relatório real
        return {
          success: true,
          reportUrl: `https://example.com/reports/report-${Date.now()}.${input.format.toLowerCase()}`,
          message: `Relatório em ${input.format} gerado com sucesso`,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao exportar relatório',
          cause: error,
        });
      }
    }),
};
