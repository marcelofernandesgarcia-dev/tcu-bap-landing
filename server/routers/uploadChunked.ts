import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  divideIntoChunks,
  calculateChunkMetadata,
  processChunksWithProgress,
  CHUNK_CONFIG,
} from "../services/chunkProcessingService";

export const uploadChunkedRouter = router({
  /**
   * Iniciar upload em chunks
   */
  startChunkedUpload: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileSize: z.number(),
        chunkSize: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const metadata = calculateChunkMetadata(
          input.fileName,
          input.fileSize,
          input.chunkSize || CHUNK_CONFIG.CHUNK_SIZE
        );

        return {
          success: true,
          metadata: {
            fileName: metadata.fileName,
            fileSize: metadata.fileSize,
            totalChunks: metadata.totalChunks,
            chunkSize: metadata.chunkSize,
            uploadedAt: metadata.uploadedAt,
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
   * Processar chunk individual
   */
  processChunk: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        chunkIndex: z.number(),
        totalChunks: z.number(),
        chunkData: z.instanceof(Buffer),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Simular processamento do chunk
        const chunkSize = input.chunkData.length;
        const percentComplete = Math.round(
          ((input.chunkIndex + 1) / input.totalChunks) * 100
        );

        return {
          success: true,
          chunkIndex: input.chunkIndex,
          chunkSize,
          percentComplete,
          message: `Chunk ${input.chunkIndex + 1}/${input.totalChunks} processado`,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Finalizar upload em chunks
   */
  finishChunkedUpload: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        totalChunks: z.number(),
        totalSize: z.number(),
        checksum: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return {
          success: true,
          message: `Upload de ${input.fileName} concluído`,
          fileName: input.fileName,
          totalChunks: input.totalChunks,
          totalSize: input.totalSize,
          totalSizeMB: (input.totalSize / 1024 / 1024).toFixed(2),
          completedAt: new Date(),
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),

  /**
   * Obter configuração de chunks
   */
  getChunkConfig: publicProcedure.query(() => {
    return {
      chunkSize: CHUNK_CONFIG.CHUNK_SIZE,
      chunkSizeMB: CHUNK_CONFIG.CHUNK_SIZE / 1024 / 1024,
      maxChunks: CHUNK_CONFIG.MAX_CHUNKS,
      maxTotalSize: CHUNK_CONFIG.MAX_CHUNKS * CHUNK_CONFIG.CHUNK_SIZE,
      maxTotalSizeMB:
        (CHUNK_CONFIG.MAX_CHUNKS * CHUNK_CONFIG.CHUNK_SIZE) / 1024 / 1024,
      timeoutPerChunk: CHUNK_CONFIG.TIMEOUT_PER_CHUNK,
    };
  }),

  /**
   * Processar múltiplos chunks de uma vez (para Manus Desktop)
   */
  processBatchChunks: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        chunks: z.array(
          z.object({
            index: z.number(),
            data: z.instanceof(Buffer),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = input.chunks.map((chunk) => ({
          chunkIndex: chunk.index,
          chunkSize: chunk.data.length,
          success: true,
        }));

        const totalSize = input.chunks.reduce((sum, c) => sum + c.data.length, 0);

        return {
          success: true,
          fileName: input.fileName,
          totalChunks: input.chunks.length,
          totalSize,
          totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
          results,
          message: `${input.chunks.length} chunks processados com sucesso`,
        };
      } catch (error) {
        return {
          success: false,
          error: String(error),
        };
      }
    }),
});
