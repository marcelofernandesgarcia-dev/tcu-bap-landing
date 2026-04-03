import { useState } from "react";
import { MultipleFileUpload } from "@/components/MultipleFileUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";

/**
 * Página de Análise em Batch
 * Permite selecionar e processar múltiplos arquivos simultaneamente
 */
export function BatchAnalysisPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Análise em Batch
          </h1>
          <p className="text-lg text-gray-600">
            Processe múltiplos documentos TCE simultaneamente
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-blue-500">
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Múltiplos Arquivos</h3>
                <p className="text-sm text-gray-600">
                  Até 15 arquivos simultâneos
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-green-500">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">100MB Total</h3>
                <p className="text-sm text-gray-600">
                  Limite aumentado para grandes documentos
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-purple-500">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-purple-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Processamento Rápido</h3>
                <p className="text-sm text-gray-600">
                  OCR + Análise + Prescrição
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-white shadow-lg">
          <MultipleFileUpload />
        </Card>

        {/* Supported Formats */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Formatos Suportados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {["PDF", "DOCX", "DOC", "TXT", "HTML"].map((format) => (
              <div
                key={format}
                className="bg-white p-3 rounded-lg text-center border border-blue-200"
              >
                <p className="font-semibold text-blue-600">{format}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Seleção com checkboxes</li>
              <li>✅ Drag-and-drop</li>
              <li>✅ Progresso individual</li>
              <li>✅ Progresso total</li>
              <li>✅ Sincronização automática</li>
              <li>✅ Histórico de processamento</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Benefícios</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>⚡ Até 15 arquivos por vez</li>
              <li>📊 Progresso em tempo real</li>
              <li>🔒 Privacidade com Manus Desktop</li>
              <li>📈 Dashboard automático</li>
              <li>🎯 Análise de prescrição</li>
              <li>🛡️ Mascaramento LGPD</li>
            </ul>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-3">Como Usar</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>
              <span className="font-semibold">1.</span> Clique ou arraste
              arquivos para a área de upload
            </li>
            <li>
              <span className="font-semibold">2.</span> Selecione os arquivos
              que deseja processar
            </li>
            <li>
              <span className="font-semibold">3.</span> Clique em "Processar"
              para iniciar a análise
            </li>
            <li>
              <span className="font-semibold">4.</span> Acompanhe o progresso
              em tempo real
            </li>
            <li>
              <span className="font-semibold">5.</span> Resultados aparecem
              automaticamente no Dashboard
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
