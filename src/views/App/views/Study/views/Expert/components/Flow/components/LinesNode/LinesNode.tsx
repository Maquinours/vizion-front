import React from 'react';
import { Node, NodeProps, XYPosition } from '@xyflow/react';

export type ExpertStudyLinesNode = Node<
  {
    positions: Array<XYPosition>;
  },
  'lines'
>;
export default function AppViewStudyViewExpertViewFlowComponentLinesNodeComponent({ data }: NodeProps<ExpertStudyLinesNode>) {
  const maxPosition = { x: Math.max(...data.positions.map((position) => position.x)), y: Math.max(...data.positions.map((position) => position.y)) };
  return (
    <svg width={maxPosition.x + 2} height={maxPosition.y + 2} className="block">
      {data.positions.map((position, index, arr) => {
        if (index === 0) return;
        const previousPosition = arr[index - 1];
        return (
          <React.Fragment key={index}>
            <line x1={previousPosition.x} y1={previousPosition.y} x2={position.x} y2={position.y} stroke="black" strokeWidth={3} strokeDasharray={4} />
            <line
              className="pointer-events-auto"
              key={index}
              x1={previousPosition.x}
              y1={previousPosition.y}
              x2={position.x}
              y2={position.y}
              stroke="transparent"
              strokeWidth={10}
            />
          </React.Fragment>
        );
      })}
    </svg>
  );
}
