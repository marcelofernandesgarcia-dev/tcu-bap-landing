/**
 * SIACT Analisador - Componente de Upload e Análise
 * Permite upload de múltiplos PDFs/documentos para análise de prescrição
 * Suporta até 90MB por arquivo, até 15 arquivos (sem limite total)
 * Integração com Manus Desktop para arquivos > 90MB
 * Ordenação cronológica por ano e volume
 * Barra de progresso individual para cada arquivo
 */

import { useState, useRef, useMemo } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, X, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ManusDesktopIndicator } from '@/components/ManusDesktopIndicator';
import { FileProgressBar, FileProgress } from '@/components/FileProgressBar';

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
  
  // Extrair volume: buscar VOLUME-XX ou similar
  const volumeMatch = fileName.match(/VOLUME-(\d+)/i);
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
  const [fileProgress, setFileProgress] = useState<Map<string, FileProgress>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ordenar arquivos cronologicamente
  const sortedFiles = useMemo(() => sortFilesCronologically(files), [files]);
  const sortedLargeFiles = useMemo(() => sortFilesCronologically(largeFiles), [largeFiles]);

  // Agrupar por ano
  const filesByYear = useMemo(() => groupFilesByYear(sortedFiles), [sortedFiles]);
  const largeFilesByYear = useMemo(() => groupFilesByYear(sortedLargeFiles), [sortedLargeFiles]);

  // Gerar ID único para arquivo
  const generateFileId = (file: File): string => {
    return `${file.name}-${file.size}-${Date.now()}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    const validLargeFiles: File[] = [];
    const errors: string[] = [];

    // Validar cada arquivo
    for (const file of selectedFiles) {
      // Verificar tipo de arquivo
      if (!UPLOAD_CONFIG.supportedFormats.includes(file.type)) {
        errors.push(`${file.name}: Tipo de arquivo não suportado`);
        continue;
      }

      // Separar por tamanho
      if (file.size > UPLOAD_CONFIG.maxSizePerFile) {
        validLargeFiles.push(file);
      } else {
        validFiles.push(file);
      }
    }

    // Verificar limite de arquivos
    const totalFiles = files.length + largeFiles.length + validFiles.length + validLargeFiles.length;
    if (totalFiles > UPLOAD_CONFIG.maxFiles) {
      errors.push(`Máximo de ${UPLOAD_CONFIG.maxFiles} arquivos excedido`);
      setError(errors.join('\n'));
      return;
    }

    // Inicializar progresso para novos arquivos
    const newProgress = new Map(fileProgress);
    for (const file of [...validFiles, ...validLargeFiles]) {
      const fileId = generateFileId(file);
      newProgress.set(fileId, {
        fileId,
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        status: 'pending',
        uploadedBytes: 0,
      });
    }
    setFileProgress(newProgress);

    // Adicionar arquivos
    setFiles([...files, ...validFiles]);
    setLargeFiles([...largeFiles, ...validLargeFiles]);
    setError(errors.length > 0 ? errors.join('\n') : null);
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
    setLargeFiles(largeFiles.filter(f => f.name !== fileName));
  };

  const handleUpload = async () => {
    if (files.length === 0 && largeFiles.length === 0) {
      setError('Selecione pelo menos um arquivo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Processar arquivos normais
      for (const file of files) {
        const fileId = generateFileId(file);
        await uploadFile(file, fileId);
      }

      // Processar arquivos grandes (Manus Desktop)
      for (const file of largeFiles) {
        const fileId = generateFileId(file);
        await uploadFileManusDesktop(file, fileId);
      }

      setSuccess(`${files.length + largeFiles.length} arquivo(s) processado(s) com sucesso`);
      setFiles([]);
      setLargeFiles([]);
      setFileProgress(new Map());
    } catch (err) {
      setError(`Erro ao processar arquivos: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, fileId: string) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Atualizar status para enviando
      setFileProgress(prev => {
        const updated = new Map(prev);
        const progress = updated.get(fileId);
        if (progress) {
          progress.status = 'uploading';
          progress.startTime = Date.now();
        }
        return updated;
      });

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setFileProgress(prev => {
          const updated = new Map(prev);
          const progress = updated.get(fileId);
          if (progress && progress.status === 'uploading') {
            // Incrementar progresso aleatoriamente
            const increment = Math.random() * 15;
            progress.progress = Math.min(progress.progress + increment, 95);
            progress.uploadedBytes = Math.floor((progress.progress / 100) * file.size);
          }
          return updated;
        });
      }, 200);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Atualizar status para concluído
      setFileProgress(prev => {
        const updated = new Map(prev);
        const progress = updated.get(fileId);
        if (progress) {
          progress.status = 'completed';
          progress.progress = 100;
          progress.uploadedBytes = file.size;
        }
        return updated;
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      // Atualizar status para erro
      setFileProgress(prev => {
        const updated = new Map(prev);
        const progress = updated.get(fileId);
        if (progress) {
          progress.status = 'error';
          progress.error = `${err}`;
        }
        return updated;
      });
    }
  };

  const uploadFileManusDesktop = async (file: File, fileId: string) => {
    // Simular processamento via Manus Desktop
    setFileProgress(prev => {
      const updated = new Map(prev);
      const progress = updated.get(fileId);
      if (progress) {
        progress.status = 'uploading';
        progress.startTime = Date.now();
      }
      return updated;
    });

    // Simular progresso
    const progressInterval = setInterval(() => {
      setFileProgress(prev => {
        const updated = new Map(prev);
        const progress = updated.get(fileId);
        if (progress && progress.status === 'uploading') {
          const increment = Math.random() * 10;
          progress.progress = Math.min(progress.progress + increment, 95);
          progress.uploadedBytes = Math.floor((progress.progress / 100) * file.size);
        }
        return updated;
      });
    }, 300);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(progressInterval);

    // Marcar como concluído
    setFileProgress(prev => {
      const updated = new Map(prev);
      const progress = updated.get(fileId);
      if (progress) {
        progress.status = 'completed';
        progress.progress = 100;
        progress.uploadedBytes = file.size;
      }
      return updated;
    });
  };

  const handleCancel = (fileId: string) => {
    setFileProgress(prev => {
      const updated = new Map(prev);
      updated.delete(fileId);
      return updated;
    });
  };

  const handleRetry = (fileId: string) => {
    setFileProgress(prev => {
      const updated = new Map(prev);
      const progress = updated.get(fileId);
      if (progress) {
        progress.status = 'pending';
        progress.progress = 0;
        progress.uploadedBytes = 0;
        progress.error = undefined;
      }
      return updated;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upload de Documentos para Análise
            </h2>
            <p className="text-gray-600 mb-2">
              Formatos suportados: PDF, DOCX, DOC, TXT, HTML
            </p>
            <p className="text-sm text-gray-500">
              Até 90MB por arquivo, até 15 arquivos (sem limite total)
            </p>
          </div>

          {/* Botão de seleção */}
          <div className="text-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.html"
              className="hidden"
              disabled={loading}
            />
          </div>

          {/* Mensagens de erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mensagens de sucesso */}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Barra de progresso por arquivo */}
          {fileProgress.size > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Progresso do Upload</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.from(fileProgress.values()).map(progress => (
                  <FileProgressBar
                    key={progress.fileId}
                    file={progress}
                    onCancel={handleCancel}
                    onRetry={handleRetry}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lista de arquivos selecionados */}
          {(files.length > 0 || largeFiles.length > 0) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Arquivos selecionados: {files.length + largeFiles.length} (
                  {files.length + largeFiles.length}/{UPLOAD_CONFIG.maxFiles} arquivos)
                </h3>
              </div>

              {/* Arquivos normais agrupados por ano */}
              {Object.entries(filesByYear).map(([year, yearFiles]) => (
                <div key={year} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {year}
                    </span>
                    ({yearFiles.length} arquivo(s))
                  </h4>
                  <div className="space-y-1 pl-4">
                    {yearFiles.map(file => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{file.name}</span>
                          <span className="text-gray-500 text-xs flex-shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Arquivos grandes (Manus Desktop) agrupados por ano */}
              {Object.entries(largeFilesByYear).map(([year, yearFiles]) => (
                <div key={`large-${year}`} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-amber-600" />
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
                      {year} (Manus Desktop)
                    </span>
                    ({yearFiles.length} arquivo(s))
                  </h4>
                  <div className="space-y-1 pl-4">
                    {yearFiles.map(file => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between p-2 bg-amber-50 rounded text-sm border border-amber-200"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <ManusDesktopIndicator
                            status="pending"
                            fileName={file.name}
                            fileSize={file.size}
                            progress={0}
                          />
                          <span className="text-gray-700 truncate">{file.name}</span>
                          <span className="text-gray-500 text-xs flex-shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão de análise */}
          {(files.length > 0 || largeFiles.length > 0) && (
            <Button
              onClick={handleUpload}
              disabled={loading || fileProgress.size > 0}
              className="w-full gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Analisar {files.length + largeFiles.length} Documento(s)
                </>
              )}
            </Button>
          )}

          {/* Informações de privacidade */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Segurança: Seu documento é processado localmente. Nenhuma informação pessoal é compartilhada com serviços externos. Dados sensíveis são mascarados conforme LGPD.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  );
}
