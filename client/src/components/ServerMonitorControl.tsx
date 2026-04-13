import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Play, Square, CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Componente de Controle de Monitoramento de Servidor
 * 
 * Permite ao usuário:
 * - Iniciar monitoramento manual
 * - Parar monitoramento
 * - Visualizar status
 * - Economizar créditos (sem execução automática)
 */
export function ServerMonitorControl() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('online');
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

  const handleStartMonitoring = async () => {
    setIsMonitoring(true);
    setStatus('checking');

    try {
      // Executar verificação manual
      const response = await fetch('/api/health');
      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        setStatus('online');
        setConsecutiveFailures(0);
      } else {
        setStatus('offline');
        setConsecutiveFailures(prev => prev + 1);
      }

      setLastCheck(new Date());
    } catch (error) {
      setStatus('offline');
      setConsecutiveFailures(prev => prev + 1);
      setLastCheck(new Date());
    }
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'checking':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Servidor Online';
      case 'offline':
        return 'Servidor Offline';
      case 'checking':
        return 'Verificando...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'offline':
        return 'bg-red-50 border-red-200';
      case 'checking':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔍 Monitoramento de Servidor</span>
        </CardTitle>
        <CardDescription>
          Verifique a saúde do servidor sob demanda. Sem execução automática para economizar créditos.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Atual */}
        <div className={`p-4 border rounded-lg ${getStatusColor()}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-semibold">{getStatusText()}</p>
              {lastCheck && (
                <p className="text-sm text-gray-600">
                  Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Alertas */}
        {consecutiveFailures > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {consecutiveFailures} falha(s) consecutiva(s) detectada(s). 
              {consecutiveFailures >= 3 && ' Considere reiniciar o servidor.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Controles */}
        <div className="flex gap-2">
          <Button
            onClick={handleStartMonitoring}
            disabled={isMonitoring}
            className="flex-1 gap-2"
            variant={status === 'online' ? 'default' : 'destructive'}
          >
            <Play className="w-4 h-4" />
            Verificar Agora
          </Button>

          {isMonitoring && (
            <Button
              onClick={handleStopMonitoring}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Square className="w-4 h-4" />
              Parar
            </Button>
          )}
        </div>

        {/* Informações */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-2">
          <p>
            <strong>💡 Dica:</strong> Clique em "Verificar Agora" para fazer uma verificação manual da saúde do servidor.
          </p>
          <p>
            <strong>⚙️ Configuração:</strong> Este componente não executa verificações automáticas para economizar créditos.
          </p>
          <p>
            <strong>📊 Intervalo Recomendado:</strong> Verifique a cada 30 minutos durante operações críticas.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded border border-blue-200">
            <p className="text-gray-600">Status Atual</p>
            <p className="font-semibold text-blue-600">{getStatusText()}</p>
          </div>
          <div className="bg-orange-50 p-2 rounded border border-orange-200">
            <p className="text-gray-600">Falhas Consecutivas</p>
            <p className="font-semibold text-orange-600">{consecutiveFailures}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
