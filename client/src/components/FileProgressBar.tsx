import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Zap, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface FileProgress {
  fileId: string;
  fileName: string;
  fileSize: number;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  uploadedBytes: number;
  startTime?: number;
  error?: string;
}

interface FileProgressBarProps {
  file: FileProgress;
  onCancel?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
}

export const FileProgressBar: React.FC<FileProgressBarProps> = ({
  file,
  onCancel,
  onRetry,
}) => {
  // Calcular velocidade de upload (bytes por segundo)
  const calculateSpeed = (): string => {
    if (!file.startTime || file.uploadedBytes === 0) return '0 MB/s';
    const elapsedSeconds = (Date.now() - file.startTime) / 1000;
    const speedBytesPerSecond = file.uploadedBytes / elapsedSeconds;
    const speedMBPerSecond = speedBytesPerSecond / (1024 * 1024);
    return `${speedMBPerSecond.toFixed(2)} MB/s`;
  };

  // Calcular tempo estimado restante
  const calculateTimeRemaining = (): string => {
    if (!file.startTime || file.progress === 0 || file.progress === 100) {
      return 'Calculando...';
    }
    const elapsedSeconds = (Date.now() - file.startTime) / 1000;
    const totalSeconds = (elapsedSeconds / file.progress) * 100;
    const remainingSeconds = totalSeconds - elapsedSeconds;

    if (remainingSeconds < 0) return 'Concluído';
    if (remainingSeconds < 60) return `${Math.ceil(remainingSeconds)}s`;
    const minutes = Math.ceil(remainingSeconds / 60);
    return `${minutes}m`;
  };

  // Formatar tamanho de arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determinar cor baseada no status
  const getStatusColor = (): string => {
    switch (file.status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Determinar ícone baseado no status
  const getStatusIcon = () => {
    switch (file.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'uploading':
        return <Zap className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  // Determinar texto de status
  const getStatusText = (): string => {
    switch (file.status) {
      case 'completed':
        return 'Concluído';
      case 'error':
        return 'Erro';
      case 'uploading':
        return `Enviando... ${file.progress}%`;
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Header com nome do arquivo e status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.fileName}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.fileSize)}
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center gap-2 ml-2">
          {file.status === 'error' && onRetry && (
            <button
              onClick={() => onRetry(file.fileId)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="Tentar novamente"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}
          {(file.status === 'pending' || file.status === 'uploading') &&
            onCancel && (
              <button
                onClick={() => onCancel(file.fileId)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
        </div>
      </div>

      {/* Barra de progresso */}
      {file.status !== 'error' && (
        <>
          <Progress value={file.progress} className="mb-2 h-2" />

          {/* Informações de progresso */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex gap-4">
              <span>
                {formatFileSize(file.uploadedBytes)} /{' '}
                {formatFileSize(file.fileSize)}
              </span>
              {file.status === 'uploading' && (
                <>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {calculateSpeed()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {calculateTimeRemaining()}
                  </span>
                </>
              )}
            </div>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </>
      )}

      {/* Mensagem de erro */}
      {file.status === 'error' && file.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {file.error}
        </div>
      )}
    </div>
  );
};
