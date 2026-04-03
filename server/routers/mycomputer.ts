/**
 * Router tRPC para Integração com Manus Desktop "My Computer"
 * Processa PDFs localmente sem upload para cloud
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { localOCRService } from '../services/localOCRService';
import { geminiDesktopService } from '../services/geminiDesktopService';

export const myComputerRouter = router({
  /**
   * Verificar status do Manus Desktop
   */
  checkStatus: publicProcedure.query(async () => {
    try {
      const ocrInfo = await localOCRService.getSystemInfo();
      const geminiStatus = await geminiDesktopService.testConnection();

      return {
        status: 'connected',
        ocr: {
          tesseractAvailable: ocrInfo.tesseractAvailable,
          paddleOCRAvailable: ocrInfo.paddleOCRAvailable,
          tesseractVersion: ocrInfo.tesseractVersion,
          pythonVersion: ocrInfo.pythonVersion,
        },
        gemini: {
          connected: geminiStatus.connected,
          version: geminiStatus.version,
          model: geminiStatus.model,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'error',
        error: String(error),
      };
    }
  }),

  /**
   * Processar PDF com OCR local
   */
  processLocalPDF: publicProcedure
    .input(
      z.object({
        filePath: z.string(),
        method: z.enum(['tesseract', 'paddle', 'hybrid']).default('hybrid'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        let result;

        if (input.method === 'tesseract') {
          result = await localOCRService.processPDFWithTesseract(input.filePath);
        } else if (input.method === 'paddle') {
          result = await localOCRService.processPDFWithPaddleOCR(input.filePath);
        } else {
          result = await localOCRService.processPDFHybrid(input.filePath);
        }

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Processar múltiplos PDFs em batch
   */
  processBatchPDFs: publicProcedure
    .input(
      z.object({
        folderPath: z.string(),
        method: z.enum(['tesseract', 'paddle', 'hybrid']).default('hybrid'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = await localOCRService.processBatch(
          input.folderPath,
          input.method
        );

        return {
          success: true,
          count: results.length,
          data: results,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Analisar texto OCR com Gemini Desktop
   */
  analyzeWithGemini: publicProcedure
    .input(
      z.object({
        ocrText: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await geminiDesktopService.analyzeOCRText(input.ocrText);

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Extrair campos estruturados
   */
  extractFields: publicProcedure
    .input(
      z.object({
        ocrText: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const fields = await geminiDesktopService.extractStructuredFields(
          input.ocrText
        );

        return {
          success: true,
          data: fields,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Analisar conformidade com IN TCU 98/2024
   */
  analyzeCompliance: publicProcedure
    .input(
      z.object({
        ocrText: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await geminiDesktopService.analyzeCompliance(input.ocrText);

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Calcular prescrição
   */
  calculatePrescription: publicProcedure
    .input(
      z.object({
        dateOfTCEInauguration: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await geminiDesktopService.calculatePrescription(
          input.dateOfTCEInauguration
        );

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Processar PDF completo (OCR + Análise + Prescrição)
   */
  processComplete: publicProcedure
    .input(
      z.object({
        filePath: z.string(),
        ocrMethod: z.enum(['tesseract', 'paddle', 'hybrid']).default('hybrid'),
        analyzeWithGemini: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Passo 1: OCR
        console.log(`📄 Iniciando OCR: ${input.filePath}`);
        let ocrResult;

        if (input.ocrMethod === 'tesseract') {
          ocrResult = await localOCRService.processPDFWithTesseract(input.filePath);
        } else if (input.ocrMethod === 'paddle') {
          ocrResult = await localOCRService.processPDFWithPaddleOCR(input.filePath);
        } else {
          ocrResult = await localOCRService.processPDFHybrid(input.filePath);
        }

        console.log(
          `✅ OCR concluído (${ocrResult.pages} páginas, confiança: ${(ocrResult.confidence * 100).toFixed(1)}%)`
        );

        // Passo 2: Análise com Gemini (opcional)
        let analysisResult = null;
        if (input.analyzeWithGemini) {
          console.log(`🤖 Iniciando análise com Gemini...`);
          analysisResult = await geminiDesktopService.analyzeOCRText(ocrResult.text);
          console.log(`✅ Análise concluída`);
        }

        return {
          success: true,
          data: {
            ocr: ocrResult,
            analysis: analysisResult,
            totalProcessingTimeMs:
              ocrResult.processingTimeMs +
              (analysisResult?.processingTimeMs || 0),
          },
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Obter informações do sistema
   */
  getSystemInfo: publicProcedure.query(async () => {
    try {
      const ocrInfo = await localOCRService.getSystemInfo();
      const geminiStatus = await geminiDesktopService.testConnection();

      return {
        success: true,
        data: {
          ocr: ocrInfo,
          gemini: geminiStatus,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  }),
});
