import _ from 'lodash';
import React from 'react';
import { ReactFlowState, useStore, useViewport } from 'reactflow';

const colors = ['black', 'red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange', 'cyan', 'magenta', 'gray', 'white'];

const getReactFlowData = (state: ReactFlowState) => {
  const nodes = Array.from(state.nodeInternals.values()).filter((node) => (node.dragging || node.resizing) && !!node.height && !!node.width);
  const reactFlowSize = { width: state.width, height: state.height };
  return { nodes, reactFlowSize };
};

export default function AppViewStudyViewExpertViewFlowComponentGuideLinesComponent() {
  const { x, y, zoom } = useViewport();
  const { nodes, reactFlowSize } = useStore(getReactFlowData, (a, b) => _.isEqual(a, b));

  if (nodes.length === 0) return null;
  return (
    <svg className="pointer-events-none absolute left-0 top-0 h-full w-full">
      {nodes.map((node, index) => {
        const nodePosition = { x: x + node.position.x * zoom, y: y + node.position.y * zoom };
        const nodeSize = { width: node.width! * zoom, height: node.height! * zoom };
        const lineColor = colors[index % colors.length];
        return (
          <React.Fragment key={node.id}>
            <line x1={nodePosition.x} y1={0} x2={nodePosition.x} y2={reactFlowSize.height} stroke={lineColor} strokeWidth={1} className="opacity-50" />
            <line x1={0} y1={nodePosition.y} x2={reactFlowSize.width} y2={nodePosition.y} stroke={lineColor} strokeWidth={1} className="opacity-50" />
            <line
              x1={nodePosition.x + nodeSize.width}
              y1={0}
              x2={nodePosition.x + nodeSize.width}
              y2={reactFlowSize.height}
              stroke={lineColor}
              strokeWidth={1}
              className="opacity-50"
            />
            <line
              x1={0}
              y1={nodePosition.y + nodeSize.height!}
              x2={reactFlowSize.width}
              y2={nodePosition.y + nodeSize.height}
              stroke={lineColor}
              strokeWidth={1}
              className="opacity-50"
            />
          </React.Fragment>
        );
      })}
    </svg>
  );
}
