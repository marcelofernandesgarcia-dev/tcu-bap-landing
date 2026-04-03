/**
 * Componente de Indicador Visual para Manus Desktop
 * Mostra status de processamento local de arquivos grandes
 */

import { HardDrive, Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ManusDesktopIndicatorProps {
  status: 'pending' | 'processing' | 'completed' | 'error';
  fileName: string;
  fileSize: number; // em bytes
  progress?: number; // 0-100
  errorMessage?: string;
  onRemove?: () => void;
}

export function ManusDesktopIndicator({
  status,
  fileName,
  fileSize,
  progress = 0,
  errorMessage,
  onRemove,
}: ManusDesktopIndicatorProps) {
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

  const statusConfig: Record<string, any> = {
    pending: {
      icon: HardDrive,
      label: 'Aguardando Processamento',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      badgeColor: 'bg-orange-100 text-orange-800',
      animated: false,
    },
    processing: {
      icon: Zap,
      label: 'Processando Localmente',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      badgeColor: 'bg-blue-100 text-blue-800',
      animated: true,
    },
    completed: {
      icon: CheckCircle,
      label: 'Processamento Concluído',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      badgeColor: 'bg-green-100 text-green-800',
      animated: false,
    },
    error: {
      icon: AlertCircle,
      label: 'Erro no Processamento',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      badgeColor: 'bg-red-100 text-red-800',
      animated: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <div className={`rounded-lg border-2 p-4 ${config.bgColor} ${config.borderColor}`}>
        <div className="flex items-start gap-3">
          {/* Ícone com animação */}
          <div className="flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`${config.animated ? 'animate-pulse' : ''}`}>
                  <Icon className={`h-6 w-6 ${config.color}`} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {status === 'processing'
                    ? 'Processamento OCR em andamento no seu computador'
                    : status === 'completed'
                      ? 'Arquivo processado com sucesso'
                      : status === 'error'
                        ? 'Erro durante o processamento'
                        : 'Arquivo aguardando processamento'}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Conteúdo */}
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{fileName}</h4>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeColor}`}>
                {config.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-600">
              Tamanho: {fileSizeMB} MB • Processamento Local (OCR)
            </p>

            {/* Barra de Progresso */}
            {status === 'processing' && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Progresso</span>
                  <span className="text-xs font-medium text-gray-700">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-300 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {status === 'error' && errorMessage && (
              <div className="mt-2 text-sm text-red-700">
                <p className="font-medium">Erro: {errorMessage}</p>
              </div>
            )}

            {/* Informações Adicionais */}
            {status === 'completed' && (
              <div className="mt-2 flex items-center gap-1 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Pronto para análise de prescrição</span>
              </div>
            )}

            {status === 'pending' && (
              <div className="mt-2 flex items-center gap-1 text-sm text-orange-700">
                <Clock className="h-4 w-4" />
                <span>Será processado quando você clicar em "Analisar"</span>
              </div>
            )}
          </div>
        </div>

        {/* Informação sobre Privacidade */}
        <div className="mt-3 rounded bg-white/50 p-2 text-xs text-gray-700">
          <p>
            <strong>🔒 Privacidade:</strong> Este arquivo será processado localmente no seu computador. Nenhum dado será enviado para
            servidores externos.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
