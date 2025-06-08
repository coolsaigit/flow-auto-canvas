
import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
}

interface FlowState {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
}

interface UseUndoRedoReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveState: (nodes: Node<CustomNodeData>[], edges: Edge[]) => void;
  clearHistory: () => void;
}

export const useUndoRedo = (
  initialNodes: Node<CustomNodeData>[],
  initialEdges: Edge[],
  setNodes: (nodes: Node<CustomNodeData>[]) => void,
  setEdges: (edges: Edge[]) => void
): UseUndoRedoReturn => {
  const [history, setHistory] = useState<FlowState[]>([
    { nodes: initialNodes, edges: initialEdges }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const saveState = useCallback((nodes: Node<CustomNodeData>[], edges: Edge[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes, edges });
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = currentIndex - 1;
      const state = history[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setCurrentIndex(newIndex);
    }
  }, [canUndo, currentIndex, history, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = currentIndex + 1;
      const state = history[newIndex];
      setNodes(state.nodes);
      setEdges(state.edges);
      setCurrentIndex(newIndex);
    }
  }, [canRedo, currentIndex, history, setNodes, setEdges]);

  const clearHistory = useCallback(() => {
    const currentState = history[currentIndex];
    setHistory([currentState]);
    setCurrentIndex(0);
  }, [history, currentIndex]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    saveState,
    clearHistory,
  };
};
