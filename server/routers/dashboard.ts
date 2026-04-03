import { z } from 'zod';
import { protectedProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { getAnalyses, getPrescriptionAlerts, getOrganizationStats, dismissAlert as dismissAlertDb, createExportedReport } from '../db/analyses';

export const dashboardRouter = {
  getAnalyses: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(10), offset: z.number().int().min(0).default(0), dateRange: z.enum(['7d', '30d', '90d', 'all']).default('30d'), status: z.enum(['all', 'ADMISSIBLE', 'REQUIRES_REVIEW', 'INADMISSIBLE']).default('all') }))
    .query(async ({ ctx, input }) => {
      try {
        return await getAnalyses(ctx.user.id, { limit: input.limit, offset: input.offset });
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar análises', cause: error });
      }
    }),

  getPrescriptionAlerts: protectedProcedure
    .input(z.object({ dismissed: z.boolean().default(false) }))
    .query(async ({ ctx }) => {
      try {
        return await getPrescriptionAlerts(ctx.user.id);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar alertas', cause: error });
      }
    }),

  getOrganizationStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getOrganizationStats(ctx.user.id);
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar estatísticas', cause: error });
    }
  }),

  dismissAlert: protectedProcedure
    .input(z.object({ alertId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await dismissAlertDb(input.alertId);
        return { success: true, message: 'Alerta descartado' };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao descartar alerta', cause: error });
      }
    }),

  exportReport: protectedProcedure
    .input(z.object({ analysisIds: z.array(z.string()), format: z.enum(['PDF', 'EXCEL', 'CSV']) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const reportName = `report-${Date.now()}.${input.format.toLowerCase()}`;
        await createExportedReport({ userId: ctx.user.id, analysisIds: input.analysisIds.join(','), reportType: input.format, reportName, reportUrl: `/api/reports/${reportName}`, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } as any);
        return { success: true, reportUrl: `/api/reports/${reportName}`, message: `Relatório em ${input.format} gerado com sucesso` };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao exportar relatório', cause: error });
      }
    }),
};
