import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  validateBatch,
  processBatchUpload,
  UPLOAD_CONFIG,
} from "../services/uploadService";

export const uploadRouter = router({
  /**
   * Validar múltiplos arquivos antes do upload
   */
  validateFiles: publicProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            name: z.string(),
            size: z.number(),
            type: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const validation = validateBatch(input.files);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        config: {
          maxFiles: UPLOAD_CONFIG.MAX_FILES,
          maxTotalSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxSingleFile: UPLOAD_CONFIG.MAX_SINGLE_FILE,
          allowedExtensions: UPLOAD_CONFIG.ALLOWED_EXTENSIONS,
        },
      };
    }),

  /**
   * Processar upload de múltiplos arquivos
   */
  processBatch: publicProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            name: z.string(),
            size: z.number(),
            type: z.string(),
            buffer: z.instanceof(Buffer),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const result = await processBatchUpload(input.files);

      return {
        success: result.validationResult.valid,
        totalFiles: result.totalFiles,
        successfulUploads: result.successfulUploads,
        failedUploads: result.failedUploads,
        totalSize: result.totalSize,
        totalSizeMB: (result.totalSize / 1024 / 1024).toFixed(2),
        files: result.files.map((f) => ({
          name: f.name,
          size: f.size,
          sizeMB: (f.size / 1024 / 1024).toFixed(2),
          type: f.type,
          uploadedAt: f.uploadedAt,
        })),
        validation: result.validationResult,
      };
    }),

  /**
   * Obter configuração de upload
   */
  getConfig: publicProcedure.query(() => {
    return {
      maxFiles: UPLOAD_CONFIG.MAX_FILES,
      maxTotalSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      maxTotalSizeMB: UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024,
      maxSingleFile: UPLOAD_CONFIG.MAX_SINGLE_FILE,
      maxSingleFileMB: UPLOAD_CONFIG.MAX_SINGLE_FILE / 1024 / 1024,
      allowedExtensions: UPLOAD_CONFIG.ALLOWED_EXTENSIONS,
      allowedTypes: UPLOAD_CONFIG.ALLOWED_TYPES,
    };
  }),

  /**
   * Validar arquivo individual
   */
  validateFile: publicProcedure
    .input(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })
    )
    .query(({ input }) => {
      // Import inline para evitar problemas de módulo
      const { validateFile: validateFileFn } = require("../services/uploadService");
      const result = validateFileFn(input, 0);
      return {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings,
      };
    }),
});
