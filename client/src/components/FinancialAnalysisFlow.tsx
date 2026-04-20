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

export const FinancialAnalysisFlow: React.FC = () => {
  const initialNodes: FlowNode[] = [
    // SWIMLANE 1: COAPC - Análise Financeira
    {
      id: 'start-1',
      data: {
        label: 'PRESTAÇÃO DE CONTAS',
        description: 'Início da análise financeira',
        swimlane: 'COAPC - Análise Financeira',
        type: 'start',
        norm: 'Portaria Interministerial 127/2008',
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
      id: 'action-1',
      data: {
        label: 'ANÁLISE FINANCEIRA DA PRESTAÇÃO DE CONTAS',
        description: 'Análise técnica dos documentos contábeis',
        swimlane: 'COAPC - Análise Financeira',
        type: 'action',
        norm: 'IN STN 01/1997',
        documents: ['Balanços', 'Demonstrações Contábeis', 'Notas Explicativas'],
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
      id: 'decision-1',
      data: {
        label: 'CONFORMIDADE?',
        description: 'Verificar se há conformidade com normas',
        swimlane: 'COAPC - Análise Financeira',
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
      id: 'notif-1',
      data: {
        label: 'NOTIFICAÇÃO DE ESCLARECIMENTO',
        description: '1ª Notificação para esclarecimentos',
        swimlane: 'COAPC - Análise Financeira',
        type: 'action',
        documents: ['Ofício de Notificação', 'Questionário'],
      },
      position: { x: 250, y: 280 },
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
      id: 'decision-2',
      data: {
        label: 'CONFORMIDADE?',
        description: 'Verificar resposta à notificação',
        swimlane: 'COAPC - Análise Financeira',
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
      id: 'notif-2',
      data: {
        label: 'SEGUNDA NOTIFICAÇÃO DE ESCLARECIMENTO',
        description: '2ª Notificação para esclarecimentos',
        swimlane: 'COAPC - Análise Financeira',
        type: 'action',
        documents: ['Ofício de Notificação', 'Questionário Complementar'],
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
      id: 'decision-3',
      data: {
        label: 'CONFORMIDADE?',
        description: 'Verificar resposta à 2ª notificação',
        swimlane: 'COAPC - Análise Financeira',
        type: 'decision',
      },
      position: { x: 450, y: 520 },
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
      id: 'glosas-1',
      data: {
        label: 'GLOSAS',
        description: 'Aplicação de glosas aos valores',
        swimlane: 'COAPC - Análise Financeira',
        type: 'action',
        documents: ['Memória de Cálculo', 'Planilha de Glosas'],
      },
      position: { x: 650, y: 400 },
      style: {
        background: '#FFFFFF',
        border: '2px solid #333',
        borderRadius: '6px',
        padding: '10px',
        width: '120px',
        fontSize: '9px',
      },
    },
    {
      id: 'parecer-1',
      data: {
        label: 'PARECER CONCLUÍDO APROVADO OU APROVADO COM RESSALVAS',
        description: 'Parecer técnico final',
        swimlane: 'COAPC - Análise Financeira',
        type: 'document',
        norm: 'Portaria Interministerial 127/2008',
        documents: ['Parecer Técnico', 'Conclusões'],
      },
      position: { x: 50, y: 520 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '6px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'register-1',
      data: {
        label: 'REGISTRO TRANSFERÊNCIA CONFORMIDADE',
        description: 'Registro de conformidade no sistema',
        swimlane: 'COAPC - Análise Financeira',
        type: 'register',
        norm: 'Sistema e-TCE',
        documents: ['Comprovante de Registro'],
      },
      position: { x: 250, y: 600 },
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
      id: 'register-2',
      data: {
        label: 'REGISTRO NO TRANSFERÊNCIA APROVADO CONCLUÍDO',
        description: 'Registro de aprovação no sistema',
        swimlane: 'COAPC - Análise Financeira',
        type: 'register',
        norm: 'Sistema e-TCE',
        documents: ['Comprovante de Registro'],
      },
      position: { x: 450, y: 600 },
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

    // SWIMLANE 2: Ordenador de Despesas
    {
      id: 'action-2',
      data: {
        label: 'PRESTAÇÃO CONTAS FINAL APROVADA OU APROVADA COM RESSALVAS',
        description: 'Apreciação final do ordenador',
        swimlane: 'Ordenador de Despesas',
        type: 'action',
        documents: ['Despacho do Ordenador', 'Aprovação'],
      },
      position: { x: 50, y: 750 },
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
      id: 'action-3',
      data: {
        label: 'PRESTAÇÃO DE COMPRAS PARA AUTORIZAÇÃO PARA INTEGRAÇÃO DE TOMADA DE CONTAS ESPECIAL',
        description: 'Preparação para possível TCE',
        swimlane: 'Ordenador de Despesas',
        type: 'action',
        documents: ['Documentação de Compras', 'Autorização'],
      },
      position: { x: 250, y: 750 },
      style: {
        background: '#FFFFFF',
        border: '2px solid #333',
        borderRadius: '6px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
      },
    },

    // SWIMLANE 3: Início TCE
    {
      id: 'end-1',
      data: {
        label: 'INÍCIO DO PROCESSO DE TOMADA DE CONTAS ESPECIAL',
        description: 'Instauração de TCE',
        swimlane: 'Início do Fluxo de TCE',
        type: 'end',
        norm: 'IN TCU 98/2024, Portaria 121/2025',
        documents: ['Termo de Instauração', 'Relatório Circunstanciado'],
      },
      position: { x: 50, y: 900 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '50px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'end-2',
      data: {
        label: 'ORIGEM NOTIFICAÇÃO INIDONEIDADE ESPECIAL',
        description: 'Notificação de inidoneidade',
        swimlane: 'Início do Fluxo de TCE',
        type: 'end',
        documents: ['Notificação de Inidoneidade'],
      },
      position: { x: 250, y: 900 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '50px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
    {
      id: 'end-3',
      data: {
        label: 'DESPACHO INFORMADO REGISTRO SIM DIGITAL',
        description: 'Registro digital de despacho',
        swimlane: 'Início do Fluxo de TCE',
        type: 'end',
        documents: ['Despacho Digital'],
      },
      position: { x: 450, y: 900 },
      style: {
        background: '#FFB6C1',
        border: '2px solid #C71585',
        borderRadius: '50px',
        padding: '10px',
        width: '140px',
        fontSize: '9px',
        fontWeight: 'bold',
      },
    },
  ];

  const initialEdges: Edge[] = [
    // COAPC Flow
    { id: 'e1', source: 'start-1', target: 'action-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    { id: 'e2', source: 'action-1', target: 'decision-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // Decision 1 - SIM path
    { id: 'e3', source: 'decision-1', target: 'parecer-1', label: 'SIM', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#228B22', strokeWidth: 2 } },
    
    // Decision 1 - NÃO path
    { id: 'e4', source: 'decision-1', target: 'notif-1', label: 'NÃO', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#DC143C', strokeWidth: 2 } },
    
    // Notification 1 flow
    { id: 'e5', source: 'notif-1', target: 'decision-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // Decision 2 - SIM path
    { id: 'e6', source: 'decision-2', target: 'register-1', label: 'SIM', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#228B22', strokeWidth: 2 } },
    
    // Decision 2 - NÃO path
    { id: 'e7', source: 'decision-2', target: 'notif-2', label: 'NÃO', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#DC143C', strokeWidth: 2 } },
    
    // Notification 2 flow
    { id: 'e8', source: 'notif-2', target: 'decision-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // Decision 3 - SIM path
    { id: 'e9', source: 'decision-3', target: 'glosas-1', label: 'SIM', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#228B22', strokeWidth: 2 } },
    
    // Decision 3 - NÃO path
    { id: 'e10', source: 'decision-3', target: 'glosas-1', label: 'NÃO', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#DC143C', strokeWidth: 2 } },
    
    // Glosas to Register
    { id: 'e11', source: 'glosas-1', target: 'register-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // Parecer to Register 1
    { id: 'e12', source: 'parecer-1', target: 'register-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0066cc', strokeWidth: 2 } },
    
    // To Ordenador
    { id: 'e13', source: 'register-1', target: 'action-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e14', source: 'register-2', target: 'action-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    
    // To TCE
    { id: 'e15', source: 'action-2', target: 'end-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e16', source: 'action-3', target: 'end-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
    { id: 'e17', source: 'parecer-1', target: 'end-3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
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
        <h4 className="font-bold text-slate-900 mb-3">Legenda - Fluxo de Análise Financeira</h4>
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
            <span className="text-xs text-slate-600">Decisão (SIM/NÃO)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-pink-300 border-2 border-pink-700 rounded"></div>
            <span className="text-xs text-slate-600">Registro/Resultado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-xs text-slate-600">Fluxo SIM (Conforme)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-xs text-slate-600">Fluxo NÃO (Não Conforme)</span>
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
          💡 <strong>Dica:</strong> Este fluxo representa a Análise Financeira de Prestação de Contas com 3 swimlanes (COAPC, Ordenador de Despesas, Início de TCE). Passe o mouse sobre os nós para ver detalhes de normas, documentos e responsáveis.
        </p>
      </div>
    </div>
  );
};
