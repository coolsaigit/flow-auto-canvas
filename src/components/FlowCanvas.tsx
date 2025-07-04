
import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { getLayoutedElements } from '../utils/layoutUtils';
import { CustomNode } from './CustomNode';
import { Sparkles, Plus, Trash2, RotateCcw, Shuffle } from 'lucide-react';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
}

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 25 },
    data: { label: 'Start Node' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 125 },
    data: { label: 'Process A' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 125 },
    data: { label: 'Process B' },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: { label: 'End Node' },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true,
    type: 'smoothstep'
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3', 
    animated: true,
    type: 'default'
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4', 
    animated: true,
    type: 'smoothstep'
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    animated: true,
    type: 'default',
    style: { strokeDasharray: '5,5' }
  },
];

export const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR' | 'BT' | 'RL'>('TB');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [defaultEdgeStyle, setDefaultEdgeStyle] = useState<'default' | 'smoothstep' | 'dotted'>('default');

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        animated: true,
        type: defaultEdgeStyle === 'dotted' ? 'default' : defaultEdgeStyle,
        style: defaultEdgeStyle === 'dotted' ? { strokeDasharray: '5,5' } : undefined,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, defaultEdgeStyle]
  );

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      layoutDirection
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, layoutDirection, setNodes, setEdges]);

  const addNode = useCallback(() => {
    const newNode: Node<CustomNodeData> = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => 
      !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target)
    ));
    setSelectedNodes([]);
  }, [selectedNodes, setNodes, setEdges]);

  const resetFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNodes([]);
  }, [setNodes, setEdges]);

  const toggleEdgeStyles = useCallback(() => {
    setEdges((eds) => eds.map((edge) => {
      const currentType = edge.type || 'default';
      const currentStyle = edge.style || {};
      const isDotted = currentStyle.strokeDasharray === '5,5';
      
      if (isDotted) {
        return {
          ...edge,
          type: 'smoothstep',
          style: { ...currentStyle, strokeDasharray: undefined }
        };
      } else if (currentType === 'smoothstep') {
        return {
          ...edge,
          type: 'default',
          style: { ...currentStyle, strokeDasharray: undefined }
        };
      } else {
        return {
          ...edge,
          type: 'default',
          style: { ...currentStyle, strokeDasharray: '5,5' }
        };
      }
    }));
  }, [setEdges]);

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodes(nodes.map((node) => node.id));
  }, []);

  const handleLayoutDirectionChange = (value: string) => {
    setLayoutDirection(value as 'TB' | 'LR' | 'BT' | 'RL');
  };

  const handleDefaultEdgeStyleChange = (value: string) => {
    setDefaultEdgeStyle(value as 'default' | 'smoothstep' | 'dotted');
  };

  const proOptions = { hideAttribution: true };

  return (
    <div className="w-full h-screen bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        className="bg-background"
      >
        <Controls className="bg-card border border-border" />
        <MiniMap 
          className="bg-card border border-border" 
          nodeColor="#8b5cf6"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="hsl(var(--muted-foreground))"
        />
        
        <Panel position="top-left" className="space-y-4">
          <Card className="p-4 bg-card/95 backdrop-blur border border-border">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Auto Layout Controls
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Layout Direction
                  </label>
                  <Select value={layoutDirection} onValueChange={handleLayoutDirectionChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TB">Top to Bottom</SelectItem>
                      <SelectItem value="BT">Bottom to Top</SelectItem>
                      <SelectItem value="LR">Left to Right</SelectItem>
                      <SelectItem value="RL">Right to Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={onLayout} 
                  className="w-full"
                  variant="default"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply Auto Layout
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/95 backdrop-blur border border-border">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Edge Controls</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Default Edge Style
                  </label>
                  <Select value={defaultEdgeStyle} onValueChange={handleDefaultEdgeStyleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Curved</SelectItem>
                      <SelectItem value="smoothstep">Smooth Step</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={toggleEdgeStyles} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Toggle All Edge Styles
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/95 backdrop-blur border border-border">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Node Controls</h3>
              
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={addNode} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Node
                </Button>
                
                <Button 
                  onClick={deleteSelectedNodes} 
                  variant="destructive" 
                  size="sm"
                  disabled={selectedNodes.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedNodes.length})
                </Button>
                
                <Button onClick={resetFlow} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Flow
                </Button>
              </div>
            </div>
          </Card>
        </Panel>

        <Panel position="top-right">
          <Card className="p-3 bg-card/95 backdrop-blur border border-border">
            <div className="text-sm text-muted-foreground">
              <div>Nodes: {nodes.length}</div>
              <div>Edges: {edges.length}</div>
              <div>Selected: {selectedNodes.length}</div>
            </div>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  );
};
