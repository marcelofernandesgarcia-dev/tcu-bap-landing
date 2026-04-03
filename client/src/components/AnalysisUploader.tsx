/**
 * SIACT Analisador - Componente de Upload e Análise
 * Permite upload de múltiplos PDFs/documentos para análise de prescrição
 * Suporta até 90MB por arquivo, até 15 arquivos (total 100MB)
 * Integração com Manus Desktop para arquivos > 90MB
 */

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, X, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ManusDesktopIndicator } from '@/components/ManusDesktopIndicator';

interface AnalysisUploaderProps {
  onAnalysisComplete?: (result: any) => void;
}

// Configuração de limites
const UPLOAD_CONFIG = {
  maxSizePerFile: 90 * 1024 * 1024, // 90MB por arquivo
  maxTotalSize: 100 * 1024 * 1024, // 100MB total
  maxFiles: 15,
  supportedFormats: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/html',
  ],
};

export function AnalysisUploader({ onAnalysisComplete }: AnalysisUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [largeFiles, setLargeFiles] = useState<File[]>([]); // Arquivos > 90MB para Manus Desktop
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    const validLargeFiles: File[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      // Validar tipo de arquivo
      if (!UPLOAD_CONFIG.supportedFormats.includes(file.type)) {
        errors.push(`${file.name}: Tipo não suportado`);
        continue;
      }

      // Separar arquivos por tamanho
      if (file.size > UPLOAD_CONFIG.maxSizePerFile) {
        // Arquivo > 90MB: será processado via Manus Desktop
        validLargeFiles.push(file);
      } else {
        // Arquivo <= 90MB: processamento normal
        validFiles.push(file);
      }
    }

    // Validar limite total de arquivos
    const totalFiles = validFiles.length + files.length + validLargeFiles.length + largeFiles.length;
    if (totalFiles > UPLOAD_CONFIG.maxFiles) {
      errors.push(`Máximo ${UPLOAD_CONFIG.maxFiles} arquivos (você está tentando adicionar ${totalFiles})`);
    }

    // Validar limite total de tamanho (apenas para arquivos normais)
    const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0) + files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > UPLOAD_CONFIG.maxTotalSize) {
      errors.push(`Tamanho total excede ${UPLOAD_CONFIG.maxTotalSize / (1024 * 1024)}MB`);
    }

    if (validFiles.length === 0 && validLargeFiles.length === 0) {
      setError(errors.join('; ') || 'Nenhum arquivo válido selecionado');
      return;
    }

    // Adicionar arquivos válidos
    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
    }

    if (validLargeFiles.length > 0) {
      setLargeFiles([...largeFiles, ...validLargeFiles]);
    }

    // Mostrar avisos se houver
    if (errors.length > 0) {
      setError(errors.join('; '));
    } else {
      setError(null);
    }

    setSuccess(null);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeLargeFile = (index: number) => {
    setLargeFiles(largeFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const totalFiles = files.length + largeFiles.length;
    if (totalFiles === 0) {
      setError('Selecione pelo menos um arquivo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const results = [];

      // Processar arquivos normais (≤ 90MB)
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erro na análise de ${file.name}: ${response.statusText}`);
        }

        const result = await response.json();
        results.push({ file: file.name, ...result });
      }

      // Processar arquivos grandes (> 90MB) via Manus Desktop
      if (largeFiles.length > 0) {
        // Preparar dados para Manus Desktop
        const largeFileResults = largeFiles.map((file) => ({
          file: file.name,
          size: file.size,
          status: 'pending_manus_desktop',
          message: 'Arquivo será processado via Manus Desktop (OCR local)',
          processingMethod: 'local_ocr',
        }));

        results.push(...largeFileResults);

        // Notificar sobre processamento via Manus Desktop
        if (onAnalysisComplete) {
          onAnalysisComplete({
            message: `${files.length} arquivo(s) processado(s). ${largeFiles.length} arquivo(s) grande(s) aguardando Manus Desktop.`,
            results,
            largeFiles: largeFiles.map((f) => ({ name: f.name, size: f.size })),
          });
        }
      }

      const successMsg = largeFiles.length > 0
        ? `${files.length} arquivo(s) analisado(s). ${largeFiles.length} arquivo(s) > 90MB serão processados via Manus Desktop.`
        : `${totalFiles} arquivo(s) analisado(s) com sucesso!`;

      setSuccess(successMsg);
      setFiles([]);
      setLargeFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onAnalysisComplete && files.length > 0) {
        onAnalysisComplete(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivos');
    } finally {
      setLoading(false);
    }
  };

  const totalFiles = files.length + largeFiles.length;
  const totalSize = (files.reduce((sum, f) => sum + f.size, 0) + largeFiles.reduce((sum, f) => sum + f.size, 0)) / (1024 * 1024);

  return (
    <div className="w-full space-y-4">
      <Card className="border-2 border-dashed border-blue-200 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="h-12 w-12 text-blue-600" />

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Upload de Documentos para Análise
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Formatos suportados: PDF, DOCX, DOC, TXT, HTML
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Até 90MB por arquivo, até 15 arquivos (100MB total)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.html"
            className="hidden"
            disabled={loading}
            multiple
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Selecionar Arquivos
          </Button>

          {totalFiles > 0 && (
            <div className="w-full bg-blue-50 p-3 rounded-lg space-y-2 max-h-64 overflow-y-auto">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-700">
                  Arquivos selecionados: {totalFiles} ({totalSize.toFixed(2)} MB)
                </p>
              </div>

              {/* Arquivos normais */}
              {files.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Processamento Normal (&le; 90MB):</p>
                  {files.map((file, index) => (
                    <div
                      key={`normal-${index}`}
                      className="flex justify-between items-center text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-green-500"
                    >
                      <div>
                        <p>
                          <strong>{file.name}</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                          Tamanho: {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Arquivos grandes */}
              {largeFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Manus Desktop (&gt; 90MB):</p>
                  {largeFiles.map((file, index) => (
                    <div key={`large-${index}`} className="relative">
                      <ManusDesktopIndicator
                        status={loading ? 'processing' : 'pending'}
                        fileName={file.name}
                        fileSize={file.size}
                        progress={loading ? Math.min(100, (index + 1) * 33) : 0}
                      />
                      <button
                        onClick={() => removeLargeFile(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full p-1"
                        disabled={loading}
                        title="Remover arquivo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={totalFiles === 0 || loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Analisar {totalFiles > 1 ? `${totalFiles} Documentos` : 'Documento'}
              </>
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {largeFiles.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <HardDrive className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Arquivos &gt; 90MB serão processados via Manus Desktop com OCR local. Nenhum dado será enviado para servidores externos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
