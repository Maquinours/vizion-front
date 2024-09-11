import { useContext } from 'react';
import ExpertStudyContext, { ExpertStudyPaneClickFunctionType } from '../../../../utils/context';
import { ReactFlowState, useStore, useViewport } from '@xyflow/react';
import _ from 'lodash';

const getReactFlowSize = (state: ReactFlowState) => {
  return { width: state.width, height: state.height };
};

export default function AppViewStudyViewExpertViewFlowComponentRectangleTracingComponent() {
  const { x, y, zoom } = useViewport();
  const reactFlowSize = useStore(getReactFlowSize, (a, b) => _.isEqual(a, b));
  const { paneClickFunction } = useContext(ExpertStudyContext)!;

  if (paneClickFunction?.type !== ExpertStudyPaneClickFunctionType.RECTANGLE || !paneClickFunction.data) return;

  const flowPosition = paneClickFunction.data;

  const { initialPosition, cursorPosition } = {
    initialPosition: { x: x + flowPosition.initialPosition.x * zoom, y: y + flowPosition.initialPosition.y * zoom },
    cursorPosition: { x: x + flowPosition.cursorPosition.x * zoom, y: y + flowPosition.cursorPosition.y * zoom },
  };

  const { minPosition, maxPosition } = {
    minPosition: { x: Math.min(initialPosition.x, cursorPosition.x), y: Math.min(initialPosition.y, cursorPosition.y) },
    maxPosition: { x: Math.max(initialPosition.x, cursorPosition.x), y: Math.max(initialPosition.y, cursorPosition.y) },
  };

  const { position, size } = {
    position: minPosition,
    size: { width: maxPosition.x - minPosition.x, height: maxPosition.y - minPosition.y },
  };

  return (
    <svg id="rectangle-tracing" className="pointer-events-none absolute left-0 top-0 h-full w-full">
      <rect
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        strokeDasharray={4 * zoom}
        strokeWidth={2 * zoom}
        stroke="black"
        fill="transparent"
        opacity={0.5}
      />
      <line x1={position.x} y1={0} x2={position.x} y2={reactFlowSize.height} stroke="black" strokeWidth={1} opacity={0.5} />
      <line x1={0} y1={position.y} x2={reactFlowSize.width} y2={position.y} stroke="black" strokeWidth={1} opacity={0.5} />
      <line x1={position.x + size.width} y1={0} x2={position.x + size.width} y2={reactFlowSize.height} stroke="black" strokeWidth={1} opacity={0.5} />
      <line x1={0} y1={position.y + size.height} x2={reactFlowSize.width} y2={position.y + size.height} stroke="black" strokeWidth={1} opacity={0.5} />
    </svg>
  );
}
