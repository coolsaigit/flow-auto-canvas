
import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

interface CustomNodeData {
  label: string;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

export const getLayoutedElements = (
  nodes: Node<CustomNodeData>[],
  edges: Edge[],
  direction = 'TB'
): { nodes: Node<CustomNodeData>[]; edges: Edge[] } => {
  const isHorizontal = direction === 'LR' || direction === 'RL';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

// Alternative layout algorithms for future expansion
export const getCircularLayout = (nodes: Node<CustomNodeData>[]): Node<CustomNodeData>[] => {
  const center = { x: 300, y: 300 };
  const radius = 200;
  const angleStep = (2 * Math.PI) / nodes.length;

  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: center.x + radius * Math.cos(index * angleStep) - nodeWidth / 2,
      y: center.y + radius * Math.sin(index * angleStep) - nodeHeight / 2,
    },
  }));
};

export const getGridLayout = (nodes: Node<CustomNodeData>[], columns = 3): Node<CustomNodeData>[] => {
  const spacing = { x: 200, y: 100 };
  const startPosition = { x: 50, y: 50 };

  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: startPosition.x + (index % columns) * spacing.x,
      y: startPosition.y + Math.floor(index / columns) * spacing.y,
    },
  }));
};
