'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";

interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  reference?: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: "tce",
    term: "Tomada de Contas Especial (TCE)",
    category: "Conceitos Principais",
    definition: "Processo administrativo formal para apurar fatos, quantificar prejuízos ao Erário federal e identificar responsáveis por omissão, desvio ou atos ilegais, visando o ressarcimento de valores.",
    reference: "Lei 8.443/1992, IN TCU nº 98/2024"
  },
  {
    id: "bap",
    term: "Banco de Arquivamentos por Prescrição (BAP)",
    category: "Conceitos Principais",
    definition: "Banco de dados que consolida processos de TCE que ficaram paralisados por mais de 5 anos e estão sendo arquivados por prescrição, conforme Resolução TCU nº 344/2022.",
    reference: "Resolução TCU nº 344/2022"
  },
  {
    id: "prescricao",
    term: "Prescrição",
    category: "Conceitos Principais",
    definition: "Perda do direito de o governo cobrar um débito após decorrido o prazo legal. Para TCE: prescrição principal de 5 anos e prescrição intercorrente de 3 anos sem atividade processual.",
    reference: "Lei 9.873/1999, Resolução TCU nº 344/2022"
  },
  {
    id: "ipca",
    term: "Índice de Preços ao Consumidor Amplo (IPCA)",
    category: "Conceitos Principais",
    definition: "Índice oficial de inflação calculado pelo IBGE, utilizado para atualizar monetariamente valores de débitos em processos de TCE.",
    reference: "IBGE"
  },
  {
    id: "desfalque",
    term: "Desfalque",
    category: "Irregularidades",
    definition: "Sumiço ou desaparecimento de valores em dinheiro ou bens públicos sob responsabilidade de um gestor, configurando motivo para instauração de TCE.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "desvio",
    term: "Desvio de Recursos",
    category: "Irregularidades",
    definition: "Utilização de recursos públicos federais para finalidade diversa daquela autorizada ou prevista no instrumento de transferência, configurando irregularidade passível de TCE.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "superfaturamento",
    term: "Superfaturamento",
    category: "Irregularidades",
    definition: "Cobrança de valor superior ao preço de mercado por bens ou serviços, resultando em prejuízo ao Erário e configurando motivo para TCE.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "omissao",
    term: "Omissão no Dever de Prestar Contas",
    category: "Irregularidades",
    definition: "Falha do gestor em apresentar documentação comprobatória de como utilizou os recursos públicos federais recebidos no prazo estabelecido.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "fase-interna",
    term: "Fase Interna da TCE",
    category: "Fases do Processo",
    definition: "Primeira etapa da TCE, com duração de até 180 dias, durante a qual o órgão federal instrui o processo, envia ao Controle Interno (CGU) e obtém pronunciamento ministerial antes de enviar ao TCU.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "fase-externa",
    term: "Fase Externa da TCE",
    category: "Fases do Processo",
    definition: "Segunda etapa da TCE, que ocorre perante o Tribunal de Contas da União (TCU), onde o processo é julgado e pode resultar em condenação, quitação ou quitação com ressalva.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "medidas-administrativas",
    term: "Medidas Administrativas (Fase Preliminar)",
    category: "Fases do Processo",
    definition: "Etapa anterior à instauração da TCE, com prazos de 120 dias (omissão) ou 360 dias (demais casos), durante a qual o governo tenta resolver o problema por meios amigáveis.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "solucao-consensual",
    term: "Solução Consensual",
    category: "Fases do Processo",
    definition: "Acordo entre o governo e o responsável durante a fase administrativa, permitindo que o débito seja quitado com apenas atualização monetária (sem juros) se comprovada boa-fé.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "condenacao",
    term: "Condenação",
    category: "Resultados do Julgamento",
    definition: "Decisão do TCU que declara as contas irregulares, condenando o responsável ao pagamento do débito (com juros de mora e correção monetária) e podendo aplicar multa de até 30% do valor.",
    reference: "Lei 8.443/1992"
  },
  {
    id: "quitacao",
    term: "Quitação",
    category: "Resultados do Julgamento",
    definition: "Decisão do TCU que aprova as contas como regulares, liberando o responsável de qualquer obrigação de ressarcimento.",
    reference: "Lei 8.443/1992"
  },
  {
    id: "quitacao-ressalva",
    term: "Quitação com Ressalva",
    category: "Resultados do Julgamento",
    definition: "Decisão do TCU que aprova as contas com observações sobre impropriedades ou faltas identificadas, mas sem condenação ao pagamento de débito.",
    reference: "Lei 8.443/1992"
  },
  {
    id: "responsabilidade-solidaria",
    term: "Responsabilidade Solidária",
    category: "Responsabilidades",
    definition: "Situação em que múltiplos responsáveis (ex: prefeito e empresa contratada) respondem conjuntamente pelo débito, podendo o credor cobrar de qualquer um deles.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "responsabilidade-subsidiaria",
    term: "Responsabilidade Subsidiária",
    category: "Responsabilidades",
    definition: "Situação em que o credor só pode cobrar do segundo responsável se o primeiro não pagar, diferentemente da responsabilidade solidária.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "inidoneidade",
    term: "Inidoneidade",
    category: "Sanções",
    definition: "Declaração do TCU que proíbe um responsável condenado de contratar com órgãos federais por até 8 anos, como sanção adicional à condenação.",
    reference: "Lei 8.443/1992"
  },
  {
    id: "multa",
    term: "Multa",
    category: "Sanções",
    definition: "Penalidade financeira que pode ser aplicada pelo TCU em processos de TCE, podendo chegar a 30% do valor do débito apurado.",
    reference: "Lei 8.443/1992"
  },
  {
    id: "juros-mora",
    term: "Juros de Mora",
    category: "Cálculos Financeiros",
    definition: "Juros legais cobrados sobre débitos em TCE desde a data do dano, conforme legislação de responsabilidade fiscal, como penalidade pelo não pagamento tempestivo.",
    reference: "Lei 8.443/1992"
  },
  {
    id: "atualizacao-monetaria",
    term: "Atualização Monetária",
    category: "Cálculos Financeiros",
    definition: "Correção do valor original do débito de acordo com o IPCA (inflação) para manter o poder de compra, obrigatória em processos de TCE.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "debito-inferior",
    term: "Débito Inferior",
    category: "Classificações",
    definition: "Débito entre R$ 20.000 e R$ 120.000 que não é enviado imediatamente ao TCU, mas cadastrado em Banco de Débitos Inferiores para consolidação posterior.",
    reference: "IN TCU nº 98/2024"
  },
  {
    id: "tcu",
    term: "Tribunal de Contas da União (TCU)",
    category: "Instituições",
    definition: "Órgão máximo de controle externo da administração pública federal, responsável por julgar TCEs, auditar contas públicas e emitir pareceres sobre conformidade de despesas.",
    reference: "Constituição Federal, Art. 71"
  },
  {
    id: "cgu",
    term: "Controladoria-Geral da União (CGU)",
    category: "Instituições",
    definition: "Órgão de controle interno federal responsável por auditar órgãos federais, instaurar TCEs e emitir Relatório e Certificado de Auditoria sobre regularidade de apurações.",
    reference: "Lei 10.683/2003"
  },
  {
    id: "stf",
    term: "Supremo Tribunal Federal (STF)",
    category: "Instituições",
    definition: "Instância suprema do Poder Judiciário que pode ser acionada para recurso de condenações em TCE e interpretação constitucional de direitos processuais.",
    reference: "Constituição Federal, Art. 102"
  }
];

const categories = Array.from(new Set(glossaryTerms.map(t => t.category))).sort();

export default function Glossary() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = searchTerm === '' || 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === null || term.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold mb-2">Glossário Técnico</h1>
          <p className="text-blue-100">Termos e definições sobre Tomada de Contas Especial (TCE) e Banco de Arquivamentos por Prescrição (BAP)</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar termos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Filtrar por Categoria:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="text-sm"
              >
                Todas ({glossaryTerms.length})
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category} ({glossaryTerms.filter(t => t.category === category).length})
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-slate-600">
            {filteredTerms.length} de {glossaryTerms.length} termos encontrados
          </p>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="container max-w-5xl mx-auto px-4 pb-16">
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map(term => (
              <Card key={term.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{term.term}</h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    {term.category}
                  </span>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">{term.definition}</p>
                {term.reference && (
                  <p className="text-xs text-slate-500 italic">
                    <strong>Referência:</strong> {term.reference}
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">Nenhum termo encontrado para sua busca.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className="mt-4"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
