/**
 * SIACT Analisador - Componente de Upload e Análise
 * Permite upload de múltiplos PDFs/documentos para análise de prescrição
 */

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalysisUploaderProps {
  onAnalysisComplete?: (result: any) => void;
}

export function AnalysisUploader({ onAnalysisComplete }: AnalysisUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Validar cada arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/html',
    ];
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      // Validar tipo de arquivo
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo não suportado`);
        continue;
      }

      // Validar tamanho (máx 10MB por arquivo)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: Arquivo muito grande (máx 10MB)`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setError(errors.join('; ') || 'Nenhum arquivo válido selecionado');
      return;
    }

    if (validFiles.length + files.length > 15) {
      setError('Máximo 15 arquivos por vez');
      return;
    }

    setFiles([...files, ...validFiles]);
    setError(null);
    setSuccess(null);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Selecione pelo menos um arquivo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const results = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        // Enviar para backend local
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

      setSuccess(`${files.length} arquivo(s) analisado(s) com sucesso!`);
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivos');
    } finally {
      setLoading(false);
    }
  };

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
              Formatos suportados: PDF, DOCX, DOC, TXT, HTML (máx 10MB cada, até 15 arquivos)
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

          {files.length > 0 && (
            <div className="w-full bg-blue-50 p-3 rounded-lg space-y-2 max-h-48 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700">
                Arquivos selecionados: {files.length}
              </p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm text-gray-700 bg-white p-2 rounded"
                >
                  <div>
                    <p>
                      <strong>{file.name}</strong>
                    </p>
                    <p className="text-xs text-gray-600">
                      Tamanho: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 text-lg"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
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
                Analisar {files.length > 1 ? `${files.length} Documentos` : 'Documento'}
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
    </div>
  );
}
