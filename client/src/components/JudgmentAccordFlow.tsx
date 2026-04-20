'use client';

import React, { useCallback, useState } from 'react';
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
    swimlane: string;
    type: 'action' | 'decision' | 'register' | 'document' | 'start' | 'end';
    norm?: string;
    documents?: string[];
  };
}

export const JudgmentAccordFlow: React.FC = () => {
  const initialNodes: FlowNode[] = [
    // SWIMLANE 1: COTCE/CGU - Coordenação e Análise Interna de TCE
    {
      id: 'start-tce',
      data: {
        label: 'ACORDÃO JULGAMENTO DE TCE (TCU)',
        description: 'Recebimento do acordão de julgamento',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'start',
        norm: 'Resolução TCU 344/2022',
      },
      position: { x: 50, y: 50 },
      style: {
        background: '#87CEEB',
        border: '2px solid #0066cc',
        borderRadius: '50px',
        padding: '10px',
        width: '140px',
        fontSize: '10px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'action-tce-1',
      data: {
        label: 'ANÁLISE DO JULGADO DO ACORDÃO DO TCU',
        description: 'Análise técnica do acordão de julgamento',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'action',
        norm: 'IN TCU 98/2024, Art. 9-10',
        documents: ['Acordão do TCU', 'Parecer Técnico', 'Análise Jurídica'],
      },
      position: { x: 50, y: 150 },
      style: {
        background: '#FFFFFF',
        border: '2px solid #333',
        borderRadius: '6px',
        padding: '10px',
        width: '160px',
        fontSize: '9px',
      },
    },
    {
      id: 'decision-tce-1',
      data: {
        label: 'INADMISSIBILIDADE',
        description: 'Verificar se há inadmissibilidade',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'decision',
        norm: 'IN TCU 98/2024',
      },
      position: { x: 50, y: 280 },
      style: {
        background: '#FFFACD',
        border: '2px solid #FFD700',
        borderRadius: '6px',
        padding: '8px',
        width: '120px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'register-inadm-1',
      data: {
        label: 'REGISTRO DE INADMISSIBILIDADE',
        description: 'Registro de inadmissibilidade no sistema',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'register',
        norm: 'Sistema e-TCE',
        documents: ['Comprovante de Registro'],
      },
      position: { x: 250, y: 280 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '8px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'base-inadm',
      data: {
        label: 'BASE DE INADMISSIBILIDADE',
        description: 'Documentação de base para inadmissibilidade',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'action',
        documents: ['Parecer de Inadmissibilidade', 'Fundamentação'],
      },
      position: { x: 50, y: 400 },
      style: {
        background: '#FFFFFF',
        border: '2px solid #333',
        borderRadius: '6px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
      },
    },
    {
      id: 'decision-tce-2',
      data: {
        label: 'ARGUMENTAÇÃO',
        description: 'Verificar se há argumentação técnica',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'decision',
      },
      position: { x: 250, y: 400 },
      style: {
        background: '#FFFACD',
        border: '2px solid #FFD700',
        borderRadius: '6px',
        padding: '8px',
        width: '120px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'action-arg',
      data: {
        label: 'ARGUMENTAÇÃO',
        description: 'Argumentação técnica e jurídica',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'action',
        documents: ['Parecer Argumentado', 'Fundamentação Técnica'],
      },
      position: { x: 450, y: 400 },
      style: {
        background: '#FFFFFF',
        border: '2px solid #333',
        borderRadius: '6px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
      },
    },
    {
      id: 'register-arg',
      data: {
        label: 'ARGUMENTAÇÃO INADMISSIBILIDADE ARGUMENTAÇÃO',
        description: 'Registro de argumentação',
        swimlane: 'COTCE/CGU - Coordenação e Análise Interna',
        type: 'register',
        documents: ['Comprovante de Registro'],
      },
      position: { x: 450, y: 520 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '8px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },

    // SWIMLANE 2: Secretaria Ordinária (TCU)
    {
      id: 'action-sec-1',
      data: {
        label: 'OFÍCIO AUTORIZADO AUTOMATICAMENTE',
        description: 'Ofício de comunicação automática',
        swimlane: 'Secretaria Ordinária (TCU)',
        type: 'action',
        documents: ['Ofício de Comunicação'],
      },
      position: { x: 50, y: 650 },
      style: {
        background: '#FFFFFF',
        border: '2px solid #333',
        borderRadius: '6px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
      },
    },

    // SWIMLANE 3: Sociedade Ordinária (TCU)
    {
      id: 'register-cadin',
      data: {
        label: 'REGISTRO CADIN',
        description: 'Registro no Cadastro de Inadimplentes',
        swimlane: 'Sociedade Ordinária (TCU)',
        type: 'register',
        norm: 'Lei 10.522/2002',
        documents: ['Comprovante de Registro CADIN'],
      },
      position: { x: 250, y: 650 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '8px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'register-baixa-cadin',
      data: {
        label: 'BAIXA DE CADIN',
        description: 'Baixa do registro no CADIN',
        swimlane: 'Sociedade Ordinária (TCU)',
        type: 'register',
        norm: 'Lei 10.522/2002',
        documents: ['Comprovante de Baixa'],
      },
      position: { x: 450, y: 650 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '8px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },

    // SWIMLANE 4: Coordenação de Execução de Contas (TCU)
    {
      id: 'register-exec',
      data: {
        label: 'REGISTRO BAIXA DE CADIN',
        description: 'Registro de baixa de CADIN',
        swimlane: 'Coordenação de Execução de Contas (TCU)',
        type: 'register',
        norm: 'Lei 10.522/2002',
        documents: ['Comprovante de Registro'],
      },
      position: { x: 50, y: 800 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '8px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
  ];

  const initialEdges: Edge[] = [
    // COTCE Flow
    { id: 'e1', source: 'start-tce', target: 'action-tce-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    { id: 'e2', source: 'action-tce-1', target: 'decision-tce-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // Decision 1 - SIM path
    { id: 'e3', source: 'decision-tce-1', target: 'register-inadm-1', label: 'SIM', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#DC143C', strokeWidth: 2 } },
    
    // Decision 1 - NÃO path
    { id: 'e4', source: 'decision-tce-1', target: 'base-inadm', label: 'NÃO', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#228B22', strokeWidth: 2 } },
    
    // Base Inadmissibility flow
    { id: 'e5', source: 'base-inadm', target: 'decision-tce-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // Decision 2 - SIM path
    { id: 'e6', source: 'decision-tce-2', target: 'action-arg', label: 'SIM', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#228B22', strokeWidth: 2 } },
    
    // Decision 2 - NÃO path
    { id: 'e7', source: 'decision-tce-2', target: 'register-cadin', label: 'NÃO', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    
    // Argumentation flow
    { id: 'e8', source: 'action-arg', target: 'register-arg', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // To Secretaria
    { id: 'e9', source: 'register-inadm-1', target: 'action-sec-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e10', source: 'register-arg', target: 'action-sec-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    
    // To CADIN
    { id: 'e11', source: 'action-sec-1', target: 'register-cadin', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    
    // CADIN to Baixa
    { id: 'e12', source: 'register-cadin', target: 'register-baixa-cadin', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // To Execução
    { id: 'e13', source: 'register-baixa-cadin', target: 'register-exec', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
  ];

  const [nodes, setNodes, onNodesState] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, nodeId: string) => {
    setHoveredNode(nodeId);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-200">
      <div className="h-[900px] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesState}
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
            <div className="text-xs text-purple-300 mb-1">
              <strong>Swimlane:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.swimlane}
            </div>
            {nodes.find(n => n.id === hoveredNode)?.data?.norm && (
              <div className="text-xs text-blue-300 mb-1">
                <strong>Norma:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.norm}
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
      <div className="p-6 bg-gray-50 border-t border-gray-200 overflow-y-auto max-h-40">
        <h4 className="font-bold text-slate-900 mb-3">Legenda - Fluxo de Acordão de Julgamento TCE</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-300 border-2 border-blue-700 rounded-full"></div>
            <span className="text-xs text-slate-600">Início/Fim</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white border-2 border-gray-700 rounded"></div>
            <span className="text-xs text-slate-600">Ação/Processo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-200 border-2 border-yellow-600 rounded"></div>
            <span className="text-xs text-slate-600">Decisão</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-pink-300 border-2 border-pink-700 rounded"></div>
            <span className="text-xs text-slate-600">Registro/Resultado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-xs text-slate-600">Fluxo Principal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-xs text-slate-600">Fluxo de Inadmissibilidade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 border-t-2 border-dashed border-gray-600"></div>
            <span className="text-xs text-slate-600">Fluxo Paralelo/Condicional</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <p className="text-xs text-blue-900">
          💡 <strong>Dica:</strong> Este fluxo representa o Acordão de Julgamento de TCE (TCU) com 4 swimlanes (COTCE/CGU, Secretaria Ordinária, Sociedade Ordinária, Coordenação de Execução). Passe o mouse sobre os nós para ver detalhes.
        </p>
      </div>
    </div>
  );
};
