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
  };
}

export const InteractiveFlowDiagram: React.FC = () => {
  // Define nodes for the 7 COTCE stages
  const initialNodes: FlowNode[] = [
    {
      id: '1',
      data: {
        label: 'Disposições Preliminares',
        description: 'Definição clara da TCE e seus objetivos',
        norm: 'IN TCU 98/2024, Art. 1-4',
        duration: 'Fase Preparatória',
      },
      position: { x: 0, y: 0 },
      style: {
        background: '#e3f2fd',
        border: '2px solid #1976d2',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    {
      id: '2',
      data: {
        label: 'Instauração e Pressupostos',
        description: 'Instauração formal via Sistema e-TCE',
        norm: 'Portaria 121/2025, Art. 10',
        duration: '5 dias úteis',
      },
      position: { x: 250, y: 0 },
      style: {
        background: '#fff3e0',
        border: '2px solid #f57c00',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    {
      id: '3',
      data: {
        label: 'Organização e Documentação',
        description: 'Elaboração de documentos essenciais',
        norm: 'Portaria 121/2025, Art. 13',
        duration: 'Até 90 dias',
      },
      position: { x: 500, y: 0 },
      style: {
        background: '#f3e5f5',
        border: '2px solid #7b1fa2',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    {
      id: '4',
      data: {
        label: 'Quantificação do Débito',
        description: 'Cálculo preciso do dano ao erário',
        norm: 'IN TCU 98/2024, Art. 7',
        duration: 'Paralelo',
      },
      position: { x: 750, y: 0 },
      style: {
        background: '#e8f5e9',
        border: '2px solid #388e3c',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    {
      id: '5',
      data: {
        label: 'Dispensa e Arquivamento',
        description: 'Avaliação de racionalidade',
        norm: 'IN TCU 98/2024, Art. 8',
        duration: 'Análise contínua',
      },
      position: { x: 125, y: 150 },
      style: {
        background: '#fce4ec',
        border: '2px solid #c2185b',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    {
      id: '6',
      data: {
        label: 'Prescrição e BAP',
        description: 'Monitoramento de prescrição',
        norm: 'Resolução TCU 344/2022',
        duration: 'Contínuo (5 anos)',
      },
      position: { x: 375, y: 150 },
      style: {
        background: '#e0f2f1',
        border: '2px solid #00796b',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    {
      id: '7',
      data: {
        label: 'Segregação de Funções',
        description: 'Garantir segregação entre análise e julgamento',
        norm: 'Portaria 121/2025, Art. 2',
        duration: 'Estrutural',
      },
      position: { x: 625, y: 150 },
      style: {
        background: '#fff9c4',
        border: '2px solid #f9a825',
        borderRadius: '8px',
        padding: '16px',
        width: '200px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
  ];

  // Define edges connecting the nodes
  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#1976d2', strokeWidth: 2 },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#f57c00', strokeWidth: 2 },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#7b1fa2', strokeWidth: 2 },
    },
    {
      id: 'e2-5',
      source: '2',
      target: '5',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' },
    },
    {
      id: 'e3-6',
      source: '3',
      target: '6',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' },
    },
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' },
    },
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
      <div className="h-[600px] relative">
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
          <div className="absolute top-4 right-4 bg-slate-900 text-white p-4 rounded-lg shadow-lg max-w-xs z-50">
            <div className="text-sm font-bold mb-2">
              {nodes.find(n => n.id === hoveredNode)?.data?.label}
            </div>
            <div className="text-xs text-gray-300 mb-2">
              {nodes.find(n => n.id === hoveredNode)?.data?.description}
            </div>
            <div className="text-xs text-blue-300 mb-1">
              <strong>Norma:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.norm}
            </div>
            <div className="text-xs text-green-300">
              <strong>Duração:</strong> {nodes.find(n => n.id === hoveredNode)?.data?.duration}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h4 className="font-bold text-slate-900 mb-4">Legenda</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 border-2 border-blue-700 rounded"></div>
            <span className="text-sm text-slate-600">Preliminares</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 border-2 border-orange-700 rounded"></div>
            <span className="text-sm text-slate-600">Instauração</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 border-2 border-purple-700 rounded"></div>
            <span className="text-sm text-slate-600">Documentação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-700 rounded"></div>
            <span className="text-sm text-slate-600">Quantificação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-100 border-2 border-pink-700 rounded"></div>
            <span className="text-sm text-slate-600">Dispensa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-100 border-2 border-teal-700 rounded"></div>
            <span className="text-sm text-slate-600">Prescrição</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-700 rounded"></div>
            <span className="text-sm text-slate-600">Segregação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-600 rounded-full mr-1"></div>
            <div className="w-4 border-t-2 border-dashed border-gray-600"></div>
            <span className="text-sm text-slate-600">Fluxo Paralelo</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <p className="text-sm text-blue-900">
          💡 <strong>Dica:</strong> Arraste para mover o fluxo, use o scroll para fazer zoom, e passe o mouse sobre as caixas para ver detalhes das normas.
        </p>
      </div>
    </div>
  );
};
