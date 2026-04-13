/**
 * SIACT Analisador de Prescrição - Página Principal
 */

import { useState } from 'react';
import { AnalysisUploader } from '@/components/AnalysisUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisConclusions } from '@/components/AnalysisConclusions';
import { MultiFileUploader } from '@/components/MultiFileUploader';
import { Card } from '@/components/ui/card';
import { AlertCircle, FileText } from 'lucide-react';
import { OCRResult } from '@/hooks/useOCR';
import { mapBackendAnalysisToFrontend } from '@/lib/analysisMapper';
import { extractConclusions } from '@/lib/conclusionExtractor';

export function Analyzer() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [conclusions, setConclusions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
  const [showOCRUploader, setShowOCRUploader] = useState(false);

  const handleAnalysisComplete = (result: any) => {
    try {
      const mappedResult = mapBackendAnalysisToFrontend(result);
      setAnalysisResult(mappedResult);
      
      // Extrair conclusões da análise
      try {
        const extractedConclusions = extractConclusions(result);
        setConclusions(extractedConclusions);
      } catch (error) {
        console.error('Erro ao extrair conclusões:', error);
      }
    } catch (error) {
      console.error('Erro ao mapear análise:', error);
      setAnalysisResult(result);
    }
  };

  const handleFilesProcessed = (results: OCRResult[]) => {
    setOcrResults(results);
    // Combinar textos extraídos e enviar para análise
    const combinedText = results.map(r => `\n=== ${r.filename} ===\n${r.text}`).join('\n');
    // TODO: Enviar para análise
    console.log('OCR Results:', results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            🔍 Analisador de Prescrição
          </h1>
          <p className="text-blue-100 text-lg">
            Análise automática de prescrição em processos de Tomada de Contas Especial
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-2">
            <AnalysisUploader onAnalysisComplete={handleAnalysisComplete} />

            {/* Instruções */}
            <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📖 Como Usar
              </h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex space-x-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Selecione um documento (PDF, DOCX, TXT ou HTML) contendo informações do processo</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Clique em "Analisar Documento" para processar</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Revise os resultados da análise determinística</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-blue-600">4.</span>
                  <span>Valide o parecer de IA com conferência humana</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-blue-600">5.</span>
                  <span>Tome decisão administrativa baseada na análise</span>
                </li>
              </ol>
            </Card>

            {/* Informações Esperadas */}
            <Card className="mt-8 p-6 bg-amber-50 border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Informações Esperadas no Documento
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-amber-900">Dados Obrigatórios:</p>
                  <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                    <li>Número do processo / e-TCE</li>
                    <li>Data do fato gerador</li>
                    <li>Valor do débito</li>
                    <li>Marcos processuais (eventos interruptivos)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Dados Opcionais:</p>
                  <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                    <li>Certificação CGU</li>
                    <li>Histórico de solução consensual</li>
                    <li>Campos BAP preenchidos</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ℹ️ Sobre o Analisador
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Versão:</strong> Prototipo v0.1 (Desenvolvimento Local)
                </p>
                <p>
                  <strong>Status:</strong> <span className="text-green-600 font-semibold">Operacional</span>
                </p>
                <p>
                  <strong>Modo:</strong> Testes Locais Exclusivos
                </p>
                <p>
                  <strong>Dados:</strong> Não compartilhados com IA pública
                </p>
              </div>
            </Card>

            {/* Conformidade Card */}
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✅ Conformidade
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>IN TCU nº 98/2024</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Lei 9.873/1999</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Resolução TCU 344/2022</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Portaria TCU 121/2025</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>LGPD - Proteção de Dados</span>
                </li>
              </ul>
            </Card>

            {/* Aviso Importante */}
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">
                    ⚠️ Aviso Importante
                  </h4>
                  <p className="text-sm text-red-800">
                    Este é um prototipo de desenvolvimento. 
                    Resultados requerem validação e conferência humana antes de qualquer decisão administrativa.
                    A responsabilidade final é do órgão setorial.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="mt-12 space-y-8">
            <AnalysisResults analysis={analysisResult} loading={isLoading} />
            
            {/* Conclusions Section */}
            {conclusions && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📄 Parecer Técnico</h2>
                <AnalysisConclusions data={conclusions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
