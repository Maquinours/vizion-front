import _ from 'lodash';
import { useContext } from 'react';
import { ReactFlowState, useStore, useViewport } from '@xyflow/react';
import ExpertStudyContext, { ExpertStudyPaneClickFunctionType } from '../../../../utils/context';

const getReactFlowSize = (state: ReactFlowState) => {
  return { width: state.width, height: state.height };
};
export default function AppViewStudyViewExpertViewFlowComponentLinesTracingComponent() {
  const { x, y, zoom } = useViewport();
  const reactFlowSize = useStore(getReactFlowSize, (a, b) => _.isEqual(a, b));
  const { paneClickFunction } = useContext(ExpertStudyContext)!;

  if (paneClickFunction?.type !== ExpertStudyPaneClickFunctionType.LINES || !paneClickFunction.data) return;

  const { positions, cursorPosition } = paneClickFunction.data;

  const finalPositions = positions.map((position) => ({ x: x + position.x * zoom, y: y + position.y * zoom }));
  const cursorFinalPosition = { x: x + cursorPosition.x * zoom, y: y + cursorPosition.y * zoom };

  return (
    <svg className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full">
      {[...finalPositions, cursorFinalPosition].map((position, index, arr) => {
        if (index === 0) return;
        const previousPosition = arr[index - 1];
        return (
          <line
            key={index}
            x1={previousPosition.x}
            y1={previousPosition.y}
            x2={position.x}
            y2={position.y}
            stroke="black"
            strokeWidth={3 * zoom}
            strokeDasharray={4 * zoom}
            opacity={index === arr.length - 1 ? 0.5 : 1}
          />
        );
      })}
      <line x1={cursorFinalPosition.x} y1={0} x2={cursorFinalPosition.x} y2={reactFlowSize.height} stroke="black" strokeWidth={1} opacity={0.5} />
      <line x1={0} y1={cursorFinalPosition.y} x2={reactFlowSize.width} y2={cursorFinalPosition.y} stroke="black" strokeWidth={1} opacity={0.5} />
    </svg>
  );
}
