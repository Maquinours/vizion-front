import React from 'react';
import { Node, NodeProps, XYPosition } from '@xyflow/react';

export const isExpertStudyLinesNode = (node: Node): node is ExpertStudyLinesNode => {
  return (
    node.type === 'lines' &&
    'positions' in node.data &&
    Array.isArray(node.data.positions) &&
    node.data.positions.every(
      (position) =>
        typeof position === 'object' && !!position && 'x' in position && typeof position.x === 'number' && 'y' in position && typeof position.y === 'number',
    ) &&
    (!('color' in node.data) || typeof node.data.color === 'string' || node.data.color === undefined) &&
    (!('dasharray' in node.data) || typeof node.data.dasharray === 'number' || node.data.dasharray === undefined) &&
    (!('obstacle' in node.data) || typeof node.data.obstacle === 'boolean' || node.data.obstacle === undefined)
  );
};

export type ExpertStudyLinesNode = Node<
  {
    positions: Array<XYPosition>;
    color?: string;
    dasharray?: number;
    obstacle?: boolean;
  },
  'lines'
>;
export default function AppViewStudyViewExpertViewFlowComponentLinesNodeComponent({ id, data }: NodeProps<ExpertStudyLinesNode>) {
  const maxPosition = { x: Math.max(...data.positions.map((position) => position.x)), y: Math.max(...data.positions.map((position) => position.y)) };
  const stroke = data.color ?? 'black';
  const strokeDasharray = data.dasharray ?? 4;

  return (
    <svg width={maxPosition.x + 2} height={maxPosition.y + 2} className="block">
      {data.positions.map((position, index, arr) => {
        if (index === 0) return;
        const previousPosition = arr[index - 1];
        return (
          <React.Fragment key={index}>
            <line
              id={`line-${id}-${index}`}
              x1={previousPosition.x}
              y1={previousPosition.y}
              x2={position.x}
              y2={position.y}
              stroke={stroke}
              strokeWidth={3}
              strokeDasharray={strokeDasharray}
            />
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
