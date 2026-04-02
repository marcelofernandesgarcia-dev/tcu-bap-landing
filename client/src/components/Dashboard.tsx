import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";
import statisticsData from '@/data/tce-statistics.json';

export function Dashboard() {
  const stats = statisticsData.statistics;
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-8">
      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total Analisadas</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{formatNumber(stats.summary.totalAnalyzed)}</p>
              <p className="text-xs text-blue-600 mt-2">2002-2025</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold">Certificadas</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{formatNumber(stats.summary.totalCertified)}</p>
              <p className="text-xs text-green-600 mt-2">{stats.summary.certificationRate.toFixed(1)}% de aprovação</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-amber-600 font-semibold">Diligenciadas</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">{formatNumber(stats.summary.totalDiligenced)}</p>
              <p className="text-xs text-amber-600 mt-2">{stats.summary.diligenceRate.toFixed(1)}% para revisão</p>
            </div>
            <PieChart className="w-8 h-8 text-amber-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">Retorno Potencial</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">R$ 54,7 Bi</p>
              <p className="text-xs text-purple-600 mt-2">Total acumulado</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('yearly')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'yearly'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Evolução Anual
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'insights'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Insights
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Estatísticas Principais (2002-2025)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Média anual de análises:</span>
                  <span className="font-semibold text-slate-900">{formatNumber(stats.summary.yearlyAverage)} TCEs</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Taxa de certificação:</span>
                  <span className="font-semibold text-green-700">{stats.summary.certificationRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Taxa de diligência:</span>
                  <span className="font-semibold text-amber-700">{stats.summary.diligenceRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Retorno potencial total:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(stats.summary.totalRecoveryPotential)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Período analisado:</span>
                  <span className="font-semibold text-slate-900">{stats.summary.startYear}-{stats.summary.endYear}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Última atualização:</span>
                  <span className="font-semibold text-slate-900">31/12/2025</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Recorde em 2025</h3>
            <p className="text-blue-800">
              A CGU certificou <strong>2.949 processos de TCE</strong> em 2025, um recorde histórico da série, com montante certificado de aproximadamente <strong>R$ 3,5 bilhões</strong>. Este resultado demonstra o aumento da eficiência no processamento de Tomadas de Contas Especiais.
            </p>
          </Card>
        </div>
      )}

      {/* YEARLY TAB */}
      {activeTab === 'yearly' && (
        <div className="space-y-6">
          <Card className="p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Análises de TCEs por Exercício (2012-2025)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-3 px-2 font-semibold text-slate-700">Exercício</th>
                  <th className="text-right py-3 px-2 font-semibold text-slate-700">Analisadas</th>
                  <th className="text-right py-3 px-2 font-semibold text-slate-700">Certificadas</th>
                  <th className="text-right py-3 px-2 font-semibold text-slate-700">Diligenciadas</th>
                  <th className="text-right py-3 px-2 font-semibold text-slate-700">Retorno Potencial</th>
                </tr>
              </thead>
              <tbody>
                {stats.yearlyData.slice(1).map((year, idx) => (
                  <tr key={idx} className={`border-b border-slate-200 ${year.year === 2025 ? 'bg-green-50' : ''}`}>
                    <td className="py-3 px-2 font-semibold text-slate-900">{year.year}</td>
                    <td className="text-right py-3 px-2 text-slate-600">{formatNumber(year.analyzed)}</td>
                    <td className="text-right py-3 px-2 text-green-700 font-semibold">{formatNumber(year.certified)}</td>
                    <td className="text-right py-3 px-2 text-amber-700">{formatNumber(year.diligenced)}</td>
                    <td className="text-right py-3 px-2 text-slate-900 font-semibold">{formatCurrency(year.recoveryPotential)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-green-700">
              <h3 className="font-bold text-slate-900 mb-3">Maior Certificação</h3>
              <p className="text-2xl font-bold text-green-700 mb-2">2.949</p>
              <p className="text-sm text-slate-600">Processos certificados em 2025 (recorde histórico)</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-700">
              <h3 className="font-bold text-slate-900 mb-3">Maior Retorno</h3>
              <p className="text-2xl font-bold text-purple-700 mb-2">R$ 9,1 Bi</p>
              <p className="text-sm text-slate-600">Retorno potencial em 2021</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-700">
              <h3 className="font-bold text-slate-900 mb-3">Média Anual</h3>
              <p className="text-2xl font-bold text-blue-700 mb-2">2.449</p>
              <p className="text-sm text-slate-600">Certificações por ano (2012-2025)</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-700">
              <h3 className="font-bold text-slate-900 mb-3">Taxa de Qualidade</h3>
              <p className="text-2xl font-bold text-amber-700 mb-2">81,7%</p>
              <p className="text-sm text-slate-600">Certificação na primeira análise</p>
            </Card>
          </div>

          <Card className="p-6 bg-slate-50">
            <h3 className="font-bold text-slate-900 mb-4">Análise Histórica</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>Período 2002-2011:</strong> 16.039 TCEs analisadas, com retorno potencial de R$ 7,7 bilhões. Este período estabeleceu a base para o sistema de controle moderno.
              </p>
              <p>
                <strong>Período 2012-2021:</strong> 20.471 TCEs analisadas, com retorno potencial de R$ 31,7 bilhões. Período de consolidação e aumento de eficiência.
              </p>
              <p>
                <strong>Período 2022-2025:</strong> 8.459 TCEs analisadas, com retorno potencial de R$ 15,4 bilhões. Período de otimização com implementação de novas normas (IN 98/2024).
              </p>
              <p className="mt-4 pt-4 border-t border-slate-300">
                <strong>Observação:</strong> O retorno "potencial" refere-se ao total certificado. O retorno "efetivo" é menor devido a recursos interpostos, prescrições e insolvências. A IN TCU nº 98/2024 foi criada justamente para evitar perdas por prescrição.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* FOOTER */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Fonte:</strong> Controladoria-Geral da União (CGU) - Dados atualizados até 31/12/2025 | 
          <strong> Normativos:</strong> Lei 8.443/1992, IN TCU nº 98/2024, Portaria TCU nº 121/2025, Resolução TCU nº 344/2022
        </p>
      </Card>
    </div>
  );
}
