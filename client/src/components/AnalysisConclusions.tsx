import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { Streamdown } from 'streamdown';

export interface ConclusionData {
  parecer: string;
  recomendacoes: string[];
  statusBAP: {
    elegivel: boolean;
    motivo: string;
    paralysisYears: number;
  };
  alertasPrescrição: {
    tipo: 'PRESCRITO' | 'RISCO_IMINENTE' | 'ATENCAO' | 'REGULAR';
    mensagem: string;
    diasRestantes?: number;
  }[];
  dataAnalise: string;
  versaoSIACT: string;
}

interface AnalysisConclusionsProps {
  data: ConclusionData;
  isLoading?: boolean;
  error?: string;
}

export const AnalysisConclusions: React.FC<AnalysisConclusionsProps> = ({
  data,
  isLoading = false,
  error
}) => {
  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Parecer da Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-blue-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-blue-200 rounded animate-pulse w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Erro ao Gerar Parecer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Principal - Parecer */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Parecer da Análise</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {data.versaoSIACT} • Análise em {new Date(data.dataAnalise).toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-white">SIACT</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Parecer Principal */}
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <Streamdown>{data.parecer}</Streamdown>
          </div>

          {/* Alertas de Prescrição */}
          {data.alertasPrescrição.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Alertas de Prescrição
              </h4>
              {data.alertasPrescrição.map((alerta, idx) => (
                <Alert
                  key={idx}
                  className={`border-l-4 ${
                    alerta.tipo === 'PRESCRITO'
                      ? 'border-l-red-500 bg-red-50'
                      : alerta.tipo === 'RISCO_IMINENTE'
                      ? 'border-l-orange-500 bg-orange-50'
                      : alerta.tipo === 'ATENCAO'
                      ? 'border-l-yellow-500 bg-yellow-50'
                      : 'border-l-green-500 bg-green-50'
                  }`}
                >
                  <AlertDescription className="text-sm">
                    <div className="flex items-start gap-2">
                      {alerta.tipo === 'PRESCRITO' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      ) : alerta.tipo === 'RISCO_IMINENTE' ? (
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      ) : alerta.tipo === 'ATENCAO' ? (
                        <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{alerta.mensagem}</p>
                        {alerta.diasRestantes !== undefined && (
                          <p className="text-xs mt-1 opacity-75">
                            Dias restantes: {alerta.diasRestantes}
                          </p>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Status BAP */}
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Status de Elegibilidade BAP</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{data.statusBAP.motivo}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Paralisação: {data.statusBAP.paralysisYears} anos
                </p>
              </div>
              <Badge
                className={`${
                  data.statusBAP.elegivel
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                {data.statusBAP.elegivel ? '✅ Elegível' : '❌ Não Elegível'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Recomendações */}
      {data.recomendacoes.length > 0 && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recomendacoes.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-green-600 font-bold flex-shrink-0">{idx + 1}.</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Rodapé com Selo de Transparência */}
      <div className="text-center text-xs text-gray-500 border-t pt-3">
        🤖 DOCUMENTO ELABORADO POR IA (SIACT v7.9.4). Dados extraídos conforme ordem lógica e cronológica dos autos.
      </div>
    </div>
  );
};

export default AnalysisConclusions;
