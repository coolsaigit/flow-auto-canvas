
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CustomNodeData {
  label: string;
}

export const CustomNode = memo(({ data, selected }: NodeProps<{ label: string }>) => {
  return (
    <Card 
      className={`
        min-w-[160px] px-4 py-2 shadow-lg transition-all duration-200 hover:shadow-xl
        ${selected 
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background border-primary' 
          : 'border-border hover:border-primary/50'
        }
        bg-card/95 backdrop-blur
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-center justify-center space-x-2">
        <Badge variant="secondary" className="text-xs">
          Node
        </Badge>
        <span className="text-sm font-medium text-foreground truncate">
          {data.label}
        </span>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </Card>
  );
});

CustomNode.displayName = 'CustomNode';
