/**
 * Chunk Processing Service - Processa arquivos grandes em pedaços
 * Ideal para PDFs > 10MB
 */

export const CHUNK_CONFIG = {
  CHUNK_SIZE: 5 * 1024 * 1024, // 5MB por chunk
  MAX_CHUNKS: 20, // Máximo 20 chunks = 100MB
  TIMEOUT_PER_CHUNK: 30000, // 30 segundos por chunk
};

export interface ChunkMetadata {
  fileName: string;
  fileSize: number;
  totalChunks: number;
  chunkSize: number;
  uploadedAt: Date;
}

export interface ChunkProgress {
  fileName: string;
  currentChunk: number;
  totalChunks: number;
  percentComplete: number;
  bytesProcessed: number;
  totalBytes: number;
  estimatedTimeRemaining: number; // em segundos
}

export interface ChunkProcessingResult {
  fileName: string;
  success: boolean;
  totalChunks: number;
  processedChunks: number;
  failedChunks: number;
  totalSize: number;
  processingTime: number; // em ms
  errors: string[];
}

/**
 * Divide arquivo em chunks
 */
export function divideIntoChunks(
  buffer: Buffer,
  chunkSize: number = CHUNK_CONFIG.CHUNK_SIZE
): Buffer[] {
  const chunks: Buffer[] = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Calcula metadados de chunks
 */
export function calculateChunkMetadata(
  fileName: string,
  fileSize: number,
  chunkSize: number = CHUNK_CONFIG.CHUNK_SIZE
): ChunkMetadata {
  const totalChunks = Math.ceil(fileSize / chunkSize);

  if (totalChunks > CHUNK_CONFIG.MAX_CHUNKS) {
    throw new Error(
      `Arquivo muito grande: ${totalChunks} chunks (máximo ${CHUNK_CONFIG.MAX_CHUNKS})`
    );
  }

  return {
    fileName,
    fileSize,
    totalChunks,
    chunkSize,
    uploadedAt: new Date(),
  };
}

/**
 * Processa chunks com callback de progresso
 */
export async function processChunksWithProgress(
  buffer: Buffer,
  fileName: string,
  onProgress?: (progress: ChunkProgress) => void,
  onChunkProcess?: (chunk: Buffer, index: number) => Promise<boolean>
): Promise<ChunkProcessingResult> {
  const startTime = Date.now();
  const metadata = calculateChunkMetadata(fileName, buffer.length);

  const result: ChunkProcessingResult = {
    fileName,
    success: true,
    totalChunks: metadata.totalChunks,
    processedChunks: 0,
    failedChunks: 0,
    totalSize: buffer.length,
    processingTime: 0,
    errors: [],
  };

  let bytesProcessed = 0;
  let chunkIndex = 0;

  const chunks = divideIntoChunks(buffer, metadata.chunkSize);
  for (const chunk of chunks) {
    try {
      // Chamar callback de processamento se fornecido
      if (onChunkProcess) {
        const success = await Promise.race([
          onChunkProcess(chunk, chunkIndex),
          new Promise<boolean>((_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout no processamento do chunk")),
              CHUNK_CONFIG.TIMEOUT_PER_CHUNK
            )
          ),
        ]);

        if (!success) {
          result.failedChunks++;
          result.errors.push(`Falha ao processar chunk ${chunkIndex + 1}`);
          result.success = false;
        } else {
          result.processedChunks++;
        }
      } else {
        result.processedChunks++;
      }

      bytesProcessed += chunk.length;
      chunkIndex++;

      // Chamar callback de progresso se fornecido
      if (onProgress) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const bytesPerSecond = bytesProcessed / elapsedSeconds;
        const remainingBytes = buffer.length - bytesProcessed;
        const estimatedTimeRemaining = Math.ceil(remainingBytes / bytesPerSecond);

        onProgress({
          fileName,
          currentChunk: chunkIndex,
          totalChunks: metadata.totalChunks,
          percentComplete: Math.round((bytesProcessed / buffer.length) * 100),
          bytesProcessed,
          totalBytes: buffer.length,
          estimatedTimeRemaining,
        });
      }
    } catch (error) {
      result.failedChunks++;
      result.errors.push(
        `Erro no chunk ${chunkIndex + 1}: ${String(error)}`
      );
      result.success = false;
    }
  }

  result.processingTime = Date.now() - startTime;
  return result;
}

/**
 * Processa múltiplos arquivos em chunks
 */
export async function processBatchWithChunks(
  files: { name: string; buffer: Buffer }[],
  onProgress?: (fileName: string, progress: ChunkProgress) => void,
  onChunkProcess?: (
    fileName: string,
    chunk: Buffer,
    index: number
  ) => Promise<boolean>
): Promise<ChunkProcessingResult[]> {
  const results: ChunkProcessingResult[] = [];

  for (const file of files) {
    const result = await processChunksWithProgress(
      file.buffer,
      file.name,
      (progress) => onProgress?.(file.name, progress),
      onChunkProcess
        ? (chunk, index) => onChunkProcess(file.name, chunk, index)
        : undefined
    );
    results.push(result);
  }

  return results;
}

/**
 * Reconstrói arquivo a partir de chunks
 */
export function reconstructFromChunks(chunks: Buffer[]): Buffer {
  if (chunks.length === 0) {
    throw new Error("Nenhum chunk fornecido");
  }

  return Buffer.concat(chunks);
}

/**
 * Valida integridade de chunks usando checksum
 */
export function calculateChecksum(buffer: Buffer): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function verifyChecksum(buffer: Buffer, expectedChecksum: string): boolean {
  return calculateChecksum(buffer) === expectedChecksum;
}
