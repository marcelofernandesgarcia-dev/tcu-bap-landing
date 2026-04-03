/**
 * SIACT Analisador - Componente de Resultados
 * Exibe resultados da análise de prescrição
 */

import { CheckCircle, AlertCircle, XCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalysisStep {
  stepName: string;
  passed: boolean;
  details: string[];
  status: string;
}

interface AnalysisResultsProps {
  analysis?: {
    admissibility: AnalysisStep;
    prescription: AnalysisStep;
    bapEligibility: AnalysisStep;
    aiParecer?: string;
  };
  loading?: boolean;
}

export function AnalysisResults({ analysis, loading }: AnalysisResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  // Validar que todas as propriedades existem
  if (!analysis.admissibility || !analysis.prescription || !analysis.bapEligibility) {
    return (
      <Alert className="border-red-300 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Erro: Dados de análise incompletos. Por favor, tente novamente.
        </AlertDescription>
      </Alert>
    );
  }

  const steps = [
    analysis.admissibility,
    analysis.prescription,
    analysis.bapEligibility,
  ];

  return (
    <div className="w-full space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Resultados da Análise
        </h2>
        <p className="text-gray-700">
          Análise determinística conforme IN TCU 98/2024, Lei 9.873/1999 e Resolução TCU 344/2022
        </p>
      </div>

      {/* Análise em Etapas */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          if (!step || step.passed === undefined) return null;
          return (
            <Card key={idx} className="p-6 border-l-4" style={{
              borderLeftColor: step.passed ? '#10b981' : '#ef4444'
            }}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {step.passed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.stepName}
                  </h3>
                  
                  <div className="space-y-2">
                    {step.details.map((detail, detailIdx) => (
                      <div key={detailIdx} className="flex items-start space-x-2">
                        <span className="text-gray-600 text-sm">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 inline-block">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      step.passed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Parecer da IA (se disponível) */}
      {analysis.aiParecer && (
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-4">
            <FileText className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🤖 Parecer de Análise (Validação Humana Necessária)
              </h3>
              <div className="bg-white p-4 rounded border border-amber-200 text-sm text-gray-700 whitespace-pre-wrap">
                {analysis.aiParecer}
              </div>
              <Alert className="mt-4 border-amber-300 bg-amber-100">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>⚠️ Importante:</strong> Este parecer foi gerado por IA e requer validação e conferência humana 
                  antes de qualquer decisão administrativa. A responsabilidade final é do órgão setorial.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>
      )}

      {/* Resumo Executivo */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Resumo Executivo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${analysis.admissibility.passed ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.admissibility.passed ? '✅' : '❌'}
            </div>
            <p className="text-sm text-gray-700 mt-2">Admissibilidade</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${analysis.prescription.passed ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.prescription.passed ? '✅' : '❌'}
            </div>
            <p className="text-sm text-gray-700 mt-2">Prescrição</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${analysis.bapEligibility.passed ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.bapEligibility.passed ? '✅' : '❌'}
            </div>
            <p className="text-sm text-gray-700 mt-2">Elegibilidade BAP</p>
          </div>
        </div>
      </Card>

      {/* Referências Normativas */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          📚 Referências Normativas
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• <strong>IN TCU nº 98/2024</strong> - Instauração de Tomada de Contas Especial</li>
          <li>• <strong>Lei nº 9.873/1999</strong> - Prescrição Administrativa</li>
          <li>• <strong>Resolução TCU nº 344/2022</strong> - Prescrição Principal e Intercorrente</li>
          <li>• <strong>Portaria TCU nº 121/2025</strong> - Banco de Arquivamentos por Prescrição (BAP)</li>
          <li>• <strong>Lei nº 13.709/2018 (LGPD)</strong> - Proteção de Dados Pessoais</li>
        </ul>
      </Card>

      {/* Aviso de Segurança */}
      <Alert className="border-blue-300 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>🔒 Segurança de Dados:</strong> Esta análise foi realizada com mascaramento de dados sensíveis 
          conforme LGPD. Nenhuma informação pessoal foi compartilhada com serviços externos. 
          Dados são processados localmente e não são armazenados permanentemente.
        </AlertDescription>
      </Alert>
    </div>
  );
}
