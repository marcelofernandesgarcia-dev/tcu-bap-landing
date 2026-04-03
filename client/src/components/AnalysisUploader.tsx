/**
 * SIACT Analisador - Componente de Upload e Análise
 * Permite upload de PDFs/documentos para análise de prescrição
 */

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalysisUploaderProps {
  onAnalysisComplete?: (result: any) => void;
}

export function AnalysisUploader({ onAnalysisComplete }: AnalysisUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Tipo de arquivo não suportado. Use PDF, DOCX, DOC, TXT ou HTML.');
      return;
    }

    // Validar tamanho (máx 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Enviar para backend local
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na análise: ${response.statusText}`);
      }

      const result = await response.json();
      
      setSuccess('Análise concluída com sucesso!');
      setFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
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
              Upload de Documento para Análise
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Formatos suportados: PDF, DOCX, DOC, TXT, HTML (máx 10MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.html"
            className="hidden"
            disabled={loading}
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Selecionar Arquivo
          </Button>

          {file && (
            <div className="w-full bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Arquivo selecionado:</strong> {file.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Tamanho: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
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
                Analisar Documento
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

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700">
          <strong>🔒 Segurança:</strong> Seu documento é processado localmente. 
          Nenhuma informação pessoal é compartilhada com serviços externos.
          Dados sensíveis são mascarados conforme LGPD.
        </p>
      </div>
    </div>
  );
}
