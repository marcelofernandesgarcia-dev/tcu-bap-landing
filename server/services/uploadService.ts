import { z } from "zod";

/**
 * Upload Service - Gerencia upload de múltiplos arquivos com validação
 * Suporta até 15 arquivos, máximo 100MB total
 */

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB total
  MAX_FILES: 15,
  MAX_SINGLE_FILE: 50 * 1024 * 1024, // 50MB por arquivo
  ALLOWED_TYPES: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "text/html",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".docx", ".doc", ".txt", ".html"],
};

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  buffer: Buffer;
  uploadedAt: Date;
}

export interface UploadValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UploadBatchResult {
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  totalSize: number;
  files: UploadedFile[];
  validationResult: UploadValidationResult;
}

/**
 * Valida um arquivo individual
 */
export function validateFile(
  file: { name: string; size: number; type: string },
  index: number
): UploadValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar tamanho
  if (file.size === 0) {
    errors.push(`Arquivo ${index + 1} (${file.name}): Arquivo vazio`);
  }
  if (file.size > UPLOAD_CONFIG.MAX_SINGLE_FILE) {
    errors.push(
      `Arquivo ${index + 1} (${file.name}): Excede 50MB (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    );
  }

  // Validar tipo
  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  if (!UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
    errors.push(
      `Arquivo ${index + 1} (${file.name}): Tipo não permitido. Use: ${UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(", ")}`
    );
  }

  // Validar MIME type
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    warnings.push(
      `Arquivo ${index + 1} (${file.name}): MIME type não reconhecido (${file.type})`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida lote de arquivos
 */
export function validateBatch(
  files: { name: string; size: number; type: string }[]
): UploadValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validar quantidade
  if (files.length === 0) {
    return {
      valid: false,
      errors: ["Nenhum arquivo foi enviado"],
      warnings: [],
    };
  }

  if (files.length > UPLOAD_CONFIG.MAX_FILES) {
    return {
      valid: false,
      errors: [
        `Máximo ${UPLOAD_CONFIG.MAX_FILES} arquivos permitidos. Você enviou ${files.length}`,
      ],
      warnings: [],
    };
  }

  // Validar tamanho total
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      errors: [
        `Tamanho total excede 100MB (${(totalSize / 1024 / 1024).toFixed(2)}MB)`,
      ],
      warnings: [],
    };
  }

  // Validar cada arquivo
  files.forEach((file, index) => {
    const result = validateFile(file, index);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Processa lote de uploads
 */
export async function processBatchUpload(
  files: { name: string; size: number; type: string; buffer: Buffer }[]
): Promise<UploadBatchResult> {
  // Validar lote
  const validation = validateBatch(files);

  if (!validation.valid) {
    return {
      totalFiles: files.length,
      successfulUploads: 0,
      failedUploads: files.length,
      totalSize: 0,
      files: [],
      validationResult: validation,
    };
  }

  // Processar arquivos
  const uploadedFiles: UploadedFile[] = [];
  let successCount = 0;
  let failCount = 0;
  let totalSize = 0;

  for (const file of files) {
    try {
      uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        buffer: file.buffer,
        uploadedAt: new Date(),
      });
      successCount++;
      totalSize += file.size;
    } catch (error) {
      failCount++;
    }
  }

  return {
    totalFiles: files.length,
    successfulUploads: successCount,
    failedUploads: failCount,
    totalSize,
    files: uploadedFiles,
    validationResult: validation,
  };
}

/**
 * Schema Zod para validação de upload
 */
export const uploadFileSchema = z.object({
  name: z.string().min(1, "Nome do arquivo é obrigatório"),
  size: z.number().positive("Tamanho deve ser positivo"),
  type: z.string().min(1, "Tipo de arquivo é obrigatório"),
});

export const uploadBatchSchema = z.object({
  files: z.array(uploadFileSchema).min(1).max(UPLOAD_CONFIG.MAX_FILES),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type UploadBatchInput = z.infer<typeof uploadBatchSchema>;
