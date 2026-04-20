import React, { useState } from 'react';
import { ChevronDown, FileText, Clock, Users, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const PortariaCard: React.FC = () => {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const stages = [
    {
      id: 1,
      title: 'Disposições Preliminares',
      responsible: 'COTCE',
      duration: 'Fase Preparatória',
      description: 'Definição clara da TCE e seus objetivos',
      actions: [
        'Definição: Processo administrativo formalizado para apurar responsabilidade por dano ao erário',
        'Dever: Medidas administrativas imediatas com vistas ao ressarcimento do dano',
        'Novidade: Solução Consensual (conclusão do objeto)',
        'Sem dano: Comunicação por representação'
      ],
      norms: ['IN TCU 98/2024 (Art. 1-4)', 'Lei 8.443/1992'],
      documents: ['Definição do objeto da TCE', 'Identificação preliminar de responsáveis']
    },
    {
      id: 2,
      title: 'Instauração e Pressupostos',
      responsible: 'Autoridade Administrativa',
      duration: '5 dias úteis',
      description: 'Instauração formal via Sistema e-TCE',
      actions: [
        'Pressupostos: Existência do dano e identificação de responsáveis',
        'Prazos: 120 dias (omissão) ou 360 dias (demais casos)',
        'Suspensão: Parcelamento do débito',
        'Multa: Art. 58, II da Lei 8.443/1992'
      ],
      norms: ['Portaria TCU 121/2025 (Art. 10)', 'IN TCU 98/2024 (Art. 6-7)', 'Lei 8.443/1992 (Art. 58)'],
      documents: ['Termo de Instauração', 'Documentação de transferência de recursos', 'Parecer jurídico']
    },
    {
      id: 3,
      title: 'Organização e Documentação',
      responsible: 'COTCE',
      duration: 'Até 90 dias',
      description: 'Elaboração de documentos essenciais',
      actions: [
        'Relatório do Tomador: Identificação, conduta e quantificação',
        'Peças Essenciais: Certificado de Auditoria e Parecer do Controle Interno',
        'Pronunciamento Ministerial: Atribuição da autoridade superior',
        'Fichas de Qualificação: Dados detalhados dos responsáveis'
      ],
      norms: ['Portaria TCU 121/2025 (Art. 13)', 'IN TCU 98/2024 (Art. 8)'],
      documents: ['Relatório circunstanciado', 'Certificado de Auditoria', 'Parecer jurídico', 'Fichas de qualificação']
    },
    {
      id: 4,
      title: 'Quantificação do Débito',
      responsible: 'COTCE',
      duration: 'Paralelo às etapas anteriores',
      description: 'Cálculo preciso do dano ao erário',
      actions: [
        'Métodos: Verificação (exata) ou Estimativa (confiável)',
        'Marco inicial: Ordem bancária, data do pagamento na ciência do fato',
        'Atualização: IPCA e incidência de juros de mora',
        'Dano não quantificável: Instauração para aplicação de multa'
      ],
      norms: ['IN TCU 98/2024 (Art. 7)', 'Lei 9.250/1995', 'Resolução TCU 344/2022'],
      documents: ['Cálculo de débito', 'Documentação de IPCA', 'Demonstrativo de juros']
    },
    {
      id: 5,
      title: 'Dispensa e Arquivamento',
      responsible: 'COTCE',
      duration: 'Análise contínua',
      description: 'Avaliação de racionalidade e limites financeiros',
      actions: [
        'Limite de valor: Dispensa se débito inferior a R$ 120.000,00',
        'Racionalidade: Banco de Débitos Inferiores (entre R$ 20 mil e R$ 120 mil)',
        'Fator tempo: Dispensa se transcorridos 10 anos sem notificação',
        'Elísio do dano: Arquivamento por resolução integral'
      ],
      norms: ['IN TCU 98/2024 (Art. 8)', 'Resolução TCU 344/2022'],
      documents: ['Análise de racionalidade', 'Documentação de somatório de débitos']
    },
    {
      id: 6,
      title: 'Prescrição e BAP',
      responsible: 'COTCE + Sistema Automatizado',
      duration: 'Contínuo (5 anos)',
      description: 'Monitoramento de prescrição e Banco de Arquivamentos',
      actions: [
        'Prazos: 5 anos (geral) e 3 anos (intercorrente)',
        'Banco de Arquivamento por Prescrição (BAP): Processos paralisados > 5 anos',
        'Responsabilização: Dano imputável a quem causou a prescrição',
        'Sistema de Prevenção: Monitoramento e alertas automáticos'
      ],
      norms: ['Resolução TCU 344/2022', 'IN TCU 98/2024 (Art. 9-10)'],
      documents: ['Registro no BAP', 'Notificações de risco de prescrição', 'Relatório de monitoramento']
    },
    {
      id: 7,
      title: 'Segregação de Funções',
      responsible: 'COTCE (não COAPC)',
      duration: 'Garantia estrutural',
      description: 'Garantir segregação entre análise e julgamento',
      actions: [
        'COTCE: Fase patológica e instrução de TCE',
        'DIVCONT: Registro contábil e conformidade patrimonial',
        'COAPC: Fase ordinária e análise financeira (NÃO INCLUSO)',
        'Objetivo: Garantir imparcialidade e conformidade'
      ],
      norms: ['Portaria TCU 121/2025 (Art. 2)', 'Portaria MTur 17/2024'],
      documents: ['Estrutura regimental', 'Atribuições de cada coordenação']
    }
  ];

  const criticalPeriods = [
    { period: 'Instauração', duration: '5 dias úteis', norm: 'Portaria 121/2025' },
    { period: 'Controle Interno', duration: '90 dias', norm: 'Portaria 121/2025' },
    { period: 'Fase Interna Total', duration: '180 dias', norm: 'IN TCU 98/2024' },
    { period: 'Prescrição Geral', duration: '5 anos', norm: 'Resolução TCU 344/2022' },
    { period: 'Prescrição Intercorrente', duration: '3 anos', norm: 'Resolução TCU 344/2022' }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Seção de Definição */}
      <Card className="border-l-4 border-l-blue-600 p-6 bg-blue-50">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-blue-900">Portaria TCU nº 121/2025</h3>
          <p className="text-sm text-blue-800">
            <strong>Definição:</strong> Sistema e-TCE para operacionalização de Tomadas de Contas Especial
          </p>
          <p className="text-sm text-blue-800">
            <strong>Objetivo:</strong> Formalizar processo administrativo para apurar responsabilidade por dano ao erário, quantificar o dano e identificar responsáveis para obter ressarcimento.
          </p>
          <p className="text-sm text-blue-800">
            <strong>Escopo:</strong> Fase Interna (COTCE) - Medidas Administrativas até Pronunciamento Ministerial
          </p>
        </div>
      </Card>

      {/* 7 Etapas da COTCE */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">7 Etapas da COTCE (Fase Interna)</h3>
        
        {stages.map((stage) => (
          <div key={stage.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
              className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full font-bold">
                  {stage.id}
                </div>
                <div>
                  <h4 className="font-bold">{stage.title}</h4>
                  <p className="text-sm text-blue-100">{stage.responsible} • {stage.duration}</p>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${expandedStage === stage.id ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedStage === stage.id && (
              <div className="p-6 bg-white space-y-4 border-t">
                {/* Descrição */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Descrição
                  </h5>
                  <p className="text-sm text-gray-700">{stage.description}</p>
                </div>

                {/* Ações */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Ações Principais
                  </h5>
                  <ul className="space-y-2">
                    {stage.actions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Normas */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    Normas Relacionadas
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {stage.norms.map((norm, idx) => (
                      <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                        {norm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Documentos */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Documentos Obrigatórios
                  </h5>
                  <ul className="space-y-1">
                    {stage.documents.map((doc, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-purple-600">✓</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prazos Críticos */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-l-orange-600">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Prazos Críticos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left p-2 font-semibold text-gray-900">Período</th>
                <th className="text-left p-2 font-semibold text-gray-900">Duração</th>
                <th className="text-left p-2 font-semibold text-gray-900">Norma</th>
              </tr>
            </thead>
            <tbody>
              {criticalPeriods.map((item, idx) => (
                <tr key={idx} className="border-b border-orange-100 hover:bg-orange-100 transition-colors">
                  <td className="p-2 text-gray-900 font-medium">{item.period}</td>
                  <td className="p-2 text-gray-700">{item.duration}</td>
                  <td className="p-2 text-orange-700 font-semibold">{item.norm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Referências Normativas Completas */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-l-4 border-l-green-600">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Referências Normativas Completas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Legislação Primária</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Constituição Federal (Art. 70 e 71)</li>
              <li>✓ Lei 8.443/1992 (Lei Orgânica do TCU)</li>
              <li>✓ Lei 9.250/1995 (Juros de Mora)</li>
              <li>✓ Lei 10.522/2002 (CADIN Parcelamento)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Instruções Normativas</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ IN TCU 98/2024 (Procedimentos de TCE)</li>
              <li>✓ IN TCU 96/2024 (Complementar)</li>
              <li>✓ IN TCU 155/2016 (Histórico)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Portarias e Resoluções</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Portaria TCU 121/2025 (Sistema e-TCE)</li>
              <li>✓ Resolução TCU 344/2022 (Prescrição)</li>
              <li>✓ Portaria CGU 1.531/2021</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Documentos Relacionados</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ NI CGU 877/2021</li>
              <li>✓ Portaria MTur 17/2024 (Estrutura)</li>
              <li>✓ Acórdão TCU 2469/2024</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Botão de Ação */}
      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => window.open('https://pesquisa.apps.tcu.gov.br/redireciona/norma/NORMA-40448', '_blank')}
        >
          Acessar Portaria 121/2025
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => window.open('https://www.gov.br/cgu/pt-br/assuntos/auditoria-e-fiscalizacao/tomadas-de-contas-especiais/fluxo-e-informacoes', '_blank')}
        >
          Fluxo CGU Completo
        </Button>
      </div>
    </div>
  );
};
