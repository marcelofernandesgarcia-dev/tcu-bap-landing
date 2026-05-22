'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowNode extends Node {
  data: {
    label: string;
    description: string;
    norm?: string;
    duration?: string;
    documents?: string[];
    responsible?: string;
  };
}

export const InteractiveFlowDiagram: React.FC = () => {
  // Define nodes for the expanded COTCE flow with 40+ nodes (Etapa 0 + 7 Etapas)
  const initialNodes: FlowNode[] = [
    // ============ ETAPA 0: MEDIDAS ADMINISTRATIVAS ============
    {
      id: '0-1',
      data: {
        label: 'Medidas Administrativas',
        description: 'Fase preliminar de caracterização do dano e adoção de medidas',
        norm: 'IN TCU 98/2024, Arts. 5-9; Portaria TCU 121/2025',
        duration: 'Variável conforme tipo',
        responsible: 'Autoridade Administrativa / COTCE',
      },
      position: { x: 0, y: -200 },
      style: {
        background: '#f3e5f5',
        border: '3px solid #7b1fa2',
        borderRadius: '8px',
        padding: '12px',
        width: '200px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '0-2',
      data: {
        label: 'Indício de Dano',
        description: 'Identificação inicial do dano ao erário pela unidade de fiscalização',
        norm: 'IN TCU 98/2024, Art. 5',
        documents: ['Relatório de Fiscalização', 'Parecer Técnico'],
        responsible: 'Unidade de Fiscalização',
        duration: 'Imediato',
      },
      position: { x: -250, y: -80 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-3',
      data: {
        label: 'Caracterização do Dano',
        description: 'Identificação do agente responsável, irregularidade, quantificação e nexo causal',
        norm: 'IN TCU 98/2024, Art. 5',
        documents: ['Parecer Jurídico', 'Cálculo do Dano'],
        responsible: 'COTCE',
        duration: 'Conforme tipo',
      },
      position: { x: -50, y: -80 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-3a',
      data: {
        label: 'Primeira Diligência',
        description: 'Notificação formal ao responsável para apresentar explicações ou devolver recursos',
        norm: 'CGU - Portaria 1.531/2021; IN TCU 98/2024, Art. 5',
        documents: ['Ofício de Notificação', 'Termo de Ciência'],
        responsible: 'Autoridade Administrativa',
        duration: '30 dias para resposta',
      },
      position: { x: -50, y: 20 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-3b',
      data: {
        label: 'Segunda Diligência',
        description: 'Reiteração da cobrança com ênfase nas consequências legais',
        norm: 'CGU - Portaria 1.531/2021; IN TCU 98/2024, Art. 5',
        documents: ['Ofício de Reiteração', 'Termo de Ciência'],
        responsible: 'Autoridade Administrativa',
        duration: '30 dias para resposta',
      },
      position: { x: 150, y: 20 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-3c',
      data: {
        label: 'Publicação por Edital',
        description: 'Última tentativa pública de recuperação antes da instauração da TCE',
        norm: 'CGU - Portaria 1.531/2021; Lei 8.443/1992, Art. 71',
        documents: ['Edital de Convocação', 'Publicação em Diário Oficial'],
        responsible: 'Autoridade Administrativa',
        duration: '60 dias para resposta',
      },
      position: { x: 350, y: 20 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-3d',
      data: {
        label: 'Resultado das Diligências',
        description: 'Sucesso: recurso recuperado; Fracasso: prosseguir com TCE',
        norm: 'IN TCU 98/2024, Art. 5',
        duration: 'Análise',
        responsible: 'COTCE',
      },
      position: { x: 550, y: 20 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-4',
      data: {
        label: 'Prazos - Omissão Contas',
        description: '120 dias contados do dia seguinte à data de vencimento',
        norm: 'IN TCU 98/2024, Art. 5, I',
        duration: '120 dias',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: 150, y: -80 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-5',
      data: {
        label: 'Prazos - Não Comprovação',
        description: '360 dias contados da data de apresentação das contas',
        norm: 'IN TCU 98/2024, Art. 5, II',
        duration: '360 dias',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: 350, y: -80 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-6',
      data: {
        label: 'Prazos - Demais Casos',
        description: '360 dias contados da ciência do fato pela Administração',
        norm: 'IN TCU 98/2024, Art. 5, III',
        duration: '360 dias',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: 550, y: -80 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-7',
      data: {
        label: 'Suspensão de Prazo',
        description: 'Parcelamento do débito suspende o prazo de instauração',
        norm: 'IN TCU 98/2024, Art. 5, § 2º',
        duration: 'Conforme acordo',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: -250, y: 40 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-8',
      data: {
        label: 'Descumprimento de Prazo',
        description: 'Multa aplicada por descumprimento do prazo de instauração',
        norm: 'IN TCU 98/2024, Art. 5, § 3º',
        duration: 'Imediato',
        responsible: 'TCU',
      },
      position: { x: -50, y: 40 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-9',
      data: {
        label: 'Dispensa TCE - Prazo > 10 anos',
        description: 'Prazo superior a 10 anos entre ocorrência e primeira notificação',
        norm: 'IN TCU 98/2024, Art. 6, I',
        duration: 'Análise',
        responsible: 'COTCE',
      },
      position: { x: 150, y: 40 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-10',
      data: {
        label: 'Dispensa TCE - Débito < R$ 20 mil',
        description: 'Débito inferior a R$ 20.000,00 - Adotar outras medidas de ressarcimento',
        norm: 'IN TCU 98/2024, Art. 6, II',
        duration: 'Imediato',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: 350, y: 40 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-11',
      data: {
        label: 'Banco de Débitos Inferiores',
        description: 'Débito entre R$ 20 mil e R$ 120 mil - Cadastrar no e-TCE',
        norm: 'IN TCU 98/2024, Art. 6, III',
        duration: '5 dias úteis',
        responsible: 'COTCE',
        documents: ['Formulário e-TCE', 'Cálculo do Débito'],
      },
      position: { x: 550, y: 40 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-12',
      data: {
        label: 'Recolhimento Voluntário',
        description: 'Débito atualizado sem juros moratórios, mas TCE deve ser instaurada',
        norm: 'IN TCU 98/2024, Art. 7',
        duration: 'Conforme acordo',
        responsible: 'Responsável / COTCE',
      },
      position: { x: -250, y: 120 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '0-13',
      data: {
        label: 'Banco de Arquivamentos por Prescrição',
        description: 'Processos paralisados > 5 anos devem ser cadastrados no BAP',
        norm: 'IN TCU 98/2024, Art. 9; Resolução TCU 344/2022',
        duration: 'Conforme marcos',
        responsible: 'COTCE',
        documents: ['Planilha BAP', 'Documentação Completa'],
      },
      position: { x: -50, y: 120 },
      style: {
        background: '#e1bee7',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 1: DISPOSIÇÕES PRELIMINARES ============
    {
      id: '1-1',
      data: {
        label: 'Disposições Preliminares',
        description: 'Definição clara da TCE e seus objetivos',
        norm: 'IN TCU 98/2024, Art. 1-4',
        duration: 'Fase Preparatória',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 250 },
      style: {
        background: '#e3f2fd',
        border: '3px solid #1976d2',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '1-2',
      data: {
        label: 'Definição: Processo Formalizado',
        description: 'Apuração de responsabilidade por dano ao erário',
        norm: 'Lei 8.443/1992, Art. 70-71',
        documents: ['Termo de Definição', 'Parecer Jurídico Inicial'],
      },
      position: { x: 0, y: 330 },
      style: {
        background: '#bbdefb',
        border: '2px solid #1976d2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '1-3',
      data: {
        label: 'Dever: Medidas Imediatas',
        description: 'Ressarcimento do dano ao erário',
        norm: 'CGU - Portaria 1.531/2021',
        duration: 'Imediato',
      },
      position: { x: 180, y: 330 },
      style: {
        background: '#bbdefb',
        border: '2px solid #1976d2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '1-4',
      data: {
        label: 'Solução Consensual',
        description: 'Conclusão colaborativa do objeto',
        norm: 'IN TCU 98/2024, Art. 4',
        duration: 'Negociação',
      },
      position: { x: 360, y: 330 },
      style: {
        background: '#bbdefb',
        border: '2px solid #1976d2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 2: INSTAURAÇÃO E PRESSUPOSTOS ============
    {
      id: '2-1',
      data: {
        label: 'Instauração e Pressupostos',
        description: 'Formalização e verificação de pressupostos legais',
        norm: 'IN TCU 98/2024, Arts. 10-15',
        duration: '5 dias úteis',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: 0, y: 480 },
      style: {
        background: '#e8f5e9',
        border: '3px solid #388e3c',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '2-2',
      data: {
        label: 'Pressupostos Legais',
        description: 'Verificação de: dano, responsável, valor mínimo (R$ 120 mil)',
        norm: 'IN TCU 98/2024, Art. 10',
        documents: ['Checklist de Pressupostos'],
        duration: '5 dias',
      },
      position: { x: -200, y: 560 },
      style: {
        background: '#c8e6c9',
        border: '2px solid #388e3c',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '2-3',
      data: {
        label: 'Prazos de Instauração',
        description: 'Conforme tipo: omissão (120d), não comprovação (360d), outros (360d)',
        norm: 'IN TCU 98/2024, Art. 5',
        duration: 'Variável',
      },
      position: { x: 0, y: 560 },
      style: {
        background: '#c8e6c9',
        border: '2px solid #388e3c',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '2-4',
      data: {
        label: 'Sistema e-TCE',
        description: 'Cadastramento no sistema eletrônico e-TCE',
        norm: 'Portaria TCU 121/2025',
        documents: ['Acesso e-TCE', 'Formulário de Cadastro'],
        duration: '5 dias úteis',
      },
      position: { x: 200, y: 560 },
      style: {
        background: '#c8e6c9',
        border: '2px solid #388e3c',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '2-5',
      data: {
        label: 'Declaração de Instauração',
        description: 'Notificação formal dos responsáveis e interessados',
        norm: 'IN TCU 98/2024, Art. 15',
        documents: ['Termo de Instauração', 'Notificação'],
        duration: '5 dias',
      },
      position: { x: 400, y: 560 },
      style: {
        background: '#c8e6c9',
        border: '2px solid #388e3c',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 3: ORGANIZAÇÃO E DOCUMENTAÇÃO ============
    {
      id: '3-1',
      data: {
        label: 'Organização e Documentação',
        description: 'Coleta, organização e análise de documentação',
        norm: 'IN TCU 98/2024, Arts. 16-20',
        duration: '30-90 dias',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 710 },
      style: {
        background: '#fff3e0',
        border: '3px solid #f57c00',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '3-2',
      data: {
        label: 'Relatório Circunstanciado',
        description: 'Descrição detalhada dos fatos, irregularidades e dano',
        norm: 'IN TCU 98/2024, Art. 16',
        documents: ['Relatório Técnico Completo'],
        duration: '30-60 dias',
      },
      position: { x: -300, y: 800 },
      style: {
        background: '#ffe0b2',
        border: '2px solid #f57c00',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-3',
      data: {
        label: 'Certificado de Dano',
        description: 'Comprovação técnica e quantificação do dano ao erário',
        norm: 'IN TCU 98/2024, Art. 17',
        documents: ['Certificado de Dano', 'Cálculos'],
        duration: '15-30 dias',
      },
      position: { x: -100, y: 800 },
      style: {
        background: '#ffe0b2',
        border: '2px solid #f57c00',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-4',
      data: {
        label: 'Parecer Jurídico',
        description: 'Análise jurídica de responsabilidade e enquadramento legal',
        norm: 'IN TCU 98/2024, Art. 18',
        documents: ['Parecer Jurídico Fundamentado'],
        duration: '15-30 dias',
      },
      position: { x: 100, y: 800 },
      style: {
        background: '#ffe0b2',
        border: '2px solid #f57c00',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-5',
      data: {
        label: 'Pronunciamento do Responsável',
        description: 'Direito de defesa do responsável acusado',
        norm: 'IN TCU 98/2024, Art. 19',
        documents: ['Notificação de Defesa', 'Peças de Defesa'],
        duration: '30 dias',
      },
      position: { x: 300, y: 800 },
      style: {
        background: '#ffe0b2',
        border: '2px solid #f57c00',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-6',
      data: {
        label: 'Fichas de Processamento',
        description: 'Organização de fichas técnicas e documentação processual',
        norm: 'IN TCU 98/2024, Art. 20',
        documents: ['Fichas Técnicas', 'Índice Processual'],
        duration: '10-15 dias',
      },
      position: { x: 500, y: 800 },
      style: {
        background: '#ffe0b2',
        border: '2px solid #f57c00',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 4: QUANTIFICAÇÃO DO DÉBITO ============
    {
      id: '4-1',
      data: {
        label: 'Quantificação do Débito',
        description: 'Cálculo preciso do valor do dano ao erário',
        norm: 'IN TCU 98/2024, Arts. 21-25',
        duration: '15-30 dias',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 940 },
      style: {
        background: '#f3e5f5',
        border: '3px solid #c2185b',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '4-2',
      data: {
        label: 'Método de Verificação',
        description: 'Cálculo exato por operações matemáticas simples',
        norm: 'IN TCU 98/2024, Art. 21',
        documents: ['Planilha de Cálculo'],
        duration: '5-10 dias',
      },
      position: { x: -200, y: 1030 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #c2185b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '4-3',
      data: {
        label: 'Método de Estimativa',
        description: 'Cálculo aproximado por métodos estatísticos confiáveis',
        norm: 'IN TCU 98/2024, Art. 22',
        documents: ['Relatório Estatístico'],
        duration: '10-20 dias',
      },
      position: { x: 0, y: 1030 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #c2185b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '4-4',
      data: {
        label: 'Marco Inicial e Atualização',
        description: 'Data do dano e atualização monetária conforme IPCA',
        norm: 'IN TCU 98/2024, Art. 23',
        documents: ['Cálculo IPCA', 'Juros Moratórios'],
        duration: '5 dias',
      },
      position: { x: 200, y: 1030 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #c2185b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '4-5',
      data: {
        label: 'Débito Final Consolidado',
        description: 'Valor total com IPCA + juros moratórios desde o dano',
        norm: 'IN TCU 98/2024, Art. 24',
        documents: ['Termo de Quantificação'],
        duration: 'Imediato',
      },
      position: { x: 400, y: 1030 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #c2185b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 5: DISPENSA E ARQUIVAMENTO ============
    {
      id: '5-1',
      data: {
        label: 'Dispensa e Arquivamento',
        description: 'Análise de critérios para dispensa ou arquivamento',
        norm: 'IN TCU 98/2024, Arts. 6-9',
        duration: 'Análise',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 1170 },
      style: {
        background: '#e0f2f1',
        border: '3px solid #00897b',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '5-2',
      data: {
        label: 'Limites de Alçada',
        description: 'Débito < R$ 20 mil: dispensa TCE; R$ 20-120 mil: Banco de Débitos',
        norm: 'IN TCU 98/2024, Art. 6',
        duration: 'Análise',
      },
      position: { x: -200, y: 1260 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00897b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '5-3',
      data: {
        label: 'Banco de Débitos Inferiores',
        description: 'Consolidação de débitos para atingir R$ 120 mil',
        norm: 'IN TCU 98/2024, Art. 6, III',
        documents: ['Registro e-TCE'],
        duration: '5 dias',
      },
      position: { x: 0, y: 1260 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00897b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '5-4',
      data: {
        label: 'Fator Tempo: Prescrição',
        description: 'Prazo de 5 anos para julgamento (Resolução TCU 344/2022)',
        norm: 'Resolução TCU 344/2022',
        duration: '5 anos',
      },
      position: { x: 200, y: 1260 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00897b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '5-5',
      data: {
        label: 'Elísio do Dano',
        description: 'Extinção da responsabilidade por prescrição ou outras causas',
        norm: 'IN TCU 98/2024, Art. 9',
        documents: ['Termo de Elísio'],
        duration: 'Conforme análise',
      },
      position: { x: 400, y: 1260 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00897b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 6: PRESCRIÇÃO E BAP ============
    {
      id: '6-1',
      data: {
        label: 'Prescrição e BAP',
        description: 'Prevenção e cadastramento de processos prescritos',
        norm: 'IN TCU 98/2024, Art. 9; Resolução TCU 344/2022',
        duration: 'Conforme marcos',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 1400 },
      style: {
        background: '#fce4ec',
        border: '3px solid #d81b60',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '6-2',
      data: {
        label: 'Prescrição Geral',
        description: 'Prazo de 5 anos para julgamento da TCE pelo TCU',
        norm: 'Resolução TCU 344/2022, Art. 1',
        duration: '5 anos',
      },
      position: { x: -200, y: 1490 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #d81b60',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '6-3',
      data: {
        label: 'Prescrição Intercorrente',
        description: 'Suspensão por 2 anos sem movimentação relevante',
        norm: 'Resolução TCU 344/2022, Art. 2',
        duration: '2 anos',
      },
      position: { x: 0, y: 1490 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #d81b60',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '6-4',
      data: {
        label: 'Banco de Arquivamentos por Prescrição',
        description: 'Cadastramento de processos paralisados > 5 anos',
        norm: 'IN TCU 98/2024, Art. 9',
        documents: ['Planilha BAP', 'Documentação'],
        duration: '5 dias',
      },
      position: { x: 200, y: 1490 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #d81b60',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '6-5',
      data: {
        label: 'Sistema de Prevenção à Prescrição',
        description: 'Notificações automáticas e acompanhamento de prazos',
        norm: 'IN TCU 98/2024, Art. 9, § 5º',
        documents: ['Relatório de Alertas'],
        duration: 'Contínuo',
      },
      position: { x: 400, y: 1490 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #d81b60',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ============ ETAPA 7: SEGREGAÇÃO DE FUNÇÕES ============
    {
      id: '7-1',
      data: {
        label: 'Segregação de Funções',
        description: 'Separação de responsabilidades entre COTCE, DIVCONT e TCU',
        norm: 'IN TCU 98/2024, Arts. 26-30',
        duration: 'Conforme fluxo',
        responsible: 'COTCE / DIVCONT',
      },
      position: { x: 0, y: 1630 },
      style: {
        background: '#ede7f6',
        border: '3px solid #512da8',
        borderRadius: '8px',
        padding: '12px',
        width: '180px',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    {
      id: '7-2',
      data: {
        label: 'Responsabilidade COTCE',
        description: 'Análise, caracterização e quantificação do dano',
        norm: 'IN TCU 98/2024, Art. 26',
        duration: 'Fase Interna',
      },
      position: { x: -200, y: 1720 },
      style: {
        background: '#d1c4e9',
        border: '2px solid #512da8',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '7-3',
      data: {
        label: 'Responsabilidade DIVCONT',
        description: 'Revisão técnica e jurídica antes do envio ao TCU',
        norm: 'IN TCU 98/2024, Art. 27',
        duration: '10-15 dias',
      },
      position: { x: 0, y: 1720 },
      style: {
        background: '#d1c4e9',
        border: '2px solid #512da8',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '7-4',
      data: {
        label: 'Envio ao TCU',
        description: 'Encaminhamento do processo completo para julgamento',
        norm: 'IN TCU 98/2024, Art. 28',
        documents: ['Processo Completo', 'Parecer Final'],
        duration: '5 dias',
      },
      position: { x: 200, y: 1720 },
      style: {
        background: '#d1c4e9',
        border: '2px solid #512da8',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
  ];

  // Define edges connecting the nodes
  interface EdgeConfig {
    source: string;
    target: string;
    animated?: boolean;
    style?: any;
    markerEnd?: any;
  }

  const initialEdges: EdgeConfig[] = [
    // Etapa 0 edges
    {source: '0-1', target: '0-2', animated: true },
    {source: '0-1', target: '0-3', animated: true },
    {source: '0-2', target: '0-3', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-3', target: '0-3a', animated: true },
    {source: '0-3a', target: '0-3b', animated: true },
    {source: '0-3b', target: '0-3c', animated: true },
    {source: '0-3c', target: '0-3d', animated: true },
    {source: '0-3d', target: '0-4', animated: true },
    {source: '0-3', target: '0-5', animated: true },
    {source: '0-3', target: '0-6', animated: true },
    {source: '0-4', target: '0-7', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-5', target: '0-7', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-6', target: '0-7', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-7', target: '0-8', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-3', target: '0-9', animated: true },
    {source: '0-3', target: '0-10', animated: true },
    {source: '0-3', target: '0-11', animated: true },
    {source: '0-10', target: '0-12', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-11', target: '0-13', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '0-1', target: '1-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 1 edges
    {source: '1-1', target: '1-2', animated: true },
    {source: '1-1', target: '1-3', animated: true },
    {source: '1-1', target: '1-4', animated: true },
    {source: '1-4', target: '2-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 2 edges
    {source: '2-1', target: '2-2', animated: true },
    {source: '2-1', target: '2-3', animated: true },
    {source: '2-1', target: '2-4', animated: true },
    {source: '2-2', target: '2-5', animated: true },
    {source: '2-3', target: '2-5', animated: true },
    {source: '2-4', target: '2-5', animated: true },
    {source: '2-5', target: '3-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 3 edges
    {source: '3-1', target: '3-2', animated: true },
    {source: '3-1', target: '3-3', animated: true },
    {source: '3-1', target: '3-4', animated: true },
    {source: '3-1', target: '3-5', animated: true },
    {source: '3-1', target: '3-6', animated: true },
    {source: '3-2', target: '3-3', animated: true },
    {source: '3-3', target: '3-4', animated: true },
    {source: '3-4', target: '3-5', animated: true },
    {source: '3-5', target: '3-6', animated: true },
    {source: '3-6', target: '4-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 4 edges
    {source: '4-1', target: '4-2', animated: true },
    {source: '4-1', target: '4-3', animated: true },
    {source: '4-2', target: '4-4', animated: true },
    {source: '4-3', target: '4-4', animated: true },
    {source: '4-4', target: '4-5', animated: true },
    {source: '4-5', target: '5-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 5 edges
    {source: '5-1', target: '5-2', animated: true },
    {source: '5-1', target: '5-3', animated: true },
    {source: '5-1', target: '5-4', animated: true },
    {source: '5-1', target: '5-5', animated: true },
    {source: '5-2', target: '5-5', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '5-3', target: '6-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    {source: '5-4', target: '6-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 6 edges
    {source: '6-1', target: '6-2', animated: true },
    {source: '6-1', target: '6-3', animated: true },
    {source: '6-1', target: '6-4', animated: true },
    {source: '6-1', target: '6-5', animated: true },
    {source: '6-2', target: '6-4', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '6-3', target: '6-4', animated: false, style: { strokeDasharray: '5,5' } },
    {source: '6-4', target: '7-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

    // Etapa 7 edges
    {source: '7-1', target: '7-2', animated: true },
    {source: '7-1', target: '7-3', animated: true },
    {source: '7-2', target: '7-3', animated: true },
    {source: '7-3', target: '7-4', animated: true },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((edge, idx) => ({
      id: `edge-${idx}`,
      source: edge.source,
      target: edge.target,
      animated: edge.animated || false,
      style: edge.style,
      markerEnd: edge.markerEnd || { type: MarkerType.ArrowClosed },
    }))
  );

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Legend - Top Bar */}
      <div className="bg-slate-50 border-b border-gray-300 p-3 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-6 min-w-max px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-200 border border-purple-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 border border-blue-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 border border-green-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-200 border border-orange-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 3</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-200 border border-pink-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 4</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-200 border border-teal-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-200 border border-rose-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 6</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-200 border border-indigo-700 rounded"></div>
            <span className="text-xs whitespace-nowrap font-medium">Etapa 7</span>
          </div>
          <div className="flex items-center gap-2 ml-6 pl-4 border-l border-gray-400">
            <span className="text-xs text-slate-600">— Fluxo principal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">- - - Condicional</span>
          </div>
        </div>
      </div>

      {/* React Flow Container */}
      <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
      </div>

      {/* Legend - Hidden (kept for reference) */}
      <div className="hidden absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-sm max-w-xs">
        <h3 className="font-bold mb-3 text-slate-900">Legenda das Etapas</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-200 border-2 border-purple-700 rounded"></div>
            <span className="text-xs">Etapa 0: Medidas Administrativas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border-2 border-blue-700 rounded"></div>
            <span className="text-xs">Etapa 1: Disposições Preliminares</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border-2 border-green-700 rounded"></div>
            <span className="text-xs">Etapa 2: Instauração e Pressupostos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 border-2 border-orange-700 rounded"></div>
            <span className="text-xs">Etapa 3: Organização e Documentação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-200 border-2 border-pink-700 rounded"></div>
            <span className="text-xs">Etapa 4: Quantificação do Débito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-teal-200 border-2 border-teal-700 rounded"></div>
            <span className="text-xs">Etapa 5: Dispensa e Arquivamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-200 border-2 border-rose-700 rounded"></div>
            <span className="text-xs">Etapa 6: Prescrição e BAP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-200 border-2 border-indigo-700 rounded"></div>
            <span className="text-xs">Etapa 7: Segregação de Funções</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
          <p className="text-slate-600">
            <strong>Linhas sólidas:</strong> Fluxo principal<br/>
            <strong>Linhas tracejadas:</strong> Fluxo condicional/paralelo
          </p>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          💡 Arraste para mover • Scroll para zoom • Clique nos nós para ver detalhes
        </div>
      </div>
    </div>
  );
};
