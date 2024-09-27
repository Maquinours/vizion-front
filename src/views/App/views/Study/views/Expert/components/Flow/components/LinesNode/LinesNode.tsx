import React, { useContext, useState } from 'react';
import { Node, NodeProps, useReactFlow, XYPosition } from '@xyflow/react';
import AppViewStudyViewExpertViewFlowComponentLinesNodeComponentMenuComponent from './components/Menu/Menu';
import ExpertStudyContext from '../../../../utils/context';
import classNames from 'classnames';

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
export default function AppViewStudyViewExpertViewFlowComponentLinesNodeComponent({ id, data, selected }: NodeProps<ExpertStudyLinesNode>) {
  const { setNodes } = useReactFlow();

  const { paneClickFunction } = useContext(ExpertStudyContext)!;

  const maxPosition = { x: Math.max(...data.positions.map((position) => position.x)), y: Math.max(...data.positions.map((position) => position.y)) };
  const stroke = data.color ?? 'black';
  const strokeDasharray = data.dasharray ?? 4;

  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>();

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, selected: true } : { ...node, selected: false })));
    const rect = document.querySelector('.react-flow')!.getBoundingClientRect();
    setMenuPosition({ top: e.pageY - rect.top, left: e.pageX - rect.left });
  };

  return (
    <>
      <svg width={maxPosition.x + 5} height={maxPosition.y + 2} className="block">
        {data.positions.map((position, index, arr) => {
          if (index === 0) return;
          const previousPosition = arr[index - 1];
          return (
            <React.Fragment key={index}>
              <line
                className={classNames({ 'pointer-events-auto': !paneClickFunction })}
                onContextMenu={onContextMenu}
                key={index}
                x1={previousPosition.x}
                y1={previousPosition.y}
                x2={position.x}
                y2={position.y}
                stroke={selected ? 'yellow' : 'transparent'}
                strokeWidth={10}
              />
              <line
                x1={previousPosition.x}
                y1={previousPosition.y}
                x2={position.x}
                y2={position.y}
                stroke={stroke}
                strokeWidth={3}
                strokeDasharray={strokeDasharray}
              />
            </React.Fragment>
          );
        })}
      </svg>
      {!!menuPosition && (
        <AppViewStudyViewExpertViewFlowComponentLinesNodeComponentMenuComponent
          position={menuPosition}
          nodeId={id}
          data={data}
          onClose={() => setMenuPosition(undefined)}
        />
      )}
    </>
  );
}
