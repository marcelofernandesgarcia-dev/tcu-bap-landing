/**
 * SIACT Analisador - Componente de Upload e Análise
 * Permite upload de múltiplos PDFs/documentos para análise de prescrição
 * Suporta até 90MB por arquivo, até 15 arquivos (sem limite total)
 * Integração com Manus Desktop para arquivos > 90MB
 * Ordenação cronológica por ano e volume
 */

import { useState, useRef, useMemo } from 'react';
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
  maxFiles: 15,
  supportedFormats: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/html',
  ],
};

// Interface para arquivo com metadados extraídos
interface FileWithMetadata extends File {
  year?: number;
  volume?: number;
  sortKey?: string;
}

// Função para extrair ano e volume do nome do arquivo
// Exemplo: SEI_72031.001254_2017_45_VOLUME-02 → ano: 2017, volume: 2
const extractYearAndVolume = (fileName: string): { year: number; volume: number } => {
  // Extrair ano: buscar 4 dígitos entre 2000-2099
  const yearMatch = fileName.match(/(\d{4})/);
  let year = 9999;
  if (yearMatch) {
    const yearNum = parseInt(yearMatch[1]);
    if (yearNum >= 2000 && yearNum <= 2099) {
      year = yearNum;
    }
  }
  
  // Extrair volume: VOLUME-XX primeiro, depois (pg-XX), depois (X)
  let volumeMatch = fileName.match(/VOLUME-(\d+)/i);
  if (!volumeMatch) {
    volumeMatch = fileName.match(/\(pg-(\d+)\)/);
  }
  if (!volumeMatch) {
    volumeMatch = fileName.match(/\((\d+)\)/);
  }
  
  const volume = volumeMatch ? parseInt(volumeMatch[1]) : 0;
  
  return { year, volume };
};

// Função para ordenar arquivos cronologicamente
const sortFilesCronologically = (fileList: File[]): File[] => {
  return [...fileList].sort((a, b) => {
    const aData = extractYearAndVolume(a.name);
    const bData = extractYearAndVolume(b.name);
    
    // Primeiro por ano crescente
    if (aData.year !== bData.year) {
      return aData.year - bData.year;
    }
    
    // Depois por volume crescente
    return aData.volume - bData.volume;
  });
};

// Função para agrupar arquivos por ano
const groupFilesByYear = (fileList: File[]): Record<number, File[]> => {
  const grouped: Record<number, File[]> = {};
  
  for (const file of fileList) {
    const { year } = extractYearAndVolume(file.name);
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(file);
  }
  
  return grouped;
};

export function AnalysisUploader({ onAnalysisComplete }: AnalysisUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [largeFiles, setLargeFiles] = useState<File[]>([]); // Arquivos > 90MB para Manus Desktop
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ordenar arquivos cronologicamente
  const sortedFiles = useMemo(() => sortFilesCronologically(files), [files]);
  const sortedLargeFiles = useMemo(() => sortFilesCronologically(largeFiles), [largeFiles]);

  // Agrupar por ano
  const filesByYear = useMemo(() => groupFilesByYear(sortedFiles), [sortedFiles]);
  const largeFilesByYear = useMemo(() => groupFilesByYear(sortedLargeFiles), [sortedLargeFiles]);

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

    // Validar limite total de arquivos (SEM limite de tamanho total)
    const totalFiles = validFiles.length + files.length + validLargeFiles.length + largeFiles.length;
    if (totalFiles > UPLOAD_CONFIG.maxFiles) {
      errors.push(`Máximo ${UPLOAD_CONFIG.maxFiles} arquivos (você está tentando adicionar ${totalFiles})`);
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
    if (sortedFiles.length === 0 && sortedLargeFiles.length === 0) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Processar arquivos normais
      const results = [];
      for (const file of sortedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erro ao analisar ${file.name}`);
        }

        const result = await response.json();
        results.push(result);
      }

      // Processar arquivos Manus Desktop
      if (sortedLargeFiles.length > 0) {
        const largeFileResults = sortedLargeFiles.map((file) => ({
          name: file.name,
          size: file.size,
          status: 'pending_manus_desktop',
          message: 'Será processado localmente via Manus Desktop',
        }));
        results.push(...largeFileResults);
      }

      const totalFiles = sortedFiles.length + sortedLargeFiles.length;
      const successMsg = sortedLargeFiles.length > 0
        ? `${sortedFiles.length} arquivo(s) analisado(s). ${sortedLargeFiles.length} arquivo(s) &gt; 90MB serão processados via Manus Desktop.`
        : `${totalFiles} arquivo(s) analisado(s) com sucesso!`;

      setSuccess(successMsg);
      setFiles([]);
      setLargeFiles([]);

      if (onAnalysisComplete && sortedFiles.length > 0) {
        onAnalysisComplete(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivos');
    } finally {
      setLoading(false);
    }
  };

  const totalFiles = sortedFiles.length + sortedLargeFiles.length;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50 p-8">
        <div className="text-center space-y-4">
          <Upload className="h-12 w-12 text-blue-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Upload de Documentos para Análise</h3>
            <p className="text-sm text-gray-600">
              Formatos suportados: PDF, DOCX, DOC, TXT, HTML
            </p>
            <p className="text-sm text-gray-600">
              Até 90MB por arquivo, até 15 arquivos (sem limite total)
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || totalFiles >= UPLOAD_CONFIG.maxFiles}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <FileText className="h-4 w-4 mr-2" />
            Selecionar Arquivos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.html"
            className="hidden"
            disabled={loading}
            multiple
          />
        </div>
      </Card>

      {/* Exibir erros */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Exibir sucessos */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Arquivos selecionados agrupados por ano */}
      {totalFiles > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">
              Arquivos selecionados: {totalFiles}
            </h4>
            <span className="text-sm text-gray-600">
              {totalFiles}/{UPLOAD_CONFIG.maxFiles} arquivos
            </span>
          </div>

          {/* Arquivos normais agrupados por ano */}
          {Object.keys(filesByYear).length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
              {Object.keys(filesByYear)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((year) => (
                  <div key={year} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 border-b border-blue-200 pb-2">
                      <span>📅 {year}</span>
                      <span className="text-xs text-gray-500">
                        ({filesByYear[parseInt(year)].length} arquivo(s))
                      </span>
                    </div>
                    <div className="space-y-2 pl-4">
                      {filesByYear[parseInt(year)].map((file, idx) => (
                        <div
                          key={`${year}-${idx}`}
                          className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 hover:border-blue-300"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const idx = sortedFiles.indexOf(file);
                              if (idx !== -1) removeFile(idx);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Arquivos Manus Desktop agrupados por ano */}
          {Object.keys(largeFilesByYear).length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto border border-orange-200 rounded-lg p-4 bg-orange-50">
              {Object.keys(largeFilesByYear)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((year) => (
                  <div key={`large-${year}`} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 border-b border-orange-200 pb-2">
                      <HardDrive className="h-4 w-4" />
                      <span>Manus Desktop - {year}</span>
                      <span className="text-xs text-gray-500">
                        ({largeFilesByYear[parseInt(year)].length} arquivo(s))
                      </span>
                    </div>
                    <div className="space-y-2 pl-4">
                      {largeFilesByYear[parseInt(year)].map((file, idx) => (
                        <div key={`large-${year}-${idx}`} className="relative">
                          <ManusDesktopIndicator
                            status={loading ? 'processing' : 'pending'}
                            fileName={file.name}
                            fileSize={file.size}
                            progress={loading ? Math.min(100, (idx + 1) * 33) : 0}
                            onRemove={() => {
                              const idx = sortedLargeFiles.indexOf(file);
                              if (idx !== -1) removeLargeFile(idx);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Botão de análise */}
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Analisar {totalFiles > 1 ? `${totalFiles} Documentos` : 'Documento'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Aviso sobre Manus Desktop */}
      {sortedLargeFiles.length > 0 && (
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
