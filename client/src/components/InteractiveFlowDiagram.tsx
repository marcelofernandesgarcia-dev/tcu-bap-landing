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
  // Define nodes for the expanded COTCE flow with 30+ nodes
  const initialNodes: FlowNode[] = [
    // ETAPA 1: DISPOSIÇÕES PRELIMINARES
    {
      id: '1-1',
      data: {
        label: 'Disposições Preliminares',
        description: 'Definição clara da TCE e seus objetivos',
        norm: 'IN TCU 98/2024, Art. 1-4',
        duration: 'Fase Preparatória',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 0 },
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
      position: { x: 0, y: 80 },
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
      position: { x: 180, y: 80 },
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
      position: { x: 360, y: 80 },
      style: {
        background: '#bbdefb',
        border: '2px solid #1976d2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ETAPA 2: INSTAURAÇÃO E PRESSUPOSTOS
    {
      id: '2-1',
      data: {
        label: 'Instauração e Pressupostos',
        description: 'Instauração formal via Sistema e-TCE',
        norm: 'Portaria 121/2025, Art. 10',
        duration: '5 dias úteis',
        responsible: 'Autoridade Administrativa',
      },
      position: { x: 0, y: 200 },
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
      id: '2-2',
      data: {
        label: 'Pressupostos: Dano + Responsáveis',
        description: 'Existência do dano e identificação',
        norm: 'IN TCU 98/2024, Art. 6',
        documents: ['Comprovação do Dano', 'Identificação de Responsáveis'],
      },
      position: { x: 0, y: 280 },
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
      id: '2-3',
      data: {
        label: 'Prazos de Instauração',
        description: '120 dias (omissão) ou 360 dias (demais)',
        norm: 'IN TCU 98/2024, Art. 6',
        duration: 'Crítico',
      },
      position: { x: 180, y: 280 },
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
      id: '2-4',
      data: {
        label: 'Inserir no Sistema e-TCE',
        description: 'Registro obrigatório no sistema',
        norm: 'Portaria 121/2025, Art. 15',
        documents: ['Termo de Instauração', 'Senha Pessoal'],
      },
      position: { x: 360, y: 280 },
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
      id: '2-5',
      data: {
        label: 'Emitir Declaração de Envio',
        description: 'Confirmação do sistema e-TCE',
        norm: 'Portaria 121/2025, Art. 10',
      },
      position: { x: 540, y: 280 },
      style: {
        background: '#ffe0b2',
        border: '2px solid #f57c00',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ETAPA 3: ORGANIZAÇÃO E DOCUMENTAÇÃO
    {
      id: '3-1',
      data: {
        label: 'Organização e Documentação',
        description: 'Elaboração de documentos essenciais',
        norm: 'Portaria 121/2025, Art. 13',
        duration: 'Até 90 dias',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 400 },
      style: {
        background: '#f3e5f5',
        border: '3px solid #7b1fa2',
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
        label: 'Relatório do Tomador',
        description: 'Identificação, conduta e quantificação',
        norm: 'IN TCU 98/2024, Art. 8',
        documents: ['Relatório Circunstanciado', 'Análise de Fatos'],
      },
      position: { x: 0, y: 480 },
      style: {
        background: '#f0e6fa',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-3',
      data: {
        label: 'Certificado de Auditoria',
        description: 'Emissão pela CGU',
        norm: 'CGU - Portaria 1.531/2021',
        duration: 'Paralelo',
        documents: ['Certificado de Auditoria', 'Parecer Técnico'],
      },
      position: { x: 180, y: 480 },
      style: {
        background: '#f0e6fa',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-4',
      data: {
        label: 'Parecer do Controle Interno',
        description: 'Análise jurídica e administrativa',
        norm: 'IN TCU 98/2024, Art. 8',
        documents: ['Parecer Jurídico', 'Análise Administrativa'],
      },
      position: { x: 360, y: 480 },
      style: {
        background: '#f0e6fa',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-5',
      data: {
        label: 'Pronunciamento Ministerial',
        description: 'Atribuição da autoridade superior',
        norm: 'Portaria 121/2025, Art. 13',
        documents: ['Parecer Ministerial', 'Decisão Administrativa'],
      },
      position: { x: 540, y: 480 },
      style: {
        background: '#f0e6fa',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '3-6',
      data: {
        label: 'Fichas de Qualificação',
        description: 'Dados detalhados dos responsáveis',
        norm: 'IN TCU 98/2024, Art. 8',
        documents: ['Fichas Individuais', 'Dados Pessoais/Jurídicos'],
      },
      position: { x: 720, y: 480 },
      style: {
        background: '#f0e6fa',
        border: '2px solid #7b1fa2',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ETAPA 4: QUANTIFICAÇÃO DO DÉBITO
    {
      id: '4-1',
      data: {
        label: 'Quantificação do Débito',
        description: 'Cálculo preciso do dano ao erário',
        norm: 'IN TCU 98/2024, Art. 7',
        duration: 'Paralelo',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 600 },
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
      id: '4-2',
      data: {
        label: 'Método: Verificação',
        description: 'Cálculo exato com matemática simples',
        norm: 'IN TCU 98/2024, Art. 7',
        documents: ['Memória de Cálculo', 'Documentação Comprobatória'],
      },
      position: { x: 0, y: 680 },
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
      id: '4-3',
      data: {
        label: 'Método: Estimativa',
        description: 'Cálculo confiável com métodos estatísticos',
        norm: 'IN TCU 98/2024, Art. 7',
        documents: ['Análise Estatística', 'Justificativa Técnica'],
      },
      position: { x: 180, y: 680 },
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
      id: '4-4',
      data: {
        label: 'Marco Inicial do Débito',
        description: 'Ordem bancária, pagamento ou ciência',
        norm: 'IN TCU 98/2024, Art. 7',
        duration: 'Crítico',
      },
      position: { x: 360, y: 680 },
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
      id: '4-5',
      data: {
        label: 'Atualização: IPCA + Juros',
        description: 'Correção monetária e juros de mora',
        norm: 'Lei 9.250/1995; IBGE',
        documents: ['Cálculo IPCA', 'Demonstrativo de Juros'],
      },
      position: { x: 540, y: 680 },
      style: {
        background: '#c8e6c9',
        border: '2px solid #388e3c',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ETAPA 5: DISPENSA E ARQUIVAMENTO
    {
      id: '5-1',
      data: {
        label: 'Dispensa e Arquivamento',
        description: 'Avaliação de racionalidade',
        norm: 'IN TCU 98/2024, Art. 8',
        duration: 'Análise Contínua',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 800 },
      style: {
        background: '#fce4ec',
        border: '3px solid #c2185b',
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
        label: 'Limite: Débito < R$ 120 mil',
        description: 'Dispensa de instauração',
        norm: 'IN TCU 98/2024, Art. 8',
        duration: 'Imediato',
      },
      position: { x: 0, y: 880 },
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
      id: '5-3',
      data: {
        label: 'Banco de Débitos Inferiores',
        description: 'Entre R$ 20 mil e R$ 120 mil',
        norm: 'IN TCU 98/2024, Art. 8',
        documents: ['Registro no Banco', 'Somatório de Débitos'],
      },
      position: { x: 180, y: 880 },
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
      id: '5-4',
      data: {
        label: 'Fator Tempo: > 10 anos',
        description: 'Dispensa se sem notificação',
        norm: 'IN TCU 98/2024, Art. 8',
        duration: 'Crítico',
      },
      position: { x: 360, y: 880 },
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
      id: '5-5',
      data: {
        label: 'Elísio do Dano',
        description: 'Comprovação de não ocorrência',
        norm: 'IN TCU 98/2024, Art. 8',
        documents: ['Parecer de Elísio', 'Comprovação'],
      },
      position: { x: 540, y: 880 },
      style: {
        background: '#f8bbd0',
        border: '2px solid #c2185b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ETAPA 6: PRESCRIÇÃO E BAP
    {
      id: '6-1',
      data: {
        label: 'Prescrição e BAP',
        description: 'Monitoramento de prescrição',
        norm: 'Resolução TCU 344/2022',
        duration: 'Contínuo (5 anos)',
        responsible: 'COTCE + Sistema',
      },
      position: { x: 0, y: 1000 },
      style: {
        background: '#e0f2f1',
        border: '3px solid #00796b',
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
        label: 'Prescrição Geral: 5 anos',
        description: 'Prazo para julgamento no TCU',
        norm: 'Resolução TCU 344/2022',
        duration: 'Crítico',
      },
      position: { x: 0, y: 1080 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00796b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '6-3',
      data: {
        label: 'Prescrição Intercorrente: 3 anos',
        description: 'Paralisação sem movimentação',
        norm: 'Resolução TCU 344/2022',
        duration: 'Crítico',
      },
      position: { x: 180, y: 1080 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00796b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '6-4',
      data: {
        label: 'Banco de Arquivamentos (BAP)',
        description: 'Processos paralisados > 5 anos',
        norm: 'IN TCU 98/2024, Art. 9-10',
        documents: ['Planilha BAP (13 campos)', 'Registro Automatizado'],
      },
      position: { x: 360, y: 1080 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00796b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '6-5',
      data: {
        label: 'Sistema de Prevenção',
        description: 'Monitoramento e alertas automáticos',
        norm: 'IN TCU 98/2024, Art. 10',
        documents: ['Notificações de Risco', 'Relatório de Monitoramento'],
      },
      position: { x: 540, y: 1080 },
      style: {
        background: '#b2dfdb',
        border: '2px solid #00796b',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },

    // ETAPA 7: SEGREGAÇÃO DE FUNÇÕES
    {
      id: '7-1',
      data: {
        label: 'Segregação de Funções',
        description: 'Garantir segregação entre análise e julgamento',
        norm: 'Portaria 121/2025, Art. 2',
        duration: 'Estrutural',
        responsible: 'COTCE',
      },
      position: { x: 0, y: 1200 },
      style: {
        background: '#fff9c4',
        border: '3px solid #f9a825',
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
        label: 'COTCE: Fase Patológica',
        description: 'Instrução de TCE (FOCO)',
        norm: 'Portaria 121/2025, Art. 2',
        documents: ['Processo Instruído', 'Documentação Completa'],
      },
      position: { x: 0, y: 1280 },
      style: {
        background: '#fff59d',
        border: '2px solid #f9a825',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
    {
      id: '7-3',
      data: {
        label: 'DIVCONT: Registro Contábil',
        description: 'Conformidade patrimonial',
        norm: 'Portaria 121/2025, Art. 2',
        documents: ['Registro Contábil', 'Conformidade Patrimonial'],
      },
      position: { x: 180, y: 1280 },
      style: {
        background: '#fff59d',
        border: '2px solid #f9a825',
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
        description: 'Encaminhamento para Fase Externa',
        norm: 'Portaria 121/2025, Art. 18',
        documents: ['Processo Completo', 'Declaração de Envio'],
      },
      position: { x: 360, y: 1280 },
      style: {
        background: '#fff59d',
        border: '2px solid #f9a825',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '10px',
      },
    },
  ];

  // Define edges connecting the nodes
  const initialEdges: Edge[] = [
    // ETAPA 1 connections
    { id: 'e1-1-1-2', source: '1-1', target: '1-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#1976d2', strokeWidth: 2 } },
    { id: 'e1-1-1-3', source: '1-1', target: '1-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#1976d2', strokeWidth: 2 } },
    { id: 'e1-1-1-4', source: '1-1', target: '1-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#1976d2', strokeWidth: 2 } },
    
    // ETAPA 1 to 2
    { id: 'e1-4-2-1', source: '1-4', target: '2-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 2 } },
    
    // ETAPA 2 connections
    { id: 'e2-1-2-2', source: '2-1', target: '2-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f57c00', strokeWidth: 2 } },
    { id: 'e2-1-2-3', source: '2-1', target: '2-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f57c00', strokeWidth: 2 } },
    { id: 'e2-1-2-4', source: '2-1', target: '2-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f57c00', strokeWidth: 2 } },
    { id: 'e2-4-2-5', source: '2-4', target: '2-5', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f57c00', strokeWidth: 2 } },
    
    // ETAPA 2 to 3
    { id: 'e2-5-3-1', source: '2-5', target: '3-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 2 } },
    
    // ETAPA 3 connections
    { id: 'e3-1-3-2', source: '3-1', target: '3-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7b1fa2', strokeWidth: 2 } },
    { id: 'e3-1-3-3', source: '3-1', target: '3-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7b1fa2', strokeWidth: 2 } },
    { id: 'e3-1-3-4', source: '3-1', target: '3-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7b1fa2', strokeWidth: 2 } },
    { id: 'e3-1-3-5', source: '3-1', target: '3-5', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7b1fa2', strokeWidth: 2 } },
    { id: 'e3-1-3-6', source: '3-1', target: '3-6', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7b1fa2', strokeWidth: 2 } },
    
    // ETAPA 4 connections (parallel)
    { id: 'e2-1-4-1', source: '2-1', target: '4-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e4-1-4-2', source: '4-1', target: '4-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#388e3c', strokeWidth: 2 } },
    { id: 'e4-1-4-3', source: '4-1', target: '4-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#388e3c', strokeWidth: 2 } },
    { id: 'e4-1-4-4', source: '4-1', target: '4-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#388e3c', strokeWidth: 2 } },
    { id: 'e4-1-4-5', source: '4-1', target: '4-5', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#388e3c', strokeWidth: 2 } },
    
    // ETAPA 5 connections (conditional)
    { id: 'e3-5-5-1', source: '3-5', target: '5-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e5-1-5-2', source: '5-1', target: '5-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#c2185b', strokeWidth: 2 } },
    { id: 'e5-1-5-3', source: '5-1', target: '5-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#c2185b', strokeWidth: 2 } },
    { id: 'e5-1-5-4', source: '5-1', target: '5-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#c2185b', strokeWidth: 2 } },
    { id: 'e5-1-5-5', source: '5-1', target: '5-5', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#c2185b', strokeWidth: 2 } },
    
    // ETAPA 6 connections (monitoring)
    { id: 'e5-3-6-1', source: '5-3', target: '6-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e6-1-6-2', source: '6-1', target: '6-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#00796b', strokeWidth: 2 } },
    { id: 'e6-1-6-3', source: '6-1', target: '6-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#00796b', strokeWidth: 2 } },
    { id: 'e6-1-6-4', source: '6-1', target: '6-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#00796b', strokeWidth: 2 } },
    { id: 'e6-1-6-5', source: '6-1', target: '6-5', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#00796b', strokeWidth: 2 } },
    
    // ETAPA 7 connections (segregation)
    { id: 'e6-4-7-1', source: '6-4', target: '7-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e7-1-7-2', source: '7-1', target: '7-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f9a825', strokeWidth: 2 } },
    { id: 'e7-1-7-3', source: '7-1', target: '7-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f9a825', strokeWidth: 2 } },
    { id: 'e7-2-7-4', source: '7-2', target: '7-4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f9a825', strokeWidth: 2 } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle node hover to show tooltip
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, nodeId: string) => {
    setHoveredNode(nodeId);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-200">
      <div className="h-[800px] relative">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onMouseEnter: onNodeMouseEnter,
              onMouseLeave: onNodeMouseLeave,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>

        {/* Tooltip */}
        {hoveredNode && (
          <div className="absolute top-4 right-4 bg-slate-900 text-white p-5 rounded-lg shadow-lg max-w-sm z-50">
            <div className="text-sm font-bold mb-2">
              {nodes.find(n => n.id === hoveredNode)?.data?.label}
            </div>
            <div className="text-xs text-gray-300 mb-2">
              {nodes.find(n => n.id === hoveredNode)?.data?.description}
            </div>
            {nodes.find(n => n.id === hoveredNode)?.data?.responsible && (
              <div className="text-xs text-cyan-300 mb-1">
                <strong>Responsável:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.responsible}
              </div>
            )}
            {nodes.find(n => n.id === hoveredNode)?.data?.norm && (
              <div className="text-xs text-blue-300 mb-1">
                <strong>Norma:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.norm}
              </div>
            )}
            {nodes.find(n => n.id === hoveredNode)?.data?.duration && (
              <div className="text-xs text-green-300 mb-1">
                <strong>Duração:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.duration}
              </div>
            )}
            {nodes.find(n => n.id === hoveredNode)?.data?.documents && (
              <div className="text-xs text-yellow-300">
                <strong>Documentos:</strong>
                <ul className="ml-3 mt-1">
                  {nodes.find(n => n.id === hoveredNode)?.data?.documents?.map((doc, idx) => (
                    <li key={idx}>• {doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 overflow-y-auto max-h-32">
        <h4 className="font-bold text-slate-900 mb-3">Legenda das 7 Etapas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-100 border-2 border-blue-700 rounded"></div>
            <span className="text-xs text-slate-600">1. Disposições Preliminares</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-100 border-2 border-orange-700 rounded"></div>
            <span className="text-xs text-slate-600">2. Instauração e Pressupostos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-100 border-2 border-purple-700 rounded"></div>
            <span className="text-xs text-slate-600">3. Organização e Documentação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 border-2 border-green-700 rounded"></div>
            <span className="text-xs text-slate-600">4. Quantificação do Débito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-pink-100 border-2 border-pink-700 rounded"></div>
            <span className="text-xs text-slate-600">5. Dispensa e Arquivamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-teal-100 border-2 border-teal-700 rounded"></div>
            <span className="text-xs text-slate-600">6. Prescrição e BAP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-100 border-2 border-yellow-700 rounded"></div>
            <span className="text-xs text-slate-600">7. Segregação de Funções</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-4 border-t-2 border-dashed border-gray-600"></div>
            <span className="text-xs text-slate-600">Fluxo Paralelo/Condicional</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <p className="text-xs text-blue-900">
          💡 <strong>Dica:</strong> Arraste para mover o fluxo, use o scroll para fazer zoom, e passe o mouse sobre as caixas para ver detalhes das normas, documentos e responsáveis. O fluxo contém 30+ nós detalhando as 7 etapas da COTCE.
        </p>
      </div>
    </div>
  );
};
